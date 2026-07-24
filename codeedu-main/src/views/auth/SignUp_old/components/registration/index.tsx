import { useThemeStore } from "@/store/themeStore";
import Registration from "./regdetails";
import RegisFaculty from "./regdetail";

const RegistrationDetails = () => {
    
  const signupProfile = useThemeStore((state)=>state.loginProfile);

    return (
        <div className="h-[200px] flex flex-col m-4 gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-1 text-cgreen flex justify-center">Registration Complete!</h1>
                </div>
                
            {signupProfile === 'student'  && <Registration />}
            {signupProfile === 'creative-mind' && <Registration />}
             {signupProfile === 'faculty'  && <RegisFaculty />}
             {signupProfile === 'institute' && <RegisFaculty />}
            {signupProfile === 'industry' && <RegisFaculty />}

    
             
        </div>
    )
}

export default RegistrationDetails