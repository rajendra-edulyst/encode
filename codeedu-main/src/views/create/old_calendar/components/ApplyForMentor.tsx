
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import { Form, FormItem } from '@/components/ui/Form'
import { toast } from 'sonner'
import Breadcrumb from '@/components/breadcrumb'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/ShadcnInput'

const formSchema = z.object({
  interest: z.string().min(5, 'Please describe your interest'),
  bio: z.string().min(5, 'Please describe your bio'),
  expertise: z.string().min(5, 'Please describe your expertise'),
})

type ApplyForMentorFormValues = z.infer<typeof formSchema>

export default function ApplyForMentor() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplyForMentorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: '',
      expertise: '',
      interest: '',
    },
  })

  const breadcrumbItems = [
    { label: 'Calendar', path: '/calendar' },
    { label: 'Be a Mentor' },
  ]

  const onSubmit = async (values: ApplyForMentorFormValues) => {
    try {
      console.log('Submitted values:', values)
      await new Promise((res) => setTimeout(res, 1000)) // simulate API
      toast.success('Application submitted successfully!')
      reset()
    } catch (err) {
      toast.error('Failed to submit application')
      console.error(err)
    }

  }

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Be a Mentor</h1>
          <p className="text-sm text-gray-500 dark:text-white">Apply to become a mentor</p>
        </div>
      </div>
      <div className="p-6 bg-white dark:bg-card shadow-md rounded-md w-full md:max-w-3xl">
        <Form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FormItem className='dark:text-white' label={<span>Your Expertise<span className='text-red-500'>*</span></span>}>
            <Controller
              control={control}
              name="expertise"
              render={({ field }) => (
                <Input placeholder="e.g., Web Development, Machine Learning..." {...field}
                  className='bg-gray-50 dark:bg-gray-700'
                />
              )}
            />
            {errors.expertise?.message && (
              <div className="text-red-500 text-sm mt-1">{errors.expertise.message}</div>
            )}
          </FormItem>
          <FormItem className='dark:text-white' label={<span>Your Bio<span className='text-red-500'>*</span></span>} >
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <Textarea
                  placeholder="Tell us about your experience..."
                  className='bg-gray-50 dark:bg-gray-700'
                  rows={7}
                  {...field}
                />
              )}
            />
          </FormItem>
          <FormItem className='dark:text-white' label={<span>What do you want to mentor?<span className='text-red-500'>*</span></span>}>
            <Controller
              name="interest"
              control={control}
              render={({ field }) => (
                <Textarea
                  placeholder="Describe the topics you wish to mentor on..."
                  className='bg-gray-50 dark:bg-gray-700'
                  rows={7}
                  {...field}
                />
              )}
            />
          </FormItem>
          <Button type="submit" className="bg-primary text-white hover:text-white transition-all hover:bg-primary-deep hover:ring-0 ease-in-out duration-100">
            Submit Application
          </Button>
        </Form>
      </div>
    </div>

  )
}