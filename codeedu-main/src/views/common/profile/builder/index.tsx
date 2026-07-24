import React, { memo, useCallback, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PersonalInfo from './PersonalInfo'
import Education from './Education'
import { Button } from '@/components/ui/ShadcnButton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { usePortfolioStore } from '@/store/learner/portfolioStore';
import { userPortfolio, fetchUpdateImage, deleteActivity } from '@/services/learner/PortfolioService';
import Certificate from './Certificate';
import Project from './Project';
import Skill from './Skill';
import Publication from './Publication';
import ExtraActivity from './ExtraActivity';
import { getFileType } from "@/utils/getFileType";
import { useAuth } from '@/auth';
import deafultprofile from '@/assets/images/defaultprofile.jpg';
import { useSessionUser } from '@/store/authStore';
import { ChevronDown, Dribbble, Eye, EyeIcon, FileText, Globe, Instagram, Link2, Trash, X } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { Link, useSearchParams } from 'react-router-dom';
import SocialMedia from './SocialMedia';
import AddResume from './AddResume';
import Experience from './experience';
import VideoResumes from './video-resume';
import SkillGraph from './SkillGraph';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function index() {

    const { user } = useAuth()

    const [searchParams] = useSearchParams();

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

    // const removeUserSkill = useCallback(async (id?: number) => {
    //     if (!id) {
    //         toast.error('Something went wrong, please try again');
    //         return;
    //     }
    //     setLoading(true);
    //     setError("");
    //     try {
    //         await deleteUserSkill(id);
    //         fetchUserPortfolio();
    //         toast.success('Skill removed successfully');
    //     } catch (error) {
    //         setError("Failed to delete skill");
    //         toast.error('Failed to delete skill');
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [fetchUserPortfolio, setLoading, setError]);

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

        const confirm = window.confirm('Are you sure you want to delete your profile image?');
        if (!confirm) return;
        setLoading(true);
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
        }).finally(() => {
            setLoading(false);
        });
    };


    useEffect(() => {
        const initialTab = searchParams.get('tab') || 'personal';
        console.log('Initial Tab:', initialTab);
        setTab(initialTab);
    }, [searchParams]);

    if (loading) return <Loading loading={loading} />
    if (error) return <Alert title={error} type='danger' />

    return (
        <div className="max-w-full">
            <Tabs defaultValue="personal" value={tab} onValueChange={setTab}>
                <div className='flex justify-between gap-4'>
                    <div className='overflow-auto' style={{
                        scrollbarColor: '#00a8e9 #e5e7eb',
                        scrollbarWidth: 'thin',
                    }}>
                        <div className='block 2xl:hidden'>
                            <DropdownMenu>
                                <DropdownMenuTrigger className='w-full'>
                                    <Button variant="outline" className='w-full text-left'>
                                        {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}  <ChevronDown size={20} className='ml-2' />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-48'>
                                    <DropdownMenuLabel>Portfolio Sections</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setTab('personal')}>Personal Information</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTab('resume')}>Resume Upload</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTab('education')}>Education</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTab('skill')}>Skills</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTab('experience')}>Experience</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTab('project')}>Projects</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTab('certificate')}>Certificate</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTab('publication')}>Publications</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTab('extra')}>Extra Activity</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTab('socialmedia')}>Social Media</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTab('video-resumes')}>Video Resumes</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <TabsList
                            className='bg-white overflow-x-auto hidden 2xl:block'
                        >
                            <div className="flex custom-scrollbar">
                                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                                <TabsTrigger value="socialmedia">Social Media</TabsTrigger>
                                <TabsTrigger value="education">Education</TabsTrigger>
                                <TabsTrigger value="experience">Experience</TabsTrigger>
                                <TabsTrigger value="project">Projects</TabsTrigger>
                                <TabsTrigger value="certificate">Certificate</TabsTrigger>
                                <TabsTrigger value="publication">Publications</TabsTrigger>
                                <TabsTrigger value="extra">Extra Activity</TabsTrigger>
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
                        <CardContent className='overflow-x-auto'>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree/Qualification</th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Field of Study (Institute)</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {portfolio?.Education?.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No education found</td>
                                        </tr>
                                    )}
                                    {portfolio?.Education?.map((education, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {education.employment_type ?? '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm flex flex-col text-center whitespace-nowrap">
                                                <p>{education.study_field}</p>
                                                <p className='text-gray-400'>({education.institute})</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-gray-400">
                                                {education.start_date
                                                    ? new Date(education.start_date + "-01").toLocaleString('en-GB', { month: '2-digit', year: 'numeric' })
                                                    : ""}
                                                {" - "}
                                                {education.end_date
                                                    ? new Date(education.end_date + "-01").toLocaleString('en-GB', { month: '2-digit', year: 'numeric' })
                                                    : ""}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                {education.grade}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                {education.location}
                                            </td>
                                            <td className="px-6 py-4 space-x-2 flex justify-center whitespace-nowrap">
                                                {education.image_name && (
                                                    <Button variant="default" className='text-white' size={'sm'}>
                                                        <a
                                                            href={`https://elms.edulystventures.com/portfolio/${education?.image_name ? education.image_name : "#"}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <EyeIcon />
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button variant="destructive" className='text-white' size={'sm'} onClick={() => deleteActivityHandler(education?.id)}>
                                                    <Trash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                            <div className="w-full overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Institute</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Duration</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Image</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {(!portfolio?.Certificate || portfolio?.Certificate.length === 0) && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No certificate found</td>
                                            </tr>
                                        )}
                                        {portfolio?.Certificate?.map((certificate, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap capitalize">{certificate.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{certificate.institute}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-400">
                                                    {certificate.start_date} - {certificate.end_date || ''}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {certificate?.image_name && getFileType(certificate?.image_name) === 'pdf' ? (
                                                        <a href={`https://elms.edulystventures.com/portfolio/${certificate.image_name}`} target="_blank" rel="noreferrer" className="inline-block">
                                                            <embed src={`https://elms.edulystventures.com/portfolio/${certificate.image_name}`} className="w-14 h-14 shadow-md rounded-md border outline-none" />
                                                        </a>
                                                    ) : certificate?.image_name ? (
                                                        <a href={`https://elms.edulystventures.com/portfolio/${certificate.image_name}`} target="_blank" rel="noreferrer" className="inline-block">
                                                            <img src={`https://elms.edulystventures.com/portfolio/${certificate.image_name}`} alt={certificate.title} className="w-14 h-14 shadow-md rounded-md border object-cover" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                                                    <Button variant='default' className='text-white' size={'sm'} onClick={() => deleteActivityHandler(certificate?.id)}>
                                                        <Trash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                            <SkillGraph portfolio={portfolio} fetchUserPortfolio={fetchUserPortfolio} type={"edit"} ></SkillGraph>
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
                            <div className="w-full overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Publication Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Publisher</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Publication Date</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {portfolio?.Publication?.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No publication found</td>
                                            </tr>
                                        )}
                                        {portfolio?.Publication?.map((publication, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap">{publication.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{publication.institute}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-400">
                                                    {publication?.start_date
                                                        ? new Date(publication?.start_date + "-01").toLocaleString('en-US', { month: 'long', year: 'numeric' })
                                                        : ""}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap space-x-2 text-center">
                                                    <Button variant='default' className='text-white bg-blue-600' size={'sm'}>
                                                        {publication?.edit_url_professional && (
                                                            <a href={publication?.edit_url_professional} target="_blank" rel="noreferrer">
                                                                <FileText />
                                                            </a>
                                                        )}
                                                    </Button>
                                                    <Button variant='default' className='text-white' size={'sm'} onClick={() => deleteActivityHandler(publication?.id)}>
                                                        <Trash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                            <div className="w-full overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Institute</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Project Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Description</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Duration</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Image</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {(!portfolio?.Project || portfolio?.Project.length === 0) && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No project found</td>
                                            </tr>
                                        )}
                                        {portfolio?.Project?.map((project, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap">{project.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{project.institute}</td>
                                                <td className="px-6 py-4 whitespace-nowrap capitalize">{project.employment_type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate" title={project.description}>{project.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-400">
                                                    {project.start_date} - {project.end_date || 'Present'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {project?.image_name && getFileType(project?.image_name) === 'pdf' ? (
                                                        <a href={`https://elms.edulystventures.com/portfolio/${project.image_name}`} target="_blank" rel="noreferrer" className="inline-block">
                                                            <embed src={`https://elms.edulystventures.com/portfolio/${project.image_name}`} className="w-14 h-14 shadow-md rounded-md border outline-none" />
                                                        </a>
                                                    ) : project?.image_name ? (
                                                        <a href={`https://elms.edulystventures.com/portfolio/${project.image_name}`} target="_blank" rel="noreferrer" className="inline-block">
                                                            <img src={`https://elms.edulystventures.com/portfolio/${project.image_name}`} alt={project.title} className="w-14 h-14 shadow-md rounded-md border object-cover" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                                                    {project?.action && (
                                                        <a href={project?.action} className="text-indigo-600 hover:text-indigo-700 inline-flex items-center" target="_blank" rel="noreferrer">
                                                            <Button variant='default' className='text-white bg-blue-500' size="sm">
                                                                <Link2 size={18} />
                                                            </Button>
                                                        </a>
                                                    )}
                                                    <Button variant='default' className='text-white' size="sm" onClick={() => deleteActivityHandler(project?.id)}>
                                                        <Trash size={18} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                                        resume?.url && <Card key={index}>
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