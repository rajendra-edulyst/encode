import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ChartConfig
} from "@/components/ui/chart"
import { Link2, MapPin, Pencil, Phone, PlayCircle, Twitter, BookA, FileDown, EyeIcon, Copy } from 'lucide-react';
import { BiEnvelope } from 'react-icons/bi';
import { BsInstagram, BsLinkedin } from 'react-icons/bs';
import { FaFacebook } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { usePortfolioStore } from '@/store/learner/portfolioStore';
import { addBanner, userPortfolio } from '@/services/learner/PortfolioService';
import Loading from '@/components/shared/Loading';
import deafultprofile from '@/assets/images/defaultprofile.jpg';
import { useAuth } from '@/auth';
import { getFileType } from '@/utils/getFileType';
import Export from '../profile/export';
import { Button } from '@/components/ui/ShadcnButton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VideoResume } from '@/@types/learner/portfolio';
import QRCode from "react-qr-code";
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { toast } from 'sonner';
import SkillGraph from '../profile/builder/SkillGraph';

const Portfolio: React.FC = () => {

    const { user } = useAuth()

    const { setPortfolio, portfolio, setError, loading, setLoading } = usePortfolioStore();
    const [showVideoResumeDialog, setShowVideoResumeDialog] = useState(false);
    const [videoResume, setVideoResume] = useState<VideoResume | null>(null);
    const [exportDailog, setExportDialog] = React.useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [bannerFile, setBannerFile] = useState<string | null>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

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

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            const formData = new FormData();
            formData.append("file", selectedFile);
            addBanner(formData).then(res => {
                console.log(res);
                const blobUrl = URL.createObjectURL(selectedFile);
                // genrate blob and append to portfolio
                setBannerFile(blobUrl);
            }).catch(err => {
                console.log(err);
            });
        }
    };

    const videoResumePreview = () => {
        const video = portfolio?.video_resume?.[0];

        if (!video) return;

        for (const [key, value] of Object.entries(video)) {
            if (key !== 'id' && value?.type === 'primary') {
                setVideoResume(value);
                setShowVideoResumeDialog(true);
                break;
            }
        }
    };


    // const handleImageClick = (url: string) => {
    //     window.open(`https://elms.edulystventures.com/portfolio/${url}`, '_blank');
    // }


    if (loading) return <Loading loading={loading} />

    return (
        <>
            <div className="min-h-screen">
                <div
                    className="relative h-64 bg-cover bg-center rounded-t overflow-hidden"
                    style={{
                        backgroundImage: bannerFile
                            ? `url('${bannerFile}')`
                            : portfolio?.banner?.length
                                ? `url('${portfolio.banner[0].url}')`
                                : `url('https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/T9ESuNGr112VOQoFZdGxNmhgQPu7fmHCtnwgqshp.jpg')`,
                    }}

                >
                    {/* <Button
                        size="icon"
                        variant="default"
                        className='absolute top-4 right-4 bg-white'
                        onClick={handleButtonClick}
                    >
                        <Pencil />
                    </Button> */}
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                    <div className='absolute top-4 right-4 space-x-4 flex items-center z-10'>
                        <Button asChild variant="outline" size="icon" className='bg-white' >
                            <Link to="/portfolio/edit"><Pencil size={20} /></Link>
                        </Button>
                        <Button asChild variant="outline" className='bg-white'>
                            <Link to="/portfolio/edit?tab=resume">Resume</Link>
                        </Button>
                        {Array.isArray(portfolio.portfolio_profile) && portfolio.portfolio_profile.length !== 0 && <Button variant="outline" size="icon" className='bg-white' onClick={() => setExportDialog(true)}>
                            <span><FileDown /></span>
                        </Button>}
                        <Button
                            variant="outline"
                            size="icon"
                            className="bg-white"
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/user-profile/${user.id}`);
                                toast.success('Link copied to clipboard');
                            }}
                        >
                            <Copy />
                        </Button>

                    </div>
                    <input ref={fileInputRef} type="file" className='absolute top-4 right-4 hidden'
                        onChange={handleFileChange} />

                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                    <div className="bg-white rounded-lg shadow border p-8 relative">
                        <div className="flex flex-col md:flex-row justify-between w-full items-center">
                            <div className='flex-col flex md:flex-row items-center w-full'>
                                <div className="relative cursor-pointer rounded-full w-40 h-40 border-4 outline outline-primary outline-offset-2 border-white shadow-lg" onClick={videoResumePreview}>
                                    <img
                                        src={
                                            portfolio?.image
                                                ? portfolio?.image?.replace("/https:", "https:")
                                                : deafultprofile
                                        }
                                        alt="Profile"
                                        className=" object-cover rounded-full w-full h-full"
                                    />
                                    <div className="flex items-center justify-center absolute bottom-1 right-4 bg-white w-6 h-6 rounded-full border-2 border-white">
                                        <PlayCircle className='text-primary' size={20} />
                                    </div>
                                </div>
                                {
                                    Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length !== 0 &&
                                    <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {portfolio?.portfolio_profile[0]?.name ?? ''} {portfolio?.portfolio_profile[0]?.lastName ?? ''}
                                        </h1>
                                        {
                                            Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length !== 0 && <div className='flex'>
                                                <p className="text-gray-600">{portfolio?.portfolio_profile[0]?.email}</p>,&nbsp; <p className="text-gray-600">{portfolio?.portfolio_profile[0]?.phone}</p></div>
                                        }
                                        <p className="text-gray-600">
                                            {portfolio?.portfolio_profile[0]?.state}, {portfolio?.portfolio_profile[0]?.country}
                                        </p>
                                        {
                                            Array.isArray(portfolio?.portfolio_social) && portfolio?.portfolio_social.length !== 0 && <div className="mt-4 flex space-x-4 justify-center md:justify-start">
                                                {
                                                    portfolio?.portfolio_social[0]?.linkedin &&
                                                    <a href={portfolio?.portfolio_social[0]?.linkedin} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-indigo-600 text-xl">
                                                        <BsLinkedin />
                                                    </a>
                                                }
                                                {
                                                    portfolio?.portfolio_social[0]?.insta &&
                                                    <a href={portfolio?.portfolio_social[0]?.insta} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-indigo-600 text-xl">
                                                        <BsInstagram />
                                                    </a>
                                                }
                                                {
                                                    portfolio?.portfolio_social[0]?.twitter &&
                                                    <a href={portfolio?.portfolio_social[0]?.twitter} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-indigo-600 text-xl">
                                                        <Twitter />
                                                    </a>
                                                }
                                                {
                                                    portfolio?.portfolio_social[0]?.facebook &&
                                                    <a href={portfolio?.portfolio_social[0]?.facebook} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-indigo-600 text-xl">
                                                        <FaFacebook />
                                                    </a>
                                                }
                                            </div>
                                        }
                                    </div>
                                }
                                {
                                    Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length == 0 &&
                                    <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {user.name}
                                        </h1>
                                    </div>
                                }

                            </div>

                            <div className="mt-4 md:mt-0 flex justify-between flex-col gap-2">
                                <div className='flex flex-col items-center gap-4'>


                                </div>

                                {/* verified badge */}
                                {
                                    portfolio?.name && (
                                        <div>
                                            <div className='text-white bg-green-500 rounded-full px-2 py-1 gap-2 flex '>
                                                <RiVerifiedBadgeFill size={20} />  Verified
                                            </div>
                                        </div>
                                    )
                                }

                                <div className='flex justify-end'>
                                    <QRCode value={`${window.location.origin}/user-profile/${user.id}`} size={90} className="hidden md:block" />
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* Content Sections */}
                    <div className="mt-8 space-y-8">
                        <div className="bg-white rounded-lg shadow border p-8">
                            {
                                Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length !== 0 &&
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">About Me</h3>
                                        <p className="mt-2 text-gray-600">
                                            {
                                                portfolio?.portfolio_profile[0]?.about_me
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2">
                                                <BiEnvelope size={20} className="text-gray-400" />
                                                <span className="text-gray-600">
                                                    {portfolio?.portfolio_profile[0]?.email}
                                                </span>
                                            </div>
                                            {
                                                portfolio?.portfolio_profile.length !== 0 &&
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="text-gray-400" />
                                                    <span className="text-gray-600">
                                                        {
                                                            portfolio?.portfolio_profile[0]?.city
                                                        },&nbsp;
                                                        {
                                                            portfolio?.portfolio_profile[0]?.state
                                                        },&nbsp;
                                                        {
                                                            portfolio?.portfolio_profile[0]?.country
                                                        }
                                                    </span>
                                                </div>
                                            }
                                            <div className="flex items-center space-x-2">
                                                <Phone className="text-gray-400" />
                                                <span className="text-gray-600">+91 9876543210</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length === 0 && <p className="text-gray-600">
                                    No data found. Please update your profile.
                                </p>
                            }
                        </div>

                        {
                            portfolio?.skill && portfolio?.skill.length > 0 &&
                            <div className="bg-white rounded-lg shadow border p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
                                <div>
                                    {/* <Card>
                                        <CardHeader className="items-center">
                                            <CardTitle>Skills Overview</CardTitle>
                                            <CardDescription>
                                                A summary of my technical skills and proficiencies.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pb-0">
                                            <ChartContainer
                                                config={chartConfig}
                                                className="h-60"
                                            >
                                                <RadarChart data={portfolio?.skill ?? []}>
                                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                    <PolarAngleAxis dataKey="name" />
                                                    <PolarGrid />
                                                    <Radar
                                                        dataKey="self_proficiency"
                                                        fill="var(--color-desktop)"
                                                        fillOpacity={0.6}
                                                        dot={{
                                                            r: 4,
                                                            fillOpacity: 1,
                                                        }}
                                                    />
                                                </RadarChart>
                                            </ChartContainer>
                                        </CardContent>
                                    </Card>
                                    <div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {portfolio?.skill?.map((skill) => (
                                                <div key={skill?.name} className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium text-gray-700">{skill?.name}</span>
                                                        <span className="text-indigo-600">{skill?.self_proficiency}%</span>
                                                    </div>
                                                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                                                        <div
                                                            className="h-2 bg-primary rounded-full"
                                                            style={{ width: `${skill?.self_proficiency}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div> */}
                                    <SkillGraph portfolio={portfolio} fetchUserPortfolio={fetchUserPortfolio} />
                                </div>
                            </div>
                        }


                        {
                            portfolio?.Experience && portfolio?.Experience.length > 0 &&
                            <div className="bg-white rounded-lg shadow border p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
                                <div className="space-y-6">
                                    {
                                        portfolio?.Experience?.sort((a, b) => {
                                            const dateA = new Date(a?.end_date || a?.start_date || "1970-01-01").getTime();
                                            const dateB = new Date(b?.end_date || b?.start_date || "1970-01-01").getTime();
                                            return dateB - dateA;
                                        }).map((experience, index) => (
                                            <div
                                                key={`exp` + index}
                                                className="bg-white p-6 rounded-lg border border-gray-200">
                                                <div className="flex md:flex-row flex-col items-center md:items-start space-y-4 md:space-y-0 justify-center">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${experience?.title}&background=random&color=fff`}
                                                        alt="Company Logo"
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                    <div className="ml-4">
                                                        <h3 className="text-xl font-semibold text-gray-900">{experience?.title}</h3>
                                                        <p className="text-gray-600">
                                                            {experience?.institute}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {
                                                                new Date(experience?.start_date + "-01").toLocaleString('en-US', {
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })
                                                            }
                                                            - {
                                                                experience?.end_date ? new Date(experience?.end_date + "-01").toLocaleString('en-US', {
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                }) : "Present"
                                                            }

                                                            • {experience?.location}
                                                        </p>
                                                        <p className="mt-2 text-gray-600">
                                                            {experience?.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        }

                        {
                            portfolio?.Education && portfolio?.Education.length > 0 &&
                            <div className="bg-white rounded-lg shadow border p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
                                <div className="space-y-6">

                                    <div className="w-full overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Degree/Qualification</th>
                                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center whitespace-nowrap">Field of Study (Institute)</th>
                                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Duration</th>
                                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Grade</th>
                                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Location</th>
                                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {portfolio?.Education?.length === 0 && (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No education found</td>
                                                    </tr>
                                                )}
                                                {portfolio?.Education?.sort((a, b) => {
                                                    const dateA = new Date(a?.end_date || a?.start_date || "1970-01-01").getTime();
                                                    const dateB = new Date(b?.end_date || b?.start_date || "1970-01-01").getTime();
                                                    return dateB - dateA;
                                                }).map((education, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap">{education.employment_type}</td>
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
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">{education.grade}</td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">{education.location}</td>
                                                        <td className="px-6 py-4 space-x-2 flex justify-center align-center whitespace-nowrap">
                                                            {education.image_name ? (
                                                                <Button variant="default" className='text-white' size={'sm'}>
                                                                    <a
                                                                        href={`https://elms.edulystventures.com/portfolio/${education?.image_name ? education.image_name : "#"}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                    >
                                                                        <EyeIcon />
                                                                    </a>
                                                                </Button>
                                                            ) : <span className="text-gray-400">No image</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        }

                        {portfolio?.Publication && portfolio?.Publication.length > 0 &&
                            <div className="bg-white rounded-lg shadow border p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Publications</h2>
                                <div className="space-y-3">
                                    {portfolio.Publication.map((data, idx) => (
                                        <div key={`pub-${idx}`} className="bg-white p-4 border-t border-gray-200 flex flex-col md:flex-row items-start gap-3">
                                            <div className="flex-shrink-0">
                                                <BookA size={56} className="text-gray-500 font-light mt-1" />
                                            </div>
                                            <div className="md:flex justify-between items-center w-full space-y-5 md:space-y-0 md:space-x-4">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">{data.title}</h3>
                                                    <p className="text-gray-600">{data?.institute}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {data?.start_date
                                                            ? new Date(data?.start_date + "-01").toLocaleString('en-US', {
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })
                                                            : ""}
                                                        {data?.study_field && (
                                                            <> • {data?.study_field}</>
                                                        )}
                                                    </p>
                                                </div>


                                                {data?.edit_url_professional && (
                                                    <a
                                                        href={data?.edit_url_professional}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="border px-4 py-2 border-black hover:bg-primary hover:text-white hover:border-primary cursor-pointer rounded-3xl w-fit h-fit flex items-center"
                                                    >
                                                        View Publication
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }

                        {portfolio?.Extra && portfolio?.Extra.length > 0 &&
                            <div className="bg-white rounded-lg shadow border p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Extra Activity</h2>
                                <div className="space-y-6">
                                    {
                                        portfolio?.Extra?.sort((a, b) => {
                                            const dateA = new Date(a?.end_date || a?.start_date || "1970-01-01").getTime();
                                            const dateB = new Date(b?.end_date || b?.start_date || "1970-01-01").getTime();
                                            return dateB - dateA;
                                        }).map((Extra, index) => (
                                            <div key={`Extra-${index}`} className="bg-white p-6 border rounded-lg border-gray-200 flex flex-col md:flex-row items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${Extra?.title}&background=random&color=fff`}
                                                        alt="Company Logo"
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center w-full">
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-900">{Extra?.title}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            {Extra?.institute && (

                                                                <>{Extra?.institute} • </>
                                                            )}
                                                            {Extra?.start_date
                                                                ? new Date(Extra?.start_date + "-01").toLocaleString('en-US', {
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })
                                                                : ""}
                                                            {Extra?.location && (
                                                                <> • {Extra?.location}</>
                                                            )}
                                                        </p>

                                                        <p className='text-gray-600 line-clamp-1'>{Extra?.description && Extra?.description}</p>
                                                    </div>


                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                        }

                        {portfolio?.Project && portfolio?.Project.length > 0 &&
                            <div className="bg-white rounded-lg shadow border p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {
                                        portfolio?.Project && portfolio?.Project?.map((project, index) => (
                                            <div key={`project-${index}`} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                {
                                                    project?.image_name && getFileType(project?.image_name) === 'pdf' && <embed src={`https://elms.edulystventures.com/portfolio/${project.image_name}`} className='border-none outline-none' />
                                                }
                                                {
                                                    project?.image_name && getFileType(project?.image_name) !== 'pdf' && <img src={`https://elms.edulystventures.com/portfolio/${project.image_name}`} alt={project.title} className='w-full h-40 object-cover' />
                                                }
                                                <div className="p-6">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {
                                                            project?.title
                                                        }
                                                    </h3>
                                                    <p className="mt-2 text-gray-600">
                                                        {
                                                            project.description
                                                        }
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {
                                                            new Date(project?.start_date + "-01").toLocaleString('en-US', {
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })
                                                        } - {
                                                            project?.end_date ? new Date(project?.end_date + "-01").toLocaleString('en-US', {
                                                                month: 'long',
                                                                year: 'numeric'
                                                            }) : "Present"
                                                        }
                                                        • {project?.location}
                                                    </p>
                                                    {project?.action && <div className="mt-4 flex space-x-4">
                                                        <a href={project?.action} className="text-indigo-600 hover:text-indigo-700 flex items-center" target="_blank" rel="noreferrer">
                                                            <Link2 size={20} className="mr-2" />
                                                            <span>View Project</span>
                                                        </a>
                                                    </div>}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </div>
            {
                Array.isArray(portfolio.portfolio_profile) && portfolio.portfolio_profile.length !== 0 && <Export show={exportDailog} setShow={() => setExportDialog(false)} portfolio={portfolio} />
            }

            <Dialog open={showVideoResumeDialog} onOpenChange={setShowVideoResumeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Video Resume</DialogTitle>
                        <DialogDescription>
                            {videoResume?.video_title}
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex items-center justify-center w-full h-full'>
                        <video controls className='w-full h-96 rounded-md'>
                            <source src={videoResume?.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default Portfolio