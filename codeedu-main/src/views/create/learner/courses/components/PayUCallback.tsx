import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { apiVerifyPayment } from '@/services/PaymentService';
import type { PaymentVerifyRequest } from '@/@types/payment';
import { useAuth } from '@/auth';
import Swal from 'sweetalert2';
import Loading from '@/components/shared/Loading';
import CourseInvoice from './CourseInvoice';
import { getNumericRate } from '../utils/taxData';
import ApiService from '@/services/ApiService';
import { CreativeCheckoutState } from '@/views/@getting-started/CreativeStages';

// Global Map to cache verification promises and prevent duplicate requests while preserving results across mounts
const verificationPromises = new Map<string, Promise<{ success: boolean; data?: any }>>();

const PayUCallback = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    let x = 0;
    const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'idle'>('loading');
    const [verifyData, setVerifyData] = useState<any>(null);

    useEffect(() => {
        const paymentStatus = searchParams.get('payment') || searchParams.get('status');
        const mihpayid = searchParams.get('mihpayid') || searchParams.get('payuid');
        const txnid = searchParams.get('txnid');

        if (paymentStatus === 'failure') {
            setStatus('failed');
            // Retrieve stored course ID for redirection
            const storedCourseId = localStorage.getItem('payu_pro_course_id') || id || '';
            Swal.fire({
                title: 'Payment Failed',
                text: 'Your payment was cancelled or failed.',
                icon: 'error',
                theme: 'dark'
            }).then(() => {
                navigate(`/courses/${storedCourseId || 'explore'}`);
            });
            return;
        }

        if (mihpayid || txnid) {
            const txnKey = txnid || mihpayid;
            if (txnKey) {
                let promise = verificationPromises.get(txnKey);
                if (!promise) {
                    const payload: Record<string, any> = {};
                    searchParams.forEach((v, k) => payload[k] = v);

                    // Retrieve all stored data from localStorage (survives redirect)
                    const storedCourseId = localStorage.getItem('payu_pro_course_id') || id || '';
                    const storedCourseName = localStorage.getItem('payu_course_name') || '';
                    const storedCourseCategory = localStorage.getItem('payu_course_category') || '';
                    const storedCourseCode = localStorage.getItem('payu_course_code') || '';
                    const storedTuitionFee = localStorage.getItem('payu_tuition_fee') || '';

                    // Retrieve billing data from localStorage
                    let billingDataFromStorage: any = {};
                    try {
                        const storedBillingData = localStorage.getItem('payu_billing_data');
                        if (storedBillingData) {
                            billingDataFromStorage = JSON.parse(storedBillingData);
                            console.log('Retrieved billing data from storage:', billingDataFromStorage);
                        }
                    } catch (error) {
                        console.error('Error parsing billing data:', error);
                    }

                    promise = handleVerify(
                        payload,
                        storedCourseId,
                        storedCourseName,
                        storedCourseCategory,
                        storedCourseCode,
                        storedTuitionFee,
                        billingDataFromStorage
                    );
                    verificationPromises.set(txnKey, promise);
                }

                setStatus('loading');
                promise.then((result) => {
                    if (result && result.success) {
                        setVerifyData(result.data);
                        setStatus('success');
                    } else {
                        setStatus('failed');
                    }
                }).catch(() => {
                    setStatus('failed');
                });
            }
        } else {
            setStatus('idle');
        }
    }, [searchParams, id]);

    const CHECKOUT_STORAGE_KEY = "creative_checkout_state";
    const readStoredCheckoutState = (): CreativeCheckoutState | null => {
        try {
            const storedState = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
            return storedState ? JSON.parse(storedState) : null;
        } catch {
            return null;
        }
    };

    const checkoutState = useMemo<CreativeCheckoutState | null>(() => {
        return readStoredCheckoutState();
    }, []);
    const selectedPlan = checkoutState?.selectedPlan ?? null;
    const selectedCourses = checkoutState?.selectedCourses ?? [];

    const handlePackageAssignment = async () => {
        const pkg: any = selectedPlan;
        const userPackageApi = 'v1/users/package/create';
        const payload = {
            user_id: user.id,
            package_id: Number(pkg.id),
            status: 'Active',
            is_latest: 1,
            is_upgraded: 0,
            price_at_purchase: String(pkg.price),
        };

        await ApiService.fetchDataWithNode<any>({
            url: userPackageApi,
            method: 'POST',
            data: payload,
        });

        const baseUrl = "update_package_id";

        await ApiService.fetchDataWithAxios<any>({
            url: baseUrl,
            method: 'POST',
            data: { package_id: String(pkg.id), user_id: String(user.id) },
        });

        const courseUrl = "enroll_course";
        const coursePayload = {
            program_id: selectedCourses.map(course => course.id).join(","),
        };

        await ApiService.fetchDataWithAxios<any>({
            url: courseUrl,
            method: 'POST',
            data: coursePayload,
        });
    }

    const handleVerify = async (
        payload: any,
        courseId: string = '',
        courseName: string = '',
        courseCategory: string = '',
        courseCode: string = '',
        tuitionFee: string = '',
        billingData: any = {}
    ): Promise<{ success: boolean; data?: any }> => {
        setStatus('loading');
        try {
            // Calculate amounts properly
            const totalAmountFromFee = parseFloat(tuitionFee?.replace(/[^0-9.]/g, '') || '0');
            const totalAmtValue = parseFloat(payload?.amount || billingData?.total_amount || totalAmountFromFee.toFixed(2));

            // ── Country / state for tax jurisdiction ───────────────────────
            const countryName = billingData?.country_name || payload?.country || 'India';
            const customerState = payload?.state || billingData?.state_name || '';
            const isIndia = countryName.toLowerCase() === 'india';
            // CGST+SGST only when customer is in the same state as merchant (Rajasthan)
            const isRajasthan = customerState.toLowerCase() === 'rajasthan';
            const isIntraState = isIndia && isRajasthan;

            // ── Dynamic tax rate (country-specific) ────────────────────────
            const taxRate = isIndia ? getNumericRate(countryName) : 0; // e.g. 18 (India), 0 (Others)

            // ── Selling price & total tax from billing data if available ───
            const sellingPrice = billingData?.selling_price
                ? parseFloat(billingData.selling_price)
                : taxRate > 0
                    ? totalAmtValue / (1 + taxRate / 100)
                    : totalAmtValue; // no-tax country

            const gstTotal = billingData?.gst_total
                ? parseFloat(billingData.gst_total)
                : totalAmtValue - sellingPrice;

            let cgstValue = billingData?.cgst ? parseFloat(billingData.cgst) : 0;
            let sgstValue = billingData?.sgst ? parseFloat(billingData.sgst) : 0;
            let igstValue = billingData?.igst ? parseFloat(billingData.igst) : 0;

            // Recalculate split only if not already saved in billingData
            if (!cgstValue && !igstValue) {
                if (isIntraState) {
                    // India + Rajasthan → CGST + SGST
                    cgstValue = gstTotal / 2;
                    sgstValue = gstTotal / 2;
                } else {
                    // India (inter-state) or any other country → single tax line
                    igstValue = gstTotal;
                }
            }

            const purchaseType = localStorage.getItem("purchase_type");
            const proCourse = localStorage.getItem("pro_course");
            const proCourseId = localStorage.getItem("pro_course_id");

            // Build the complete invoice payload with ALL required fields
            const invoicePayload: any = {
                // Payment gateway fields
                gateway: payload?.gateway || 'payu',
                mihpayid: payload?.mihpayid || '',
                mode: payload?.mode || 'CC',
                status: payload?.status || 'success',
                unmappedstatus: payload?.unmappedstatus || 'captured',
                key: payload?.key || 'eFBbV2',
                txnid: payload?.txnid || '',
                amount: totalAmtValue.toFixed(2),
                cardCategory: payload?.cardCategory || 'domestic',
                discount: payload?.discount || '0.00',
                net_amount_debit: payload?.net_amount_debit || totalAmtValue,
                addedon: payload?.addedon || new Date().toISOString(),
                productinfo: courseName || payload?.productinfo || 'Product',
                firstname: payload?.firstname || user?.name || '',
                lastname: payload?.lastname || '',
                address1: payload?.address1 || billingData?.address || '',
                address2: payload?.address2 || '',
                city: payload?.city || billingData?.city || '',
                state: payload?.state || billingData?.state_name || '',
                country: payload?.country || billingData?.country_name || 'India',
                zipcode: payload?.zipcode || billingData?.zipcode || '',
                email: payload?.email || user?.email || '',
                phone: payload?.phone || billingData?.phone || '',
                hash: payload?.hash || '',
                payment_source: payload?.payment_source || 'payu',
                PG_TYPE: payload?.PG_TYPE || 'CC-PG',
                bank_ref_num: payload?.bank_ref_num || '',
                cardnum: payload?.cardnum || `XXXXXXXXXXXX${(payload?.phone || billingData?.phone || '9999').slice(-4)}`,
                payment: payload?.status || payload?.payment || 'success',

                // User details
                Name: user?.name || payload?.firstname || '',
                Email: user?.email || payload?.email || '',
                Address: payload?.address1 || billingData?.address || (user as any)?.address || '',

                // CRITICAL: Course details - ensure these are NEVER null
                description: courseName || 'Course',
                Quantity: '1',
                Price: sellingPrice.toFixed(2),
                pro_course: proCourse ? proCourse : courseName || courseCategory || 'Course',
                pro_course_id: proCourseId ? proCourseId : courseId || '',
                course_name: courseName || '',
                course_code: courseCode || '',
                course_category: courseCategory || '',
                purchase_type: purchaseType || 'course',

                // Amount calculations
                sub_total: sellingPrice.toFixed(2),
                tax: gstTotal.toFixed(2),
                total_amt: totalAmtValue.toFixed(2),
                sp: sellingPrice.toFixed(2),

                // GST fields - CRITICAL for tax calculation
                cgst: cgstValue.toFixed(2),
                sgst: sgstValue.toFixed(2),
                igst: igstValue.toFixed(2),
                gst_total: gstTotal.toFixed(2),

                // Location fields - CRITICAL for tax jurisdiction
                country_id: billingData?.country_id || '',
                state_id: billingData?.state_id || '',
                country_name: payload?.country || billingData?.country_name || 'India',
                state_name: payload?.state || billingData?.state_name || '',

                // Payment details
                payment_method: payload?.payment_method || `Visa .... ${(payload?.cardnum || '').slice(-4) || (payload?.phone || billingData?.phone || '9999').slice(-4)}`,
                txn_id: payload?.txnid || payload?.mihpayid || '',
                payment_status: 'Paid',
                paid_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),

                // Additional user info
                user_id: (user as any)?.id || '',
                user_email: user?.email || payload?.email || '',
                user_name: user?.name || payload?.firstname || '',
                user_phone: payload?.phone || billingData?.phone || (user as any)?.phone || '',
            };

            const response: any = await apiVerifyPayment(invoicePayload);

            if (response.status === 1 || response.status === true || response.status === 'success') {
                const verifyResponseData = {
                    ...invoicePayload, // Base payload with all correct data
                    ...billingData,
                    ...(response.data || response),
                    address: payload?.address1 || billingData?.address || invoicePayload?.address1 || response?.data?.address || response?.data?.Address || '',
                    address1: payload?.address1 || billingData?.address || invoicePayload?.address1 || response?.data?.address || response?.data?.Address || '',
                    state_name: payload?.state || billingData?.state_name || invoicePayload?.state || response?.data?.state_name || response?.data?.state || '',
                    state: payload?.state || billingData?.state_name || invoicePayload?.state || response?.data?.state_name || response?.data?.state || '',
                    country_name: payload?.country || billingData?.country_name || invoicePayload?.country || response?.data?.country_name || response?.data?.country || '',
                    city: payload?.city || billingData?.city || invoicePayload?.city || response?.data?.city || '',
                    zipcode: payload?.zipcode || billingData?.zipcode || invoicePayload?.zipcode || response?.data?.zipcode || '',
                    cgst: cgstValue,
                    sgst: sgstValue,
                    igst: igstValue,
                    gst_total: gstTotal,
                    invoiceNo: response.invoice_no || response.data?.invoice_no,
                    txnid: payload?.txnid || payload?.mihpayid,
                    amount: payload?.amount,
                    pro_course: proCourse || courseName || courseCategory || 'Pro Course',
                    pro_course_id: proCourseId || courseId
                };

                setVerifyData(verifyResponseData);
                setStatus('success');

                if (purchaseType === "package") {
                    handlePackageAssignment();
                }
                // Clear all stored data after successful verification
                localStorage.removeItem('payu_pro_course_id');
                localStorage.removeItem('payu_course_name');
                localStorage.removeItem('payu_course_category');
                localStorage.removeItem('payu_course_code');
                localStorage.removeItem('payu_tuition_fee');
                // Kept payu_billing_data to survive page reloads (it gets overwritten on new payments anyway)

                // Auto redirect after 30 seconds
                localStorage.removeItem("purchase_type");
                localStorage.removeItem("pro_course");
                localStorage.removeItem("pro_course_id");
                setTimeout(() => {
                    if (invoicePayload.purchase_type === "package") {
                        navigate('/portfolio-summary', { replace: true });
                    } else {
                        navigate(`/courses/${courseId}?payment=success`, { replace: true });
                    }
                }, 5000);

                return { success: true, data: verifyResponseData };
            } else {
                throw new Error(response.message || 'Verification failed');
            }
        } catch (error: any) {
            setStatus('failed');

            // Retrieve stored course ID for redirection
            const storedCourseId = localStorage.getItem('payu_pro_course_id') || courseId || '';

            // Remove from active verifications so user can retry/refresh
            const txnKey = payload?.txnid || payload?.mihpayid;
            if (txnKey) {
                verificationPromises.delete(txnKey);
            }

            Swal.fire({
                title: 'Verification Failed',
                text: error.message || 'Could not verify payment.',
                icon: 'error',
                theme: 'dark'
            }).then(() => {
                navigate(`/courses/${storedCourseId || 'explore'}`);
            });

            return { success: false };
        }
    };

    if (status === 'success' && verifyData) {
        return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1a1a1a]">
                <CourseInvoice
                    data={verifyData}
                    courseDetails={{
                        id: verifyData.pro_course_id || id,
                        name: verifyData.pro_course || 'Course',
                        category_name: verifyData.course_category || ''
                    }}
                    user={user}
                    onClose={() => {
                        const courseId = verifyData.pro_course_id || id;
                        navigate(`/courses/${courseId}?payment=success`, { replace: true });
                    }}
                    onGoToCourse={() => {
                        const courseId = verifyData.pro_course_id || id;
                        navigate(`/courses/${courseId}?payment=success`, { replace: true });
                    }}
                />
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#1a1a1a] text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Payment Failed</h2>
                    <p className="text-gray-400">Redirecting to course page...</p>
                </div>
            </div>
        );
    }

    return <Loading loading={true} className="h-screen w-full flex items-center justify-center bg-[#1a1a1a]" />;
};

export default PayUCallback;

