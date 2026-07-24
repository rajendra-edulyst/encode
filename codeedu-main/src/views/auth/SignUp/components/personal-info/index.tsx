import PersonalInfoForm from './creator-personal-info-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import OrgPersonalInfoForm from './org-personal-info-form';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const PersonalInfo = () => {
  const navigate = useNavigate();

  const profileType = sessionStorage.getItem('profileType');
  const isValidProfileType = profileType === 'creator' || profileType === 'organization';

  useEffect(() => {
    if (!isValidProfileType) {
      navigate('/sign-up/start', { replace: true });
    }
  }, [isValidProfileType, navigate]);

  if (!isValidProfileType) {
    return null;
  }

  return (
    <div className='bg-[#1D1D1D] p-8 rounded-3xl shadow-md w-full md:max-w-7xl overflow-auto max-h-[80vh]'>
      <div className="flex items-center justify-between mb-2">
        {profileType === 'creator' && <h1 className="text-3xl font-bold text-cblue">Start Your Design Journey</h1>}
        {profileType === 'organization' && <h1 className="text-3xl font-bold text-white text-">Set the Foundation of Your <span className='font-creative text-codeblue'>Craft</span>.</h1>}
      </div>
      <ScrollArea className='min-h-[550px]'>
        <div className='flex flex-col gap-6'>
          {profileType === 'creator' && <div>
            <p className="text-white text-lg font-bold mt-4">Personal Information</p>
            <p className="text-white text-sm">Tell us about yourself</p>
          </div>
          }
        </div>
        <div>
          {profileType === 'creator' && <PersonalInfoForm />}
          {profileType === 'organization' && <OrgPersonalInfoForm />}
        </div>
      </ScrollArea>
    </div>
  )
}

export default PersonalInfo