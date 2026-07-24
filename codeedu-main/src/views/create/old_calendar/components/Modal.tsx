import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Form, FormItem } from '@/components/ui/Form';
import { RxCross1 } from 'react-icons/rx';
import { useMentorsStore } from '../store/MentorsStore';
import { useFacultyStore } from '../store/FacultyStore';
import { useBatchStore } from '../store/BatchStore';
import { useAuth } from '@/auth';
import { FACULTY, LEARNER } from '@/constants/roles.constant';
import { fetchUsers } from "../services/CalendarService";
import { Event } from '../@types/calendar';

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: {
    start_date: Date;
    end_date: Date;
    title: string;
    description?: string;
    link?: string;
    purpose?: string;
    is_mentoring: number;
    batch_id?: number
  };
  onSave: (data: Event) => void;
  onDelete?: () => void;
}



const validationSchema = z.object({
  title: z.string().nonempty('Please enter a title.'),
  purpose: z.string().nonempty('Please enter a purpose.'),
  description: z.string().optional(),
  start_date: z.date(),
  end_date: z.date(),
  userType: z.enum(['mentor', 'faculty', 'learner', 'batch']).optional(),
  invited_user_ids: z.array(z.number()).optional(),
  link: z.string().optional(),
  is_mentoring: z.number(),
  batch_id: z.number().optional()
});

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultValues,
}) => {
  const { mentors, fetchMentors } = useMentorsStore();
  const { batches, fetchBatches } = useBatchStore();
  const { faculty, fetchFaculty } = useFacultyStore();

  const { user } = useAuth();

  useEffect(() => {
    fetchMentors();
    fetchBatches();
    fetchFaculty();
  }, [fetchMentors, fetchBatches, fetchFaculty]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<Event>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      start_date: defaultValues?.start_date || new Date(),
      end_date: defaultValues?.end_date || new Date(),
      description: defaultValues?.description || '',
      purpose: defaultValues?.purpose || '',
      link: defaultValues?.link || '',
      userType: undefined,
      is_mentoring: defaultValues?.is_mentoring || 0,
      batch_id: defaultValues?.batch_id || undefined
    },
  });


  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);


  const onSubmit = async (data: Event) => {
    try {
      const formattedData: Event = {
        ...data,
      };
      if (formattedData.userType === 'mentor') {
        formattedData.is_mentoring = 1;
      }
      await onSave(formattedData);
    } catch (error) {
      console.error('Error saving event', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm px-2 sm:px-4">
      <div className="relative bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-2xl max-h-[95vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-primary text-xl"
          onClick={onClose}
        >
          <RxCross1 />
        </button>

        <Form className="gap-1" onSubmit={handleSubmit(onSubmit)}>
          <FormItem
            label="Event Title"
            className="mb-4"
            invalid={!!errors.title}
            errorMessage={errors.title?.message}
          >
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter event title" />
              )}
            />
          </FormItem>

          <FormItem
            label="Purpose"
            className="mb-4"
            invalid={!!errors.purpose}
            errorMessage={errors.purpose?.message}
          >
            <Controller
              name="purpose"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter purpose of the meeting" />
              )}
            />
          </FormItem>

          <FormItem
            label="Description"
            className="mb-3"

            invalid={!!errors.description}
            errorMessage={errors.description?.message}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input
                  textArea
                  {...field}
                  placeholder="Enter description (optional)"
                />
              )}
            />
          </FormItem>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <FormItem
              className="mb-1"
              label="Start Date & Time"
              invalid={!!errors.start_date}
              errorMessage={errors.start_date?.message}
            >
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => {
                  const now = new Date();
                  const value =
                    field.value instanceof Date && !isNaN(field.value.getTime())
                      ? field.value
                      : now;

                  const toLocalDateTimeString = (date: Date) => {
                    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                      .toISOString()
                      .slice(0, 16); // 'YYYY-MM-DDTHH:mm'
                  };

                  return (
                    <Input
                      type="datetime-local"
                      {...field}
                      value={toLocalDateTimeString(value)}
                      min={toLocalDateTimeString(now)}
                      onChange={(e) => {
                        const localDate = new Date(e.target.value);
                        field.onChange(localDate);
                      }}
                    />
                  );
                }}
              />

            </FormItem>

            <FormItem
              label="End Date & Time"
              className="mb-1"
              invalid={!!errors.end_date}
              errorMessage={errors.end_date?.message}
            >
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => {
                  const startDate = watch('start_date');
                  const now = new Date();
                  const value =
                    field.value instanceof Date && !isNaN(field.value.getTime())
                      ? field.value
                      : startDate instanceof Date && !isNaN(startDate.getTime())
                        ? new Date(startDate.getTime() + 60 * 60 * 1000)
                        : new Date(now.getTime() + 60 * 60 * 1000);

                  const toLocalDateTimeString = (date: Date) => {
                    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                      .toISOString()
                      .slice(0, 16);
                  };

                  const minEnd = startDate
                    ? toLocalDateTimeString(new Date(new Date(startDate).getTime() + 60 * 60 * 1000))
                    : toLocalDateTimeString(new Date(now.getTime() + 60 * 60 * 1000));

                  return (
                    <Input
                      type="datetime-local"
                      {...field}
                      value={toLocalDateTimeString(value)}
                      min={minEnd}
                      onChange={(e) => {
                        const localDate = new Date(e.target.value);
                        field.onChange(localDate);
                      }}
                    />
                  );
                }}
              />

            </FormItem>
          </div>





          {(Array.isArray(user?.authority) ? user?.authority.includes(FACULTY) : user?.authority === FACULTY) && (

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

              <FormItem
                label="Meeting With (Optional)"
                className=''
                invalid={!!errors.userType}
                errorMessage={errors.userType?.message}
              >
                <Controller
                  name="userType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Meeting With" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="batch">Batch</SelectItem>
                        <SelectItem value="learner">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormItem>

              {watch('userType') === 'batch' && (
                <FormItem
                  label="Batch"
                  invalid={!!errors.batch_id}
                  errorMessage={errors.batch_id?.message}
                >
                  <Controller
                    name="batch_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Batch" />
                        </SelectTrigger>
                        <SelectContent>
                          {batches?.map((batch) => (
                            <SelectItem key={batch.id} value={batch.id.toString()}>
                              {batch.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormItem>
              )}


              {watch('userType') === 'learner' && (
                <FormItem
                  label="Learner"
                  invalid={!!errors.invited_user_ids}
                  errorMessage={errors.invited_user_ids?.message}
                >
                  <Controller
                    name="invited_user_ids"
                    control={control}
                    render={({ field }) => {
                      const [search, setSearch] = useState('');
                      const [debouncedSearch, setDebouncedSearch] = useState('');
                      const [options, setOptions] = useState<{ id: number; name: string }[]>([]);
                      const [loading, setLoading] = useState(false);

                      useEffect(() => {
                        const handler = setTimeout(() => {
                          setDebouncedSearch(search);
                        }, 300);
                        return () => clearTimeout(handler);
                      }, [search]);

                      useEffect(() => {
                        let active = true;
                        if (debouncedSearch.length < 2) {
                          setOptions([]);
                          return;
                        }
                        setLoading(true);
                        fetchUsers(debouncedSearch)
                          .then((users) => {
                            if (active) setOptions(users || []);
                          })
                          .finally(() => {
                            if (active) setLoading(false);
                          });
                        return () => {
                          active = false;
                        };
                      }, [debouncedSearch]);

                      return (
                        <Select
                          value={field?.value?.[0]?.toString()}
                          onValueChange={(val) => field.onChange([Number(val)])}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Learner" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="px-2 py-1">
                              <Input
                                autoFocus
                                value={search}
                                placeholder="Search learner by name"
                                className="mb-2 p-2 mt-2 border border-gray-300 rounded-md"
                                onChange={(e) => setSearch(e.target.value)}
                              />
                            </div>
                            {options.length === 0 &&
                              debouncedSearch.length >= 2 &&
                              !loading && (
                                <div className="px-3 py-2 text-gray-500">No learners found</div>
                              )}
                            {options.map((learner) => (
                              <SelectItem key={learner.id} value={learner.id.toString()}>
                                {learner.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                </FormItem>
              )}

            </div>

          )}

          {(Array.isArray(user?.authority) ? user?.authority.includes(LEARNER) : user?.authority === LEARNER) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

              <FormItem
                label="Meeting With"
                invalid={!!errors.userType}
                errorMessage={errors.userType?.message}
              >
                <Controller
                  name="userType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Meeting With" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="mentor">Mentor</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormItem>

              {
                watch('userType') === 'faculty' && (
                  <FormItem
                    label="Faculty"
                    invalid={!!errors.invited_user_ids}
                    errorMessage={errors.invited_user_ids?.message}
                  >
                    <Controller
                      name="invited_user_ids"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field?.value?.[0]?.toString()}
                          onValueChange={(val) => field.onChange([Number(val)])}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Faculty" />
                          </SelectTrigger>
                          <SelectContent>
                            {faculty?.map((faculty) => (
                              <SelectItem key={faculty.id} value={faculty.id.toString()}>
                                {faculty.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormItem>
                )
              }


              {
                watch('userType') === 'mentor' && (
                  <FormItem
                    label="Mentor"
                    invalid={!!errors.invited_user_ids}
                    errorMessage={errors.invited_user_ids?.message}
                  >
                    <Controller
                      name="invited_user_ids"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field?.value?.[0]?.toString()}
                          onValueChange={(val) => field.onChange([Number(val)])}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Mentor" />
                          </SelectTrigger>
                          <SelectContent>
                            {mentors?.map((mentor) => (
                              <SelectItem key={mentor.id} value={mentor.id.toString()}>
                                {mentor.name} {mentor.portfolio_profile.lastName} - {mentor.organization_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormItem>
                )
              }

            </div>
          )}


          <FormItem
            label="Meeting Link (Optional)"
            className="mb-4"
            invalid={!!errors.link}
            errorMessage={errors.link?.message}
          >
            <Controller
              name="link"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="https://meet.example.com/..."
                />
              )}
            />
          </FormItem>

          <div className="flex justify-end gap-2">
            <Button
              variant="solid"
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Modal;


