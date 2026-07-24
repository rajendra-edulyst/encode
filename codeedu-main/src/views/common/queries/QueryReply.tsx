"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/ShadcnButton"
import { Eye, Paperclip, MailQuestion, Ticket, Clock, User, Book } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { Query, QueryReply } from "@/@types/learner/mailbox"
import { getReplies, sendReply } from "@/services/learner/QueryService"
import { toast } from "sonner"

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

const getActualAttachmentUrl = (url: string) => {
  const parts = url.split("/https://")
  return parts.length > 1 ? "https://" + parts[1] : url
}

export default function QueryReply({ query }: { query: Query }) {
  const [open, setOpen] = useState(false)
  const [replies, setReplies] = useState<QueryReply[]>([])
  const [loading, setLoading] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [replyFile, setReplyFile] = useState<File | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchReplies = async () => {
    try {
      setLoading(true)
      const res = await getReplies(query.id)

      // Sort replies oldest first
      const sortedReplies = res.sort(
        (a: QueryReply, b: QueryReply) =>
          new Date(a.reply_at).getTime() - new Date(b.reply_at).getTime()
      )

      setReplies(sortedReplies)
    } catch (err) {
      console.error("Failed to fetch replies", err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      await fetchReplies()
    }
  }

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      alert("Please enter a reply.")
      return
    }

    try {
      await sendReply(replyText, query.id, replyFile)
      toast.success("Reply sent successfully!")
      setReplyText("")
      setReplyFile(null)
      await fetchReplies()
    } catch (error) {
      console.error("Failed to send reply:", error)
      toast.error("Failed to send reply. Please try again.")
    }
  }

  // Auto-scroll to bottom when replies change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [replies])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-white text-gray-700 border hover:bg-gray-100" variant="default" size="sm">
          <Eye className="w-5 h-5 text-gray-700" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl p-0 !gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-muted">
          <DialogTitle className="text-lg font-semibold flex gap-2 items-center">
            <MailQuestion className="w-5 h-5" /> Query Chat
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[600px]">
          {/* Header Info */}
          <div className="bg-background px-4 py-4 border-b z-20 border-gray-400 shadow-md">
             <div className="flex justify-between">
            
                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Ticket className="w-5 h-5" /> Ticket ID:
                            <span className="text-foreground">{query?.id}</span>
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <User className="w-5 h-5" /> From:
                            <span className="text-foreground">{query?.name}</span>
                          </p>
            
                        </div>
            
                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-5 h-5" /> Created At:
                            <span className="text-foreground">{formatDate(query?.created_at)}</span>
                          </p>
            
                          {query?.program_name && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Book className="w-5 h-5" /> Subject :
                              <span className="text-foreground">{query?.program_name}</span>
                            </p>
                          )}
                        </div>
                        </div>
            <h2 className="font-semibold text-base mt-2">{query?.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{query?.description}</p>
          </div>

          {/* Replies */}
          <div className="flex-1 overflow-y-auto bg-gray-100 z-10 p-4 space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500 text-center">Loading replies...</p>
            ) : replies.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">No replies yet.</p>
            ) : (
              <>
                {replies.map((reply) => (
  <div
    key={reply.id}
    className={`max-w-[75%] ml-auto  bg-white text-foreground rounded-br-none rounded-xl p-3 text-sm shadow-md`}
  >
    <div className="mb-1 font-medium">
      <img
        src={`https://ui-avatars.com/api/?name=${reply?.replied_by}`}
        alt="Avatar"
        className="inline-block w-5 h-5 rounded-full mr-2"
      />
      {reply.replied_by}
    </div>

    <div>{reply.description}</div>

    <div className="mt-3 flex items-center justify-between text-xs">

      <div className="text-gray-400">{formatDate(reply.reply_at)}</div>
      {reply.attachment && (
        <a
          href={getActualAttachmentUrl(reply.attachment)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs flex items-center gap-1 text-primary hover:underline"
        >
          <Paperclip className="w-3 h-3" /> View Attachment
        </a>
      )}
    </div>
  </div>
))}

                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Reply Input */}
          <div className="border-t px-4 py-3 bg-background space-y-2">
            <textarea
              value={replyText}
              className="w-full border text-sm rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Type your reply..."
              rows={3}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex items-center gap-3 justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-primary hover:underline text-sm">
                <Paperclip className="w-5 h-5" />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setReplyFile(e.target.files?.[0] || null)}
                />
                Attach File
              </label>
              {replyFile && (
                <span className="text-xs text-primary truncate max-w-xs">{replyFile.name}</span>
              )}
              <Button size="sm" className="ml-auto text-white" onClick={handleSendReply}>
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
