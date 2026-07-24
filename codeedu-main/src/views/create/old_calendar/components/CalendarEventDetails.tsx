import React from 'react'
import { useParams } from 'react-router-dom'
import { Event, InvitedUsers } from '../@types/calendar'
import { fetchInvitedUsers } from '../services/CalendarService'
import Breadcrumb from '@/components/breadcrumb'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import { Search, Users, FileText } from 'lucide-react'

const USERS_PER_PAGE = 5

const CalendarEventDetails: React.FC = () => {
  const { calendarId } = useParams()
  const [invitedUsers, setInvitedUsers] = React.useState<InvitedUsers[]>([])
  const [event, setEvent] = React.useState<Event | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [searchTerm, setSearchTerm] = React.useState('')

  const breadcrumbItems = [
    { label: 'Calendar', path: '/calendar' },
    { label: 'Event Details' },
  ]

  const fetchEventDetails = async (id: number) => {
    try {
      const res = await fetchInvitedUsers(id)
      setInvitedUsers(res.data.invited_user || [])
      setEvent(res.data.calender_details)
    } catch (err) {
      console.error('Failed to fetch event details', err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (calendarId) {
      fetchEventDetails(Number(calendarId))
    }
  }, [calendarId])

  function formatIndianDateTime(datetime: string | Date | null | undefined) {
    if (!datetime) return 'Invalid date'
    let dateObj: Date

    if (typeof datetime === 'string') {
      dateObj = new Date(datetime.replace(' ', 'T'))
    } else if (datetime instanceof Date) {
      dateObj = datetime
    } else {
      return 'Invalid date'
    }

    return dateObj.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    })
  }

  // 🔍 Filtered list based on search
  const filteredUsers = invitedUsers.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  )

  React.useEffect(() => {
    setCurrentPage(1) // Reset to page 1 when search changes
  }, [searchTerm])

  if (loading) return <div className="p-6 text-center">Loading event details...</div>
  if (!event) return <div className="p-6 text-center text-red-500">Event not found.</div>

  return (
    <div>

      <Breadcrumb items={breadcrumbItems} />
      <div className="min-h-screen dark:bg-[#1D1D1D] rounded-xl bg-white p-4 space-y-6">
        {/* Breadcrumb */}

        {/* Header with title */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize mb-2">{event.title}</h1>
            {event.invited_by_name && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Invited by <span className="font-medium text-primary">{event.invited_by_name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Main card content */}
        <div className="dark:bg-[#323232] bg-gray-50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Event details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date & Time */}
            <div className="space-x-4">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Start Date & Time
              </label>
              <div className="inline-flex items-center gap-3  p-1 px-4 border dark:border-gray-600 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatIndianDateTime(event.start_date)}
                </span>
              </div>
            </div>

            {/* End Date & Time */}
            <div className="space-x-4">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                End Date & Time
              </label>
              <div className="inline-flex items-center gap-3 p-1 px-4 border dark:border-gray-600 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatIndianDateTime(event.end_date)}
                </span>
              </div>
            </div>

            {/* Purpose */}
            {event.purpose && (
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Purpose
                </label>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#5A5A5A]/30 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  {event.purpose}
                </p>
              </div>
            )}

            {/* Link */}
            {event.link && (
              <div className="space-x-4 md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Meeting Link
                </label>
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-4 py-3 rounded-lg border border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-200 dark:bg-blue-900/40 flex items-center justify-center group-hover:bg-blue-300 dark:group-hover:bg-blue-900/60 transition-colors">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-blue-900 dark:text-blue-300 truncate max-w-xs">
                      {event.link.replace(/^https?:\/\//, '').split('/')[0]}
                    </span>
                    <span className="text-xs text-blue-700 dark:text-blue-400">Click to join meeting</span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Tabs section */}
        <Tabs defaultValue="description" className="dark:bg-[#323232] bg-gray-50 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <TabsList className="dark:bg-[#5A5A5A] bg-gray-100 border-b border-gray-200 dark:border-gray-600">
            <TabsTrigger
              value="description"
              className="flex items-center gap-2 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-primary dark:text-gray-300 dark:data-[state=active]:text-white"
            >
              <FileText size={16} />
              Description
            </TabsTrigger>
            {invitedUsers.length > 0 && (
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary dark:text-gray-300 dark:data-[state=active]:text-white"
              >
                <Users size={16} />
                Invited Users ({invitedUsers.length})
              </TabsTrigger>
            )}
          </TabsList>

          {/* Description Tab */}
          <TabsContent value="description" className="mt-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {event.description ? (
                  <div dangerouslySetInnerHTML={{ __html: event.description }} />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No description provided for this event.</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          {invitedUsers.length > 0 && (
            <TabsContent value="users" className="mt-6">
              <div className="space-y-4">
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#5A5A5A] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Users table */}
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="mx-auto mb-3 text-gray-400 dark:text-gray-500" size={40} />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No users found matching your search</p>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-transparent">
                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">#</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Name</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Email</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUsers.map((user, index) => (
                          <TableRow
                            key={user.id}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#5A5A5A]/50 transition-colors"
                          >
                            <TableCell className="text-gray-700 dark:text-gray-300 font-medium">
                              {(currentPage - 1) * USERS_PER_PAGE + index + 1}
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">
                              <div className="flex gap-3 items-center">
                                {user.profile_image && (
                                  <img
                                    src={user.profile_image}
                                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 object-cover"
                                    alt={user.name}
                                  />
                                )}
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                              {user.email}
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-colors
                              ${user.approval_status === 1
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                  : user.approval_status === 0
                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                }`}>
                                {user.approval_status === 1 ? '✓ Accepted' : user.approval_status === 0 ? '⏱ Pending' : '✕ Rejected'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-[#5A5A5A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                          >
                            ← Previous
                          </button>
                          <button
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-[#5A5A5A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>

  )
}

export default CalendarEventDetails