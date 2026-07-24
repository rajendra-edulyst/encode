import React, { memo, useCallback, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PersonalInfo from './PersonalInfo'
import Education from './Education'
import { Button } from '@/components/ui/ShadcnButton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { usePortfolioStore } from '@/store/learner/portfolioStore';
import { userPortfolio, fetchUpdateImage, deleteActivity, deleteUserSkill } from '@/services/learner/PortfolioService';
import Certificate from './Certificate';
import Project from './Project';
import Skill from './Skill';
import Publication from './Publication';
import ExtraActivity from './ExtraActivity';
import { Badge } from '@/components/ui/badge';
import { getFileType } from "@/utils/getFileType";
import { useAuth } from '@/auth';
import deafultprofile from '@/assets/images/defaultprofile.jpg';
import { useSessionUser } from '@/store/authStore';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/shadcnTooltip"
import { Dribbble, Expand, Eye, Globe, Instagram, Link2, Trash, X } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { Link } from 'react-router-dom';
import SocialMedia from './SocialMedia';
import AddResume from './AddResume';
import Experience from './experience';
import VideoResumes from './video-resume';

function index() {

    const { user } = useAuth()

    const [showEducationDialog, setShowEducationDialog] = useState<boolean>(false);
    const [showCertificateDialog, setShowCertificateDialog] = useState<boolean>(false);
    const [showPublicationDialog, setShowPublicationDialog] = useState<boolean>(false);
    const [showEXtraDialog, setShowEXtraDialog] = useState<boolean>(false);
    const [showSkillDialog, setShowSkillDialog] = useState<boolean>(false);
    const [showProjectDialog, setShowProjectDialog] = useState<boolean>(false);
    const [showSocialMediaDialog, setShowSocialMediaDialog] = useState<boolean>(false);
    const [showPersonalInfoDialog, setShowPersonalInfoDialog] = useState<boolean>(false);
    const { setPortfolio, portfolio, error, setError, loading, setLoading } = usePortfolioStore();
    const [tab, setTab] = useState<string>('personal');
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [addResumeDialog, setAddResumeDialog] = useState<boolean>(false);

    const fetchUserPortfolio = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await userPortfolio();
            setPortfolio(data);
            console.log(data);
        } catch (error) {
            setError("Failed to fetch portfolio");
            console.error(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }, [setLoading, setPortfolio, setError]);

    useEffect(() => {
        fetchUserPortfolio();
    }, [fetchUserPortfolio]);


    const deleteActivityHandler = useCallback(async (id?: number) => {
        if (!id) {
            toast.error('Something went wrong, please try again');
            return;
        }
        setLoading(true);
        setError("");
        try {
            await deleteActivity(id);
            fetchUserPortfolio();
        } catch (error) {
            setError("Failed to delete activity");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [fetchUserPortfolio, setLoading, setError]);

    const removeUserSkill = useCallback(async (id?: number) => {
        if (!id) {
            toast.error('Something went wrong, please try again');
            return;
        }
        setLoading(true);
        setError("");
        try {
            await deleteUserSkill(id);
            fetchUserPortfolio();
            toast.success('Skill removed successfully');
        } catch (error) {
            setError("Failed to delete skill");
            toast.error('Failed to delete skill');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [fetchUserPortfolio, setLoading, setError]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {

            // check uploaded image is less than 2mb and is of type image
            if (e.target.files[0].size > 2097152) {
                toast.error('Image size should be less than 2mb');
                return;
            }

            if (e.target.files[0].type !== 'image/png' && e.target.files[0].type !== 'image/jpeg') {
                toast.error('Invalid image format, please upload image in PNG or JPG format');
                return;
            }

            const uploadedImage = e.target.files[0];
            const localUrl = URL.createObjectURL(uploadedImage);
            setProfileImageUrl(localUrl);
            fetchUpdateImage(uploadedImage).then((res) => {
                toast.success('Profile image updated successfully');
                useSessionUser.setState((state) => ({
                    user: {
                        ...state.user,
                        profile_image: res ?? localUrl,
                    },
                }));
            }).catch((error) => {
                console.error(error);
                toast.error('Failed to update profile image');
            });
        }
    };

    const handleDeleteImage = async () => {
        // convert to blob
        const response = await fetch(deafultprofile);
        const blob = await response.blob();
        const file = new File([blob], 'avatar.png', { type: 'image/png' });
        const showProfileImage = URL.createObjectURL(file);
        setProfileImageUrl(showProfileImage);
        fetchUpdateImage(file).then(() => {
            toast.success('Profile image updated successfully');
        }).catch((error) => {
            console.error(error);
            toast.error('Failed to update profile image');
        });
    };

    if (loading) return <Loading loading={loading} />
    if (error) return <Alert title={error} type='danger' />

    return (
        <div className="max-w-full sm:max-w-[90%] md:max-w-3xl lg:max-w-6xl mx-auto">
            <Tabs defaultValue="personal" value={tab} onValueChange={setTab}>
                <div className='flex justify-between gap-4'>
                    <div className='overflow-auto' style={{
                                scrollbarColor: '#00a8e9 #e5e7eb',
                                scrollbarWidth: 'thin',
                            }}>
                        <TabsList
                            className='bg-white overflow-x-auto'
                            
                        >
                            <div className="flex custom-scrollbar">
                                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                                <TabsTrigger value="socialmedia">Social Media</TabsTrigger>
                                <TabsTrigger value="education">Education</TabsTrigger>
                                <TabsTrigger value="experience">Experience</TabsTrigger>
                                <TabsTrigger value="certificate">Certificate</TabsTrigger>
                                <TabsTrigger value="publication">Publications</TabsTrigger>
                                <TabsTrigger value="extra">Extra Activity</TabsTrigger>
                                <TabsTrigger value="project">Projects</TabsTrigger>
                                <TabsTrigger value="resume">Resumes</TabsTrigger>
                                <TabsTrigger value="video-resumes">Video Resumes</TabsTrigger>
                                <TabsTrigger value="skill">Skills</TabsTrigger>
                            </div>
                        </TabsList>
                    </div>
                    <Link to='/portfolio'>
                        <Button className='text-white hidden md:block'>Preview Portfolio</Button>
                        <Button variant="default" className='text-white md:hidden'>
                            <Eye size={20} />
                        </Button>
                    </Link>
                </div>
                <TabsContent value="personal">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Personal Info</h2>
                                <Button className='text-white' variant='default' onClick={() => setShowPersonalInfoDialog(true)}>Edit</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-5 mt-6">
                                <div className="relative w-20 h-20 group">
                                    <div className="w-full h-full bg-slate-300 rounded-full border border-primary overflow-hidden">
                                        <img src={profileImageUrl ? profileImageUrl
                                            : portfolio.image ? portfolio.image : `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>

                                    {/* Delete Button - visible on hover */}
                                    <button
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={handleDeleteImage}
                                    >
                                        Delete
                                    </button>
                                </div>

                                <div className="mt-5">
                                    <div className="mb-3">
                                        <label
                                            htmlFor="avatar"
                                            className="text-ac-dark bg-primary text-white px-4 py-2 rounded cursor-pointer"
                                        >
                                            Upload Image
                                        </label>
                                        <input
                                            type="file"
                                            id="avatar"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                    <span className="block text-slate-400 text-xs">
                                        Max size 2mb. Formats: JPG, PNG.
                                    </span>
                                </div>
                            </div>
                            {portfolio && portfolio?.portfolio_profile && portfolio?.portfolio_profile?.length !== 0 && <table className='w-full mt-3'>
                                <tbody className='divide-y'>
                                    <tr className='hover:bg-gray-100'>
                                        <td className='font-semibold p-3 w-25 text-gray-600'>Full Name</td>
                                        <td>{portfolio?.portfolio_profile[0]?.name} {portfolio?.portfolio_profile[0]?.lastName}</td>
                                    </tr>
                                    <tr className='hover:bg-gray-100'>
                                        <td className='font-semibold p-3 w-25 text-gray-600'>Email</td>
                                        <td>{portfolio?.portfolio_profile[0]?.email}</td>
                                    </tr>
                                    <tr className='hover:bg-gray-100'>
                                        <td className='font-semibold p-3 w-25 text-gray-600'>Phone Number</td>
                                        <td>{portfolio?.portfolio_profile[0]?.phone}</td>
                                    </tr>
                                    <tr className='hover:bg-gray-100'>
                                        <td className='font-semibold p-3 w-25 text-gray-600'>Address</td>
                                        <td>
                                            {portfolio?.portfolio_profile[0]?.city}, {portfolio?.portfolio_profile[0]?.state}, {portfolio?.portfolio_profile[0].country}
                                        </td>
                                    </tr>
                                    <tr className='hover:bg-gray-100'>
                                        <td className='font-semibold p-3 w-25 text-gray-600'>About</td>
                                        <td className='py-3'>{portfolio?.portfolio_profile[0].about_me}</td>
                                    </tr>
                                </tbody>
                            </table>
                            }
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="socialmedia">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Social Media</h2>
                                <Button className='text-white' variant='default' onClick={() => setShowSocialMediaDialog(true)}>Edit</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {portfolio && portfolio?.portfolio_social && <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                {portfolio?.portfolio_social[0]?.linkedin && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <img src="https://linkedin.com/favicon.ico" alt="linkedin"
                                        className='w-12 h-12 object-contain rounded-lg' />
                                    <div>
                                        <h6>LinkedIn</h6>
                                        <p>{portfolio?.portfolio_social[0]?.linkedin}</p>
                                    </div>
                                </div>
                                }
                                {portfolio?.portfolio_social[0]?.facebook && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <img src="https://facebook.com/favicon.ico" alt="facebook"
                                        className='w-12 h-12 object-contain rounded-lg' />
                                    <div>
                                        <h6>Facebook</h6>
                                        <p>{portfolio?.portfolio_social[0].facebook}</p>
                                    </div>
                                </div>
                                }
                                {portfolio?.portfolio_social[0]?.twitter && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <img src="https://twitter.com/favicon.ico" alt="twitter"
                                        className='w-12 h-12 object-contain rounded-lg' />
                                    <div>
                                        <h6>Twitter</h6>
                                        <p>{portfolio?.portfolio_social[0].twitter}</p>
                                    </div>
                                </div>
                                }
                                {portfolio?.portfolio_social[0]?.insta && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <div className='w-12 h-12 object-contain rounded-lg flex justify-center items-center bg-gray-300'>
                                        <Instagram size={40} />
                                    </div>
                                    <div>
                                        <h6>Instagram</h6>
                                        <p>{portfolio?.portfolio_social[0].insta}</p>
                                    </div>
                                </div>
                                }
                                {/* website */}
                                {portfolio?.portfolio_social[0]?.site_url && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <div className='w-12 h-12 object-contain rounded-lg flex justify-center items-center bg-gray-300'>
                                        <Globe size={40} />
                                    </div>
                                    <div>
                                        <h6>Website</h6>
                                        <p>{portfolio?.portfolio_social[0].site_url}</p>
                                    </div>
                                </div>
                                }
                                {/* Dribbble */}
                                {portfolio?.portfolio_social[0]?.dribble && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <div className='w-12 h-12 object-contain rounded-lg flex justify-center items-center bg-gray-300'>
                                        <Dribbble size={40} />
                                    </div>
                                    <div>
                                        <h6>Dribbble</h6>
                                        <p>{portfolio?.portfolio_social[0].dribble}</p>
                                    </div>
                                </div>
                                }
                                {/* pinterest */}
                                {portfolio?.portfolio_social[0].pinterest && <div className='flex items-center gap-4 border p-4 rounded-lg'>
                                    <img src="https://www.pinterest.com/favicon.ico" alt="pinterest"
                                        className='w-12 h-12 object-contain rounded-lg' />
                                    <div>
                                        <h6>Pinterest</h6>
                                        <p>{portfolio?.portfolio_social[0].pinterest}</p>
                                    </div>
                                </div>
                                }
                                {
                                    portfolio?.portfolio_social[0].linkedin === null &&
                                    portfolio?.portfolio_social[0].facebook === null &&
                                    portfolio?.portfolio_social[0].twitter === null &&
                                    portfolio?.portfolio_social[0].insta === null &&
                                    portfolio?.portfolio_social[0].email === null &&
                                    portfolio?.portfolio_social[0].mob_num === null &&
                                    portfolio?.portfolio_social[0].site_url === null &&
                                    portfolio?.portfolio_social[0].dribble === null &&
                                    portfolio?.portfolio_social[0].pinterest === null &&
                                    <p className='p-2'>No social media found</p>
                                }
                            </div>
                            }
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="education">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Education</h2>
                                <Button className='text-white' variant='default' onClick={() => setShowEducationDialog(true)}>Add</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                {
                                    portfolio?.Education?.map((education, index) => (
                                        <Card key={index}>
                                            <CardHeader>
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex items-center'>
                                                        <img src={`https://ui-avatars.com/api/?name=${education.title}&background=random`} alt={education?.title} className='w-12 h-12 object-cover rounded-full' />
                                                        <div className='ml-3'>
                                                            <h6>{education.title}</h6>
                                                            <p>{education.institute}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant='destructive' onClick={() => deleteActivityHandler(education?.id)}>
                                                        <Trash />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p>{education.description}</p>
                                                <p className='text-gray-400'>{education.start_date} - {education.end_date}</p>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                                {
                                    portfolio?.Education?.length === 0 && <p>No education found</p>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="experience">
                    {/* experience */}
                    <Experience experiences={portfolio?.Experience ?? []} fetchUserPortfolio={fetchUserPortfolio} deleteActivityHandler={deleteActivityHandler} />
                </TabsContent>
                <TabsContent value="certificate">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Certificate</h2>
                                <Button className='text-white' variant='default' onClick={() => setShowCertificateDialog(true)}>Add</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4'>
                                {
                                    portfolio?.Certificate?.map((certificate, index) => (
                                        <Card key={index}>
                                            <CardHeader className='p-0 rounded-t-lg overflow-hidden relative'>
                                                {
                                                    certificate?.image_name && getFileType(certificate?.image_name) === 'pdf' && <embed src={`https://elms.edulystventures.com/portfolio/${certificate.image_name}`} className='border-none outline-none' />
                                                }
                                                {
                                                    certificate?.image_name && getFileType(certificate?.image_name) !== 'pdf' && <img src={`https://elms.edulystventures.com/portfolio/${certificate.image_name}`} alt={certificate.title} className='w-full h-40 object-cover' />
                                                }
                                                <div className='absolute -top-1 right-0 bg-black bg-opacity-50 p-2 w-full h-full flex justify-end'>
                                                    <div className='flex gap-2'>
                                                        <Button variant='destructive' onClick={() => deleteActivityHandler(certificate?.id)}>
                                                            <Trash />
                                                        </Button>
                                                        <Button variant='outline'>
                                                            <Expand />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className='p-2'>
                                                <h3 className='capitalize text-lg'>{certificate.title}</h3>
                                                <p>{certificate.institute}</p>
                                                <p>{certificate.start_date} - {certificate.end_date || ''}</p>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                                {
                                    portfolio?.Certificate?.length === 0 && <p>No certificate found</p>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="skill">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Skills</h2>
                                <Button className='text-white' variant='default' onClick={() => setShowSkillDialog(true)}>Add</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <TooltipProvider>
                                {
                                    portfolio?.skill?.map((skill, index) => (
                                        <Tooltip key={index}>
                                            <TooltipTrigger>
                                                <Badge className='mr-2 mb-3 text-white'>{skill.name}
                                                    <span className='ml-2 text-xs text-white'>{skill.self_proficiency}</span>
                                                    <span className='ml-2 text-xs text-white' onClick={() => removeUserSkill(skill?.id)}>
                                                        <X size={20} />
                                                    </span>
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent className='w-[300px]'>
                                                <div>
                                                    <h6>{skill.name}</h6>
                                                    <p>{skill.description}</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))
                                }
                            </TooltipProvider>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="publication">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Publications</h2>
                                <Button className='text-white' variant='default' onClick={() => setShowPublicationDialog(true)}>Add</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='gap-2 grid grid-cols-2 md:grid-cols-2'>
                                {
                                    portfolio?.Publication?.map((publication, index) => (
                                        <Card key={index}>
                                            <CardHeader className='p-4'>
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex items-center'>
                                                        <div className='ml-3'>
                                                            <h6>{publication?.title}</h6>
                                                            <p>{publication.institute} || <span className='font-semibold text-gray-400'>{publication?.start_date
                                                                ? new Date(publication?.start_date + "-01").toLocaleString('en-US', { month: 'long', year: 'numeric' })
                                                                : ""}</span></p>
                                                

                                                        </div>
                                                    </div>
                                                    <Button variant='destructive' onClick={() => deleteActivityHandler(publication?.id)}>
                                                        <Trash />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            
                                        </Card>
                                    ))
                                }
                                {
                                    portfolio?.Publication?.length === 0 && <p>No publication found</p>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="extra">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Extra Activities</h2>
                                <Button className='text-white' variant='default' onClick={() => setShowEXtraDialog(true)}>Add</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                {
                                    portfolio?.Extra?.map((extra, index) => (
                                        <Card key={index}>
                                            <CardContent>
                                                <div className='flex justify-between items-center py-3'>
                                                    <div className='flex items-center'>
                                                        <div>
                                                            <h6>{extra.title}</h6>
                                                            <span className='mt-2'>{extra?.start_date ? new Date(extra?.start_date + "-01").toLocaleString('en-US', { month: 'long', year: 'numeric' })
                                                                : ""} - {extra?.end_date ? new Date(extra?.end_date + "-01").toLocaleString('en-US', { month: 'long', year: 'numeric' })
                                                                : ""}</span> 
                                                            <p className='text-gray-500 mt-1'>{extra.institute} || {extra.location} </p>
                                                            
                                                        </div>
                                                    </div>
                                                    <Button variant='destructive' onClick={() => deleteActivityHandler(extra?.id)}>
                                                        <Trash />
                                                    </Button>
                                                </div>
                                                <p>{extra.description}</p>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                                {
                                    portfolio?.Extra?.length === 0 && <p>No extra activity found</p>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="project">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Projects</h2>
                                <Button className='text-white' variant='default' onClick={() => setShowProjectDialog(true)}>Add</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                {
                                    portfolio?.Project && portfolio?.Project?.map((project, index) => (
                                        <Card key={index}>
                                            <CardHeader className='p-0 rounded-t-lg overflow-hidden'>
                                                <div className='bg-gray-100'>
                                                    {
                                                        project?.image_name && getFileType(project?.image_name) === 'pdf' && <embed src={`https://elms.edulystventures.com/portfolio/${project.image_name}`} className='border-none outline-none' />
                                                    }
                                                    {
                                                        project?.image_name && getFileType(project?.image_name) !== 'pdf' && <img src={`https://elms.edulystventures.com/portfolio/${project.image_name}`} alt={project.title} className='w-full h-40 object-cover' />
                                                    }
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className='flex justify-between items-center py-3'>
                                                    <div className='flex items-center'>
                                                        <div>
                                                            <h6>{project.title}</h6>
                                                            <p>{project.institute}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant='destructive' onClick={() => deleteActivityHandler(project?.id)}>
                                                        <Trash />
                                                    </Button>
                                                </div>
                                                <p>{project.description}</p>
                                                <p className='text-gray-400 mt-2'>{project.start_date} - {project.end_date || 'Present'}</p>
                                            </CardContent>
                                            <CardFooter>
                                                {project?.action && <div className="flex space-x-4">
                                                    <a href={project?.action} className="text-indigo-600 hover:text-indigo-700 flex items-center" target="_blank" rel="noreferrer">
                                                        <Link2 size={20} className="mr-2" />
                                                        <span>View Project</span>
                                                    </a>
                                                </div>}
                                            </CardFooter>
                                        </Card>
                                    ))
                                }
                                {
                                    portfolio?.Project && portfolio?.Project.length === 0 && <p>No project found</p>
                                }
                                {
                                    !portfolio?.Project && <p>No project found</p>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="resume">
                    <Card>
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-lg font-semibold'>Resumes</h2>
                                <Button className='text-white' variant='default' onClick={() => setAddResumeDialog(true)}>Upload Resume</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* resume -> url,id */}
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                {
                                    portfolio?.resume?.map((resume, index) => (
                                        <Card key={index}>
                                            <CardHeader className='p-0 rounded-t-lg overflow-hidden'>
                                                <div className='bg-gray-100'>
                                                    {
                                                        resume?.url && getFileType(resume?.url) === 'pdf' && <embed src={resume.url} className='border-none outline-none w-full' />
                                                    }
                                                </div>
                                            </CardHeader>
                                            <CardFooter>
                                                {resume?.url && <div className="flex space-x-4 pt-2">
                                                    <a href={resume?.url} className="text-indigo-600 hover:text-indigo-700 flex items-center" target="_blank" rel="noreferrer">
                                                        <Link2 size={20} className="mr-2" />
                                                        <span>View Resume</span>
                                                    </a>
                                                </div>}
                                            </CardFooter>
                                        </Card>
                                    ))
                                }
                                {
                                    portfolio?.resume && portfolio?.resume.length === 0 && <p>No resume found</p>
                                }
                                {
                                    !portfolio?.resume && <p>No resume found</p>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="video-resumes">
                    <VideoResumes videoResumes={portfolio?.video_resume ?? []} />
                </TabsContent>
            </Tabs>
            <Education show={showEducationDialog} onClose={setShowEducationDialog} onSuccess={fetchUserPortfolio} />
            <Certificate show={showCertificateDialog} onClose={setShowCertificateDialog} onSuccess={fetchUserPortfolio} />
            <Publication show={showPublicationDialog} onClose={setShowPublicationDialog} onSuccess={fetchUserPortfolio} />
            <ExtraActivity show={showEXtraDialog} onClose={setShowEXtraDialog} onSuccess={fetchUserPortfolio} />
            <Skill show={showSkillDialog} onClose={setShowSkillDialog} onSuccess={fetchUserPortfolio} />
            <Project show={showProjectDialog} onClose={setShowProjectDialog} onSuccess={fetchUserPortfolio} />
            <SocialMedia socialMedia={portfolio && portfolio?.portfolio_social && portfolio?.portfolio_social[0]} show={showSocialMediaDialog} onClose={setShowSocialMediaDialog} onSuccess={fetchUserPortfolio} />
            <PersonalInfo portfolio={portfolio && portfolio?.portfolio_profile && portfolio?.portfolio_profile?.length !== 0 ? portfolio?.portfolio_profile[0] : null} show={showPersonalInfoDialog} onClose={setShowPersonalInfoDialog} onSuccess={fetchUserPortfolio} />
            <AddResume show={addResumeDialog} onClose={setAddResumeDialog} onSuccess={fetchUserPortfolio} />
        </div>
    )
}

export default memo(index);