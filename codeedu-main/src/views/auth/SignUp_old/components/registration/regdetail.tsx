import { Button } from "@/components/ui/ShadcnButton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisFaculty = () => {
    const navigate = useNavigate();

   const removeSessions = () => {
        sessionStorage.removeItem('accountEmail');
        sessionStorage.removeItem('verified-email');
        sessionStorage.removeItem('otp-countdown-time');
        sessionStorage.removeItem('studentData');
        sessionStorage.removeItem('signup-request-data');
        navigate('/sign-in');
    };
   
     
      const [data, setData] = useState<{
        name?: string;
        email?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    }>({});


    useEffect(() => {
        const signupData = sessionStorage.getItem('signup-request-data');
        if (signupData) {
            const parsed = JSON.parse(signupData);
            setData({
            name: parsed.name,
            email: parsed.email,
            referceno: parsed.reference_code
            });
        }
        }, []);

        
   
    return (
        <div className="h-[200px] flex flex-col gap-4">
                <div className="flex items-center text-center flex-col gap-4 text-base">
                   <p>Thanks for your interest. <br />
                    Our team will connect with you shortly </p>
                   <p>Your reference number is <span className='font-semibold'>{data?.referceno}</span></p>
                </div> 
                <div className='mt-3 flex justify-center'>
                   
                    <Button
                        type="submit"
                        className="bg-[#d63384] hover:bg-[#b02a5b] text-white w-[400px]  rounded-lg px-8 py-2 font-semibold focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0"
                        onClick={() => removeSessions()}
                    >
                       Done
                    </Button>
             
                </div>
        </div>
    )
}

export default RegisFaculty