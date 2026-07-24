import Breadcrumb from '@/components/breadcrumb'
import StatusIndicator from '@/components/StatusIndicator';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcnAvatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProgramDetailsStore } from '@/store/faculty/ProgramStore';
import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import ContentTypeIcons from '@/views/player/content/icons';
import { Button } from '@/components/ui/ShadcnButton';
import { stripHtmlTags } from '@/utils/stripHtmlTags';


const SubjectDetails = () => {

    const { id } = useParams();
    const { fetchProgramDetails, setSelectedModule, selectedModule, fetchModuleContents, moduleContents, program, loading, error, modulecontentLoading } = useProgramDetailsStore();

    useEffect(() => {
        if (!id) {
            toast.error('Subject not found, please try again later.');
            return;
        }
        fetchProgramDetails(id);
    }, [id, fetchProgramDetails]);

    const breadcrumbItems = [
        { label: 'Subjects', path: '/subjects' },
        { label: program?.name || 'Details' },
    ];


    useEffect(() => {
        if (selectedModule) {
            fetchModuleContents();
        }
    }, [selectedModule, fetchModuleContents]);



    return (
        <div>
            <div className='flex items-center justify-between mb-1'>
                <Breadcrumb items={breadcrumbItems} />
                <div>
                    <StatusIndicator error={error} loading={loading} />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <div className="md:flex justify-start gap-4">
                        <div className='flex justify-center rounded-lg items-center mb-5 md:mb-0'>
                            <img src={program?.image} alt="Subject" className='w-60 min-w-60 rounded-lg' />
                        </div>
                        <div>
                            <CardTitle className='mb-2'>{program?.name}</CardTitle>
                            <CardDescription className='mb-2 line-clamp-3'>{stripHtmlTags(program?.description ?? '')}</CardDescription>
                            <div>
                                <div className="flex items-center gap-2 mt-2">
                                    <ChevronRight className="text-gray-500" size={16} />
                                    <p className="text-sm text-gray-500 mb-0">Duration - {new Date(`${program?.start_date}`).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: '2-digit',
                                        year: 'numeric',
                                    })} to {new Date(`${program?.end_date}`).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: '2-digit',
                                        year: 'numeric',
                                    })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <ChevronRight className="text-gray-500" size={16} />
                                <p className="text-sm text-gray-500 mb-0">Total Modules - {program?.modules?.length}</p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <div className='mt-4 bg-white shadow-sm p-0 rounded-lg'>
                <Tabs defaultValue="details">
                    <TabsList className='border-b w-full justify-start bg-white rounded-none rounded-t-lg'>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="faculty">Faculty</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className='p-3'>

                        <div
                            className="text-sm text-gray-500 prose-sm"
                            dangerouslySetInnerHTML={{ __html: program?.description || '' }}
                        />

                        <div className='mt-2'>
                            <h1 className='text-lg mb-2'>Course Skills</h1>
                            {
                                program?.course_skills?.split(',').map((skill, index) => (
                                    <Badge key={index} className='mr-2 mb-2' variant="outline">
                                        {skill}
                                    </Badge>
                                ))
                            }
                        </div>

                        <div className='mt-2'>
                            <h1 className='text-lg mb-2'>Course Organization</h1>
                            <div className='flex items-center gap-3'>
                                <img src={program?.organization?.organization_logo} alt="Organization" className='w-10 h-10 rounded-full' />
                                <p className='text-base group-hover:text-primary transition-all duration-200 ease-in-out'>{program?.organization?.name}</p>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="content" className="p-3">
                        <div className='flex items-center justify-between mb-3'>
                            <p className="text-sm text-gray-500 mb-3">List of modules for this subject.</p>
                            {/* <Button asChild variant="outline" size="sm" className='mr-2'>
                                <Link to={`/programs/${id}/modules/`}>Modules</Link>
                            </Button> */}
                        </div>
                        <div className="space-y-3">
                            {program?.modules?.map((module, index) => {
                                const isOpen = selectedModule?.id === module.id;
                                return (
                                    <div
                                        key={index}
                                        className={`border rounded-lg transition-shadow duration-200 group cursor-pointer bg-white shadow-sm hover:shadow-md ${isOpen ? "ring-2 ring-primary/30 bg-gray-50" : ""
                                            }`}
                                        onClick={() => setSelectedModule(isOpen ? null : module)}
                                    >
                                        <div className="flex items-center justify-between p-4">
                                            <div>
                                                <h1 className="text-base font-semibold transition-colors duration-200">
                                                    {module?.name}
                                                </h1>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {stripHtmlTags(module?.description || '')}
                                                </div>
                                            </div>
                                            <span
                                                className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "rotate-0 text-gray-400"
                                                    }`}
                                            >
                                                <ChevronDown size={22} />
                                            </span>
                                        </div>
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen overflow-auto opacity-100" : "max-h-O opacity-0"
                                                }`}
                                        >
                                            <div className="">
                                                {isOpen && (
                                                    modulecontentLoading ? (
                                                        <div className="flex items-center gap-2 p-4 pt-0 text-gray-400 text-sm">
                                                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-2 border-l-2 border-transparent border-t-primary border-l-primary" />
                                                            Loading contents...
                                                        </div>
                                                    ) : moduleContents && moduleContents.length > 0 ? (
                                                        <div className="grid gap-3 p-4 pt-0">
                                                            {moduleContents.map((content, idx) => (
                                                                <Link key={idx} to={`/subjects/${id}/modules/${module.id}`}>
                                                                    <div
                                                                        key={idx}
                                                                        className="border flex gap-2 items-center hover:bg-gray-100 border-gray-200 p-3 rounded-md transition group"
                                                                    >
                                                                        <div>
                                                                            <ContentTypeIcons content_type={content?.content_type} />
                                                                        </div>
                                                                        <div>
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <span className="font-semibold text-base text-gray-800">{content.title}</span>
                                                                            </div>
                                                                            {content.description && (
                                                                                <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                                                    {stripHtmlTags(content.description)}
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                    </div>
                                                                </Link>

                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-gray-400">No contents found for this module.</div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </TabsContent>
                    <TabsContent value="faculty" className='p-3'>
                        <div className='mb-3'>
                            <p className='text-sm text-gray-500'>List of faculty members for this subject.</p>
                        </div>
                        {
                            program?.program_faculty?.map((faculty, index) => (
                                <Link key={index} to={`/portfolio/codeedu-dae124fa/${faculty?.id}`} className='border-b border-gray-200 group flex items-center gap-3 p-3'>
                                    <Avatar>
                                        <AvatarImage src={faculty?.profile_image} alt="Faculty" />
                                        <AvatarFallback>
                                            <img src={`https://ui-avatars.com/api/?name=${faculty?.name}`} alt="Faculty" className='w-10 h-10 rounded-full' />
                                        </AvatarFallback>
                                    </Avatar>
                                    <h1 className='text-lg group-hover:text-primary transition-all duration-200 ease-in-out'>{faculty?.name}</h1>
                                </Link>
                            ))
                        }
                    </TabsContent>
                </Tabs>
            </div>

        </div >
    )
}

export default SubjectDetails