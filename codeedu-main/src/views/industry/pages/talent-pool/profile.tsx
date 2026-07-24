import React, { useEffect } from 'react'
import { usePortfolioDetailsStore } from '@/store/portfolio/PortfolioStore'
import Loading from '@/components/shared/Loading';
import { Link2, MapPin, Phone, Twitter, BookA, Eye } from 'lucide-react';
import { getFileType } from '@/utils/getFileType';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BiEnvelope } from 'react-icons/bi';
import { FaFacebook } from 'react-icons/fa6';
import { BsInstagram, BsLinkedin } from 'react-icons/bs';
import deafultprofile from '@/assets/images/defaultprofile.jpg';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { toast } from 'sonner';
import maskEmail from '@/utils/maskEmail';
import { Button } from '@/components/ui/ShadcnButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useResumeMatchingJobs } from '../../hooks/useResumeMatchingJobs';
import Jobs from '../jobs/otherJobs';

function Portfolio() {

    const { id } = useParams();
    const navigate = useNavigate();


    const { portfolio, loading, error, fetchPortfolioDetails } = usePortfolioDetailsStore();

    useEffect(() => {
        if (!id) {
            toast.error("User Profile not found, Something went wrong.");
            navigate(-1);
            return;
        }
        fetchPortfolioDetails(id);
    }, [fetchPortfolioDetails, id, navigate]);

    const { data: jobs } = useResumeMatchingJobs(id as string);


    if (loading) {
        return <Loading loading={loading} />
    }




    if (!portfolio || error) {
        return (
            <div className="flex flex-col w-full min-h-screen gap-6">

                {/* Portfolio Not Found Card (Top, Full Width) */}
                <div className="w-full flex justify-center">
                    <div className="bg-card rounded-lg shadow p-8 w-full">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Portfolio Not Found
                        </h2>
                        <p className="text-gray-600">
                            The portfolio you are looking for does not exist.
                        </p>
                        <Link
                            to="/dashboard"
                            className="mt-4 inline-block text-indigo-600 hover:text-indigo-700"
                        >
                            Go Back to Dashboard
                        </Link>
                    </div>
                </div>

                {/* Jobs Section (Bottom, Full Width) */}
                <div className="w-full">
                    <Jobs />
                </div>

            </div>
        );
    }


    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig


    return (
        <>
            <div className="min-h-screen">
                <div
                    className="relative h-64 bg-cover bg-center rounded-t overflow-hidden"
                    style={{
                        backgroundImage: portfolio?.banner?.length ? `url('${portfolio.banner[0].url}')` : `url('https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/portfolio.jpg')`,
                    }}
                >
                    <div className="absolute inset-0 bg-indigo-900 bg-opacity-60"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                    <div className="bg-white rounded-lg shadow border p-8">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="relative cursor-pointer border-2 border-primary rounded-full">
                                <img
                                    src={
                                        portfolio?.image ? portfolio?.image : deafultprofile
                                    }
                                    alt="Profile"
                                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                                    onError={(e) => {
                                        e.currentTarget.src = deafultprofile;
                                    }}
                                />
                            </div>
                            {
                                Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length !== 0 ?
                                    (
                                        <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
                                            <h1 className="text-3xl font-bold text-gray-900">
                                                {portfolio?.portfolio_profile[0]?.name ?? ''} {portfolio?.portfolio_profile[0]?.lastName ?? ''}
                                            </h1>
                                            {
                                                Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length !== 0 && <div className='flex'>
                                                    <p className="text-gray-600">
                                                        {portfolio?.portfolio_profile[0]?.email
                                                            ? maskEmail(portfolio.portfolio_profile[0].email as string)
                                                            : ''}
                                                    </p>,&nbsp; <p className="text-gray-600">
                                                        {portfolio?.portfolio_profile[0]?.phone
                                                            ? (portfolio.portfolio_profile[0].phone as string).replace(
                                                                /^(.)(.*)(.{2})$/,
                                                                (_: string, first: string, middle: string, last: string) =>
                                                                    first + '*'.repeat(middle.length) + last
                                                            )
                                                            : ''}</p></div>
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
                                    ) :
                                    (
                                        <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
                                            <h1 className="text-3xl font-bold text-gray-900">
                                                {portfolio?.name ?? ''}
                                            </h1>
                                        </div>
                                    )
                            }
                            {
                                Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length == 0 &&
                                <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {portfolio?.portfolio_profile[0]?.name}
                                    </h1>
                                </div>
                            }
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
                                                    {portfolio?.portfolio_profile[0]?.email
                                                        ? maskEmail(portfolio.portfolio_profile[0].email as string)
                                                        : ''}
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
                                                <span className="text-gray-600">
                                                    {portfolio?.portfolio_profile[0]?.phone
                                                        ? (portfolio.portfolio_profile[0].phone as string).replace(
                                                            /^(.)(.*)(.{2})$/,
                                                            (_: string, first: string, middle: string, last: string) =>
                                                                first + '*'.repeat(middle.length) + last
                                                        )
                                                        : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length === 0 && <p className="text-gray-600">
                                    No information has been added to this profile.
                                </p>
                            }
                        </div>
                        {
                            portfolio?.skill && portfolio?.skill.length > 0 &&
                            <div className="bg-white rounded-lg shadow border p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <Card>
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
                                    </div>
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
                                                <div className="flex items-start">
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
                                    {
                                        portfolio?.Education?.sort((a, b) => {
                                            const dateA = new Date(a?.end_date || a?.start_date || "1970-01-01").getTime();
                                            const dateB = new Date(b?.end_date || b?.start_date || "1970-01-01").getTime();
                                            return dateB - dateA;
                                        }).map((education, index) => (
                                            <div key={`edu` + index} className="bg-white p-6 rounded-lg border border-gray-200" >
                                                <div className="flex items-start">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${education?.title}&background=random&color=fff`}
                                                        alt="University Logo"
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                    <div className="ml-4">
                                                        <h3 className="text-xl font-semibold text-gray-900">{education?.title}</h3>
                                                        <p className="text-gray-600">{education?.institute}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {
                                                                new Date(education?.start_date + "-01").toLocaleString('en-US', {
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })
                                                            } - {
                                                                education?.end_date ? new Date(education?.end_date + "-01").toLocaleString('en-US', {
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                }) : "Present"
                                                            }

                                                            • {education?.location}
                                                        </p>
                                                        <p className="mt-2 text-gray-600">
                                                            {education?.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
                                            <div className="flex justify-between items-center w-full">
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
                    <div className="bg-white rounded-lg border shadow-sm overflow-auto mt-5" id="matches">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">Job Matches</h2>
                            <Link to="/industry/jobs">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="!rounded-button whitespace-nowrap cursor-pointer"
                                >
                                    View All Jobs
                                </Button>
                            </Link>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">Sr. no.</TableHead>
                                    <TableHead className="text-center">Job Title</TableHead>
                                    <TableHead className="text-center">Posted Date</TableHead>
                                    <TableHead className="text-center">Location</TableHead>
                                    <TableHead className="text-center">Resume Match</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.isArray(jobs) && jobs?.map((job, index) => (
                                    <TableRow key={index} className="hover:bg-gray-50">
                                        <TableCell className="text-gray-500 text-center">{index + 1}</TableCell>
                                        <TableCell className="text-center font-medium">{job.designation}</TableCell>
                                        <TableCell className="text-center font-medium">{job.job_posted_date_time}</TableCell>
                                        <TableCell className="text-center font-medium">{job.location ?? '-'}</TableCell>
                                        <TableCell className="text-center font-medium">{job.resume_matches}</TableCell>
                                        <TableCell className="text-center justify-end flex gap-1">
                                            <Link to={`/jobs/details/${job.gulfjob_id}`}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="!rounded-button whitespace-nowrap cursor-pointer"
                                                >
                                                    <Eye />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {jobs?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-gray-500">
                                            No job matches found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Portfolio