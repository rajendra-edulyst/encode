import React, { useRef, useMemo } from 'react';
import { Check, Printer, Download, Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getTaxLabel } from '../utils/taxData';
import { useSessionUser } from '@/store/authStore';

const numberToWords = (amount: number): string => {
    const say = (n: number): string => {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
            'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
            'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
            'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        if (n < 20) return ones[n];

        if (n < 100)
            return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');

        if (n < 1000)
            return ones[Math.floor(n / 100)] + ' Hundred' +
                (n % 100 ? ' and ' + (say(n % 100) || '').toLowerCase() : '');

        if (n < 100000)
            return say(Math.floor(n / 1000)) + ' Thousand' +
                (n % 1000 ? ' ' + (say(n % 1000) || '').toLowerCase() : '');

        if (n < 10000000)
            return say(Math.floor(n / 100000)) + ' Lakh' +
                (n % 100000 ? ' ' + (say(n % 100000) || '').toLowerCase() : '');

        return say(Math.floor(n / 10000000)) + ' Crore' +
            (n % 10000000 ? ' ' + (say(n % 10000000) || '').toLowerCase() : '');
    };

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);

    let str = 'INR ' + say(rupees);
    if (paise > 0) str += ' and ' + say(paise) + ' paise';

    return str + ' Only';
};


const calculateGST = (
    sellingPrice: number,
    merchantState: string,
    customerState: string
): { cgst: number; sgst: number; igst: number; gstTotal: number; isIntraState: boolean } => {
    const isIntraState = String(customerState || '').toLowerCase() === String(merchantState || '').toLowerCase();
    const gstRate = 0.18; // 18% GST
    const gstTotal = sellingPrice * gstRate;

    if (isIntraState) {
        return {
            cgst: gstTotal / 2,
            sgst: gstTotal / 2,
            igst: 0,
            gstTotal,
            isIntraState: true,
        };
    } else {
        return {
            cgst: 0,
            sgst: 0,
            igst: gstTotal,
            gstTotal,
            isIntraState: false,
        };
    }
};

interface CourseInvoiceProps {
    data?: any;
    courseDetails?: any;
    user?: any;
    onClose?: () => void;
    onGoToCourse?: () => void;
}

const CourseInvoice: React.FC<CourseInvoiceProps> = ({
    data = {},
    courseDetails = {},
    user = {},
    onClose,
    onGoToCourse
}) => {
    const invoiceRef = useRef<HTMLDivElement>(null);
    const sessionUser = useSessionUser((state) => state.user);


    const getSafeStr = (val: any, fallback: string = ""): string => {
        if (typeof val === 'object' && val !== null) {
            const str = String(val.name || val.label || val.title || '').trim();
            if (str && str !== 'null' && str !== 'undefined') return str;
            return fallback;
        }
        const strVal = val ? String(val).trim() : '';
        if (strVal && strVal !== 'null' && strVal !== 'undefined') return strVal;
        return fallback;
    };


    const merchantDetails = useMemo(() => ({
        name: getSafeStr(data?.merchant_name, "DC CODE Edu Pvt. Ltd."),
        gstin: getSafeStr(data?.merchant_gstin, "08AAKCD5584H1Z8"),
        stateName: getSafeStr(data?.merchant_state_name, "Rajasthan"),
        stateCode: getSafeStr(data?.merchant_state_code, "08"),
        country: getSafeStr(data?.merchant_country, "India"),
        address: getSafeStr(data?.merchant_address, "1007-8, Horizon Tower, Jewel of India,"),
        city: getSafeStr(data?.merchant_city, "Malviya Nagar"),
        pincode: getSafeStr(data?.merchant_pincode, "Jaipur-302019"),
        email: getSafeStr(data?.merchant_email, "support@codeedu.com"),
        website: getSafeStr(data?.merchant_website, "www.encode.codeedu.com"),
        logo: data?.merchant_logo || "/img/logo/logo-light-full.png"
    }), [data]);


    const customerDetails = useMemo(() => ({
        name: getSafeStr(data?.Name) || getSafeStr(data?.user_name) || getSafeStr(data?.firstname) || getSafeStr(data?.first_name) || getSafeStr(data?.billing_name) || getSafeStr(data?.customer_name) || getSafeStr(user?.name) || getSafeStr(sessionUser?.name) || 'Guest User',
        email: getSafeStr(data?.Email) || getSafeStr(data?.user_email) || getSafeStr(data?.email) || getSafeStr(user?.email) || getSafeStr(sessionUser?.email) || getSafeStr(data?.customer_email) || '',
        address: getSafeStr(data?.address) || getSafeStr(data?.Address) || getSafeStr(data?.address1) || getSafeStr(data?.customer_address) || getSafeStr(user?.address) || '',
        address2: getSafeStr(data?.address2) || getSafeStr(data?.customer_address2) || '',
        city: getSafeStr(data?.city) || getSafeStr(data?.customer_city) || '',
        state: getSafeStr(data?.state_name) || getSafeStr(data?.state) || getSafeStr(data?.customer_state) || '',
        country: getSafeStr(data?.country_name) || getSafeStr(data?.country) || getSafeStr(data?.customer_country) || 'India',
        zipcode: getSafeStr(data?.zipcode) || getSafeStr(data?.customer_zipcode) || '',
        stateCode: getSafeStr(data?.state_id) || getSafeStr(data?.customer_state_code) || getSafeStr(data?.state_code) || '',
        phone: getSafeStr(data?.phone) || getSafeStr(data?.customer_phone) || getSafeStr(user?.phone) || '',
    }), [data, user]);


    const courseDetailsComputed = useMemo(() => ({
        name: getSafeStr(
            data?.productinfo || data?.course_name || data?.pro_course || data?.subject || data?.purchase || courseDetails?.name,
            getSafeStr(data?.purchase_type, 'Pro Course')
        ),
        subName: getSafeStr(data?.course_subname || data?.description || courseDetails?.subname || courseDetails?.description, ''),
        code: getSafeStr(data?.course_code || data?.course_id || courseDetails?.course_code || courseDetails?.code || courseDetails?.id, ''),
        category: getSafeStr(data?.course_category || courseDetails?.category, ''),
        duration: getSafeStr(data?.course_duration || courseDetails?.duration, ''),
        instructor: getSafeStr(data?.course_instructor || courseDetails?.instructor, ''),
        quantity: parseInt(String(data?.Quantity || data?.quantity || '1')),
    }), [data, courseDetails]);


    const financials = useMemo(() => {

        let totalAmt = 0;
        if (data?.total_amt) totalAmt = parseFloat(String(data.total_amt));
        else if (data?.amount) totalAmt = parseFloat(String(data.amount));
        else if (data?.total_amount) totalAmt = parseFloat(String(data.total_amount));
        else if (courseDetails?.course_meta?.tuition_fee) {
            totalAmt = parseFloat(String(courseDetails.course_meta.tuition_fee).replace(/[^0-9.]/g, ''));
        }

        const isIndia = customerDetails.country.toLowerCase() === 'india';


        let sp = 0;
        if (data?.sp) sp = parseFloat(String(data.sp));
        else if (data?.Price) sp = parseFloat(String(data.Price));
        else if (data?.sub_total) sp = parseFloat(String(data.sub_total));
        else if (data?.selling_price) sp = parseFloat(String(data.selling_price));
        else if (totalAmt > 0) {
            sp = isIndia ? totalAmt / 1.18 : totalAmt;
        }


        const calculated = isIndia ? calculateGST(
            sp,
            merchantDetails.stateName,
            customerDetails.state
        ) : { cgst: 0, sgst: 0, igst: 0, gstTotal: 0, isIntraState: false };

        const discount = data?.discount ? parseFloat(String(data.discount)) : 0;
        const finalTotal = totalAmt || (sp + calculated.gstTotal);

        return {
            sellingPrice: sp,
            cgst: calculated.cgst,
            sgst: calculated.sgst,
            igst: calculated.igst,
            gstTotal: calculated.gstTotal,
            totalAmount: finalTotal,
            discount,
            isIntraState: calculated.isIntraState,
            isIndia
        };
    }, [data, courseDetails, merchantDetails.stateName, customerDetails.state, customerDetails.country]);


    const invoiceDetails = useMemo(() => ({
        invoiceNo: data?.invoiceNo || data?.invoice_no || data?.invoice_number || data?.txn_id || data?.txnid || data?.mihpayid || `INV-${Date.now().toString().slice(-6)}`,
        transactionId: data?.txn_id || data?.txnid || data?.mihpayid || data?.transaction_id || data?.payment_id || '',
        paymentMethod: data?.payment_method || data?.mode || data?.cardCategory || 'Online Payment',
        paidDate: data?.paid_date ? new Date(data.paid_date) : (data?.addedon ? new Date(data.addedon) : new Date()),
        paymentStatus: data?.payment_status || data?.status || data?.payment || 'Paid',
        bankRefNum: data?.bank_ref_num || data?.bankrefnum || '',
        cardNumber: data?.cardnum || data?.card_number || '',
        paymentSource: data?.payment_source || data?.PG_TYPE || '',
        gateway: data?.gateway || 'PayU',
        netAmountDebit: parseFloat(String(data?.net_amount_debit || financials.totalAmount)) || 0,
    }), [data, financials.totalAmount]);


    const fullAddress = useMemo(() => {
        const stateZip = [customerDetails.state, customerDetails.zipcode].filter(Boolean).join(' - ');
        const parts = [
            customerDetails.address,
            customerDetails.address2,
            customerDetails.city,
            stateZip
        ].filter(Boolean);
        return parts.join(', ');
    }, [customerDetails]);


    const cardDisplay = useMemo(() => {
        if (invoiceDetails.cardNumber) {
            return `${invoiceDetails.paymentMethod} ••• ${invoiceDetails.cardNumber.slice(-4)}`;
        }
        return invoiceDetails.paymentMethod;
    }, [invoiceDetails]);


    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;

        try {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Learning_Receipt_${invoiceDetails.invoiceNo}.pdf`);
        } catch (error) {
            console.error('PDF generation failed:', error);
        }
    };


    const handleEmail = () => {
        const subject = encodeURIComponent(`Learning Receipt - ${invoiceDetails.invoiceNo}`);
        const body = encodeURIComponent(
            `Dear ${customerDetails.name},\n\n` +
            `Thank you for your payment. Please find your learning receipt details below:\n\n` +
            `Receipt Number: ${invoiceDetails.invoiceNo}\n` +
            `Course: ${courseDetailsComputed.name}\n` +
            `Amount Paid: ₹${financials.totalAmount.toFixed(2)}\n` +
            `Transaction ID: ${invoiceDetails.transactionId}\n` +
            `Date: ${format(invoiceDetails.paidDate, 'dd MMM, yyyy')}\n\n` +
            `You can access your course at any time through your dashboard.\n\n` +
            `Best regards,\n` +
            `${merchantDetails.name}`
        );
        window.location.href = `mailto:${customerDetails.email}?subject=${subject}&body=${body}`;
    };


    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-950 p-8 print:bg-white print:p-0">

            <div className="max-w-4xl mx-auto mb-4 print:hidden">
                <div className="flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3 border border-gray-800">
                    <div className="flex items-center gap-4">
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-white text-sm"
                            >
                                <ArrowLeft size={16} />
                                Back
                            </button>
                        )}
                        <span className="text-white font-medium">Learning Receipt {invoiceDetails.invoiceNo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleEmail}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-white text-sm"
                        >
                            <Mail size={16} />
                            Email
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-white text-sm"
                        >
                            <Download size={16} />
                            Download
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-white text-sm"
                        >
                            <Printer size={16} />
                            Print
                        </button>
                        {onGoToCourse && (
                            <button
                                onClick={onGoToCourse}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition text-white text-sm font-semibold"
                            >
                                Go to Course
                                <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>


            <div
                ref={invoiceRef}
                className="max-w-4xl mx-auto print:max-w-none bg-no-repeat bg-bottom bg-contain"
                style={{ backgroundImage: "url('/img/bg/banner.svg')" }}
            >

                <div className="relative bg-black rounded-t-lg overflow-hidden pb-12 bg-no-repeat bg-center pt-8 px-8 print:rounded-none"
                    style={{ backgroundImage: "url('/img/bg/rainbow.png')", backgroundSize: 'auto 100%' }}>
                    <div
                        className="absolute inset-0 bg-[#000000] pointer-events-none opacity-70"
                    />

                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-8">
                            <div>

                                <div className="mb-4">
                                    <img
                                        src={merchantDetails.logo}
                                        alt={`${merchantDetails.name} Logo`}
                                        className="h-12 rounded shadow-md"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/img/logo/logo-light-full.png';
                                        }}
                                    />
                                </div>
                                <h1 className="text-[30px] font-bold text-white mb-2">{merchantDetails.name}</h1>
                                <p className="text-[16px] font-normal text-[#9F9F9F] space-y-1">
                                    <span>{merchantDetails.address},</span><br />
                                    <span>{merchantDetails.city},</span><br />
                                    <span>{merchantDetails.pincode}</span>
                                </p>
                            </div>

                            <div className="text-right">
                                <h2 className="text-[30px] font-bold text-white mb-4">Learning Receipt</h2>
                                <div className="space-y-1 text-[#9F9F9F]">
                                    <p className="text-lg font-bold">{invoiceDetails.invoiceNo}</p>
                                    <p className="text-[16px] font-normal">Dated: {format(invoiceDetails.paidDate, 'dd MMM, yyyy')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 text-[16px] font-bold text-[#9F9F9F]">
                            <div>
                                <p className="">GSTIN/UIN: {merchantDetails.gstin}</p>
                                <p className="">State Name: {merchantDetails.stateName}, Code: {merchantDetails.stateCode}</p>
                                <p className="">Country Name: {merchantDetails.country}</p>
                                {invoiceDetails.gateway && (
                                    <p className="">Payment Gateway: {invoiceDetails.gateway}</p>
                                )}
                            </div>
                            <div className="flex justify-end items-start">
                                <div className={`px-4 py-2 rounded-[10px] text-[16px] font-semibold flex items-center gap-2 ${String(invoiceDetails.paymentStatus || '').toLowerCase() === 'paid' || String(invoiceDetails.paymentStatus || '').toLowerCase() === 'success'
                                    ? 'bg-[#7FBC42] text-black'
                                    : 'bg-yellow-400 text-black'
                                    }`}>
                                    <CheckCircle size={18} />
                                    {typeof invoiceDetails?.paymentStatus === 'boolean'
                                        ? (invoiceDetails?.paymentStatus ? 'PAID' : 'PENDING')
                                        : (String(invoiceDetails?.paymentStatus || 'PAID').toUpperCase())}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-b-[14px] print:rounded-none">
                    <div className="p-8 pt-2 border-b border-gray-200">
                        <h3 className="text-sm font-bold text-black mb-4">BILL TO</h3>
                        <div className="bg-[#C0C0C0] rounded-[10px] p-6 text-black">
                            <h4 className="text-[20px] font-bold mb-3">{customerDetails.name}</h4>
                            <div className="text-[16px] font-normal">
                                {customerDetails.email && <p>{customerDetails.email}</p>}
                                {/* {customerDetails.phone && <p>{customerDetails.phone}</p>} */}
                                {customerDetails.address && <p>{customerDetails.address || customerDetails.address2}</p>}
                                {customerDetails.state && <p>{customerDetails.state}, {customerDetails.zipcode}</p>}
                                {customerDetails.country && <p>{customerDetails.country}</p>}
                            </div>
                        </div>
                    </div>


                    <div className="p-8 border-b border-gray-200">
                        <table className="w-full text-black text-sm mb-8">
                            <thead>
                                <tr className="border-b-2 border-black">
                                    <th className="text-left font-bold pb-3">DESCRIPTION</th>
                                    <th className="text-center font-bold pb-3">TYPE</th>
                                    <th className="text-center font-bold pb-3">BASE PRICE</th>
                                    <th className="text-center font-bold pb-3">QUANTITY</th>
                                    <th className="text-right font-bold pb-3">PRICE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-300">
                                    <td className="py-4">
                                        <p className="font-bold">{courseDetailsComputed.name}</p>
                                        {courseDetailsComputed.code && String(data?.purchase_type).toLowerCase() !== 'package' && (
                                            <p className="text-gray-500 text-xs">Course ID: {courseDetailsComputed.code}</p>
                                        )}
                                        {courseDetailsComputed.category && String(data?.purchase_type).toLowerCase() !== 'package' && (
                                            <p className="text-gray-500 text-xs">Category: {courseDetailsComputed.category}</p>
                                        )}
                                        {courseDetailsComputed.instructor && String(data?.purchase_type).toLowerCase() !== 'package' && (
                                            <p className="text-gray-500 text-xs">Instructor: {courseDetailsComputed.instructor}</p>
                                        )}
                                    </td>
                                    <td className="text-center align-top py-4 font-medium text-gray-700 capitalize">
                                        {courseDetailsComputed.subName || (String(data?.purchase_type).toLowerCase() === 'package' ? 'Package' : 'Course')}
                                    </td>
                                    <td className="text-center align-top py-4">₹{financials.sellingPrice.toFixed(2)}</td>
                                    <td className="text-center align-top py-4">{courseDetailsComputed.quantity}</td>
                                    <td className="text-right font-bold align-top py-4">₹{financials.sellingPrice.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>


                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex flex-col justify-end">
                                <p className="text-sm text-gray-500 mb-4">Amount Chargeable (In Words)</p>
                                <p className="font-bold text-black text-lg">{numberToWords(financials.totalAmount)}</p>
                            </div>
                            <div className="space-y-3 text-black">
                                {financials.isIndia && (
                                    <div className="flex justify-between pb-3 border-b border-gray-300">
                                        <span className="text-[#767676]">Base Price</span>
                                        <span className="font-bold">₹{financials.sellingPrice.toFixed(2)}</span>
                                    </div>
                                )}

                                {financials.discount > 0 && (
                                    <div className="flex justify-between pb-3 border-b border-gray-300">
                                        <span className="text-[#767676]">Discount</span>
                                        <span className="font-bold text-green-600">-₹{financials.discount.toFixed(2)}</span>
                                    </div>
                                )}

                                {financials.isIndia && (
                                    <>
                                        {financials.isIntraState ? (
                                            <>
                                                <div className="flex justify-between pb-3 border-b border-gray-300">
                                                    <span className="text-[#767676]">CGST (9%)</span>
                                                    <span className="font-bold">₹{financials.cgst.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between pb-3 border-b border-gray-300">
                                                    <span className="text-[#767676]">SGST (9%) ({merchantDetails.stateName})</span>
                                                    <span className="font-bold">₹{financials.sgst.toFixed(2)}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex justify-between pb-3 border-b border-gray-300">
                                                <span className="text-[#767676]">{getTaxLabel(customerDetails.country)}</span>
                                                <span className="font-bold">₹{financials.igst.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="bg-[#C0C0C0] rounded-[10px] px-4 py-3 flex justify-between">
                                    <span className="font-bold">Total</span>
                                    <span className="font-bold">₹{financials.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="p-8 grid grid-cols-2 gap-6 border-b border-gray-200">
                        <div className="bg-[#C0C0C0] rounded-[10px] p-6 text-black">
                            <h4 className="font-semibold mb-3 text-sm">PAYMENT METHOD</h4>
                            <p className="font-semibold text-[16px] mb-3">{cardDisplay}</p>
                            {invoiceDetails.transactionId && (
                                <p className="text-sm text-[#4E4E4E]">Transaction ID: {invoiceDetails.transactionId}</p>
                            )}
                            {invoiceDetails.bankRefNum && (
                                <p className="text-sm text-[#4E4E4E] mt-2">Bank Ref: {invoiceDetails.bankRefNum}</p>
                            )}
                            {invoiceDetails.paymentSource && (
                                <p className="text-sm text-[#4E4E4E] mt-2">Source: {invoiceDetails.paymentSource}</p>
                            )}
                        </div>
                        <div className="bg-[#C0C0C0] rounded-[10px] p-6 text-black">
                            <h4 className="font-semibold text-sm mb-3">PAYMENT STATUS</h4>
                            <p className="flex items-center gap-2 font-semibold text-[16px] text-[#00A63E] mb-3">
                                <CheckCircle size={18} />
                                {invoiceDetails.paymentStatus}
                            </p>
                            <p className="text-sm text-[#4E4E4E]">Paid on {format(invoiceDetails.paidDate, 'MMMM dd, yyyy')}</p>
                            {invoiceDetails.paidDate && (
                                <p className="text-sm text-[#4E4E4E] mt-2">
                                    Time: {format(invoiceDetails.paidDate, 'hh:mm a')}
                                </p>
                            )}
                            <p className="text-sm text-[#4E4E4E] mt-2">
                                Net Amount: ₹{invoiceDetails.netAmountDebit.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Tax Summary if applicable */}
                    {financials.isIndia && (financials.cgst > 0 || financials.sgst > 0 || financials.igst > 0) && (
                        <div className="p-8 border-b border-gray-200">
                            <div className="bg-gray-50 rounded-lg p-4 text-black">
                                <h4 className="font-bold mb-3 text-sm">TAX SUMMARY</h4>
                                <div className="grid grid-cols-3 gap-4 text-xs">
                                    {financials.cgst > 0 && (
                                        <div>
                                            <span className="text-gray-500">CGST @9%:</span>
                                            <span className="ml-2 font-semibold">₹{financials.cgst.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {financials.sgst > 0 && (
                                        <div>
                                            <span className="text-gray-500">SGST @9%:</span>
                                            <span className="ml-2 font-semibold">₹{financials.sgst.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {financials.igst > 0 && (
                                        <div>
                                            <span className="text-gray-500">{getTaxLabel(customerDetails.country)} :</span>
                                            <span className="ml-2 font-semibold">₹{financials.igst.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-gray-500">Total Tax:</span>
                                        <span className="ml-2 font-semibold">₹{financials.gstTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    <div className="p-8 text-center border-b border-gray-200">
                        <p className="text-black text-sm">
                            Thank you for your business! For any questions,<br />
                            please contact {merchantDetails.email}
                        </p>
                    </div>


                    <div className="bg-cyan-500 text-white p-6 rounded-b-lg flex justify-between items-center text-sm print:rounded-none">
                        <span>This is a Computer Generated Invoice</span>
                        <span>{merchantDetails.website}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseInvoice;