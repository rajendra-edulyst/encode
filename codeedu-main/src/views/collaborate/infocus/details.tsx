import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { Loader, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/ShadcnButton';
import SafeHtml from '@/components/SafeHtml';
import { Organization } from '@/@types/collaborate/organization';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/ShadcnInput';
import { useMutation } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { AxiosError } from 'axios';
import { errorToast, successToast } from '@/views/auth/@lib/toastUtils';
import InputError from '@/components/input-error';
import CourseCard from '@/components/CourseCard';
import LoadingSection from '@/components/LoadingSection';
import { fetchBrochure } from '@/services/collaborate/BrochureLeadService';
import { useIndustryDetails } from '@/hooks/data/collaborate/useIndustry';
import { useCourses } from '@/hooks/data/create/useCourses';
import { useEffect } from 'react';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

const Details: React.FC = () => {

    const [saveBrochureLeadDialogOpen, setSaveBrochureLeadDialogOpen] = React.useState(false);
    const { organizationId } = useParams<{ organizationId: string }>();
    const { data: organization, isLoading, isError } = useIndustryDetails(organizationId);

    const params = new URLSearchParams();
    params.append('org_id', organizationId || '');
    const { data: coursesData, isLoading: isCoursesLoading } = useCourses(params);
    const courses = coursesData?.data || [];

    useEffect(() => {
        if (organization?.name) {
            mixpanelService.track('Creator Profile Viewed', {
                creator_id: organizationId,
                creator_name: organization.name,
                category: organization.type || 'Creator',
                page_path: window.location.pathname,
                timestamp: new Date().toISOString()
            })
        }
    }, [organization, organizationId])

    if (isLoading) return <Loading loading={isLoading} />;
    if (isError) return <Alert type="danger" title={isError} showIcon={true} />;

    return (
        <div>
            <div className='relative h-[40vh] bg-center bg-cover' style={{ backgroundImage: `url('${organization?.banners?.[0]}')` }}>
                <div className="absolute inset-0 bg-gray-900 opacity-50 dark:opacity-70 h-full"></div>
            </div>
            <div className='md:flex justify-between px-4'>
                <div className="rounded-md relative -mt-12">
                    <div className="w-24 h-24 bg-dark rounded-full border-4 overflow-hidden">
                        <img src={`${organization?.logo}`} alt={organization?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className='mt-2 space-y-3'>
                        <div>
                            <h1 className="text-2xl font-bold dark:text-primary text-primary">{organization && organization?.name}</h1>
                            <p className="flex gap-1 items-center text-gray-500">
                                <MapPin size={16} /> {organization?.city ?? ''}, {organization?.state_name ?? ''}, {organization?.country_name ?? ''}
                            </p>
                        </div>
                    </div>
                </div>
                {/* <div className='mt-5 md:mt-10 mr-10'>
                    <Button className='text-white' onClick={() => setSaveBrochureLeadDialogOpen(true)}>View Brochure</Button>
                </div> */}
            </div>
            <div className="rounded-md relative px-3 mt-4">
                <Tabs defaultValue="about">
                    <TabsList className='w-full overflow-x-auto scrollbar-hide border-b flex gap-2 text-sm font-medium justify-start bg-transparent rounded-none'>
                        <TabsTrigger value="about" className="flex-shrink-0 border-b-2 border-transparent text-lg data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-cblack text-gray-500">About</TabsTrigger>
                        <TabsTrigger value="why_we_choose" className="flex-shrink-0 border-b-2 border-transparent text-lg data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-cblack text-gray-500">Why We Choose</TabsTrigger>
                        {(organization?.type === 'institute' || organization?.type === 'university') && <TabsTrigger value="admission" className="flex-shrink-0 border-b-2 border-transparent text-lg data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-cblack text-gray-500">Admission</TabsTrigger>}
                        {(organization?.type === 'institute' || organization?.type === 'university') && <TabsTrigger value="courses" className="flex-shrink-0 border-b-2 border-transparent text-lg data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-cblack text-gray-500">Courses</TabsTrigger>}
                    </TabsList>
                    <TabsContent value="about">
                        <div className='py-2 px-3'>
                            <p className="text-gray-600 dark:text-gray-40">{organization && organization?.org_description}</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="why_we_choose">
                        <div className='py-2 px-3'>
                            <SafeHtml html={organization?.why_this_university ?? 'No Data available'} className='text-gray-500' />
                        </div>
                    </TabsContent>
                    <TabsContent value="admission">
                        <div className='py-2 px-3'>
                            <SafeHtml html={organization?.admission ?? 'No Data available'} className='text-gray-500' />
                        </div>
                    </TabsContent>
                    <TabsContent value="courses">
                        <div className='py-2 px-3'>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4'>
                                {
                                    courses?.map((course) => (
                                        <Link key={course.id} to={`/courses/${course.id}`}>
                                            <CourseCard course={course} />
                                        </Link>
                                    ))
                                }
                            </div>
                            {
                                isCoursesLoading && <LoadingSection isLoading={isCoursesLoading} title='Courses Loading' />
                            }
                            {
                                courses?.length === 0 && <div className='h-60 w-full border flex justify-center items-center rounded-lg'>
                                    <h1 className='text-2xl text-gray-500'>No Courses Available</h1>
                                </div>
                            }
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <SaveBrochureLead open={saveBrochureLeadDialogOpen} organization={organization!} onOpenChange={setSaveBrochureLeadDialogOpen} />
        </div>
    );
};

interface SaveBrochureLeadProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organization: Organization
}

const formSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    mobile: z.string().min(10).max(15),
    education: z.string().min(2).max(100),
    university: z.string().min(2).optional(),
    university_sort_name: z.string().optional(),
});

type formSchemaType = z.infer<typeof formSchema>;

const SaveBrochureLead: React.FC<SaveBrochureLeadProps> = ({ open, onOpenChange, organization }) => {

    const { register, handleSubmit, reset, formState: { errors }, } = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
    });

    const requestBrochureMutation = useMutation({
        mutationFn: fetchBrochure,
        onSuccess: () => {
            reset();
            successToast("Brochure Lead Submitted", "You will receive the brochure in your email shortly.");
        },
        onError: (err: unknown) => {
            const error = err as AxiosError<{ message?: string }>;
            errorToast("Failed to fetch brochure lead", error.response?.data?.message || "Something went wrong, please try again later.");
        },
        onMutate: () => {
            reset();
            onOpenChange(false);
        }
    })

    const submitData = async (data: formSchemaType) => {

        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('mobile', data.mobile);
        formData.append('education', data.education);
        formData.append('university', organization?.name || '');
        formData.append('university_sort_name', organization?.name.slice(0, 4) || '');
        requestBrochureMutation.mutate(formData);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-5">Get Brochure</DialogTitle>
                    <DialogDescription>
                        Please fill in your details to download the brochure.
                    </DialogDescription>
                </DialogHeader>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit(submitData)}>
                    <div>
                        <Label htmlFor="name" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">Name</Label>
                        <Input {...register("name")} placeholder="Name" className='focus-visible:ring-0' />
                        <InputError message={errors.name?.message} />
                    </div>
                    <div>
                        <Label htmlFor="email" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">Email</Label>
                        <Input {...register("email")} placeholder="Email" className='focus-visible:ring-0' />
                        <InputError message={errors.email?.message} />
                    </div>
                    <div>
                        <Label htmlFor="mobile" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">Mobile</Label>
                        <Input type="tel" {...register("mobile")} placeholder="Mobile number" className='focus-visible:ring-0' />
                        <InputError message={errors.mobile?.message} />
                    </div>
                    <div>
                        <Label htmlFor="education" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">Education</Label>
                        <Input {...register("education")} placeholder="Highest Qualification" className='focus-visible:ring-0' />
                        <InputError message={errors.education?.message} />
                    </div>
                    <div className="md:col-span-2">
                        <Button type="submit" className='text-white w-full' disabled={requestBrochureMutation.isPending}>
                            {requestBrochureMutation.isPending ? 'Submitting...' : 'Submit'} {requestBrochureMutation.isPending && <Loader className="ml-2 h-4 w-4 animate-spin inline-block" />}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default Details;
