import React, { useState } from 'react';
import EventDetails from './EventDetails';
import GroupSelection from './GroupSelection';
import Breadcrumb from '@/components/breadcrumb';
import { useNavigate } from 'react-router-dom';

export interface User {
  name: string;
  email: string;
}
export interface FormData {
  eventName: string;
  eventDescription: string;
  category: string;
  eventImage: File | null;
  eventImagePreview: string;
  startDateTime: string;
  endDateTime: string;
  duration: string;
  organization: string;
  domain: string;
  eventType: string;
  whatsInItForYou: string;
  instructions: string;
  faq: string;
  groupName: string;
  groupCSV?: File | null;
  groupMembers: User[];
}



const  MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const navigate = useNavigate();

   const breadcrumbItems = [
    { label: 'Events', path: '/manage-events' },
    { label: 'New Event' },
  ];

 const [formData, setFormData] = useState<FormData>({
  eventName: '',
  eventDescription: '',
  category: '',
  eventImage: null,
  eventImagePreview: '',
  startDateTime: '',
  endDateTime: '',
  duration: '',
  organization: '',
  domain: '',
  eventType: '',
  whatsInItForYou: '',
  instructions: '',
  faq: '',
  groupName: '',
  groupCSV: null,
  groupMembers: [],
});


  const handleNext = () => {
    if (formData.eventType !== 'for group') {
      navigate('/manage-events/5618/activity');
    }
    else if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    }
  }
  const handleBack = () => setCurrentStep((prev) => prev - 1);


  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  let files: FileList | null = null;
  if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
    files = e.target.files;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: files ? files[0] : value,
  }));

  // Handle preview if image uploaded
  if (name === 'eventImage' && files?.[0]) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        eventImagePreview: reader.result as string,
      }));
    };
    reader.readAsDataURL(files[0]);
  }

  // Clear preview when image is removed
  if (name === 'eventImage' && !files) {
    setFormData((prev) => ({
      ...prev,
      eventImage: null,
      eventImagePreview: '',
    }));
  }
};



  // Render steps based on currentStep
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
       
       <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">Create New Event</h1>
            <p className="text-xs sm:text-sm text-gray-500">Schedule a new Event</p>
        </div>

      
      <div>

      {currentStep === 1 && (
        <EventDetails formData={formData} handleChange={handleChange} handleNext={handleNext} />
      )}
      {currentStep === 2 && formData.eventType === 'for group' && (
        <GroupSelection formData={formData} handleChange={handleChange} handleNext={handleNext} handleBack={handleBack} />
      )}
      </div>

    </div>
  );
};


export default MultiStepForm