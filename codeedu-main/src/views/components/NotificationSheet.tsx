import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Bell, Filter, ChevronLeft, ChevronRight, Eye, EyeOff, Trash2 } from "lucide-react"
import { markNotificationsAsRead, deleteNotification, requestFCMToken } from "@/services/NotificationService";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Notification as TNotification } from "@/@types/notification"

type NotificationSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  notifications: TNotification[]
  loading: boolean
  error: string | null
  setNotifications: (notifications: TNotification[] | ((prev: TNotification[]) => TNotification[])) => void
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    next_page_url: string | null
    prev_page_url: string | null
  }
  onPageChange: (page: number) => void
}

const NotificationSheet: React.FC<NotificationSheetProps> = ({
  open,
  onOpenChange,
  notifications,
  loading,
  setNotifications,
  pagination,
  onPageChange,
}) => {
  const [filterType, setFilterType] = useState<"all" | "read" | "unread">("unread")
  const [selectedNotification, setSelectedNotification] = useState<TNotification | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isClearingAll, setIsClearingAll] = useState(false)
  const navigate = useNavigate()

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationsAsRead([notificationId])
      setNotifications((prev: TNotification[]) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: 1 } : n)))
    } catch (err) {
      console.error("Failed to mark notification as read:", err)
    }
  }

  const handleMarkAsUnread = async (notificationId: number) => {
    try {
      setNotifications((prev: TNotification[]) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: 0 } : n)))
    } catch (err) {
      console.error("Failed to mark notification as unread:", err)
    }
  }

  const handleDeleteNotification = async (notificationId: number) => {
    setDeletingId(notificationId)
    try {
      await deleteNotification({ notification_id: [notificationId] })
      setNotifications((prev: TNotification[]) => prev.filter((n) => n.id !== notificationId))
      if (selectedNotification?.id === notificationId) {
        setShowDialog(false)
        setSelectedNotification(null)
      }
    } catch (err) {
      console.error("Failed to delete notification:", err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteNotificationFromList = async (notificationId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    setDeletingId(notificationId)
    try {
      await deleteNotification({ notification_id: [notificationId] })
      setNotifications((prev: TNotification[]) => prev.filter((n) => n.id !== notificationId))
    } catch (err) {
      console.error("Failed to delete notification:", err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)
    if (unreadIds.length === 0) return

    try {
      await markNotificationsAsRead(unreadIds)
      setNotifications((prev: TNotification[]) => prev.map((n) => (unreadIds.includes(n.id) ? { ...n, is_read: 1 } : n)))
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err)
    }
  }

  const handleClearAllNotifications = async () => {
    if (notifications.length === 0) return

    setIsClearingAll(true)
    try {
      await deleteNotification({ isClearAll: true })
      setNotifications([])
      if (showDialog) {
        setShowDialog(false)
        setSelectedNotification(null)
      }
    } catch (err) {
      console.error("Failed to clear all notifications:", err)
    } finally {
      setIsClearingAll(false)
    }
  }

  const handleNotificationClick = (notification: TNotification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id)
    }

    if (notification.redirect_url) {
      navigate(notification.redirect_url)
      onOpenChange(false)
    }
  }

  const handleViewDetails = (notification: TNotification, event: React.MouseEvent) => {
    event.stopPropagation()
    if (!notification.is_read) {
      handleMarkAsRead(notification.id)
    }
    setSelectedNotification(notification)
    setShowDialog(true)
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === "read") return n.is_read
    if (filterType === "unread") return !n.is_read
    return true
  })

  const handlePreviousPage = () => {
    if (pagination.current_page > 1) {
      onPageChange(pagination.current_page - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination.current_page < pagination.last_page) {
      onPageChange(pagination.current_page + 1)
    }
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, pagination.current_page - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(pagination.last_page, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    buttons.push(
      <button
        key="prev"
        disabled={pagination.current_page === 1}
        className={`px-3 py-2 rounded-md border ${pagination.current_page === 1
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        onClick={handlePreviousPage}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>,
    )

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`px-3 py-2 rounded-md border min-w-[40px] ${i === pagination.current_page
            ? "bg-primary text-white border-primary"
            : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>,
      )
    }

    buttons.push(
      <button
        key="next"
        disabled={pagination.current_page === pagination.last_page}
        className={`px-3 py-2 rounded-md border ${pagination.current_page === pagination.last_page
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        onClick={handleNextPage}
      >
        <ChevronRight className="w-4 h-4" />
      </button>,
    )

    return buttons
  }

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-md flex flex-col z-[999]">
          <SheetHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle>Notifications</SheetTitle>
            </div>
            <SheetDescription className="!mt-0 text-start">Your notifications will appear here</SheetDescription>

            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                Showing: {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {pagination?.total > 0 && (
                  <span className="ml-1">
                    ({filteredNotifications.length} of {pagination.total})
                  </span>
                )}
              </p>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition">
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-36 p-1.5 bg-[#1a1a1a] border border-white/10 shadow-2xl rounded-xl">
                  <div className="flex flex-col gap-1">
                    {(['all', 'read', 'unread'] as const).map((type) => (
                      <button
                        key={type}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filterType === type
                          ? "bg-primary text-black font-semibold shadow-[0_0_12px_rgba(var(--primary),0.3)]"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                        onClick={() => setFilterType(type)}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </SheetHeader>

          <div className="flex-1 flex flex-col min-h-0 mt-4">
            {notifications.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full">
                <Bell className="w-16 h-16 text-gray-300 mb-4" />
                <h1 className="text-lg font-medium text-gray-500 mb-2">No notifications</h1>
                <p className="text-sm text-gray-400 text-center">
                  {"You're all caught up! Check back later for new updates."}
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-3">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-xl border-none transition-all duration-200 hover:shadow-lg cursor-pointer group relative ${notification.is_read ? "bg-[#5A5A5A]/80" : "bg-[#5A5A5A]"
                          }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/50 hover:text-white transition-colors"
                            title="View details"
                            onClick={(e) => handleViewDetails(notification, e)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            disabled={deletingId === notification.id}
                            className="p-1 rounded-full bg-white/10 hover:bg-red-500/20 text-white/50 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Delete notification"
                            onClick={(e) => handleDeleteNotificationFromList(notification.id, e)}
                          >
                            {deletingId === notification.id ? (
                              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        <div className="flex justify-between items-start mb-2 pr-6">
                          <span className="text-xs text-white/50 font-medium">
                            {new Date(notification.created_at).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                          {!notification.is_read && (
                            <span className="inline-block w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]"></span>
                          )}
                        </div>

                        <div className="flex items-start gap-3">
                          <div
                            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-primary border border-white/5"
                          >
                            <Bell className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3
                              className="font-semibold text-sm mb-1 text-white"
                            >
                              {notification.message_title}
                            </h3>
                            <p className="text-sm text-white/70 line-clamp-2">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {pagination && pagination.last_page > 1 && (
                  <div className="flex-shrink-0 mt-4 pt-4 border-t">
                    <div className="flex items-center justify-center space-x-2 overflow-x-auto">
                      <div className="flex space-x-2">{renderPaginationButtons()}</div>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-2">
                      Page {pagination.current_page} of {pagination.last_page}
                      {pagination.total > 0 && <span className="ml-2">({pagination.total} total items)</span>}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <SheetFooter className="flex-shrink-0 pt-4 border-t mt-4">
            <div className="flex flex-row gap-3 w-full">
              {notifications.some((n) => !n.is_read) && (
                <button
                  className="flex-1 bg-primary text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-primary/80 transition-colors whitespace-nowrap"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  disabled={isClearingAll}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 whitespace-nowrap"
                  onClick={handleClearAllNotifications}
                >
                  {isClearingAll ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Clearing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3 h-3" />
                      Clear all
                    </>
                  )}
                </button>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900">Notification Details</DialogTitle>
            </div>

            {selectedNotification && (
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>
                  {new Date(selectedNotification.created_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedNotification.is_read ? "bg-green-100 text-green-800" : "bg-red-100 text-primary-800"
                    }`}
                >
                  {selectedNotification.is_read ? "Read" : "Unread"}
                </span>
              </div>
            )}
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Title</h4>
              <p className="text-gray-700">{selectedNotification?.message_title}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Message</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{selectedNotification?.message}</p>
            </div>

            {selectedNotification?.notification_type && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Type</h4>
                <p className="text-gray-700 capitalize">{selectedNotification.notification_type.replace("_", " ")}</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <div className="flex space-x-2">
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() =>
                  selectedNotification &&
                  (selectedNotification.is_read
                    ? handleMarkAsUnread(selectedNotification.id)
                    : handleMarkAsRead(selectedNotification.id))
                }
              >
                {selectedNotification?.is_read ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Mark as Unread
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Mark as Read
                  </>
                )}
              </button>

              <button
                disabled={deletingId === selectedNotification?.id}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                onClick={() => selectedNotification && handleDeleteNotification(selectedNotification.id)}
              >
                <Trash2 className="w-4 h-4" />
                {deletingId === selectedNotification?.id ? "Deleting..." : "Delete"}
              </button>
            </div>

            {selectedNotification?.notification_type === "program_content" && (
              <button
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                onClick={() => {
                  console.log(`Navigate to course: ${selectedNotification?.reference_id}`)
                  setShowDialog(false)
                  onOpenChange(false)
                }}
              >
                Go to Course
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NotificationSheet
