import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/ShadcnButton";
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import z from 'zod';
import { signUpRequest } from '@/services/AuthService';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useAuth } from '@/auth';

// Define the form schema with validation
const formSchema = z.object({
    reasons: z.array(z.string()).min(1, 'Please select at least one reason'),
});

type FormData = z.infer<typeof formSchema>;

// Define checkbox options
const checkboxOptions = [
    { id: 'learn-new-skills', label: 'Learn new programming skills' },
    { id: 'collaborate', label: 'Collaborate on open source projects' },
    { id: 'mentorship-opportunities', label: 'Find mentorship opportunities' },
    { id: 'share-knowledge', label: 'Share knowledge and expertise' },
    { id: 'network-with-peers', label: 'Network with peers' },
    { id: 'access-to-exclusive-resources', label: 'Access to exclusive resources' },
    { id: 'career-development', label: 'Career development' },
    { id: 'research-collaboration', label: 'Research collaboration' },
];


const JoinDetails = () => {

    const { signUp } = useAuth()
    const navigate = useNavigate();
    const loginProfile = useThemeStore((state) => state.loginProfile)
    const [error, setError] = useState<string | null>(null);

    const [data, setData] = useState<{
        name?: string;
        email?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    }>({});

    useEffect(() => {
        const storedData = sessionStorage.getItem('studentData');
        const accountEmail = sessionStorage.getItem('accountEmail');
        const verifiedEmail = sessionStorage.getItem('verified-email');

        if (!accountEmail) {
            toast.error('Something went wrong, please try again');
            navigate('/sign-up');
            return;
        }

        if (!verifiedEmail) {
            toast.error('Please verify your email before proceeding');
            navigate('/account-verify');
            return;
        }

        if (!storedData) {
            navigate('/personal-info');
            toast.error('Please fill out your personal information first');
            return;
        }

        if (storedData) {
            setData(JSON.parse(storedData));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reasons: [],
        },
    });

    // handle tankstack mutation

    const mutation = useMutation({
        mutationFn: signUpRequest,
        onSuccess: (data) => {
            removeSessions();
            toast.success('Successfully signed up!', {
                duration: 3000,
                position: 'top-right',
                style: { background: '#f0f4f8', color: '#333' },
            });
            sessionStorage.setItem('signup-request-data', JSON.stringify(data));
            navigate('/student-reg');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
            console.error('Error during sign up:', err?.request);
            toast.error(err?.response?.data?.message || 'Failed to sign up. Please try again.', {
                duration: 3000,
                position: 'top-right',
                style: { background: '#f0f4f8', color: '#333' },
            });
            console.error('Sign up error:', err);
            setError(err?.response?.data?.message || 'Failed to sign up. Please try again.');
        },
    });


    const onSubmit = async (formData: FormData) => {
        const dataKey = {
            ...data,
            email: sessionStorage.getItem('verified-email'),
            name: data.name,
            mobile_no: data.phone,
            reasons: formData.reasons || formData.reasons,
        };

        const finalData = {
            data: dataKey,
            // type: 'student',
            type: loginProfile.toLowerCase() || 'student',
            email: sessionStorage.getItem('verified-email'),
            name: data.name,
            mobile_no: data.phone,

        };

        if (loginProfile === 'student' || loginProfile === 'creative-mind') {
            // call login api and redirect

            setError(null);

            if (data) {
                const response = await signUp({
                    name: data?.name ?? '',
                    password: 'Hello@12345',
                    email: sessionStorage.getItem('verified-email') ?? '',
                    dob: '',
                    profilePic: "",
                    first_name: finalData.data.name ?? "",
                    last_name: "",
                    gender: "",
                    mobile_no: "",
                    alternate_mobile_no: "",
                    email_address: sessionStorage.getItem('verified-email') ?? '',
                    date_of_birth: "",
                    db_code: "0",
                    username: sessionStorage.getItem('verified-email') ?? '',
                    locale: "English",
                    created_timezone: "UTC+05:30",
                    wp_center_id: null,
                    wp_course_id: null
                });

                if (response.status === 0) {
                    toast.error(response?.error?.[0], {
                        duration: 3000,
                        position: 'top-center',
                        style: { background: '#f0f4f8', color: '#333' },
                    });
                    setError(response?.error?.[0]);
                    return;
                }
                return;
            }

        }

        mutation.mutate(finalData);
    }

    const removeSessions = () => {
        sessionStorage.removeItem('accountEmail');
        sessionStorage.removeItem('verified-email');
        sessionStorage.removeItem('otp-countdown-time');
        sessionStorage.removeItem('studentData');
        sessionStorage.removeItem('signup-request-data');
        navigate('/sign-up');
    };

    return (
        <div>
            <div className='flex flex-col gap-6'>
                <div className='flex items-center justify-between mb-2'>
                    <h1 className="text-3xl font-bold mb-1 text-cblue">Hey {data && data?.name}, welcome to the Code Community!</h1>
                    <Button variant={'ghost'} size={'icon'} onClick={() => removeSessions()}><X /></Button>
                </div>
                <div>
                    <p className="text-[#263A43] text-lg font-bold">Why do you want to join the code community?<span className="text-red-500 text-sm"> *</span></p>
                    <p className="text-[#263A43] text-sm">Select all that apply to help us understand your goals</p>
                </div>
            </div>
            <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {checkboxOptions.map((option) => (
                        <div key={option.id} className="flex items-center gap-2 mt-4">
                            <Controller
                                name="reasons"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id={option.id}
                                        className="w-5 h-5 border-gray-300 data-[state=checked]:text-white data-[state=checked]:bg-[#d63384]"
                                        checked={field.value.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                field.onChange([...field.value, option.id]);
                                            } else {
                                                field.onChange(field.value.filter((id: string) => id !== option.id));
                                            }
                                        }}
                                    />
                                )}
                            />
                            <Label htmlFor={option.id} className="text-[#263A43] font-medium text-base">
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.reasons && <p className="text-red-500 text-sm mt-2">{errors.reasons.message}</p>}
                <div className='mt-7 flex justify-center'>
                    <Button type="submit" className="bg-[#d63384] hover:bg-[#b02a5b] text-white w-[400px]  rounded-lg px-8 py-2 font-semibold focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0">
                        Continue
                    </Button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </form>
        </div>
    )
}

export default JoinDetails