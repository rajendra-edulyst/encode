import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/ShadcnButton'
import { Form, FormItem } from '@/components/ui/Form'
import Breadcrumb from '@/components/breadcrumb'
import { toast } from 'sonner'
import { ArrowRight, BadgeCheck, Check, ChevronDown, Play } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { useFunctionalDomains } from '@/hooks/data/useGettingStarted'
import { ApplyForMentorship, getMentorshipStatus } from '@/services/mentorship/mentorship'
import { useSessionUser } from '@/store/authStore'
import { usePortfolioDetailsStore } from '@/store/portfolio/PortfolioStore'
import type {
  ApplyForMentorshipPayload,
  MentorRequest,
} from '@/services/mentorship/mentorship'
import { Link } from 'react-router-dom'

import TermsAndConditionsModal from './components/TermsAndConditionsModal'
import RolesAndResponsibilitiesModal from './components/RolesAndResponsibilitiesModal'
import { getprofile, type Profile } from '../../common/profile-view/services/profileService'

type FunctionalDomain = { id: number; name: string }

const formSchema = z.object({
  expertise: z.array(z.number()).min(1, 'Select at least one domain').max(3, 'You can select max 3 domains'),
  mentoringGoal: z.array(z.string()).min(1, 'Select at least one mentoring goal'),
  t_and_c: z.boolean().refine((v) => v === true, { message: 'You must accept the Terms and Conditions' }),
  r_and_r: z.boolean().refine((v) => v === true, { message: 'You must accept the Roles and Responsibilities' }),
  my_profile: z.boolean().refine((v) => v === true, { message: 'You must confirm profile completion' }),
  role: z.array(z.string()).min(1, 'Select at least one additional role'),
})

type ApplyForMentorFormValues = z.infer<typeof formSchema>

export default function ApplyForMentor() {
  const { data: functionalDomains = [] } = useFunctionalDomains() as {
    data: FunctionalDomain[]
  }

  const [mentorStatus, setMentorStatus] = useState<MentorRequest | null>(null)
  const [profileData, setProfileData] = useState<Profile | null>(null)
  const isPending = mentorStatus?.status === 'pending'
  const isApproved = mentorStatus?.status === 'approved'

  // We add user session to check overall profile completeness
  const { user } = useSessionUser()
  const { portfolio, fetchPortfolioDetails } = usePortfolioDetailsStore()

  useEffect(() => {
    if (user?.id) {
      fetchPortfolioDetails(user.id.toString())
    }

    const loadProfile = async () => {
      const data = await getprofile()
      if (data?.portfolio) {
        setProfileData(data.portfolio)
      }
    }
    loadProfile()
  }, [user?.id, fetchPortfolioDetails])

  const [isLoading, setIsLoading] = useState(true)

  // Modal visibility
  const [showTandCModal, setShowTandCModal] = useState(false)
  const [showRAndRModal, setShowRAndRModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<ApplyForMentorFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        expertise: [],
        mentoringGoal: [],
        t_and_c: false,
        r_and_r: false,
        my_profile: false,
        role: [],
      },
    })

  const tandcValue = watch('t_and_c')
  const rAndRValue = watch('r_and_r')

  // PERSISTENCE: Save form data to localStorage on change
  const formValues = watch()
  useEffect(() => {
    if (!isLoading && !isPending && !isApproved) {
      localStorage.setItem('mentor_application_draft', JSON.stringify(formValues))
    }
  }, [formValues, isLoading, isPending, isApproved])

  useEffect(() => {
    const fetchMentorStatus = async () => {
      try {
        const res = await getMentorshipStatus()
        if (res.status === 200 && res.data) {
          setMentorStatus(res.data)
          const agreed_tandc = res.data.t_and_c === 1
          const agreed_randr = res.data.r_and_r === 1

          reset({
            expertise: res.data.domain_map || [],
            mentoringGoal: res.data.goal_of_mentoring ? res.data.goal_of_mentoring.split(', ') : [],
            t_and_c: agreed_tandc,
            r_and_r: agreed_randr,
            my_profile: res.data.my_profile === 1,
            role: res.data.role ? res.data.role.split(', ') : [],
          })
        } else {
          // No active application, try to load from localStorage
          const savedDraft = localStorage.getItem('mentor_application_draft')
          if (savedDraft) {
            try {
              const parsed = JSON.parse(savedDraft)
              reset(parsed)
            } catch (e) {
              console.error('Failed to parse draft', e)
            }
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMentorStatus()
  }, [reset])

  const onSubmit = async (values: ApplyForMentorFormValues) => {
    if (mentorStatus?.status === 'pending') return

    try {
      const payload: ApplyForMentorshipPayload = {
        domain_map: values.expertise,
        goal_of_mentoring: values.mentoringGoal.join(', '),
        t_and_c: values.t_and_c ? 1 : 0,
        r_and_r: values.r_and_r ? 1 : 0,
        my_profile: values.my_profile ? 1 : 0,
        role: values.role && values.role.length > 0 ? values.role.join(', ') : undefined,
      }

      const response = await ApplyForMentorship(payload)
      if (response.status === 200) {
        toast.success('Application submitted!')
        setMentorStatus(response.data)
      } else {
        toast.error(response.message || 'Failed to submit')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  // Handle T&C checkbox click
  const handleTandCCheckbox = () => {
    if (isPending || isApproved) return
    if (!tandcValue) {
      // User trying to check — open modal first
      setShowTandCModal(true)
      // don't set value yet; will set after they click agree in modal
    } else {
      // Uncheck
      setValue('t_and_c', false)
    }
  }

  // Handle R&R checkbox click
  const handleRAndRCheckbox = () => {
    if (isPending || isApproved) return
    if (!rAndRValue) {
      setShowRAndRModal(true)
    } else {
      setValue('r_and_r', false)
    }
  }

  const MultiSelect = <T extends string | number>({
    value,
    onChange,
    options,
    disabled,
    placeholder = "Select options",
    maxCount,
    maxToast = "You have reached the limit"
  }: {
    value: T[]
    onChange: (val: T[]) => void
    options: { id: T; name: string }[]
    disabled?: boolean
    placeholder?: string
    maxCount?: number
    maxToast?: string
  }) => {
    const [open, setOpen] = useState(false)

    const toggleValue = (id: T) => {
      if (disabled) return
      if (value.includes(id)) {
        onChange(value.filter((v) => v !== id))
      } else {
        if (maxCount && value.length >= maxCount) {
          toast.error(maxToast)
          return
        }
        onChange([...value, id])
      }
    }

    const toggleAll = () => {
      if (disabled) return
      if (maxCount && options.length > maxCount) {
        toast.error(`You can only select up to ${maxCount} items`)
        return
      }

      if (value.length === options.length) {
        onChange([])
      } else {
        onChange(options.map((opt) => opt.id))
      }
    }

    const selectedNames = options
      .filter((item) => value.includes(item.id))
      .map((item) => item.name)
      .join(', ')

    return (
      <Popover open={open} onOpenChange={(state) => !disabled && setOpen(state)}>
        <PopoverTrigger asChild>
          <div className={`flex justify-between mt-2 items-center bg-[#404040] border-none min-h-12 px-4 rounded-xl ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            {value.length > 0 ? (
              <>
                <span className="text-sm font-medium text-white line-clamp-1 truncate mr-2">{selectedNames}</span>
                <span className="text-gray-400 flex-shrink-0"><ChevronDown size={18} /></span>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-400">{placeholder}</span>
                <span className="text-gray-400 flex-shrink-0"><ChevronDown size={18} /></span>
              </>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-[#1D1D1D] border-white/10 rounded-xl overflow-hidden shadow-2xl" align="start">
          <Command className="bg-[#1D1D1D] text-white">
            <CommandInput placeholder="Search options..." className="h-11 border-b border-white/10 text-white [&_svg]:opacity-50" />
            <CommandList className="max-h-60 overflow-y-auto custom-scrollbar">
              <CommandEmpty className="text-gray-400 text-sm py-4 text-center">No results found.</CommandEmpty>
              <CommandGroup className="px-1 py-1">
                {!maxCount && (
                  <CommandItem
                    onSelect={toggleAll}
                    className="cursor-pointer text-white data-[selected='true']:bg-white/10 rounded-md my-0.5 px-2 py-2"
                  >
                    <div
                      className={`mr-3 flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors ${value.length === options.length ? 'bg-primary border-primary text-black' : 'border-gray-500 bg-transparent'
                        }`}
                    >
                      {value.length === options.length && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </div>
                    (Select All)
                  </CommandItem>
                )}
                {options.map((option) => {
                  const isSelected = value.includes(option.id)
                  return (
                    <CommandItem
                      key={option.id}
                      onSelect={() => toggleValue(option.id)}
                      className="cursor-pointer text-white data-[selected='true']:bg-white/10 rounded-md my-0.5 px-2 py-2"
                    >
                      <div
                        className={`mr-3 flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors ${isSelected ? 'bg-primary border-primary text-black' : 'border-gray-500 bg-transparent'
                          }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </div>
                      {option.name}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
            <CommandSeparator className="bg-white/10" />
            <div className="flex items-center justify-between p-1">
              <button
                type="button"
                onClick={() => onChange([])}
                className="flex-1 py-2 text-center text-sm font-medium text-white hover:bg-white/5 rounded-md transition-colors"
              >
                Clear
              </button>
              <div className="h-4 w-px bg-white/20 mx-1" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-2 text-center text-sm font-medium text-white hover:bg-white/5 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  // Profile completion percentage based on unified profile data (4 sections x 25%)
  const { profileCompletion, missingFields } = (() => {
    if (!profileData) return { profileCompletion: 0, missingFields: ['Profile Summary', 'Work Experience', 'Education', 'Skills & Strengths'] }
    let score = 0
    const missing = []

    const profileSection = profileData.profileSection;

    // We check both the dynamic profileSection and the legacy portfolio_profile for robustness
    const hasProfileSummary = (profileSection?.about && profileSection.about.length > 0) || (profileData.name && profileData.name.length > 0);
    const hasExperience = (profileSection?.experience && profileSection.experience.length > 0);
    const hasEducation = (profileSection?.education && profileSection.education.length > 0);
    const hasSkills = (profileSection?.skills && profileSection.skills.length > 0);

    if (hasProfileSummary) score += 25; else missing.push('Profile Summary');
    if (hasExperience) score += 25; else missing.push('Work Experience');
    if (hasEducation) score += 25; else missing.push('Education');
    if (hasSkills) score += 25; else missing.push('Skills & Strengths');

    return { profileCompletion: score, missingFields: missing }
  })()

  return (
    <div>
      {/* Breadcrumb + description */}
      <Breadcrumb items={[{ label: 'Mentors', path: '/mentors' }, { label: 'Be a Mentor' }]} />
      <p className="text-white font-normal">Inspire growth and share your expertise—apply now to become a mentor.</p>

      {/* Form card */}
      <div className="relative mt-6 bg-white dark:bg-[#1D1D1D] p-4 rounded-xl shadow-md">
        <Form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="text-white mb-4">
            <div className='flex justify-between items-start'>
              <div>
                <h2 className="text-xl font-bold mb-1">✨ Welcome Mentor!</h2>
                <p className="font-semibold text-base">You're now part of ENCODE – where innovative minds meet guidance</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mt-4">
              <div className="flex-1">
                <div className="flex flex-col gap-4 mt-2">
                  <div>
                    <ul className="text-sm space-y-2 opacity-90">
                      <li className="flex items-center gap-2">💬 Learners may connect for:</li>
                      <li className="font-semibold px-2 border-l-2 border-primary/50">Courses • Projects • Portfolios • Creative growth</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="text-sm space-y-2 opacity-90">
                      <li className="flex items-center gap-2">🕒 3–10 sessions/month • 45–60 mins each</li>
                      <li className="font-semibold px-2 border-l-2 border-primary/50">Keep it professional. Keep it inspiring.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Steps Video Section */}
                <div className="bg-[#2B2B2B] p-3 pr-4 rounded-xl flex items-center gap-4 min-w-[280px]">
                  <p className="text-sm font-semibold max-w-[80px] break-words">Steps for becoming a Mentor</p>
                  <div
                    onClick={() => setShowVideoModal(true)}
                    className="relative group cursor-pointer w-[120px] h-[70px] bg-neutral-800 rounded-lg overflow-hidden border border-white/10"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop"
                      alt="Steps video"
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play size={16} fill="white" className="ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isPending || isApproved || isLoading || profileCompletion < 100 || !watch('my_profile')}
                  className={`min-w-[120px] !h-[86px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all border-2
                    ${isApproved ? 'bg-codeyellow text-black border-codeyellow hover:bg-codeyellow/90' :
                      isPending ? 'bg-neutral-800 text-white border-white/20 cursor-not-allowed' :
                        profileCompletion < 100 || !watch('my_profile') ? 'bg-transparent text-gray-500 border-gray-600 opacity-50 cursor-not-allowed' :
                          'bg-primary text-white border-primary hover:bg-primary/90 shadow-lg shadow-primary/20'}`}
                >
                  {isApproved ? (
                    <>
                      <BadgeCheck size={28} />
                      <span className="font-bold">Approved</span>
                    </>
                  ) : isPending ? (
                    <>
                      <BadgeCheck size={28} className="opacity-50" />
                      <span className="font-bold">Already Applied</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight size={28} />
                      <span className="font-bold">Send Request</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="bg-[#2B2B2B] p-4 rounded-xl mb-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-white">Profile Completion</p>

                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
              </div>
              <Link
                to="/portfolio"
                className="bg-codeyellow text-black font-bold text-sm px-4 py-2 rounded-xl hover:bg-codeyellow/90 transition-colors whitespace-nowrap"
              >
                Complete Your Profile
              </Link>
            </div>
            {profileCompletion < 100 && (
              <div className="mt-3 text-xs text-yellow-500  font-bold opacity-90">
                Please complete the following above fields: {missingFields.join(', ')}
              </div>
            )}
          </div>



          {/* Form fields */}
          <div className='space-y-6'>
            {/* Domain field */}
            <div className='bg-[#2B2B2B] p-5 rounded-2xl'>
              <FormItem className="dark:text-white !mb-0 space-y-4">
                <label className="text-lg font-semibold">Your Expertise <span className='text-red-500'>*</span></label>
                <Controller
                  name="expertise"
                  control={control}
                  render={({ field }) => (
                    <div className="mt-2">
                      <MultiSelect
                        value={field.value}
                        options={functionalDomains}
                        disabled={isPending || isApproved}
                        onChange={field.onChange}
                        placeholder="Select expertise domains"
                        maxCount={3}
                        maxToast="You can select max 3 domains"
                      />
                    </div>
                  )}
                />
                {errors.expertise && <p className="text-red-500 mt-2 text-xs">{errors.expertise.message}</p>}
              </FormItem>
            </div>

            {/* Goal select */}
            <div className='bg-[#2B2B2B] p-5 rounded-2xl'>
              <FormItem className="dark:text-white !mb-0 space-y-4">
                <label className="text-lg font-semibold">Your Mentoring Goal? <span className='text-red-500'>*</span></label>
                <Controller
                  name="mentoringGoal"
                  control={control}
                  render={({ field }) => (
                    <div className="mt-2">
                      <MultiSelect
                        value={field.value}
                        options={[
                          { id: 'Share Course Knowledge', name: 'Share Course Knowledge' },
                          { id: 'Guide Portfolios', name: 'Guide Portfolios' },
                          { id: 'Inspire Creative Growth', name: 'Inspire Creative Growth' },
                          { id: 'Offer Career Direction', name: 'Offer Career Direction' },
                          { id: 'Collaborate & Co-work', name: 'Collaborate & Co-work' },
                          { id: 'Support Academic Excellence', name: 'Support Academic Excellence' },
                          { id: 'Other Reasons', name: 'Other Reasons' },
                        ]}
                        disabled={isPending || isApproved}
                        onChange={field.onChange}
                        placeholder="Select mentoring goals"
                      />
                    </div>
                  )}
                />
                {errors.mentoringGoal && <p className="text-red-500 mt-2 text-xs">{errors.mentoringGoal.message}</p>}
              </FormItem>
            </div>

            {/* Checkboxes Section */}
            <div className="space-y-3">
              {/* T&C Checkbox */}
              <Controller
                name="t_and_c"
                control={control}
                render={({ field }) => (
                  <div
                    className={`flex items-center gap-3 cursor-pointer select-none ${isPending || isApproved ? 'opacity-60 pointer-events-none' : ''}`}
                    onClick={handleTandCCheckbox}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all
                      ${field.value ? 'bg-primary border-primary' : 'bg-transparent border-white/40'}`}>
                      {field.value && <Check size={13} className="text-black" strokeWidth={3} />}
                    </div>
                    <span className="text-white/90 text-sm">
                      Yes, I have read and acknowledged the{' '}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowTandCModal(true) }}
                        className="text-primary underline font-semibold hover:text-primary/80 transition-colors"
                      >
                        Terms and Conditions
                      </button>
                      <span className="text-red-500">*</span>
                    </span>
                  </div>
                )}
              />
              {errors.t_and_c && <p className="text-red-500 text-xs pl-8">{errors.t_and_c.message}</p>}

              {/* R&R Checkbox */}
              <Controller
                name="r_and_r"
                control={control}
                render={({ field }) => (
                  <div
                    className={`flex items-center gap-3 cursor-pointer select-none ${isPending || isApproved ? 'opacity-60 pointer-events-none' : ''}`}
                    onClick={handleRAndRCheckbox}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all
                      ${field.value ? 'bg-primary border-primary' : 'bg-transparent border-white/40'}`}>
                      {field.value && <Check size={13} className="text-black" strokeWidth={3} />}
                    </div>
                    <span className="text-white/90 text-sm">
                      Yes, Also I have read and acknowledged the{' '}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowRAndRModal(true) }}
                        className="text-primary underline font-semibold hover:text-primary/80 transition-colors"
                      >
                        Roles and Responsibilities
                      </button>
                      <span className="text-red-500">*</span>
                    </span>
                  </div>
                )}
              />
              {errors.r_and_r && <p className="text-red-500 text-xs pl-8">{errors.r_and_r.message}</p>}

              {/* My Profile Checkbox */}
              <Controller
                name="my_profile"
                control={control}
                render={({ field }) => (
                  <div
                    className={`flex items-center gap-3 cursor-pointer select-none ${isPending || isApproved ? 'opacity-60 pointer-events-none' : ''}`}
                    onClick={() => {
                      if (!isPending && !isApproved) {
                        // Check profile completion based on unified profileData
                        if (!profileData) {
                          toast.error('Profile data not loaded yet. Please wait.')
                          return
                        }

                        const profileSection = profileData.profileSection;
                        const hasProfileSummary = (profileSection?.about && profileSection.about.length > 0) || (profileData.name && profileData.name.length > 0);
                        const hasExperience = (profileSection?.experience && profileSection.experience.length > 0);
                        const hasEducation = (profileSection?.education && profileSection.education.length > 0);
                        const hasSkills = (profileSection?.skills && profileSection.skills.length > 0);

                        const isPortfolioComplete = hasProfileSummary && hasExperience && hasEducation && hasSkills;

                        if (!isPortfolioComplete) {
                          toast.error('Please complete your profile first. Ensure Profile Summary, Work Experience, Education, and Skills are filled.')
                        } else {
                          field.onChange(!field.value)
                        }
                      }
                    }}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all
                      ${field.value ? 'bg-primary border-primary' : 'bg-transparent border-white/40'}`}>
                      {field.value && <Check size={13} className="text-black" strokeWidth={3} />}
                    </div>
                    <span className="text-white/90 text-sm">
                      Yes, I have completed my profile
                      <span className="text-red-500">*</span>
                    </span>
                  </div>
                )}
              />
              {errors.my_profile && <p className="text-red-500 text-xs pl-8">{errors.my_profile.message}</p>}
            </div>

            {/* Role Select */}
            <div className='bg-[#2B2B2B] p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
              <label className="text-sm font-semibold text-white/80 md:w-1/2">
                Apart from becoming a Mentor, are you open for any further role? please select the role <span className='text-red-500'>*</span>
              </label>
              <div className="w-full md:w-1/2">
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <div className="mt-0">
                      <MultiSelect
                        value={field.value || []}
                        options={[
                          { id: 'patron', name: 'Patron' },
                          { id: 'course_leader', name: 'Course Leader' },
                          { id: 'course_instructor', name: 'Course Instructor' },
                        ]}
                        disabled={isPending || isApproved}
                        onChange={field.onChange}
                        placeholder="Select additional roles"
                      />
                    </div>
                  )}
                />
                {errors.role && <p className="text-red-500 mt-2 text-xs">{errors.role.message}</p>}
              </div>
            </div>
          </div>
        </Form>
      </div>

      {/* Terms & Conditions Modal */}
      <TermsAndConditionsModal
        isOpen={showTandCModal}
        onClose={() => setShowTandCModal(false)}
        onAgree={() => setValue('t_and_c', true)}
      />

      {/* Roles & Responsibilities Modal */}
      <RolesAndResponsibilitiesModal
        isOpen={showRAndRModal}
        onClose={() => setShowRAndRModal(false)}
        onAgree={() => setValue('r_and_r', true)}
      />

      {/* Video Preview Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none overflow-hidden">
          <video
            className="w-full aspect-video"
            controls
            autoPlay
            src="/video/Client Demo - VIdeo.mp4"
          >
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </div>
  )
}
