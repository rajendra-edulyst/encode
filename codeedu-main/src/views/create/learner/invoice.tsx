import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Mail, Printer } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { format } from 'date-fns'
import React from 'react'
import { useNavigate } from 'react-router-dom'

// Helper to convert number to words for INR (same output style as existing receipt)
const numberToWords = (amount: number): string => {
  const say = (n: number): string => {
    const ones = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ]
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '')
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        ' Hundred' +
        (n % 100 !== 0 ? ' and ' + say(n % 100).toLowerCase() : '')
      )
    if (n < 100000)
      return say(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + say(n % 1000).toLowerCase() : '')
    if (n < 10000000)
      return (
        say(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + say(n % 100000).toLowerCase() : '')
      )
    return (
      say(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + say(n % 10000000).toLowerCase() : '')
    )
  }

  const rupees = Math.floor(amount)
  const paise = Math.round((amount - rupees) * 100)

  let str = 'INR ' + say(rupees) + ' '
  if (paise > 0) str += 'and ' + say(paise) + ' paise '
  return str + 'Only'
}

type InvoiceItem = {
  title: string
  subtitle: string
  quantity: number
  price: number
}

type InvoiceTemplateData = {
  invoiceNo: string
  dated: Date
  buyerName: string
  buyerEmail: string
  buyerAddress: string
  paymentCardLast4: string
  transactionId: string
  paidOn: Date
  taxRate: number
  items: InvoiceItem[]
}

const demoData: InvoiceTemplateData = {
  invoiceNo: 'INV-DC-166',
  dated: new Date('2026-03-10T12:00:00.000Z'),
  buyerName: 'John Doe',
  buyerEmail: 'john.doe@example.com',
  buyerAddress: '250, Sagar Plaza, Zone-II, M. P. Nagar, Bhopal,\nMadhya Pradesh -462016',
  paymentCardLast4: '4242',
  transactionId: 'TXN-2024-001-ABC123',
  paidOn: new Date('2026-02-24T12:00:00.000Z'),
  taxRate: 0.09,
  items: [
    {
      title: 'Pro Course',
      subtitle: 'Adobe Tools and Applications-1',
      quantity: 1,
      price: 870.91,
    },
  ],
}

const Invoice = () => {
  const navigate = useNavigate()
  const invoiceRef = React.useRef<HTMLDivElement>(null)

  const data = demoData

  const totalAmount = React.useMemo(() => {
    const sum = data.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    return Number(sum.toFixed(2))
  }, [data.items])

  const { subtotal, taxAmount } = React.useMemo(() => {
    const base = totalAmount / (1 + data.taxRate)
    const tax = totalAmount - base
    return { subtotal: Number(base.toFixed(2)), taxAmount: Number(tax.toFixed(2)) }
  }, [data.taxRate, totalAmount])

  const handleDownloadPDF = React.useCallback(async () => {
    if (!invoiceRef.current) return

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`Learning_Receipt_${data.invoiceNo}.pdf`)
  }, [data.invoiceNo])

  const handleEmail = React.useCallback(() => {
    const subject = encodeURIComponent(`Learning Receipt ${data.invoiceNo}`)
    const body = encodeURIComponent(`Hello,\n\nPlease find the learning receipt: ${data.invoiceNo}.\n\nRegards`)
    window.location.href = `mailto:${data.buyerEmail}?subject=${subject}&body=${body}`
  }, [data.buyerEmail, data.invoiceNo])

  return (
    <div
      className="min-h-screen bg-[#0b0b0b] text-white relative overflow-hidden print:bg-white print:text-black"
      style={{ fontFamily: "'Jacques Pro', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Background: banner.svg (original, no filter) */}
      <div
        className="pointer-events-none absolute -bottom-10 left-0 right-0 h-[420px] bg-no-repeat bg-bottom bg-cover print:hidden"
        style={{ backgroundImage: "url('/img/bg/banner.svg')" }}
      />

      {/* Top bar */}
      <div className="w-full px-6 py-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-white/90">Learning Receipt {data.invoiceNo}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleEmail}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 transition text-sm font-semibold"
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 transition text-sm font-semibold"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] active:scale-95 transition text-sm font-semibold text-white shadow-lg shadow-sky-500/20"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Receipt */}
      <div className="px-6 pb-12 flex justify-center print:px-0 print:pb-0">
        <div
          ref={invoiceRef}
          className="bg-white text-black p-0 rounded-[20px] overflow-hidden shadow-2xl max-w-2xl w-full border border-gray-100 relative print:shadow-none print:border-0 print:rounded-none"
        >
          {/* Header Section */}
          <div className="bg-[#0b0b0b] text-white p-8 relative overflow-hidden">
            {/* Header background: invoicebg.svg (original, no filter) */}
            <div
              className="absolute inset-0 pointer-events-none bg-no-repeat bg-right bg-cover"
              style={{ backgroundImage: "url('/img/bg/invoicebg.svg')" }}
            />

            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <img src="/img/logo/logo-light-full.png" alt="CODE Logo" className="h-10 rounded shadow-md" />
                </div>
                <h1 className="text-3xl font-bold mb-4 tracking-tight">DC CODE Edu Pvt. Ltd.</h1>
                <div className="text-[11px] text-gray-400 leading-[16px]">
                  <p>1007-8, Horizon Tower,</p>
                  <p>Jewel of India, Jaipur,</p>
                  <p>Rajasthan</p>
                  <p className="mt-2 text-white font-bold">
                    GSTIN/UIN:08AAKCD5584H1Z8
                  </p>
                  <p className="text-white font-bold">State Name: Rajasthan, Code: 08</p>
                </div>
              </div>
              <div className="text-right">
                <h2
                  className="text-3xl font-bold text-white/90 mb-0"
                >
                  Learning Receipt
                </h2>
                <p className="text-gray-400 text-sm tracking-tight mb-1">{data.invoiceNo}</p>
                <p className="text-[10px] text-gray-400 tracking-[0.16em] font-medium">
                  Dated: {format(data.dated, 'dd MMM, yyyy')}
                </p>

                <div className="mt-6 flex justify-end">
                  <Badge className="bg-[#84cc16] hover:bg-[#84cc16] text-[#0b0b0b] px-3 py-1.5 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg border border-black/10">
                    <img src="/img/icons/check.png" alt="" className="w-4 h-4" />
                    PAID
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-8 bg-white">
            {/* Bill To Section */}
            <div className="relative">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black-600 mb-2">BILL TO</h3>
              <div className="bg-[#d0d0d0] p-6 rounded-xl border border-[#c9c9c9]">
                <h4 className="text-xl font-bold mb-1 text-black-900">{data.buyerName}</h4>
                <p className="text-sm text-black-600 mb-3">{data.buyerEmail}</p>
                <p className="text-[11px] text-black-600 max-w-md leading-relaxed whitespace-pre-line">
                  {data.buyerAddress}
                </p>
              </div>
            </div>

            {/* Description Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-800 border-b-2 border-black-400">
                    <th className="text-left pb-3 font-bold">DESCRIPTION</th>
                    <th className="text-center pb-3 font-bold">QUANTITY</th>
                    <th className="text-right pb-3 font-bold">PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.title} className="border-b border-gray-200">
                      <td className="py-5">
                        <h4 className="font-bold text-base text-gray-900 leading-tight">{item.title}</h4>
                        <p className="text-[11px] text-gray-400 mt-1">{item.subtitle}</p>
                      </td>
                      <td className="py-5 text-center font-medium text-gray-800">{item.quantity}</td>
                      <td className="py-5 text-right font-bold text-lg text-gray-900">₹{subtotal.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals and Amount in Words */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_256px] gap-8 items-start">
              {/* Left: align rows with right-side totals */}
              <div className="grid grid-rows-[auto_auto_auto]">
                {/* Row 1 aligns with Subtotal (leave empty) */}
                <div className="min-h-[34px]" />
                {/* Row 2 aligns with Tax (9%) */}
                <div className="min-h-[34px] flex items-end">
                  <p className="text-[10px] font-medium text-gray-500">Amount Chargeable (In Words)</p>
                </div>
                <div className="pt-3 flex items-start">
                  <p className="text-lg font-bold leading-snug text-gray-900 max-w-sm">{numberToWords(totalAmount)}</p>
                </div>
              </div>

              {/* Right: totals */}
              <div className="grid grid-rows-[auto_auto_auto]">
                <div className="flex justify-between text-xs font-medium text-gray-500 pb-2 border-b border-gray-200 min-h-[34px] items-end">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-gray-500 pb-2 border-b border-gray-200 min-h-[34px] items-end">
                  <span>Tax (9%)</span>
                  <span className="font-bold text-gray-900">₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="pt-3">
                  <div className="flex justify-between items-center bg-[#d0d0d0] p-4 rounded-xl border border-[#c9c9c9]">
                    <span className="text-[19px] font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-gray-900">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="bg-[#cfcfcf] p-5 rounded-lg border border-[#c7c7c7]">
                <p className="text-[10px] uppercase font-bold text-[#111827] mb-3 tracking-[0.16em]">PAYMENT METHOD</p>
                <p className="font-bold text-[14px] text-[#111827] flex items-center gap-2">
                  Visa .... {data.paymentCardLast4}
                </p>
                <p className="text-[12px] text-[#6b7280] mt-2">
                  Transaction ID: <span className="text-[#6b7280] font-medium">{data.transactionId}</span>
                </p>
              </div>
              <div className="bg-[#cfcfcf] p-5 rounded-lg border border-[#c7c7c7]">
                <p className="text-[10px] uppercase font-bold text-[#111827] mb-3 tracking-[0.16em]">PAYMENT STATUS</p>
                <div className="flex items-center gap-2 font-bold text-[14px] text-[#20c65a]">
                  <img
                    src="/img/icons/check.png"
                    alt=""
                    className="w-[18px] h-[18px] text-[#20c65a]"
                    style={{ filter: 'brightness(0) saturate(100%) invert(62%) sepia(72%) saturate(484%) hue-rotate(87deg) brightness(92%) contrast(90%)' }}
                  />
                  <span className="tracking-tight">Paid</span>
                </div>
                <p className="text-[12px] text-[#6b7280] mt-2 font-medium">
                  Paid on {format(data.paidOn, 'MMMM dd, yyyy')}
                </p>
              </div>
            </div>

            {/* Footer Message */}
            <div className="text-center space-y-2 pt-10">
              <p className="text-[16px] leading-6 font-medium text-[#111827]">
                Thank you for your business! For any questions,
                <br />
                please contact{" "}
                <span className="font-medium text-[#111827]">
                  support@codeedu.com
                </span>
              </p>
            </div>
          </div>

          {/* Bottom Decorative Bar */}
          <div className="h-[52px] w-full bg-[#00ACF0] flex items-center justify-between px-6">
            <div className="text-[13px] font-medium text-white/80">
              This is a Computer Generate Invoice
            </div>
            <div className="text-[13px] font-medium text-white/80">www.encode.codeedu.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice
