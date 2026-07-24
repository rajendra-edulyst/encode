import { Button } from "@/components/ui/ShadcnButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createCommunity } from '../../services/CommunityService';
import { useSessionUser } from '@/store/authStore';

import { useCCITimer } from "@/context/CCIContext";

// Validation schema
const formSchema = z.object({
    name: z.string().min(1, 'Community name is required').max(100, 'Name must be 100 characters or less'),
    creators: z.array(z.object({
        email: z.string().email('Invalid email address').or(z.string().length(0))
    })).refine((data) => data.some((creator) => creator.email.trim().length > 0), {
        message: 'At least one valid email is required'
    }),
    terms: z.boolean().refine(val => val === true, {
        message: 'You must accept the terms and conditions'
    })
});

type FormData = z.infer<typeof formSchema>;

const CreateCommunityV2: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { profile_image, name } = useSessionUser((state) => state.user)
    const { timeLeft } = useCCITimer();

    const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            creators: [{ email: '' }, { email: '' }],
            terms: false
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "creators"
    });

    const onSubmit = useCallback(
        async (data: FormData) => {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('title', data.name);
            formData.append('type', 'public');
            formData.append('domain_id', '1');
            formData.append('sub_domain_id', '');
            formData.append('description', data.name);
            formData.append('status', 'Active');
            formData.append('location', '');
            formData.append('country_id', '');
            formData.append('state_id', '');
            formData.append('city_id', '');

            const creatorEmails = data.creators
                .map(c => c.email)
                .filter(email => email && email.trim() !== '')
                .join(',');

            formData.append('invite_creators', creatorEmails);
            formData.append('cci', '1');
            formData.append('domain', window.location.origin);

            try {
                const response = await createCommunity(formData);
                if (response?.status === 1 && response?.data?.id) {
                    toast.success('Community created successfully');
                    navigate(`/community/forum?joy_category_id=${response.data.id}&cci=1`);
                } else {
                    toast.error(response?.message || 'Failed to create community');
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to create community');
            } finally {
                setIsSubmitting(false);
            }
        },
        [navigate]
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-jacques-pro p-4 md:p-8">
            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .cci-input {
                    background: rgba(255, 255, 255, 0.07);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    border-radius: 12px;
                    padding: 12px 16px;
                    transition: all 0.3s ease;
                    width: 100%;
                }
                .cci-input:focus {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: #82b440;
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(130, 180, 64, 0.2);
                }
                .btn-green {
                    background: #82b440;
                    color: #000;
                    font-weight: 600;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                }
                .btn-green:hover {
                    background: #94c84d;
                    transform: translateY(-1px);
                }
                .btn-outline {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    border-radius: 12px;
                    cursor: pointer;
                }
                .btn-outline:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
            `}</style>

            {/* Top Header */}
            <div className="max-w-6xl mx-auto mb-6">
                <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Stage 02</p>
                        <h1 className="text-2xl md:text-3xl font-bold">CCIQ Engage: Ecosystem Simulation</h1>
                    </div>
                    <div className="text-[#facc15] font-mono text-xl md:text-2xl font-bold">
                        Time Left: {timeLeft}
                    </div>
                </div>
            </div>

            {/* Sub Header / Navigation */}
            <div className="max-w-6xl mx-auto mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-lg font-medium hover:text-gray-300 transition-colors bg-white/5 px-6 py-4 rounded-xl border border-white/10 w-full md:w-auto cursor-pointer"
                >
                    <ArrowLeft size={20} />
                    Build Your Own Tribe
                </button>
            </div>

            {/* Main Form Card */}
            <div className="max-w-6xl mx-auto">
                <div className="glass-card p-8 md:p-12 relative overflow-hidden">
                    <h2 className="text-2xl font-bold mb-8">Create Community</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                        {/* Community Name Section */}
                        <div className="glass-card p-6 bg-white/5 border-none">
                            <Label className="text-gray-300 font-medium mb-3 block text-lg">
                                Community Name<span className="text-red-500 ml-1">*</span>
                            </Label>
                            <input
                                {...register('name')}
                                className="cci-input max-w-xl"
                                placeholder="CCI Community-1"
                            />
                            {errors.name && <p className="text-red-400 text-sm mt-2">{errors.name.message}</p>}
                        </div>

                        {/* Invite Creators Section */}
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="glass-card p-6 bg-white/5 border-none flex-1 w-full">
                                <Label className="text-gray-300 font-medium mb-4 block text-lg">
                                    Invite Creators<span className="text-red-500 ml-1">*</span>
                                </Label>
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex flex-col gap-1">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    {...register(`creators.${index}.email` as const)}
                                                    className="cci-input flex-1"
                                                    placeholder="email@example.com"
                                                />
                                                <div className="flex gap-2">
                                                    {index === fields.length - 1 ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => append({ email: '' })}
                                                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 border-none bg-transparent cursor-pointer"
                                                        >
                                                            <Plus size={20} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(index)}
                                                            className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-red-400 border-none bg-transparent cursor-pointer"
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {errors.creators?.[index]?.email && (
                                                <p className="text-red-400 text-sm mt-1">{errors.creators[index]?.email?.message}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {errors.creators?.root?.message && (
                                    <p className="text-red-400 text-sm mt-3">{errors.creators.root.message}</p>
                                )}
                                {errors.creators?.message && typeof errors.creators.message === 'string' && (
                                    <p className="text-red-400 text-sm mt-3">{errors.creators.message as string}</p>
                                )}
                            </div>

                            <button
                                type="button"
                                className="hidden btn-green px-10 py-8 text-xl min-w-[200px]"
                            >
                                Send<br />Invite
                            </button>
                        </div>

                        {/* Terms Section */}
                        <div className="flex items-center space-x-3 py-4">
                            <Controller
                                control={control}
                                name="terms"
                                render={({ field }) => (
                                    <Checkbox
                                        id="terms"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="border-white/20 data-[state=checked]:bg-[#82b440] data-[state=checked]:border-[#82b440]"
                                    />
                                )}
                            />
                            <Label htmlFor="terms" className="text-gray-300 cursor-pointer text-base">
                                Yes, I accept the <span className="text-[#82b440] hover:underline">Terms and Conditions</span><span className="text-red-500 ml-1">*</span>
                            </Label>
                        </div>
                        {errors.terms && <p className="text-red-400 text-sm mt-[-8px]">{errors.terms.message}</p>}

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-6 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn-outline px-10 py-4 text-lg font-semibold min-w-[160px]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-green px-10 py-4 text-lg font-semibold min-w-[200px] flex items-center justify-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="animate-spin" size={20} />}
                                Create Community
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCommunityV2;
