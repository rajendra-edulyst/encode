import { useAuth } from "@/auth";
import { Button } from "@/components/ui/ShadcnButton";
import { userSignUpData } from "@/views/auth/@hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CheckCircleIcon, Loader } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {


    const token = sessionStorage.getItem('token');
    const { data: userResponse } = userSignUpData(token);
    const user = userResponse?.data;
    const { signUp } = useAuth()
    const navigate = useNavigate();

    const [message, setMessage] = useState<{ type: "success" | "error"; content: string } | null>(null);

    const signUpMutation = useMutation({
        mutationFn: signUp,
        onSuccess: (data) => {
            if (data.status === 0) {
                setMessage({ type: "error", content: data.message || "Something went wrong, please try again later." });
                return;
            }
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('accountEmail');
            setMessage({ type: "success", content: "Registration successful! Redirecting to community..." });
        },
        onError: (err: unknown) => {
            const error = err as AxiosError<{ message?: string }>;
            setMessage({ type: "error", content: error.response?.data?.message || "Something went wrong, please try again later." });
        },
    });

    const continueToCommunity = () => {

        if (!user) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('accountEmail');
            setMessage({ type: "error", content: "Something went wrong, please try again later." });
            navigate('/sign-up');
            return;
        }

        const data = {
            name: user?.name || "",
            // password: 'BoQ28iFzUPYHEHO',
            email: user?.email || "",
            dob: '',
            profilePic: '',
            profile_pic_cdn: user?.data?.profile_pic_cdn || `https://ui-avatars.com/api/?name=${user?.name}`,
            first_name: user?.name?.split(' ')[0] || "",
            last_name: user?.name?.split(' ')[1] || "",
            gender: "",
            mobile_no: user?.mobile_number || "",
            alternate_mobile_no: "",
            email_address: user?.email || "",
            date_of_birth: "",
            db_code: "0",
            username: user?.email || "",
            locale: "English",
            created_timezone: "UTC+05:30",
            wp_center_id: null,
            wp_course_id: null
        }

        signUpMutation.mutate(data);
    };

    return (
        <div className="flex flex-col gap-4 justify-center items-center h-full">
            <div>
                <CheckCircleIcon size={70} className="text-cgreen mx-auto mb-5" />
                <h1 className="text-3xl font-bold mb-1 text-cgreen flex justify-center">Registration Complete!</h1>
            </div>
            <div className="flex items-center text-center flex-col gap-4 text-base">
                <p>Thanks for your interest, <span className='font-semibold text-cpink'>{user?.name}</span></p>
                <p>Your reference number is <span className='font-semibold font-semibold text-cpink'>{user?.reference_number}</span></p>
            </div>
            <Button type="submit"
                className="bg-[#d63384] hover:bg-[#b02a5b] text-white rounded-lg px-8 py-2 font-semibold focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0"
                onClick={continueToCommunity}
            >
                {signUpMutation.isPending ? "please wait ..." : "Continue"} <Loader className={`${signUpMutation.isPending ? 'animate-spin' : 'hidden'}`} />
            </Button>
            {message && <div>
                <p className={`text-sm ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>{message.content}</p>
            </div>}
        </div>
    )
}

export default Registration