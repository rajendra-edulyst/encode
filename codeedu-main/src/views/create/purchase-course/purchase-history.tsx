import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  CreditCard,
  ChevronDown,
  Download,
  Eye,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiPaymentHistory } from '@/services/PaymentService'
import dayjs from 'dayjs'

type OrderRow = {
  id: number
  invoiceId: string
  date: string
  purchase: string
  amount: string
  payment: string
  status: 'Completed' | 'Processing' | 'Failed'
  purchase_type: string
  attachment?: string
  program_id?: number | string
}

type DashboardData = {
  total_orders: number
  completed_orders: number
  total_spent: number | string
  invoices: number
}

const ProductBase = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<OrderRow[]>([])
  const [dashboard, setDashboard] = useState<DashboardData>({
    total_orders: 0,
    completed_orders: 0,
    total_spent: 0,
    invoices: 0,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['Completed', 'Processing', 'Failed'])
  const pageSize = 10

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const resp = await apiPaymentHistory()
      if (resp.status === 1 && resp.data) {
        const list = resp.data.list || []
        const mappedRows: OrderRow[] = list.map((item: any) => {
          const transDetails = item.response?.transaction_details || {}
          const txnKey = Object.keys(transDetails)[0]
          const txn = transDetails[txnKey] || {}

          // Calculate total amount from transaction_amount or price + tax
          const amountValue = txn.transaction_amount ||
            (Number(item.price || 0) + Number(item.tax || 0)).toFixed(2)

          return {
            id: item.id,
            invoiceId: item.invoice_no || `INV-${item.id}`,
            date: dayjs(item.created_at).format('DD MMM YYYY'),
            purchase: item.subject || 'Design and Creative Applications',
            amount: `${item.currency === 'INR' ? '₹' : (item.currency || '₹')}${amountValue}`,
            payment: item.payment_method === 'CC' ? 'Credit Card' : item.payment_method || txn.mode || 'N/A',
            status: item.status === 'success' ? 'Completed' : (item.status === 'failed' || item.status === 'failure' ? 'Failed' : 'Processing'),
            purchase_type: item.purchase_type || 'Course',
            attachment: item.attachment,
            program_id: item.program_id
          }
        })
        setRows(mappedRows)
        if (resp.data.dashboard) {
          setDashboard(resp.data.dashboard)
        }
      }
    } catch (err) {
      console.error('Failed to fetch payment history:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredRows = rows
    .filter(row =>
      (selectedStatuses.length === 0 || selectedStatuses.includes(row.status)) &&
      (row.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.purchase.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => b.id - a.id)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedStatuses])

  const totalItems = filteredRows.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedRows = filteredRows.slice(startIndex, endIndex)

  const handleDownload = (attachment: string) => {
    if (attachment) {
      window.open(attachment, '_blank')
    }
  }

  const handleViewPdf = (attachment: string) => {
    if (attachment) {
      setSelectedPdf(attachment)
      setIsModalOpen(true)
    }
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-black text-white"
      style={{ fontFamily: "'Jacques Pro', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[180px] bg-no-repeat"
        style={{
          backgroundImage: "url('/img/bg/invoicebg.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
        }}
      />

      <div className="relative z-10 mx-auto w-full px-6 py-8 pb-[180px] md:px-10">
        <div className="rounded-[20px] bg-[#1D1D1D] px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg transition"
              aria-label="Back"
            >
              <ArrowLeft size={20} color='white' className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-[20px] font-semibold leading-none">Learning History</h1>
              <p className="mt-2 text-[14px] text-[#858585]">View and manage your purchase history</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<img src="/img/icons/order.svg" alt="" className="h-15 w-15 shrink-0 object-contain" />}
            label="Total Orders"
            value={String(dashboard.total_orders)}
          />
          <StatCard
            icon={<img src="/img/icons/completeoreder.svg" alt="" className="h-15 w-15 shrink-0 object-contain" />}
            label="Completed Orders"
            value={String(dashboard.completed_orders)}
          />
          <StatCard
            icon={<img src="/img/icons/spent.svg" alt="" className="h-15 w-15 shrink-0 object-contain" />}
            label="Total Spent"
            value={`₹${dashboard.total_spent}`}
          />
          <StatCard
            icon={<img src="/img/icons/invoice.svg" alt="" className="h-15 w-15 shrink-0 object-contain" />}
            label="Invoices"
            value={String(dashboard.invoices)}
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-[10px] bg-[#1D1D1D] pl-11 pr-4 text-sm text-white/80 placeholder:text-[#9A9A9A] focus:border-[#22b7f6] focus:outline-none"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex h-11 min-w-[140px] items-center justify-between rounded-[10px] bg-[#5A5A5A] px-4 text-sm text-white/75 transition"
              >
                {selectedStatuses.length === 0 ? 'None' : selectedStatuses.length === 3 ? 'All Status' : `${selectedStatuses.length} Selected`}
                <ChevronDown className="h-4 w-4 text-white/60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] bg-[#1a1a1d] border-white/10 p-2 text-white/80 overflow-hidden">
              {['Completed', 'Processing', 'Failed'].map((status) => (
                <div key={status} className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition" onClick={() => {
                  if (selectedStatuses.includes(status)) {
                    setSelectedStatuses(selectedStatuses.filter(s => s !== status))
                  } else {
                    setSelectedStatuses([...selectedStatuses, status])
                  }
                }}>
                  <Checkbox
                    id={status}
                    checked={selectedStatuses.includes(status)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedStatuses([...selectedStatuses, status])
                      } else {
                        setSelectedStatuses(selectedStatuses.filter(s => s !== status))
                      }
                    }}
                    className="border-white/20 data-[state=checked]:bg-[#22b7f6] data-[state=checked]:border-[#22b7f6]"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label htmlFor={status} className="text-xs font-medium cursor-pointer flex-1" onClick={(e) => e.stopPropagation()}>
                    {status}
                  </label>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        <div className="mt-12 overflow-hidden rounded-[20px] bg-[#1D1D1D]/95">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#22b7f6]" />
            </div>
          ) : (
            <>
              <table className="w-full border-collapse">
                <thead className="bg-[#323232] text-left">
                  <tr className="text-[14px] font-bold text-white">
                    <th className="px-5 py-4 hidden">S.No.</th>
                    <th className="px-5 py-4">Invoice ID</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Purchase</th>
                    <th className="px-5 py-4 hidden">Type</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length > 0 ? (
                    paginatedRows.map((item, index) => (
                      <tr key={`${item.id}-${index}`} className="border-t border-[#323232] text-[14px] text-[#D1D5DC]">
                        <td className="px-5 py-4 text-white/40 hidden">{startIndex + index + 1}</td>
                        <td className="px-5 py-4 font-medium text-[#51A2FF]">{item.invoiceId}</td>
                        <td className="px-5 py-4 text-[#D1D5DC] font-normal">{item.date}</td>
                        <td className="px-5 py-4 cursor-pointer text-white transition-colors font-normal w-[300px]" onClick={() => item.program_id && navigate(`/courses/${item.program_id}`)}>{item.purchase}</td>
                        <td className="px-5 py-4 uppercase text-xs font-bold text-white hidden">{item.purchase_type}</td>
                        <td className="px-5 py-4 font-bold text-white">{item.amount}</td>
                        <td className="px-5 py-4 text-white/55">
                          <span className="inline-flex items-start gap-2">
                            <CreditCard className="h-4 w-5 text-[#99A1AF]" />
                            {item.payment}
                          </span>
                        </td>
                        <td className={`px-5 py-4 font-medium ${item.status === 'Completed' ? 'text-[#7FBC42]' : item.status === 'Failed' ? 'text-red-500' : 'text-yellow-500'}`}>
                          {item.status}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              // onClick={() => item.attachment && handleViewPdf(item.attachment)}
                              onClick={() => item.attachment && navigate(`/purchase-history/${item.invoiceId.toLowerCase()}`)}
                              className="inline-flex h-8 items-center gap-1.5 rounded-[10px] bg-[#5A5A5A] px-3 text-[14px] font-normal text-white transition hover:bg-white/30"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                            {item.attachment && (
                              <button
                                type="button"
                                onClick={() => handleDownload(item.attachment!)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#00A8E9] text-white transition hover:bg-[#0999d6]"
                                aria-label="Download invoice"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-20 text-center text-white/40">
                        No order history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {filteredRows.length > 0 && (
                <div className="flex items-center justify-between border-t border-white/5 px-5 py-4">
                  <div className="text-[13px] text-white/45">
                    Showing <span className="font-medium text-white/70">{startIndex + 1}</span> to{' '}
                    <span className="font-medium text-white/70">{endIndex}</span> of{' '}
                    <span className="font-medium text-white/70">{totalItems}</span> results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      {(() => {
                        const pages = []
                        const maxVisible = 5
                        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
                        let end = Math.min(totalPages, start + maxVisible - 1)

                        if (end - start + 1 < maxVisible) {
                          start = Math.max(1, end - maxVisible + 1)
                        }

                        if (start > 1) {
                          pages.push(1)
                          if (start > 2) pages.push('...')
                        }

                        for (let i = start; i <= end; i++) {
                          pages.push(i)
                        }

                        if (end < totalPages) {
                          if (end < totalPages - 1) pages.push('...')
                          pages.push(totalPages)
                        }

                        return pages.map((page, idx) => {
                          if (page === '...') {
                            return <span key={`dots-${idx}`} className="px-1 text-white/30">...</span>
                          }
                          return (
                            <button
                              key={page}
                              type="button"
                              onClick={() => setCurrentPage(page as number)}
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-medium transition ${currentPage === page
                                ? 'bg-[#22b7f6] text-white'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                              {page}
                            </button>
                          )
                        })
                      })()}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[98vw] md:max-w-5xl h-[92vh] p-0 bg-[#18181a] border-[#ffffff10] overflow-hidden flex flex-col shadow-2xl shadow-black/50">
          <div className="flex items-center p-4 border-b border-white/5 bg-[#1a1a1d]">
            <h2 className="text-lg font-semibold text-white/90">Invoice Preview</h2>
          </div>
          <div className="flex-1 w-full relative bg-[#1c1c1e]">
            {selectedPdf ? (
              <iframe
                src={`${selectedPdf}#view=FitH&toolbar=0`}
                className="absolute inset-0 w-full h-full border-none"
                title="Invoice Preview"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/40">
                No preview available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const StatCard = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => {
  return (
    <div className="rounded-[10px] bg-[#1D1D1D] px-5 py-4">
      <div className="flex items-center gap-6">
        {icon}
        <div className="flex flex-col justify-center gap-2">
          <div className="text-[14px] font-normal text-white leading-[14px]">{label}</div>
          <div className="mt-1 text-[32px] font-bold leading-[40px] tracking-tight text-white">{value}</div>
        </div>
      </div>
    </div>
  )
}

export default ProductBase
