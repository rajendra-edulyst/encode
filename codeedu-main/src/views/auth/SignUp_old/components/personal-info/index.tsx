import { useThemeStore } from '@/store/themeStore';
import StudentProfile from './student';
import FacultyProfile from './faculty';
import { ScrollArea } from '@/components/ui/scroll-area';
import Institute from './institute';
import CreativeMinds from './creative';
import Industry from './industry';
import { Button } from '@/components/ui/ShadcnButton';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PersonalInfo = () => {


  const signupProfile = useThemeStore((state) => state.loginProfile);
  const navigate = useNavigate();

  const removeSessions = () => {
    sessionStorage.removeItem('accountEmail');
    sessionStorage.removeItem('verified-email');
    sessionStorage.removeItem('otp-countdown-time');
    navigate('/sign-up');
  };
  

  return (
    <div className="px-4 rounded-lg  bg-white">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-cblue">Sign up as <span className='capitalize'>{signupProfile}</span></h1>
        <Button variant={'ghost'} size={'icon'} onClick={() => removeSessions()}><X /></Button>
      </div>
      <ScrollArea className='h-[450px]'>
        <div className='flex flex-col gap-6'>

          <div>
            <p className="text-[#263A43] text-lg font-bold mt-4">Personal Infromation</p>
            <p className="text-[#263A43] text-sm">Tell us about yourself</p>
          </div>
        </div>
        <div>
          {signupProfile === 'student' && <StudentProfile />}
          {signupProfile === 'faculty' && <FacultyProfile />}
          {signupProfile === 'institute' && <Institute />}
          {signupProfile === 'creative-mind' && <CreativeMinds />}
          {signupProfile === 'industry' && <Industry />}
        </div>
      </ScrollArea>
    </div>
  )
}

export default PersonalInfo