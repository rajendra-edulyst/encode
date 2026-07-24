import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { apiCreatePayment, apiVerifyPayment } from '@/services/PaymentService';
import type { PaymentVerifyRequest } from '@/@types/payment';
import CourseInvoice from './CourseInvoice';
import BillingDetails from './BillingDetails';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ArrowRight, FileText } from 'lucide-react';
import { PiDiceFiveBold } from 'react-icons/pi';

const CoursePayment = ({
  courseDetails,
  user,
  programTools,
  courseLeader,
  courseFaculty,
  purchaseDialog,
  setPurchaseDialog,
  setEnrollDialog,
  fetchCourse
}: any) => {

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id: courseIdFromParams } = useParams<{ id: string }>();
  const [invoiceDialog, setInvoiceDialog] = useState(false);
  const [thankYouDialog, setThankYouDialog] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const [verifyData, setVerifyData] = useState<any>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [billingData, setBillingData] = useState<any>(null);
  const [pdfDialog, setPdfDialog] = useState(false);


  // Save courseDetails.id to localStorage whenever the purchase popup opens
  useEffect(() => {
    if (purchaseDialog && courseDetails?.id) {
      localStorage.setItem('payu_pro_course_id', String(courseDetails.id));
    }
  }, [purchaseDialog, courseDetails?.id]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('payment');
    const txnid = params.get('txnid');
    const mihpayid = params.get('mihpayid');
    const amount = params.get('amount') || '0.00';

    if (status === 'success') {
      const txnid = params.get('txnid');
      const mihpayid = params.get('mihpayid');
      const payuid = params.get('payuid');

      if (txnid || mihpayid || payuid) {
        window.history.replaceState(null, '', window.location.pathname);
        const payload: Record<string, any> = {};
        params.forEach((v, k) => payload[k] = v);
        handleVerifyPayment(payload);
      }
    }

    if (status === 'failure') {
      window.history.replaceState(null, '', window.location.pathname);

      Swal.fire({
        title: 'Payment Failed',
        text: 'Your payment was cancelled or failed.',
        icon: 'error',
        theme: 'dark'
      });
    }
  }, []);


  const handleProceedToPayment = async (formData?: any) => {
    // if (isProd) return
    if (!courseDetails) return;

    const rawTotalAmount = courseDetails?.course_meta?.tuition_fee?.replace(/[^0-9.]/g, '') || '0';
    const totalAmount = parseFloat(rawTotalAmount);
    const amount = formData?.total_amount || totalAmount.toFixed(2);

    try {
      // Save billing data to state and localStorage for persistence
      if (formData) {
        setBillingData(formData);
        // Store billing data in localStorage (survives page reloads)
        localStorage.setItem('payu_billing_data', JSON.stringify(formData));
      }

      const baseUrl = window.location.origin.replace(/\/+$/, '');
      const surl = `https://encodeapi.codeedu.co/api/payment/payu-callback`;
      const furl = `https://encodeapi.codeedu.co/api/payment/payu-callback`;

      const firstname = user?.name || 'User';
      const email = user?.email || 'test@example.com';
      const phone = formData?.phone || '';
      const productinfo = courseDetails?.name || 'Product';

      setIsPaymentLoading(true);

      const response = await apiCreatePayment({
        gateway: 'payu',
        amount,
        firstname,
        email,
        phone,
        productinfo,
      });

      const data = response?.data || response;

      const txnid = data?.txnid;
      const hash = data?.hash;
      const key = data?.key || 'eFBbV2';
      const paymentUrl = data?.url || 'https://test.payu.in/_payment';

      const finalProductInfo = data?.productinfo || data?.product_info || productinfo;

      if (!txnid || !hash) {
        throw new Error('Invalid payment data');
      }

      const finalAmount = parseFloat(String(data?.amount || amount)).toFixed(2);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentUrl;
      form.style.display = 'none';

      const fields: Record<string, string> = {
        key: String(data?.key || key),
        txnid: String(data?.txnid || txnid),
        hash: String(data?.hash || hash),
        amount: String(data?.amount || finalAmount),
        firstname: String(data?.firstname || firstname),
        email: String(data?.email || email),
        phone: String(data?.phone || phone),
        productinfo: String(data?.productinfo || finalProductInfo),
        surl: String(data?.surl || surl),
        furl: String(data?.furl || furl),
      };

      // Add billing details if available
      if (formData) {
        if (formData.address) fields.address1 = String(formData.address);
        if (formData.country_name) fields.country = String(formData.country_name);
        if (formData.state_name) fields.state = String(formData.state_name);
        if (formData.city) fields.city = String(formData.city);
        if (formData.zipcode) fields.zipcode = String(formData.zipcode);
      }

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);

      // Save course info for callback
      const courseIdToStore = String(courseDetails?.id || courseIdFromParams || '');
      localStorage.setItem('payu_pro_course_id', courseIdToStore);
      localStorage.setItem('payu_course_name', String(courseDetails?.name || ''));
      localStorage.setItem('payu_course_category', String(courseDetails?.category || ''));
      localStorage.setItem('payu_course_code', String(courseDetails?.course_code || courseDetails?.code || ''));
      localStorage.setItem('payu_tuition_fee', String(courseDetails?.course_meta?.tuition_fee || '0'));

      form.submit();

    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Payment initiation failed',
        icon: 'error',
        theme: 'dark'
      });
    } finally {
      setIsPaymentLoading(false);
    }
  };


  const handleVerifyPayment = async (payload: any) => {
    setIsPaymentLoading(true);

    // Retrieve all stored data from localStorage
    const storedCourseId = localStorage.getItem('payu_pro_course_id') || String(courseDetails?.id || courseIdFromParams || '');
    const storedCourseName = localStorage.getItem('payu_course_name') || courseDetails?.name || '';
    const storedCourseCategory = localStorage.getItem('payu_course_category') || courseDetails?.category || '';
    const storedCourseCode = localStorage.getItem('payu_course_code') || courseDetails?.course_code || '';
    const storedTuitionFee = localStorage.getItem('payu_tuition_fee') || courseDetails?.course_meta?.tuition_fee || '0';

    // Retrieve billing data from localStorage
    let billingDataFromStorage: any = {};
    try {
      const storedBillingData = localStorage.getItem('payu_billing_data');
      if (storedBillingData) {
        billingDataFromStorage = JSON.parse(storedBillingData);
      }
    } catch (error) {
      console.error('Error parsing billing data:', error);
    }

    try {
      // Calculate amounts properly
      const totalAmtValue = parseFloat(payload?.amount || storedTuitionFee.replace(/[^0-9.]/g, '') || '0');

      // Use billing data for calculations
      const sellingPrice = parseFloat(billingDataFromStorage?.selling_price || (totalAmtValue / 1.18).toFixed(2));
      const gstTotal = parseFloat(billingDataFromStorage?.gst_total || (totalAmtValue - sellingPrice).toFixed(2));
      const cgstValue = parseFloat(billingDataFromStorage?.cgst || '0');
      const sgstValue = parseFloat(billingDataFromStorage?.sgst || '0');
      const igstValue = parseFloat(billingDataFromStorage?.igst || '0');

      // Build the complete invoice payload
      const invoicePayload: any = {
        // Payment gateway fields
        gateway: payload?.gateway || 'payu',
        mihpayid: payload?.mihpayid || '',
        mode: payload?.mode || '',
        status: payload?.status || '',
        unmappedstatus: payload?.unmappedstatus || '',
        key: payload?.key || '',
        txnid: payload?.txnid || '',
        amount: totalAmtValue.toFixed(2),
        cardCategory: payload?.cardCategory || '',
        discount: payload?.discount || '0.00',
        net_amount_debit: payload?.net_amount_debit || totalAmtValue,
        addedon: payload?.addedon || new Date().toISOString(),
        productinfo: storedCourseName || payload?.productinfo || 'Product',
        firstname: payload?.firstname || user?.name || '',
        lastname: payload?.lastname || '',
        address1: billingDataFromStorage?.address || payload?.address1 || '',
        address2: payload?.address2 || '',
        city: payload?.city || billingDataFromStorage?.city || '',
        state: payload?.state || billingDataFromStorage?.state_name || '',
        country: payload?.country || billingDataFromStorage?.country_name || '',
        zipcode: payload?.zipcode || billingDataFromStorage?.zipcode || '',
        email: payload?.email || user?.email || '',
        phone: payload?.phone || billingDataFromStorage?.phone || '',
        hash: payload?.hash || '',
        payment_source: payload?.payment_source || '',
        PG_TYPE: payload?.PG_TYPE || '',
        bank_ref_num: payload?.bank_ref_num || '',
        cardnum: payload?.cardnum || `XXXXXXXXXXXX${(payload?.phone || billingDataFromStorage?.phone || '9999').slice(-4)}`,
        payment: payload?.status || payload?.payment || 'success',

        // User details
        Name: user?.name || payload?.firstname || '',
        Email: user?.email || payload?.email || '',
        Address: billingDataFromStorage?.address || payload?.address1 || '',

        // Course details - CRITICAL FIELDS
        description: storedCourseName || 'Course',
        Quantity: '1',
        Price: sellingPrice.toFixed(2),
        pro_course: storedCourseName || 'Course',
        pro_course_id: storedCourseId,
        course_name: storedCourseName,
        course_code: storedCourseCode,
        course_category: storedCourseCategory,
        purchase_type: 'course',

        // Amount calculations
        sub_total: sellingPrice.toFixed(2),
        tax: gstTotal.toFixed(2),
        total_amt: totalAmtValue.toFixed(2),
        sp: sellingPrice.toFixed(2),

        // GST fields - CRITICAL
        cgst: cgstValue.toFixed(2),
        sgst: sgstValue.toFixed(2),
        igst: igstValue.toFixed(2),
        gst_total: gstTotal.toFixed(2),

        // Location fields - CRITICAL
        country_id: billingDataFromStorage?.country_id || '',
        state_id: billingDataFromStorage?.state_id || '',
        country_name: payload?.country || billingDataFromStorage?.country_name || '',
        state_name: payload?.state || billingDataFromStorage?.state_name || '',

        // Payment details
        payment_method: payload?.payment_method || `Visa .... ${(payload?.cardnum || '').slice(-4) || (payload?.phone || billingDataFromStorage?.phone || '9999').slice(-4)}`,
        txn_id: payload?.txnid || payload?.mihpayid || '',
        payment_status: 'Paid',
        paid_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),

        // Additional user info
        user_id: user?.id || '',
        user_email: user?.email || payload?.email || '',
        user_name: user?.name || payload?.firstname || '',
        user_phone: payload?.phone || billingDataFromStorage?.phone || user?.phone || '',
      };

      console.log('VERIFICATION PAYLOAD (FINAL):', invoicePayload);
      console.log('pro_course:', invoicePayload.pro_course);
      console.log('pro_course_id:', invoicePayload.pro_course_id);
      console.log('Billing Data:', billingDataFromStorage);

      const verifyResponse: any = await apiVerifyPayment(invoicePayload);

      if (verifyResponse.status === 1 || verifyResponse.status === true) {
        Swal.fire({
          title: 'Payment Successful',
          text: 'Your payment has been verified.',
          icon: 'success',
          theme: 'dark'
        });

        setVerifyData({
          ...billingDataFromStorage,
          ...verifyResponse.data,
          ...verifyResponse,
          address: billingDataFromStorage?.address || verifyResponse?.data?.address || verifyResponse?.data?.Address || '',
          state_name: billingDataFromStorage?.state_name || verifyResponse?.data?.state_name || verifyResponse?.data?.state || '',
          country_name: billingDataFromStorage?.country_name || verifyResponse?.data?.country_name || verifyResponse?.data?.country || '',
          invoiceNo: verifyResponse.invoice_no || verifyResponse.data?.invoice_no,
          txnid: verifyResponse.data?.txnid || payload?.txnid || payload?.mihpayid,
          amount: verifyResponse.data?.amount || payload?.amount,
          pro_course: storedCourseName,
          pro_course_id: storedCourseId
        });

        setPurchaseDialog(false);
        setShowUserForm(false);
        setInvoiceDialog(true);

        // Auto transition to Thank You dialog after 30 seconds
        setTimeout(() => {
          setInvoiceDialog(false);
          setThankYouDialog(true);
        }, 30000);

        // Clear all stored data after successful verification
        localStorage.removeItem('payu_pro_course_id');
        localStorage.removeItem('payu_course_name');
        localStorage.removeItem('payu_course_category');
        localStorage.removeItem('payu_course_code');
        localStorage.removeItem('payu_tuition_fee');
        localStorage.removeItem('payu_billing_data');

        fetchCourse();
        queryClient.invalidateQueries({ queryKey: ['mycourses'] });

      } else {
        throw new Error(verifyResponse.message || 'Verification failed');
      }

    } catch (error: any) {
      console.error('Verification error:', error);
      Swal.fire({
        title: 'Verification Failed',
        text: error.message,
        icon: 'error',
        theme: 'dark'
      });
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <>
      <Dialog open={purchaseDialog} onOpenChange={setPurchaseDialog}>
        <DialogContent className="p-0 rounded-[24px] shadow-2xl max-w-2xl bg-[#1a1a1a] border-none overflow-hidden text-white max-h-[90vh] flex flex-col">
          <div className="p-10 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <h2 className="text-3xl font-bold text-center mb-10 tracking-tight">Purchase Course</h2>

            <button
              onClick={() => setPdfDialog(true)}
              className='flex items-center justify-center gap-2 mb-6 w-full group cursor-pointer hover:opacity-80 transition-opacity'
            >
              <FileText className="text-red-500 group-hover:scale-110 transition-transform" size={18} />
              <p className="text-sm font-bold text-white underline underline-offset-2">Refund Policy</p>
            </button>

            <div className="bg-[#2a2a2a] p-6 rounded-2xl mb-6 border border-white/5 shadow-inner">
              <h3 className="text-xl font-bold text-white/90">{courseDetails?.name}</h3>
            </div>

            {(courseLeader?.length > 0 || courseFaculty?.length > 0) && <div className="bg-[#2a2a2a] p-8 rounded-2xl mb-10 border border-white/5">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-3">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Course Tool:</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 p-1.5 flex items-center justify-center border border-white/10 overflow-hidden shadow-lg">
                      <img
                        src={programTools?.[0]?.logo_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbqzXb0frYPXslo6raQm6Jaw5Nhp46A94orw&s'}
                        alt="Tool"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-white/90 truncate uppercase tracking-tight">{programTools?.[0]?.name || "Adobe Tools"}</p>
                      <p className="text-[9px] text-gray-500 font-medium truncate uppercase tracking-wider">{programTools?.[0]?.category || "Design Software"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Course Leader:</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-[#00ACF0]/30 overflow-hidden shadow-lg">
                      <img
                        src={courseLeader?.[0]?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(courseLeader?.[0]?.name || 'Leader')}&background=random`}
                        alt="Leader"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-white/90 truncate uppercase tracking-tight">{courseLeader?.[0]?.name || "Course Leader"}</p>
                      <p className="text-[9px] text-gray-500 font-medium truncate uppercase tracking-wider">{courseLeader?.[0]?.designation || courseLeader?.[0]?.expertise || "Mentor"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Course Instructor:</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-primary/30 overflow-hidden shadow-lg">
                      <img
                        src={courseFaculty?.[0]?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(courseFaculty?.[0]?.name || 'Instructor')}&background=random`}
                        alt="Instructor"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-white/90 truncate uppercase tracking-tight">{courseFaculty?.[0]?.name || "Course Instructor"}</p>
                      <p className="text-[9px] text-gray-500 font-medium truncate uppercase tracking-wider">{courseFaculty?.[0]?.designation || courseFaculty?.[0]?.expertise || "Instructor"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            }

            <div className="flex flex-col items-center gap-8">
              {!showUserForm ? (
                <>
                  <div className="bg-[#1f1f1f] rounded-[24px] p-5 flex flex-col items-center gap-4 border border-white/5 shadow-2xl w-full max-w-sm">
                    <div className="w-full space-y-3">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                        <span className="text-xl font-black text-white italic tracking-tighter">
                          ₹{parseFloat(courseDetails?.course_meta?.tuition_fee?.replace(/[^0-9.]/g, '') || '0').toFixed(2)}
                        </span>
                      </div>
                      {/* <div className="flex justify-between items-center pt-1">
                        <span className="text-xs font-bold text-[#00ACF0] uppercase tracking-widest">Total Amount</span>
                        <span className="text-3xl font-black text-white italic tracking-tighter">
                          ₹{(parseFloat(courseDetails?.course_meta?.tuition_fee?.replace(/[^0-9.]/g, '') || '0') * 1.18).toFixed(2)}
                        </span>
                      </div> */}
                    </div>

                    <button
                      onClick={() => setShowUserForm(true)}
                      disabled={isPaymentLoading || !courseDetails?.course_meta?.tuition_fee || parseFloat(courseDetails?.course_meta?.tuition_fee?.replace(/[^0-9.]/g, '') || '0') === 0}
                      className="w-full bg-[#00ACF0] hover:bg-[#00ACF0]/90 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-[#00ACF0]/20 active:scale-95 disabled:opacity-50"
                    >
                      {isPaymentLoading ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                  </div>

                  {/* {!isProd && (
                    <button
                      onClick={() => {
                        setPurchaseDialog(false);
                        setEnrollDialog(true);
                      }}
                      className="text-[#fff] flex items-center justify-center gap-2 bg-[#00ACF0]/90 p-4 rounded-xl text-xl font-bold tracking-wider hover:underline transition-all"
                    >
                      <span>Send request to admin</span> <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )} */}

                  {/* {isProd && (
                    <button
                      onClick={() => {
                        setPurchaseDialog(false);
                        setEnrollDialog(true);
                      }}
                      className="text-[#fff] bg-[#00ACF0]/90 p-4 rounded-xl text-xl font-bold tracking-wider hover:underline transition-all"
                    >
                      Send Request to Admin
                    </button>
                  )} */}
                </>
              ) : (
                <BillingDetails
                  tuitionFee={courseDetails?.course_meta?.tuition_fee || '0'}
                  onBack={() => setShowUserForm(false)}
                  onConfirm={handleProceedToPayment}
                  isLoading={isPaymentLoading}
                />
              )}
            </div >
          </div >
        </DialogContent >
      </Dialog >

      <Dialog open={invoiceDialog} onOpenChange={setInvoiceDialog}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-2xl">
          <div className="relative group">
            <CourseInvoice
              data={verifyData}
              courseDetails={courseDetails}
              user={user}
              onClose={() => setInvoiceDialog(false)}
              onGoToCourse={() => {
                setInvoiceDialog(false);
                navigate(`/courses/${courseDetails?.id || '7803'}`);
                window.location.reload();
              }}
            />
            <button
              onClick={() => setInvoiceDialog(false)}
              className="absolute -top-12 right-0 text-white/50 hover:text-white transition-all bg-white/5 p-2 rounded-full backdrop-blur-sm border border-white/10 hover:bg-white/10"
            >
              <ChevronDown className="w-6 h-6 rotate-0 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* THANK YOU DIALOG */}
      <Dialog open={thankYouDialog} onOpenChange={setThankYouDialog}>
        <DialogContent className="p-0 rounded-[24px] shadow-2xl max-w-lg bg-[#2b2b2b] border-none overflow-hidden text-center">
          <div className="relative p-10 pt-16">
            <button
              onClick={() => setThankYouDialog(false)}
              className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h2 className="text-4xl font-bold mb-8 flex items-center justify-center gap-2">
              Thank you<span className="text-[#00ACF0]">✨</span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-10 max-w-sm mx-auto text-center">
              You have been successfully enrolled into <br />
              <span className="font-medium text-white">"{courseDetails?.name}"</span> <br />
              course.<br />
              <span className="inline-block mt-4">
                We are happy that you are on the right path <br />
                of achieving extraordinary.
              </span>
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setThankYouDialog(false);
                  setInvoiceDialog(true);
                }}
                className="group flex items-center justify-center gap-2 text-white bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold text-sm transition-all mx-auto w-fit border border-white/5"
              >
                View Invoice
              </button>
              <button
                onClick={() => {
                  setThankYouDialog(false);
                  navigate(`/courses/${courseDetails?.id || '7803'}`);
                  window.location.reload();
                }}
                className="group flex items-center justify-center gap-2 text-[#00ACF0] hover:text-[#009bd9] font-black text-sm uppercase tracking-[0.2em] transition-all mx-auto w-fit"
              >
                Go to enrolled course
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={pdfDialog} onOpenChange={setPdfDialog}>
        <DialogContent className="p-0 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 shrink-0">
            <FileText className="text-red-500" size={20} />
            <span className="text-white font-bold tracking-tight">Refund &amp; Cancellation Policy</span>
          </div>
          {/* PDF iframe */}
          <iframe
            src="/enCODE_Refund_Cancellation_Policy.pdf"
            className="flex-1 w-full"
            title="Refund & Cancellation Policy"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CoursePayment;