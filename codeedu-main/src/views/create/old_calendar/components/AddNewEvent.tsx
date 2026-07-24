/* eslint-disable prefer-const */
/* eslint-disable react-hooks/exhaustive-deps */
import Button from '@/components/ui/Button';
import { Form, FormItem } from '@/components/ui/Form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMentorListV2 } from '@/hooks/data/faculty/useMentor';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar as CalendarIcon, Paperclip, Sparkles } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from "sonner";
import { z } from 'zod';
import { Event } from '../@types/calendar';
import { createEvent, getUserAvailability } from '../services/CalendarService';
import { useBatchStore } from '../store/BatchStore';
import { useEventStore } from '../store/CalendarStore';
import { useFacultyStore } from '../store/FacultyStore';
import { useAuth } from '@/auth';


// Modified schema to handle file separately or loosely
const validationSchema = z.object({
  title: z.string().nonempty('Please select a purpose.'),
  description: z.string().nonempty('Please provide a brief description.'),
  start_date: z.date(),
  end_date: z.date(),
  userType: z.enum(['mentor', 'faculty', 'learner', 'batch']).optional(),
  invited_user_ids: z.array(z.number()).optional(),
  link: z.string().optional(),
  is_mentoring: z.number(),
  batch_id: z.number().optional(),
  selectedSlot: z.string().optional(),
});

const AddNewEventPage: React.FC = () => {
  const { data: mentors } = useMentorListV2();
  const { batches, fetchBatches } = useBatchStore();
  const { faculty, fetchFaculty } = useFacultyStore();
  const { events, setEvents } = useEventStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [availabilitySlots, setAvailabilitySlots] = useState<
    {
      slotKey: string;
      start_time: string;
      end_time: string;
      available_date: string;
      day_of_week: string;
      formattedStart: string;
      formattedEnd: string;
    }[]
  >([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<Event & { selectedSlot?: string }>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      title: 'Portfolio Guidance', // Default value
      start_date: new Date(),
      end_date: new Date(),
      description: '',
      purpose: '',
      link: '',
      is_mentoring: 1, // Default to mentoring
      selectedSlot: '',
      userType: 'mentor', // Default to mentor
    },
  });

  useEffect(() => {
    fetchBatches();
    fetchFaculty();
  }, [fetchBatches, fetchFaculty]);

  // Handle URL params - prioritize defaulting to mentor
  useEffect(() => {
    const userTypeParam = searchParams.get('userType');
    const id = searchParams.get('id');

    // Force userType to mentor if not specified or different (based on user request)
    // Actually, user said "Meeting With value will be default to mentor". 
    // We'll stick to that, but if userType is passed in URL we might want to respect it OR override it.
    // The request implies this page IS for booking session with mentor.
    setValue('userType', 'mentor');

    if (id) {
      const numId = Number(id);
      if (!isNaN(numId)) {
        // Since we default to mentor, we assume the ID passed is a mentor ID
        setValue('invited_user_ids', [numId]);
      }
    }
  }, [searchParams, mentors, setValue]);


  useEffect(() => {
    const userType = watch('userType');
    const invitedUserIds = watch('invited_user_ids');

    if ((userType === 'mentor' || userType === 'faculty') && invitedUserIds?.[0]) {
      setLoadingSlots(true);
      getUserAvailability(invitedUserIds[0])
        .then((res) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (!res || !Array.isArray(res)) {
            setAvailabilitySlots([]);
            return;
          }

          // Format availability slots properly
          const formatted = res.map((slot, idx) => {
            // Create a unique key for each slot
            const slotKey = `${slot.available_date}_${slot.start_time}_${slot.end_time}_${idx}`;

            // Format times for display
            const formattedStart = slot.start_time;
            const formattedEnd = slot.end_time;

            return {
              slotKey,
              start_time: slot.start_time,
              end_time: slot.end_time,
              available_date: slot.available_date,
              day_of_week: slot.day_of_week || getDayOfWeek(slot.available_date),
              formattedStart,
              formattedEnd,
            };
          });

          setAvailabilitySlots(formatted);
        })
        .catch((error) => {
          console.error('Failed to load availability slots:', error);
          toast.error('Failed to load availability slots.');
          setAvailabilitySlots([]);
        })
        .finally(() => setLoadingSlots(false));

    } else {
      setAvailabilitySlots([]);
    }
  }, [watch('userType'), watch('invited_user_ids')]);

  // Helper function to get day of week from date string
  const getDayOfWeek = (dateString: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const handleSlotSelect = (slotKey: string) => {
    const selectedSlot = availabilitySlots.find(slot => slot.slotKey === slotKey);

    if (selectedSlot) {
      // Parse the time strings
      const parseTime = (timeStr: string) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }

        return { hours, minutes };
      };

      const startTime = parseTime(selectedSlot.start_time);
      const endTime = parseTime(selectedSlot.end_time);

      // Create date objects with the selected date and times
      const startDate = new Date(selectedSlot.available_date);
      startDate.setHours(startTime.hours, startTime.minutes, 0, 0);

      const endDate = new Date(selectedSlot.available_date);
      endDate.setHours(endTime.hours, endTime.minutes, 0, 0);

      // Update form values
      setValue('start_date', startDate);
      setValue('end_date', endDate);
    }
  };

  const onSubmit = async (data: Event & { selectedSlot?: string }) => {
    try {
      const formData = new FormData();

      // Add standard fields
      formData.append('title', data.title);
      formData.append('description', data.description || ''); // Send empty if undefined
      formData.append('is_mentoring', '1');

      // Format dates
      const formatDateTime = (date: Date) =>
        new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);

      formData.append('start_date', formatDateTime(data.start_date));
      formData.append('end_date', formatDateTime(data.end_date));

      // Add link if exists
      if (data.link) {
        formData.append('link', data.link);
      }

      // Add invited user IDs
      if (data.invited_user_ids && data.invited_user_ids.length > 0) {
        // Backend handles array or string, for safety we append individual items or stringify
        // Assuming backend handles typical form-data array conventions or JSON string
        // Based on other patterns, JSON string might be safer if backend expects JSON body usually
        // But for FormData, usually invited_user_ids[] is the key.
        // Let's try appending each ID.
        data.invited_user_ids.forEach(id => {
          formData.append('invited_user_ids[]', id.toString());
        });

        // Also simpler: assuming single mentor for this flow
        formData.append('userType', 'mentor');
      }

      // Add file if selected
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const addedEvent = await createEvent(formData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (addedEvent) {
        toast.success('Event booked successfully');
        // Optimistically update local state (though with FormData this logic is a bit loose)
        setEvents([
          ...events,
          data
        ]);
        navigate('/calendar');
      }

    } catch (error) {
      console.error('Error saving event', error);
      toast.error('Error saving event');
    }
  };

  // Ensure invited_user_ids is synced with URL param once mentors are loaded
  useEffect(() => {
    const id = searchParams.get('id');
    if (id && mentors && mentors.length > 0) {
      const numId = Number(id);
      if (!isNaN(numId)) {
        setValue('invited_user_ids', [numId]);
      }
    }
  }, [mentors, searchParams, setValue]);


  const selectedSlotKey = watch('selectedSlot');
  const selectedSlotDetails = availabilitySlots.find(s => s.slotKey === selectedSlotKey);

  // Check if all required fields are filled
  const isFormValid = watch('title') && watch('description') && watch('selectedSlot') && watch('invited_user_ids')?.[0];


  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 md:p-10 font-jacques">
      <div className="mx-auto relative">

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-yellow-400 w-5 h-5" />
            <h1 className="text-xl font-bold font-jacques">Hello {user?.name}!</h1>
          </div>
          <h2 className="text-lg font-bold text-gray-200 mb-6 font-jacques">
            Great to see you booking a session with your mentor!
          </h2>

          {/* <div className="space-y-1 mb-6 text-sm text-gray-400">
            <div className="flex items-start gap-2">
            
              💬
              <p>You can use this time to:</p>
            </div>
            <div className="pl-3 space-y-1">
              <p>• Discuss courses</p>
              <p>• Get project feedback</p>
              <p>• Clarify doubts</p>
              <p>• Build your creative direction</p>
            </div>
          </div> */}

          <div className="text-xs text-gray-500 space-y-1">
            <p>Please Note:</p>
            <p>Keep sessions professional – no personal chats, sharing contacts, or job/internship requests.</p>
          </div>
        </div>

        {/* Action Button (Absolute positioned on desktop, relative on mobile) */}
        <div className="md:absolute md:top-0 md:right-0 mb-6 md:mb-0">
          <Button
            variant="default"
            className={`font-bold h-auto py-3 px-6 rounded-xl flex flex-col items-center gap-1 leading-tight transition-all ${isFormValid
              ? "!bg-primary hover:bg-primary/80 text-gray-900 shadow-[0_0_15px_rgba(0,178,255,0.3)]"
              : "!bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
              }`}
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            disabled={!isFormValid || isSubmitting}
          >
            <CalendarIcon className="w-5 h-5 mb-1 text-gray-900" />
            <span className="text-sm  text-gray-900">Book &</span>
            <span className="text-sm  text-gray-900">Connect</span>
          </Button>
        </div>

        <Form className="gap-6" onSubmit={handleSubmit(onSubmit)}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Purpose of Connect */}
            <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-800">
              <FormItem
                label={<span className="text-white font-medium text-sm mb-2 block">Purpose of Connect<span className='text-red-500'>*</span></span>}
                className="mb-0"
                invalid={!!errors.title}
                errorMessage={errors.title?.message}
              >
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <select
                        {...field}
                        className="w-full p-3 pr-10 rounded-lg bg-[#2A2A2A] text-gray-200 border-none focus:ring-0 appearance-none outline-none text-sm"
                      >
                        <option value="Portfolio Guidance">Portfolio Guidance</option>
                        <option value="Academic Discussion">Academic Discussion</option>
                        <option value="Creative Growth Tips">Creative Growth Tips</option>
                        <option value="Career Direction">Career Direction</option>
                        <option value="Collaborative Project">Collaborative Project</option>
                        <option value="Any Other">Any Other</option>
                      </select>
                      {/* Custom arrow */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  )}
                />
              </FormItem>
            </div>

            {/* Mentor */}
            <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-800">
              <label className="text-white font-medium text-sm mb-2 block">Mentor</label>
              <Controller
                name="invited_user_ids"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.[0]?.toString() || ""}
                    onValueChange={(val) => field.onChange([Number(val)])}
                  >
                    <SelectTrigger className="w-full bg-[#555555] border-none text-white rounded-lg h-10" disabled={!!searchParams.get('id')}>
                      <SelectValue placeholder="Select Mentor" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-gray-700 text-white max-h-60 z-[100]">
                      {mentors?.map((mentor) => (
                        <SelectItem key={mentor.id} value={mentor.id.toString()}>
                          {mentor.name} - {mentor.organization_name || 'CODE'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Attach File Section */}
          <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-800 mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

            <div className="flex-1">
              <label className="text-white font-medium text-sm mb-1 block">
                Attach File <span className="text-gray-400 font-normal">(reviewed by Mentor)</span>
              </label>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Validate file size (10MB)
                    const maxSize = 10 * 1024 * 1024; // 10MB
                    if (file.size > maxSize) {
                      toast.error("File size exceeds 10MB limit.");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                      setSelectedFile(null);
                      return;
                    }

                    // Validate file type
                    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
                    if (!allowedTypes.includes(file.type)) {
                      toast.error("Invalid file type. Please upload PDF, JPG, JPEG, or PNG.");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                      setSelectedFile(null);
                      return;
                    }

                    setSelectedFile(file);
                  }
                }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border border-[#00B2FF] text-[#00B2FF] rounded-lg hover:bg-[#00B2FF]/10 transition-colors bg-transparent border-dashed"
              >
                <Paperclip className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {selectedFile ? 'Change File' : 'Attach File Here'}
                </span>
              </button>

              <div className="text-xs text-gray-400">
                {selectedFile ? (
                  <span className="text-white">{selectedFile.name}</span>
                ) : (
                  <>
                    File Type<br />
                    (PDF, JPG, PNG, MP4)
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Add Brief Field */}
          <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-800 mt-6">
            <FormItem
              label={<span className="text-white font-medium text-sm mb-2 block">Add Brief<span className='text-red-500'>*</span></span>}
              className="mb-0"
              invalid={!!errors.description}
              errorMessage={errors.description?.message}
            >
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Write description for Connect"
                    className="w-full p-4 rounded-lg bg-[#2A2A2A] text-gray-200 border-none focus:ring-0 outline-none text-sm min-h-[100px] resize-none"
                  />
                )}
              />
            </FormItem>
          </div>

          {/* Slot Selection & Available Slots Section */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-gray-800 mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">

            {/* Slot Selected Card */}
            <div>
              <label className="text-white font-medium text-sm mb-3 block">Slot Selected</label>
              {selectedSlotDetails ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 border border-[#00B2FF] text-white rounded-lg bg-[#1A1A1A]">
                    <CalendarIcon className="w-4 h-4 text-[#00B2FF]" />
                    <span className="text-sm">
                      {`${selectedSlotDetails.available_date} ${selectedSlotDetails.formattedStart} - ${selectedSlotDetails.formattedEnd}`}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm font-light">1 Seat available</span>
                </div>
              ) : (
                <div className="text-gray-500 text-sm italic">No slot selected</div>
              )}
            </div>

            {/* Available Slots Dropdown */}
            <div>
              <label className="text-white font-medium text-sm mb-3 block">Available Slots</label>

              <FormItem
                invalid={!!errors.selectedSlot}
                errorMessage={errors.selectedSlot?.message}
                className="mb-0"
              >
                <Controller
                  name="selectedSlot"
                  control={control}
                  render={({ field }) => (
                    <>
                      {loadingSlots ? (
                        <div className="animate-pulse h-10 bg-[#2A2A2A] rounded-lg w-full" />
                      ) : availabilitySlots.length > 0 ? (
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            handleSlotSelect(val);
                          }}
                        >
                          <SelectTrigger className="w-full bg-[#555555] border-none text-white rounded-lg h-10">
                            <SelectValue placeholder="Select Available time Slot" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2A2A2A] border-gray-700 text-white max-h-60">
                            {availabilitySlots.map((slot) => (
                              <SelectItem key={slot.slotKey} value={slot.slotKey} className="focus:bg-[#3A3A3A] focus:text-white cursor-pointer">
                                {`${slot.available_date} — ${slot.formattedStart} to ${slot.formattedEnd}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-sm text-gray-500 bg-[#2A2A2A] p-2 rounded-lg">
                          No slots available
                        </div>
                      )}
                    </>
                  )}
                />
              </FormItem>
            </div>

          </div>

        </Form>
      </div>
    </div>
  );
};

export default AddNewEventPage;
