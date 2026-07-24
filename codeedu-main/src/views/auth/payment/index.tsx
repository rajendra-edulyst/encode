import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiCreatePayment, apiVerifyPayment } from "@/services/PaymentService";
import { submitPreferences } from "@/services/getting-started";
import { useAuth } from "@/auth";
import courseIcon from "@/assets/images/course-icon.png";
import type { CreativeCheckoutState, PlanType } from "@/views/@getting-started/CreativeStages";
import type { PreAssignCourse } from "@/@types/learner/Courses";
import { colorStyles, duration } from "@/lib/packageColor";
import BillingDetails from "@/views/create/learner/courses/components/BillingDetails";
import type { PaymentVerifyRequest, PaymentVerifyResponse } from "@/@types/payment";
import { CheckIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ApiService from "@/services/ApiService";

const CHECKOUT_STORAGE_KEY = "creative_checkout_state";
const PACKAGE_STORAGE_KEYS = [
    "payu_package_id",
    "payu_package_name",
    "payu_package_price",
    "payu_package_duration",
    "payu_billing_data",
];

type BillingData = {
    address?: string;
    city?: string;
    country_id?: string;
    country_name?: string;
    state_id?: string;
    state_name?: string;
    zipcode?: string;
    phone?: string;
    selling_price?: string;
    total_amount?: string;
    sgst?: string;
    cgst?: string;
    gst_total?: string;
    igst?: string;
};

type AuthUser = {
    id?: string | number;
    name?: string;
    email?: string;
    phone?: string;
    mobile_no?: string;
};

type PaymentGatewayPayload = Record<string, string>;

type PaymentCreateData = {
    txnid?: string;
    hash?: string;
    key?: string;
    url?: string;
    amount?: string | number;
    firstname?: string;
    email?: string;
    phone?: string;
    productinfo?: string;
    product_info?: string;
    surl?: string;
    furl?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
    return error instanceof Error ? error.message : fallback;
};

const readStoredCheckoutState = (): CreativeCheckoutState | null => {
    try {
        const storedState = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
        return storedState ? JSON.parse(storedState) : null;
    } catch {
        return null;
    }
};

const formatLabel = (value?: string | null) => {
    if (!value) return "-";

    return value
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getCourseTitle = (course: PreAssignCourse) => course?.name || "Selected Course";

const getCourseSubtitle = (course: PreAssignCourse) => {
    const courseMeta = course?.course_meta_data;
    return courseMeta?.mode_of_delivery || "Course";
};

const getPackageName = (plan: PlanType) => plan?.name || "Selected Package";
const getPackageColor = (plan: PlanType) => plan?.color_code || "Selected Package";

const getPackagePrice = (plan: PlanType) => {
    const rawPrice = String(plan?.price ?? "0").replace(/[^0-9.]/g, "");
    return Number(rawPrice || 0);
};

const getStoredBillingData = (): BillingData => {
    try {
        const storedBillingData = localStorage.getItem("payu_billing_data");
        return storedBillingData ? JSON.parse(storedBillingData) : {};
    } catch {
        return {};
    }
};

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-[10px] bg-[#323232] p-4">
        <p className="text-[12px] font-normal text-[#909090] mb-1">{label}</p>
        <p className="text-[16px] font-bold text-white">{value}</p>
    </div>
);

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const authUser = user as AuthUser | undefined;
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [billingCycle, setBillingCycle] = useState<true | false>(true);
    const [purchaseDialog, setPurchaseDialog] = useState(false);

    const checkoutState = useMemo<CreativeCheckoutState | null>(() => {
        return (location.state as CreativeCheckoutState | null) || readStoredCheckoutState();
    }, [location.state]);

    const selectedPlan = checkoutState?.selectedPlan ?? null;
    const selectedCourses = checkoutState?.selectedCourses ?? [];
    const planName = getPackageName(selectedPlan);
    const planPrice = getPackagePrice(selectedPlan);
    const planColor = getPackageColor(selectedPlan);
    const planDuration = selectedPlan?.duration
        ? duration[selectedPlan.duration as keyof typeof duration]
        : null;
    const totalAmount = planPrice.toFixed(2);

    const color = planColor && colorStyles[planColor]?.color || "#7FC142"
    
    useEffect(() => {
        if (checkoutState) {
            sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkoutState));
        }
    }, [checkoutState]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get("payment") || params.get("status");
        const txnid = params.get("txnid");
        const mihpayid = params.get("mihpayid");
        const payuid = params.get("payuid");

        if (status === "failure") {
            window.history.replaceState(null, "", window.location.pathname);
            Swal.fire({
                title: "Payment Failed",
                text: "Your payment was cancelled or failed.",
                icon: "error",
                theme: "dark",
            });
            return;
        }

        if (status === "success" || txnid || mihpayid || payuid) {
            const payload: PaymentGatewayPayload = {};
            params.forEach((value, key) => {
                payload[key] = value;
            });
            window.history.replaceState(null, "", window.location.pathname);
            void handleVerifyPayment(payload);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const handleProceedToPayment = async (formData: BillingData) => {
        if (!selectedPlan?.id) {
            Swal.fire({
                title: "Package Missing",
                text: "Please select a package before continuing to payment.",
                icon: "error",
                theme: "dark",
            });
            navigate("/creative-stage");
            return;
        }

        const amount = formData?.total_amount || totalAmount;
        const firstname = authUser?.name || "User";
        const email = authUser?.email || sessionStorage.getItem("accountEmail") || "test@example.com";
        const phone = formData?.phone || authUser?.phone || authUser?.mobile_no || "";

        try {
            setIsPaymentLoading(true);
            localStorage.setItem("payu_billing_data", JSON.stringify(formData));
            localStorage.setItem("payu_package_id", String(selectedPlan.id));
            localStorage.setItem("payu_package_name", planName);
            localStorage.setItem("payu_package_price", String(amount));
            localStorage.setItem("payu_package_duration", String(selectedPlan.duration || ""));
            localStorage.setItem("purchase_type", "package");
            localStorage.setItem("pro_course", "package");
            localStorage.setItem("pro_course_id", selectedPlan.id.toString());

            const response = await apiCreatePayment({
                gateway: "payu",
                amount,
                firstname,
                email,
                phone,
                productinfo: planName,
            });

            const data = (response?.data || response) as PaymentCreateData;
            const txnid = data?.txnid;
            const hash = data?.hash;
            const key = data?.key || "eFBbV2";
            const paymentUrl = data?.url || "https://test.payu.in/_payment";

            if (!txnid || !hash) {
                throw new Error("Invalid payment data");
            }

            const fields: Record<string, string> = {
                key: String(data?.key || key),
                txnid: String(txnid),
                hash: String(hash),
                amount: String(data?.amount || amount),
                firstname: String(data?.firstname || firstname),
                email: String(data?.email || email),
                phone: String(data?.phone || phone),
                productinfo: String(data?.productinfo || data?.product_info || planName),
            };

            if (data?.surl) fields.surl = String(data.surl);
            if (data?.furl) fields.furl = String(data.furl);
            if (formData.address) fields.address1 = String(formData.address);
            if (formData.country_name) fields.country = String(formData.country_name);
            if (formData.state_name) fields.state = String(formData.state_name);
            if (formData.city) fields.city = String(formData.city);
            if (formData.zipcode) fields.zipcode = String(formData.zipcode);

            const form = document.createElement("form");
            form.method = "POST";
            form.action = paymentUrl;
            form.style.display = "none";

            Object.entries(fields).forEach(([name, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = name;
                input.value = value;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (error: unknown) {
            Swal.fire({
                title: "Error",
                text: getErrorMessage(error, "Payment initiation failed"),
                icon: "error",
                theme: "dark",
            });
        } finally {
            setIsPaymentLoading(false);
        }
    };

    const handleVerifyPayment = async (payload: PaymentGatewayPayload) => {
        const billingData = getStoredBillingData();
        const storedPackageId = localStorage.getItem("payu_package_id") || String(selectedPlan?.id || "");
        const storedPackageName = localStorage.getItem("payu_package_name") || planName;
        const storedPackagePrice = localStorage.getItem("payu_package_price") || totalAmount;
        const storedPackageDuration = localStorage.getItem("payu_package_duration") || String(selectedPlan?.duration || "");
        const totalAmtValue = parseFloat(payload?.amount || billingData?.total_amount || storedPackagePrice || "0");
        const sellingPrice = parseFloat(billingData?.selling_price || totalAmtValue.toFixed(2));
        const gstTotal = parseFloat(billingData?.gst_total || "0");

        try {
            setIsVerifying(true);

            const invoicePayload: PaymentVerifyRequest = {
                gateway: payload?.gateway || "payu",
                mihpayid: payload?.mihpayid || payload?.payuid || "",
                mode: payload?.mode || "",
                status: payload?.status || "success",
                unmappedstatus: payload?.unmappedstatus || "",
                key: payload?.key || "",
                txnid: payload?.txnid || "",
                amount: totalAmtValue.toFixed(2),
                cardCategory: payload?.cardCategory || "",
                discount: payload?.discount || "0.00",
                net_amount_debit: payload?.net_amount_debit || totalAmtValue,
                addedon: payload?.addedon || new Date().toISOString(),
                productinfo: storedPackageName || payload?.productinfo || "Package",
                firstname: payload?.firstname || authUser?.name || "",
                lastname: payload?.lastname || "",
                address1: billingData?.address || payload?.address1 || "",
                address2: payload?.address2 || "",
                city: payload?.city || billingData?.city || "",
                state: payload?.state || billingData?.state_name || "",
                country: payload?.country || billingData?.country_name || "",
                zipcode: payload?.zipcode || billingData?.zipcode || "",
                email: payload?.email || authUser?.email || sessionStorage.getItem("accountEmail") || "",
                phone: payload?.phone || billingData?.phone || authUser?.phone || "",
                hash: payload?.hash || "",
                payment_source: payload?.payment_source || "payu",
                PG_TYPE: payload?.PG_TYPE || "",
                bank_ref_num: payload?.bank_ref_num || "",
                cardnum: payload?.cardnum || "",
                payment: payload?.status || payload?.payment || "success",
                Name: authUser?.name || payload?.firstname || "",
                Email: authUser?.email || payload?.email || "",
                Address: billingData?.address || payload?.address1 || "",
                description: storedPackageName || "Package",
                Quantity: "1",
                Price: sellingPrice.toFixed(2),
                pro_course: storedPackageName || "Package",
                pro_course_id: storedPackageId,
                package_duration: storedPackageDuration,
                purchase_type: "package",
                sub_total: sellingPrice.toFixed(2),
                tax: gstTotal.toFixed(2),
                total_amt: totalAmtValue.toFixed(2),
                sp: sellingPrice.toFixed(2),
                cgst: parseFloat(billingData?.cgst || "0").toFixed(2),
                sgst: parseFloat(billingData?.sgst || "0").toFixed(2),
                igst: parseFloat(billingData?.igst || "0").toFixed(2),
                gst_total: gstTotal.toFixed(2),
                country_id: billingData?.country_id || "",
                state_id: billingData?.state_id || "",
                country_name: payload?.country || billingData?.country_name || "",
                state_name: payload?.state || billingData?.state_name || "",
                payment_method: payload?.payment_method || payload?.mode || "PayU",
                txn_id: payload?.txnid || payload?.mihpayid || payload?.payuid || "",
                payment_status: "Paid",
                paid_date: new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
                user_id: authUser?.id || "",
                user_email: authUser?.email || payload?.email || "",
                user_name: authUser?.name || payload?.firstname || "",
                user_phone: payload?.phone || billingData?.phone || authUser?.phone || "",
            };

            const verifyResponse: PaymentVerifyResponse = await apiVerifyPayment(invoicePayload);

            if (verifyResponse.status === 1 || verifyResponse.status === true || verifyResponse.status === "success") {
                if (storedPackageId) {
                    await submitPreferences(Number(storedPackageId));
                }
                await handlePackageAssignment();
                PACKAGE_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
                sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);

                Swal.fire({
                    title: "Payment Successful",
                    text: "Your package payment has been verified.",
                    icon: "success",
                    theme: "dark",
                }).then(() => {
                    navigate("/portfolio", { replace: true });
                });
            } else {
                throw new Error(verifyResponse.message || "Verification failed");
            }
        } catch (error: unknown) {
            Swal.fire({
                title: "Verification Failed",
                text: getErrorMessage(error, "Could not verify payment."),
                icon: "error",
                theme: "dark",
            });
        } finally {
            setIsVerifying(false);
        }
    };

    const handleConfirmToPay = () => {
        setPurchaseDialog(true);
    }

    return (
        <div className="min-h-screen text-white relative overflow-hidden w-full flex flex-col items-center py-10">
            <div className="text-center mb-12 relative z-10">
                <h1 className="text-4xl md:text-5xl font-jacques font-bold mb-4">
                    Choose Payment <span className="text-codeblue font-creative">Method</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 font-light">
                    Select how would you like to complete your payment.
                </p>
            </div>

            <div className="relative z-10 flex gap-10 w-full max-w-[90%] items-start flex-wrap mb-64 px-4">
                <div className="flex flex-1 flex-col gap-3 min-w-[320px]">
                    {/* Billing Cycle */}
                    <div className="rounded-[20px] bg-[#1D1D1D] p-5 mb-3.5">
                        <p className="text-xl font-bold text-white tracking-[1px] mb-3.5">
                            Billing Cycle
                        </p>
                        <div className={`
                            flex items-center gap-3 rounded-[10px] p-4 cursor-pointer transition-all duration-150 bg-[#323232]`}>
                            <button className={`w-[18px] h-[18px] bg-transparent rounded flex items-center justify-center flex-shrink-0 border-2
                                ${billingCycle === true
                                    ? 'border-[#00A8E9]'
                                    : 'border-[#7A7A7A]'}
                            `} onClick={() => setBillingCycle(!billingCycle)}>
                                {billingCycle === true ? <CheckIcon color="#00A8E9" fontWeight={700} /> : ""}
                            </button>
                            <div>
                                <p className="text-[16px] font-bold">Full Payment</p>
                                <p className="text-[12px] font-normal mt-0.5">Your subscription starts from the day you buy it</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[20px] bg-[#1D1D1D] p-5 mb-3.5">
                        <p className="text-xl font-bold text-white tracking-[1px] mb-3.5">
                            Selected Courses
                        </p>
                        <div className="flex flex-col gap-2.5">
                            {selectedCourses.length > 0 ? selectedCourses.map((course) => (
                                <div key={course.id} className="relative flex items-center gap-3 bg-[#323232] rounded-[10px] p-4 overflow-hidden">
                                    <img
                                        src={courseIcon}
                                        alt="Course"
                                        className="rounded-[6px] bg-[#131313] border-[0.2px] border-white border-opacity-60 w-12 h-12 object-contain"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[16px] font-bold truncate">{getCourseTitle(course)}</p>
                                        <p className="text-[14px] text-white font-light mt-1">{getCourseSubtitle(course)}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-[14px] text-[#909090] bg-[#323232] rounded-[10px] p-4">
                                    No courses selected yet.
                                </p>
                            )}
                        </div>
                    </div>

                    <Dialog open={purchaseDialog} onOpenChange={setPurchaseDialog}>
                        <DialogContent className="p-0 rounded-[24px] shadow-2xl max-w-2xl bg-[#1a1a1a] border-none overflow-hidden text-white max-h-[90vh] flex flex-col">
                            <BillingDetails
                                tuitionFee={totalAmount}
                                isLoading={isPaymentLoading || isVerifying}
                                onBack={() => navigate("/creative-stage")}
                                onConfirm={handleProceedToPayment}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="w-full lg:w-[397px] flex-shrink-0 sticky top-0">
                    <div className="bg-[#1D1D1D] rounded-[20px] p-5 flex flex-col gap-1">
                        <h3 className="text-xl font-bold text-white tracking-[1px] mb-4.5">
                            Order Summary
                        </h3>

                        <div className="flex justify-between items-start mb-3.5 mt-5">
                            <p className="text-[16px] font-normal text-white">Your Package</p>
                            <div className="text-right flex flex-col gap-2 items-end">
                                <p className={`text-xl font-bold text-[${color}]`}>{planName}</p>
                                <p className="text-xl font-bold text-white">Rs.{totalAmount}</p>
                            </div>
                        </div>

                        <div className="h-px bg-[#5A5A5A] mb-4" />

                        <div className="flex justify-between items-end mb-5">
                            <p className="text-2xl font-bold">Total<br />Amount</p>
                            <div className="text-right">
                                <p className="text-xl font-bold">Rs.{totalAmount}</p>
                                <p className="text-[16px] font-normal text-[#909090] mt-0.5">
                                    {planDuration ? `/${planDuration.days} Days` : "/-"}
                                </p>
                            </div>
                        </div>

                        <div className="h-px bg-[#5A5A5A] mb-4" />

                        <div className="bg-[#323232] rounded-[10px] p-[10px] mb-4.5">
                            <ul className="list-disc pl-5">
                                {["Cancel Anytime", "7 Days money-back guarantee"].map((item) => (
                                    <li key={item} className="text-[14px] font-light text-white">{item}</li>
                                ))}
                            </ul>
                        </div>
                        <button
                            id="payu-submit-btn"
                            onClick={handleConfirmToPay}
                            className="w-fit bg-[#FFEC00] text-black font-bold text-[16px] rounded-[10px] p-4 mx-auto mt-4 cursor-pointer transition-transform duration-150"
                        >
                            Complete<br />Payment
                        </button>
                    </div>
                </div>
            </div>

            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute bottom-[-12rem] left-0 w-full h-96 object-cover z-0 opacity-80 pointer-events-none"
            >
                <source src="/video/rainbow.mp4" type="video/mp4" />
            </video>
        </div>
    );
}
