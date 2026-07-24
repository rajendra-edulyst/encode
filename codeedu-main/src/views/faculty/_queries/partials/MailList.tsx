import React, { useEffect } from "react"
import { useMailboxStore } from "./mailboxStore"
import { getQueries } from "@/services/learner/QueryService"
import { useQueryStore } from "@/store/learner/queryStore"

const MailList: React.FC = () => {
  const { activeTab, setSelectedMail, selectedMail } = useMailboxStore()
  const {
    queries,
    setQueries,
    loading,
    setLoading,
    error,
    setError
  } = useQueryStore()

  useEffect(() => {
    setError("")
    setLoading(true)

    getQueries()
      .then((data) => {
        setQueries(data)
      })
      .catch((err) => {
        setError(err?.message || "Failed to fetch queries")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [activeTab, setQueries, setLoading, setError])

  // Filter queries based on activeTab and type
  const filteredQueries = Array.isArray(queries)
    ? queries.filter((query) => {
        if (activeTab === "Sent") return query?.type === "1"
        if (activeTab === "Draft") return query?.type === "0"
        return false
      })
    : []

  return (
    <div className="h-full overflow-y-auto border-r bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold capitalize">{activeTab}</h2>
      </div>

      {loading ? (
        <div className="p-4 text-muted-foreground">Loading queries...</div>
      ) : error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : filteredQueries.length === 0 ? (
        <div className="p-4 text-muted-foreground">No messages</div>
      ) : (
        <ul>
          {filteredQueries.map((query) => (
            <li
              key={query?.id}
              className={`cursor-pointer border-b px-4 py-3 transition hover:bg-muted ${
                selectedMail?.id === query?.id?.toString() ? "bg-muted" : ""
              }`}
              onClick={() =>
                setSelectedMail({
                  id: query?.id?.toString(),
                  subject: query?.title,
                  sender: "You",
                  message: query?.description,
                  date: new Date().toISOString(),
                })
              }
            >
              <div className="font-medium line-clamp-1">{query?.title}</div>
              <div className="text-sm line-clamp-1 text-muted-foreground">
                {query?.description}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MailList
