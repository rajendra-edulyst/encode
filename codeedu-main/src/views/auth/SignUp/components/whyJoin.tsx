import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/ShadcnButton";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import z from 'zod';
import { X } from 'lucide-react';
import { userSignUpData } from '../../@hooks/useAuth';
import { errorToast, successToast } from '../../@lib/toastUtils';
import { useMutation } from '@tanstack/react-query';
import { signUpRequest } from '@/services/AuthService';
import { AxiosError } from 'axios';

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

    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const { data: userResponse } = userSignUpData(token);
    const user = userResponse?.data;

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reasons: [],
        },
    });

    const signUpMutation = useMutation({
        mutationFn: signUpRequest,
        onSuccess: (data) => {
            console.log(data);
            successToast("Profile Created", "Your profile has been successfully created.");
            navigate('/eula');
        },
        onError: (err: unknown) => {
            const error = err as AxiosError<{ message?: string }>;
            errorToast("Sign Up Failed", error.response?.data?.message || "Something went wrong, please try again later.");
        },
    });

    const onSubmit = async (formData: FormData) => {

        const mergeData = {
            ...formData,
            ...user?.data,
        }

        const newData = {
            data: mergeData,
            email_token: token,
            mobile_no: user?.mobile_number,
            name: user?.name ?? "",
            is_completed: '1',
            type: user?.type ?? "",
        }

        console.log('Form submitted:', newData);
        signUpMutation.mutate(newData);
    }

    const removeSessions = () => {
        sessionStorage.removeItem('accountEmail');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('otp-countdown-time');
        navigate('/sign-up');
    };

    return (
        <div>
            <div className='flex flex-col'>
                <div className='flex items-center justify-between mb-2'>
                    <h1 className="text-3xl font-bold mb-1 text-cblue">Hey {user?.name}, welcome to the Code Community!</h1>
                    <Button variant={'ghost'} size={'icon'} onClick={() => removeSessions()}><X /></Button>
                </div>
                <div>
                    <p className="text-white text-lg font-bold">Why do you want to join the code community?<span className="text-red-500 text-sm"> *</span></p>
                    <p className="text-white text-sm">Select all that apply to help us understand your goals</p>
                </div>
            </div>
            <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 ml-6 mr-6 gap-4">
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
                            <Label htmlFor={option.id} className="text-white font-medium text-base">
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.reasons && <p className="text-red-500 text-sm mt-2">{errors.reasons.message}</p>}
                <div className='mt-7 mb-7 flex justify-center'>
                    <Button type="submit" className="bg-[#d63384] hover:bg-[#b02a5b] text-white w-[400px]  rounded-lg px-8 py-2 font-semibold focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0">
                        Continue
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default JoinDetails