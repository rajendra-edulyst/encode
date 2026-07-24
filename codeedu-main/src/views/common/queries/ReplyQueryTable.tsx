"use client"

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/ShadcnButton"
import {
  Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/ShadcnInput"
import { Textarea } from "@/components/ui/textarea"
import { Query } from "@/@types/learner/mailbox"
import { sendReply } from "@/services/learner/QueryService"
import React, { useState } from "react"
import QueryReply from "./QueryReply"


type QueryTableProps = {
  queries: Query[]
  loading: boolean
  page: number
  lastPage: number
  onPrev: () => void
  onNext: () => void
  actions: ("view" | "reply")[]
}

const formatDate = (raw: string) => {
  const date = new Date(raw.replace(" ", "T"))
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12 || 12
  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`
}

const ReplyQueryTable = ({
  queries,
  loading,
  page,
  lastPage,
  onPrev,
  onNext,
  actions,
}: QueryTableProps) => {
  const [selectedQuery] = useState<Query | null>(null)
  const [replyText, setReplyText] = useState("")
  const [replyFile, setReplyFile] = useState<File | null>(null)
  const [replyOpen, setReplyOpen] = useState(false)

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedQuery) {
      alert("Please enter a reply.")
      return
    }

    try {
      await sendReply(replyText, selectedQuery.id, replyFile as File)
      alert("Reply sent successfully.")
      setReplyText("")
      setReplyFile(null)
      setReplyOpen(false)

    } catch (error) {
      console.error("Failed to send reply:", error)
      alert("An error occurred while sending the reply.")
    }
  }

  return (
    <>
      <div className="mt-4 rounded-md border bg-white dark:bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="">
              <TableHead >Ticket ID</TableHead>
              <TableHead >Subject</TableHead>
              <TableHead >Date</TableHead>
              <TableHead >Title</TableHead>
              <TableHead >Description</TableHead>
              <TableHead className="text-center">From</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Loading queries...
                </TableCell>
              </TableRow>
            ) : queries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No queries found.
                </TableCell>
              </TableRow>
            ) : (
              queries.map((query) => (
                <TableRow key={query.id}>
                  <TableCell>{query.id}</TableCell>
                  <TableCell className="max-w-[100px] truncate">
                    <div
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                    }}
                  >
                    {query?.program_name || "N/A"} 
                  </div>
                  </TableCell>
                  <TableCell className="max-w-[100px]">{formatDate(query.created_at)}</TableCell>
                  <TableCell className="max-w-[100px]">

                    <div
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                      }}
                    >
                      {query?.title}
                    </div></TableCell>
                  <TableCell className="max-w-[200px]">
                    <div
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                      }}
                    >
                      {query.description}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-center">{query.name}</TableCell>
                  <TableCell className="text-right gap-2 space-y-2 flex justify-end">
                    {actions.includes("view") && <QueryReply query={query} />}


                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {lastPage > 1 && (
          <Pagination className="mt-4 mb-4">
            <PaginationContent className="justify-end">
              <PaginationItem>
                <PaginationPrevious
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  onClick={onPrev}
                />
              </PaginationItem>
              <span className="text-sm px-4 py-2">
                Page {page} of {lastPage}
              </span>
              <PaginationItem>
                <PaginationNext
                  className={page === lastPage ? "pointer-events-none opacity-50" : ""}
                  onClick={onNext}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* REPLY DIALOG */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent className="max-w-2xl p-6">
          <DialogHeader>
            <DialogTitle>Reply to Query #{selectedQuery?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              required
              placeholder="Enter your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setReplyFile(file)
              }}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" onClick={handleSendReply}>
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ReplyQueryTable
