import { SignUpRequestReponseData } from "@/@types/auth";
import { Button } from "@/components/ui/ShadcnButton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Registration = () => {

    // const signupProfile = useThemeStore((state)=>state.loginProfile);

    const navigate = useNavigate();

    const [data, setData] = useState<SignUpRequestReponseData>({} as SignUpRequestReponseData);

    const removeSessions = () => {
        sessionStorage.removeItem('accountEmail');
        sessionStorage.removeItem('verified-email');
        sessionStorage.removeItem('otp-countdown-time');
        sessionStorage.removeItem('studentData');
        sessionStorage.removeItem('signup-request-data');
        navigate('/sign-up');
    };

    useEffect(() => {
        const storedData = sessionStorage.getItem('signup-request-data');
        if (!storedData) {
            toast.error('Something went wrong, please try again');
            navigate('/sign-up');
            return;
        }
        setData(JSON.parse(storedData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="h-[200px] flex flex-col gap-4">
                <div className="flex items-center text-center flex-col gap-4 text-base">
                   <p>Thanks for your interest, <span className='font-semibold'>{data.name}</span></p>
                   <p>Your reference number is <span className='font-semibold'>{data.reference_code}</span></p>
                </div> 
                <div className='mt-3 flex justify-center'>
                    <Button
                        type="submit"
                        className="bg-[#d63384] hover:bg-[#b02a5b] text-white w-[400px]  rounded-lg px-8 py-2 font-semibold focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0"
                        onClick={() => removeSessions()}
                    >
                        Continue to our community
                    </Button>
                 
                </div>
        </div>
    )
}

export default Registration