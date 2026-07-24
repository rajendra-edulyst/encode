import Breadcrumb from '@/components/breadcrumb'
import StatusIndicator from '@/components/StatusIndicator'
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcnAvatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSessionDetailsStore } from '@/store/faculty/SessionStore';
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Attendance from './attendance';
import { formatDate } from '@/utils/commonDateFormat';
import { BookOpen, Calendar, Clock, FileText, Layers } from 'lucide-react';

const Details: React.FC = () => {

    const { id } = useParams();
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const { session, getSessionDetails, error, loading, changeSessionStatus } = useSessionDetailsStore();
    const [defaultTab, setDefaultTab] = React.useState<string>(tabParam ? tabParam : 'details');

    useEffect(() => {
        if (!id) {
            toast.error('Something went wrong, Please try again later.');
            return;
        }
        getSessionDetails(id);
    }, [getSessionDetails, id]);

    const breadcrumbItems = [
        { label: 'Sessions' },
    ];

    return (
        <div>
            <div className="flex items-center justify-between">
                <Breadcrumb items={breadcrumbItems} />
                <div className="flex items-center gap-3">
                    <StatusIndicator error={error} loading={loading} loadingMessage={"Syncing Live Sessions"} />
                </div>
            </div>
            <Card className='rounded-none rounded-t-lg'>
                <CardContent className='flex items-center justify-between p-3'>
                    <div>
                        <p className="text-sm text-gray-500">{session?.program_name}</p>
                        <h1 className="text-2xl font-bold">{session?.title}</h1>
                        <p className="text-sm text-gray-500">{session?.module_name}</p>
                    </div>
                    <Select defaultValue={session?.status} onValueChange={(value) => changeSessionStatus(value as 'Published' | 'Draft')}>
                        <SelectTrigger className={`w-[150px] ${session?.status === 'Published' ? 'bg-green-100' : 'bg-red-100'}`}>
                            <SelectValue placeholder={session?.status} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Published">Published</SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
            <div className='bg-white dark:bg-card shadow-sm p-0'>
                <Tabs defaultValue={defaultTab} onValueChange={(value) => setDefaultTab(value as 'details' | 'faculty' | 'learners')}>
                    <TabsList className='border-b w-full justify-start bg-gray-50 border-x rounded-none dark:bg-card'>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="faculty">Faculty</TabsTrigger>
                        <TabsTrigger value="learners">Participants</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className='p-3'>
                        <div className="space-y-3">
                            <DetailItem
                                icon={<FileText className="w-4 h-4 text-blue-500" />}
                                label="Session Type"
                                value={session?.content_type}
                            />
                            <DetailItem
                                icon={<BookOpen className="w-4 h-4 text-green-500" />}
                                label="Subject"
                                value={session?.program_name}
                            />
                            <DetailItem
                                icon={<Layers className="w-4 h-4 text-purple-500" />}
                                label="Unit"
                                value={session?.module_name}
                            />
                            <DetailItem
                                icon={<Calendar className="w-4 h-4 text-pink-500" />}
                                label="Date"
                                value={formatDate(session?.start_date)}
                            />
                            <DetailItem
                                icon={<Clock className="w-4 h-4 text-orange-500" />}
                                label="Time"
                                value={`${formatDate(session?.start_date, "h:mm a")} - ${formatDate(
                                    session?.end_date,
                                    "h:mm a"
                                )}`}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="faculty" className='p-3'>
                        <div className='mb-3'>
                            <p className='text-sm text-gray-500'>List of faculty members for this session.</p>
                        </div>
                        {
                            session?.liveclass_faculty?.map((faculty, index) => (
                                <Link key={index} to={`/portfolio/codeedu-dae124fa/${faculty?.id}`} className='border-b border-gray-200 group flex items-center gap-3 p-3'>
                                    <Avatar>
                                        <AvatarImage src={'https://ui-avatars.com/api/?name=' + faculty?.name} alt="Faculty" className='w-10 h-10 rounded-full' />
                                        <AvatarFallback>
                                            <img src={`https://ui-avatars.com/api/?name=${faculty?.name}`} alt="Faculty" className='w-10 h-10 rounded-full' />
                                        </AvatarFallback>
                                    </Avatar>
                                    <h1 className='text-lg group-hover:text-primary transition-all duration-200 ease-in-out'>{faculty?.name}</h1>
                                </Link>
                            ))
                        }
                    </TabsContent>
                    <TabsContent value="learners" className='p-3'>
                        {session && session?.id && <Attendance sessionId={session?.id} />}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Details


interface DetailItemProps {
    icon: React.ReactNode;
    label: string;
    value: string | null | undefined;
}

const DetailItem = ({ icon, label, value }: DetailItemProps) => {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-neutral-800">
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
                    {value || "—"}
                </p>
            </div>
        </div>
    );
}
