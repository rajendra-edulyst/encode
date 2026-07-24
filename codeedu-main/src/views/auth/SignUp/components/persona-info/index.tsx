import PersonalInfoForm from './creator-personal-info-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import OrgPersonalInfoForm from './org-personal-info-form';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import boy from '@/assets/images/boy5.png';

const PersonalInfo = () => {
  const navigate = useNavigate();

  const profileType = sessionStorage.getItem('profileType');
  const isValidProfileType = profileType === 'creator' || profileType === 'organization';

  useEffect(() => {
    sessionStorage.setItem('profileType', "creator");
    if (!isValidProfileType) {
      navigate('/sign-up/start', { replace: true });
    }
  }, [isValidProfileType, navigate]);

  if (!isValidProfileType) {
    return null;
  }

  return (
    <div className="flex w-[calc(100%-32px)] md:w-full flex-col max-w-[1125px] mx-auto h-[calc(100vh-100px)] md:h-auto md:max-h-[85vh] overflow-y-auto no-scrollbar">
      {/* Mobile Header Section - Outside the card */}
      <div className="mb-4 flex md:hidden flex-row items-start justify-between shrink-0">
        <h1 className="text-[28px] font-bold leading-tight text-white text-left w-[60%]">
          Set the <br /> Foundation of <br /> Your{" "}
          <span className={`font-creative text-[#00A8E9] ${profileType === 'creator' ? 'font-[400]' : ''}`}>
            Craft
          </span>
        </h1>
        <div className="w-[140px] -mt-2 -mr-6 relative z-10 shrink-0">
          <img src={boy} alt="boy" className="w-full object-contain scale-x-[-1]" />
        </div>
      </div>

      {/* Card Container */}
      <div className='bg-[#1D1D1D] py-4 px-4 sm:px-6 md:py-6 md:px-8 rounded-3xl shadow-md w-full my-0 md:my-4 flex flex-col gap-4 md:gap-6 shrink-0 mb-4'>
        {/* Desktop Header - Inside the card */}
        <div className="hidden md:flex items-center justify-center shrink-0 text-center">
          {profileType === 'creator' && <h1 className="text-[40px] font-bold text-white leading-tight">Set the Foundation of Your <span className='font-creative text-[#00A8E9] font-[400]'>Craft</span></h1>}
          {profileType === 'organization' && <h1 className="text-[40px] font-bold text-white leading-tight">Set the Foundation of Your <span className='font-creative text-[#00A8E9]'>Craft</span></h1>}
        </div>

        <div className='flex flex-col gap-6 hidden'>
          {profileType === 'creator' && <div>
            <p className="text-white text-lg font-bold mt-4">Personal Information</p>
            <p className="text-white text-sm">Tell us about yourself</p>
          </div>
          }
        </div>

        <div className='flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6'>
          <div className='hidden md:flex w-full md:w-[30%] justify-center shrink-0'>
            <img src={boy} alt='boy with tablet' className="max-w-full h-auto" />
          </div>
          <div className='w-full md:w-[70%]'>
            {profileType === 'creator' && <PersonalInfoForm />}
            {profileType === 'organization' && <OrgPersonalInfoForm />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalInfo