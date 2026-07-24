import { Input } from '@/components/ui/ShadcnInput'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { signUpIndustryFields, signUpCommunityFields } from '@/data/signup-fields'
import { useThemeStore } from '@/store/themeStore'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { useState } from 'react'
import { UploadDropzone } from '@/components/ui/upload-dropzone'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/ShadcnButton'
import { signUpRequest } from '@/services/AuthService'
import { toast } from 'sonner'


type SignUpProps = {
    disableSubmit?: boolean
    signInUrl?: string
}

export const SignUpBase = ({ signInUrl = '/sign-in', }: SignUpProps) => {
    const [message, setMessage] = useTimeOutMessage()
    const loginProfile = useThemeStore((state) => state.loginProfile)
    const [files, setFiles] = useState<File[] | undefined>();
    const colors = [
        'text-cblue',
        'text-cpink',
        'text-cyellow',
        'text-cgreen',
    ]

    const formArray = loginProfile === 'industry' ? signUpIndustryFields : signUpCommunityFields

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formValues, setFormValues] = useState<Record<string, any>>({});

    // Handle input changes
    const handleChange = (name: string, value: any) => {
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle checkbox changes (multiple selection)
    const handleCheckboxChange = (name: string, option: string, checked: boolean) => {
        setFormValues(prev => {
            const current = prev[name] || []
            if (checked) {
                return {
                    ...prev,
                    [name]: [...current, option]
                }
            } else {
                return {
                    ...prev,
                    [name]: current.filter((item: string) => item !== option)
                }
            }
        })
    }

    // Handle file changes (assuming single file for this example)
    const handleFileChange = (name: string, files: FileList | null) => {
        setFormValues(prev => ({
            ...prev,
            [name]: files ? Array.from(files) : []
        }))
    }


    // On submit function
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Map formValues and formArray to question-answer output
        const output = formArray.map(field => {
            let answer = formValues[field.name]

            // For file fields, you may want to serialize file names
            if (field.type === 'file') {
                if (Array.isArray(answer)) {
                    answer = answer.map(f => f.name)
                } else if (answer instanceof File) {
                    answer = answer.name
                } else {
                    answer = null
                }
            }

            return {
                question: field.question,
                answer: answer || ''
            }
        })

        console.log('Form Output:', output)
        console.log('send - :', JSON.stringify(output))
        setMessage('Form submitted successfully!')

        const data = {
            type: loginProfile,
            data: output
        }

        signUpRequest(data).then(() => {
            toast.success('Registration Request sent successfully!');
            setMessage('Registration successful!');
            // clear form values after successful submission
            setFormValues({});
        }).catch((error) => {
            console.error('Error:', error)
            setMessage('Registration failed. Please try again.')
            toast.error('Registration failed. Please try again.');
        });

        // You can send this "output" object/array to your backend here.
    }


    return (
        <div className="">
            <div className='flex items-center justify-between mb-4'>
                <h1 className='flex text-cblack'>
                    <span className='text-cblue'>C</span>
                    <span className='text-cpink'>O</span>
                    <span className='text-cyellow'>D</span>
                    <span className='text-cgreen mr-2'>E</span>
                    COMMUNITY REGISTRATION ({loginProfile.toUpperCase()})
                </h1>
                <Link to={`/sign-in`}><X className='text-cblack text-2xl ml-2' /></Link>
            </div>
            <p className="mt-4 mb-8 text-cblack">Thank you for your interest in joining the CODE Community. This form helps us gather key information about our alumni to build strong connections and foster collaboration between alumni, students, and the broader CODE network.</p>

            <p className="mt-8 mb-4 text-cblack">
                By completing this form, {`you'll`} join a dynamic community focused on professional growth, industry collaboration, and mentorship. Your participation will keep you informed about CODE events, initiatives, and opportunities, while supporting your career.
            </p>

            <form onSubmit={handleSubmit}>
                <ScrollArea className="w-full h-[300px] p-4">
                    {formArray.map((field, index) => (
                        <div key={index} className="mb-6">
                            <Label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-4">
                                <span className={`mr-2 ${colors[index % 4]}`}>{index + 1}.</span><span>{field.question} {field.required && <span className="text-red-500">*</span>}</span>
                            </Label>
                            {field.type === 'input' && (
                                <Input
                                    id={field.name}
                                    placeholder="Your answer"
                                    className='border-l-0 border-t-0 border-r-0 rounded-none outline-none focus:border-cblue ring-0 focus:ring-0 focus-visible:ring-0'
                                    required={field.required}
                                    autoComplete='off'
                                />
                            )}

                            {field.type === 'textarea' && (
                                <Textarea
                                    id={field.name}
                                    placeholder="Your answer"
                                    required={field.required}
                                />
                            )}

                            {field.type === 'radio' && (
                                <RadioGroup
                                    value={formValues[field.name] || ''}
                                    onValueChange={val => handleChange(field.name, val)}
                                >
                                    {field.options?.map((option, idx) => (
                                        <div key={idx} className="flex items-center space-x-2 mb-2">
                                            <RadioGroupItem id={`${field.name}-${idx}`} value={option} />
                                            <Label htmlFor={`${field.name}-${idx}`}>{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )}

                            {field.type === 'checkbox' && (
                                <div className="space-y-2">
                                    {field.options?.map((option, idx) => {
                                        const checkedValues: string[] = formValues[field.name] || []
                                        return (
                                            <div key={idx} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`${field.name}-${idx}`}
                                                    checked={checkedValues.includes(option)}
                                                    onCheckedChange={checked =>
                                                        handleCheckboxChange(field.name, option, checked === true)
                                                    }
                                                />
                                                <Label htmlFor={`${field.name}-${idx}`}>{option}</Label>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {/* {field.type === 'file' && (
                            // create custom file upload button
                            <UploadDropzone
                                id="brochure"
                                accept={{ 'application/pdf': [], 'video/*': [] }}
                                maxSize={10 * 1024 * 1024}
                            />
                        )} */}

                            {field.type === 'file' && (
                                <input
                                    type="file"
                                    id={field.name}
                                    accept=".pdf,video/*"
                                    required={field.required}
                                    multiple={false}
                                    onChange={e => handleFileChange(field.name, e.target.files)}
                                />
                                // If you want to keep using UploadDropzone component,
                                // you need to provide onFilesChange and forwarding files upstream.
                            )}
                        </div>
                    ))}
                </ScrollArea>

                <div className="flex justify-end mt-4 border-t pt-4">
                    <Button
                        className="w-32 bg-[--IndexPink] text-white hover:bg-[--IndexPink]/90"
                        disabled={false} // replace with actual condition to disable submit
                        onClick={() => setMessage('Form submitted successfully!')}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    )
}

const SignUp = () => {
    return <SignUpBase />
}

export default SignUp
