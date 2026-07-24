import { apiPaymentHistory } from "@/services/PaymentService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, Loader2, Printer } from "lucide-react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import CourseInvoice from "../learner/courses/components/CourseInvoice";
import PurchaseInvoice from "../learner/courses/components/PurchaseInvoice";

type OrderRow = {
    id: number
    invoice_no: string
    date: string
    purchase: string
    amount: string
    payment: string
    status: 'Completed' | 'Processing' | 'Failed'
    purchase_type: string
    attachment?: string
    program_id?: number | string
}

export default function PaymentReceipt() {
    const [loading, setLoading] = useState(false)
    const [row, setRow] = useState<OrderRow>()
    const { invoiceId } = useParams();

    const fetchHistory = async (invoiceId: string) => {
        setLoading(true)
        try {
            const resp = await apiPaymentHistory()
            if (resp.status === 1 && resp.data) {
                const list = resp.data.list || []
                const selected = list.find((item: any) => item.invoice_no === invoiceId.toUpperCase())
                setRow(selected)
            }
        } catch (err) {
            console.error('Failed to fetch payment history:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (invoiceId) {
            fetchHistory(invoiceId)
        }
    }, [])

    const handlePrint = async (pdfUrl: string) => {
        try {
            const response = await fetch(pdfUrl);
            const blob = await response.blob();

            const blobUrl = URL.createObjectURL(blob);

            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = blobUrl;

            document.body.appendChild(iframe);

            iframe.onload = () => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();

                setTimeout(() => {
                    URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(iframe);
                }, 1000);
            };
        } catch (error) {
            console.error("Print failed:", error);
        }
    };

    const handleDownload = async (pdfUrl: string) => {
        try {
            const response = await fetch(pdfUrl);
            const blob = await response.blob();

            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${row?.invoice_no || "receipt"}.pdf`;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };


    if (loading || !row) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#22b7f6]" />
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 overflow-x-hidden relative">
            <div className="max-w-5xl mx-auto relative z-10 pb-20">
                {/* Header */}
                <div className="hidden bg-[#1D1D1D] rounded-[20px] px-6 py-4 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="text-white text-xl"
                        >
                            <BiLeftArrowAlt />
                        </button>

                        <div>
                            <h1 className="text-white font-semibold text-[20px]">
                                Learning Receipt {row?.invoice_no}
                            </h1>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#5A5A5A] text-white rounded-[10px] text-[16px] font-normal">
                            <MdOutlineEmail className="w-4 h-4" />  Email
                        </button>

                        <button
                            onClick={() => handleDownload(row.attachment || "")}
                            className="flex items-center gap-2 px-4 py-2 bg-[#5A5A5A] text-white rounded-[10px] text-[16px] font-normal"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>

                        <button
                            onClick={() => handlePrint(row.attachment || "")}
                            className="flex items-center gap-2 px-4 py-2 bg-[#00A8E9] text-white rounded-[10px] text-[16px] font-normal"
                        >
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                    </div>
                </div>

                {/* PDF */}
                <div className="min-h-screen">
                    <PurchaseInvoice data={row} />
                </div>
            </div>

            <video
                autoPlay
                loop
                muted
                playsInline
                className="fixed -bottom-48 left-0 w-full h-96 object-cover z-0 opacity-80 pointer-events-none"
            >
                <source src="/video/rainbow.mp4" type="video/mp4" />
            </video>
        </div>
    );
}