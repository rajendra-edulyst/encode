import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/ShadcnButton"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Pencil, Reply, Send, Trash2 } from "lucide-react"
import { Query } from "@/@types/learner/mailbox"
import QueryViewDialog from "./QueryViewDialog"
import { Link, useNavigate } from "react-router-dom"


type QueryTableProps = {
  queries: Query[]
  loading: boolean
  page: number
  lastPage: number
  onPrev: () => void
  onNext: () => void
  tab: string
  SendDraft?: (query: Query) => void
  DeleteQuery?: (query: Query) => void
  EditDraft?: (query: Query) => void
  actions: ("view" | "edit" | "reply" | "send" | "delete")[]
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

export default function QueryTable({
  queries,
  loading,
  page,
  lastPage,
  onPrev,
  onNext,
  actions,
  SendDraft,
  // EditDraft,
  DeleteQuery,
  tab,
}: QueryTableProps) {

  return (
    <div className="mt-4 rounded-md border bg-white dark:bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-center">Recipient</TableHead>

            {tab === "my" && (
              <TableHead className="text-center">Status</TableHead>
            )}
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
              <TableRow key={query?.id}>
                <TableCell>{query?.id}</TableCell>
                <TableCell className="max-w-[100px]">{formatDate(query?.created_at)}</TableCell>
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
                    {query?.description}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs text-center" >{query?.mentor_name || "Admin"}</TableCell>

                {tab === "my" && (
                  <TableCell className="max-w-xs text-center">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${query?.is_faculty_answered === 1
                        ? "md:bg-green-100 text-green-700"
                        : "md:bg-red-100 text-red-700"
                        }`}
                    >
                      {query?.is_faculty_answered === 1 ? "Replied" : "Not replied"}
                    </span>
                  </TableCell>
                )}

                <TableCell className="text-right space-x-2">
                  {actions.includes("view") && <QueryViewDialog query={query} />}

                  {actions.includes("reply") && (
                    <Button className="bg-white hover:bg-gray-100 border" variant="default" size="sm">
                      <Reply className="w-5 h-5 text-gray-700" />
                    </Button>
                  )}
                  {actions.includes("edit") && (
                    <Button className="bg-white hover:bg-gray-100 border" size="sm" asChild>
                      <Link to={`/queries/new?id=${query.id}`}>
                        <Pencil className="w-5 h-5 text-gray-700" />
                      </Link>
                    </Button>
                  )}

                  {actions.includes("send") && (
                    <Button className="bg-white hover:bg-gray-100 border" variant="default" size="sm" onClick={() => SendDraft && SendDraft(query)} >
                      <Send className="w-5 h-5 text-gray-700" />
                    </Button>
                  )}

                  {actions.includes("delete") && (
                    <Button className="bg-white hover:bg-gray-100 border" variant="default" size="sm" onClick={() => DeleteQuery && DeleteQuery(query)}>
                      <Trash2 className="w-5 h-5 text-red-700" />
                    </Button>
                  )}
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
  )
}
