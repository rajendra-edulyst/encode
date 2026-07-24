import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaCheckCircle, FaLinkedin, FaTwitter, FaExternalLinkAlt } from 'react-icons/fa';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link2, Pencil, EyeIcon, FileDown, Copy, QrCode } from 'lucide-react';
import { BsInstagram } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { usePortfolioStore } from '@/store/learner/portfolioStore';
import { addBanner, userPortfolio } from '@/services/learner/PortfolioService';
import deafultprofile from '@/assets/images/defaultprofile.jpg';
import { useAuth } from '@/auth';
import { getFileType } from '@/utils/getFileType';
import Export from '../../profile/export';
import { Button } from '@/components/ui/ShadcnButton';
import { VideoResume } from '@/@types/learner/portfolio';
import QRCode from "react-qr-code";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import AddResume from '../../profile/builder/AddResume';
import PersonalInfo from '../../profile/builder/PersonalInfo'

type DescriptionWithClampProps = {
    text: string;
    className?: string;
};

const DescriptionWithClamp = ({ text, className = '' }: DescriptionWithClampProps) => {
    const [expanded, setExpanded] = useState(false);

    const charLimit = 80;
    const shouldClamp = text.length > charLimit;
    return (
        <div className={className + ' relative'}>
            {!expanded ? (
                <div className={shouldClamp ? 'line-clamp-1 text-gray-800' : 'text-gray-800'} style={{ fontSize: '1rem' }}>
                    {text}
                    {shouldClamp && (
                        <span
                            className="absolute bottom-0 right-0 bg-white text-gray-500 text-sm pl-1 cursor-pointer hover:underline"
                            onClick={() => setExpanded(true)}
                        >
                            See more
                        </span>
                    )}
                </div>
            ) : (
                <div className="text-gray-800" style={{ fontSize: '1rem' }}>
                    <p>{text}</p>
                    <button
                        className="text-gray-600 hover:underline text-sm mt-2"
                        onClick={() => setExpanded(false)}
                    >
                        See less
                    </button>
                </div>
            )}
        </div>
    );
};



const App = () => {

    const { user } = useAuth()
    const { setPortfolio, portfolio, setError, setLoading } = usePortfolioStore();
    const [videoResume, setVideoResume] = useState<VideoResume | null>(null);
    const [exportDailog, setExportDialog] = React.useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showVideoResumeDialog, setShowVideoResumeDialog] = useState(false);
    const [addResumeDialog, setAddResumeDialog] = useState<boolean>(false);
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


    const [aboutExpanded, setAboutExpanded] = useState(false);
    const [showPersonalInfoDialog, setShowPersonalInfoDialog] = useState<boolean>(false);




    useEffect(() => {
        AOS.init({ once: true, duration: 700, offset: 40 });
    }, []);



    return (
        <div className="bg-gray-100">
            <div className="flex flex-col gap-4">
                <section
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden px-0"
                    data-aos="fade-up"
                >
                    {/* Banner */}
                    <div className="relative w-full aspect-[3/1] bg-cover sm:aspect-[6/1] bg-gray-100 sm:min-h-0"
                        style={{
                            backgroundImage: bannerFile
                                ? `url('${bannerFile}')`
                                : portfolio?.banner?.length
                                    ? `url('${portfolio.banner[0].url}')`
                                    : `url('https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/T9ESuNGr112VOQoFZdGxNmhgQPu7fmHCtnwgqshp.jpg')`,
                        }}
                    >
                        {/* <img
                            src="https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/T9ESuNGr112VOQoFZdGxNmhgQPu7fmHCtnwgqshp.jpg"
                            alt="Profile Banner"
                            
                            className="absolute inset-0 w-full h-full object-cover"
                        /> */}

                        <Button
                            size="icon"
                            variant="default"
                            className='absolute top-4 right-4 bg-white'
                            onClick={handleButtonClick}
                        >
                            <Pencil />
                        </Button>
                        {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}

                        <div className="absolute bottom-0 left-6 translate-y-1/2 flex items-end gap-4">
                            <img
                                src={
                                    portfolio?.image
                                        ? portfolio?.image?.replace("/https:", "https:")
                                        : deafultprofile
                                }
                                alt="Profile"
                                className="w-24 h-24 sm:w-36 sm:h-36 rounded-full border-4 border-white object-cover shadow-md bg-white"
                            />
                        </div>
                    </div>

                    {/* Verified Badge below banner, aligned to pfp */}
                    {/* <div className="flex items-center justify-end pr-6 mt-4">
                        <span className="inline-flex items-center bg-gray-100 text-gray-800 text-sm sm:text-base px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-gray-300 shadow-sm">
                            <FaCheckCircle className="text-blue-500 mr-1 w-4 h-4 sm:w-5 sm:h-5" aria-label="Verified" /> Verified profile
                        </span>
                    </div> */}

                    {/* Profile Info */}
                    <div className="pt-8 sm:pt-12 px-6 relative mt-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            {portfolio?.portfolio_profile && portfolio?.portfolio_profile.length > 0 && (
                                <div>
                                    <h1 className="text-xl sm:text-3xl capitalize font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                                        {portfolio?.portfolio_profile[0]?.name && portfolio?.portfolio_profile[0]?.lastName ? (
                                            <>
                                                {portfolio?.portfolio_profile[0]?.name} {portfolio?.portfolio_profile[0]?.lastName}
                                            </>
                                        ) : (
                                            <>
                                                {portfolio?.name ?? ''}
                                            </>
                                        )}

                                        <FaCheckCircle className="text-blue-500 w-5 h-5" aria-label="Verified" />
                                    </h1>
                                    <p className="text-base sm:text-lg text-gray-700 mt-1 max-w-xl">
                                        {
                                            Array.isArray(portfolio?.portfolio_profile) && portfolio?.portfolio_profile?.length !== 0 && <div className='flex'>
                                                <p className="text-gray-600">{portfolio?.portfolio_profile[0]?.email}</p>
                                                {portfolio?.portfolio_profile[0]?.phone !== null && (
                                                    <>,<p className="text-gray-600">{portfolio?.portfolio_profile[0]?.phone}</p></>
                                                )}
                                            </div>
                                        }
                                        <p className="text-gray-600">
                                            {portfolio?.portfolio_profile[0]?.state}
                                            {portfolio?.portfolio_profile[0]?.country && (
                                                <>
                                                    , {portfolio?.portfolio_profile[0]?.country}
                                                </>
                                            )}
                                        </p>
                                    </p>

                                    {/* Social Icons */}
                                    {Array.isArray(portfolio?.portfolio_social) && portfolio?.portfolio_social.length !== 0 && (
                                        <div className="flex flex-col gap-2 mt-4 sm:mt-3">
                                            <div className="flex space-x-4 text-gray-500 hover:text-gray-700">
                                                {portfolio?.portfolio_social[0]?.insta && (
                                                    <a href={portfolio?.portfolio_social[0]?.insta} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-black transition">
                                                        <BsInstagram className="w-6 h-6" />
                                                    </a>
                                                )}
                                                {portfolio?.portfolio_social[0]?.linkedin && (
                                                    <a href={portfolio?.portfolio_social[0]?.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-600 transition">
                                                        <FaLinkedin className="w-6 h-6" />
                                                    </a>
                                                )}
                                                {portfolio?.portfolio_social[0]?.twitter && (
                                                    <a href={portfolio?.portfolio_social[0]?.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-sky-400 transition">
                                                        <FaTwitter className="w-6 h-6" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )
                                    }
                                </div>
                            )

                            }


                            {portfolio?.portfolio_profile && portfolio?.portfolio_profile.length > 0 && (
                                <div className='flex justify-end'>
                                    <QRCode value={`${window.location.origin}/user-profile/${user.id}`} size={90} className="hidden md:block" />
                                </div>
                            )}

                        </div>
                    </div>

                    <div data-aos="fade-up" className="flex m-4 flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                        <div className="flex-1 flex gap-3 sm:gap-4">
                            <Button
                                asChild
                                variant="outline"
                                className="flex-1 flex items-center justify-center gap-2 font-medium text-base bg-white border-primary hover:border-primary hover:bg-indigo-50 transition"
                            >
                                <Link to="/portfolio/edit">
                                    <Pencil size={20} className="sm:mr-2" />
                                    <span className="hidden sm:inline ">Edit Portfolio</span>
                                </Link>
                            </Button>
                            {/* Export button: only show on sm and up */}
                            <Button
                                asChild
                                variant="outline"
                                className="hidden sm:flex flex-1 items-center justify-center gap-2 font-medium text-base bg-white border-primary hover:border-primary hover:bg-indigo-50 transition"
                                onClick={() => setExportDialog(true)}
                            >
                                <span>
                                    <FileDown className="sm:mr-2" />
                                    <span className="hidden sm:inline">Export</span>
                                </span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 flex items-center justify-center gap-2 font-medium text-base bg-white border-primary hover:border-primary hover:bg-indigo-50 transition"
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/user-profile/${user.id}`);
                                    toast.success('Link copied to clipboard');
                                }}
                            >
                                <Copy className="sm:mr-2" />
                                <span className="hidden sm:inline">Copy Link</span>
                            </Button>
                            {/* Show QR button only on mobile (sm:hidden) */}
                            <Button
                                variant="outline"
                                className="flex-1 flex items-center justify-center gap-2 font-medium text-base bg-white border-primary hover:border-primary hover:bg-indigo-50 transition sm:hidden"
                                onClick={() => setShowVideoResumeDialog(true)}
                            >
                                <QrCode className="w-5 h-5" />
                            </Button>

                            <Button
                                variant="outline"
                                className="flex-1 sm:flex items-center justify-center gap-2 font-medium text-base bg-white border-primary hover:border-primary hover:bg-indigo-50 transition"
                                onClick={() => setAddResumeDialog(true)}
                            >
                                <FileDown className="sm:mr-2" />
                                <span className="hidden sm:inline">
                                    Upload Resume
                                </span>
                            </Button>


                        </div>
                        {/* QR Dialog for mobile */}
                        <Dialog open={showVideoResumeDialog} onOpenChange={setShowVideoResumeDialog}>
                            <DialogContent className="max-w-xs p-6 flex flex-col items-center">
                                <QRCode value={`${window.location.origin}/user-profile/${user.id}`} size={180} />
                                <div className="mt-4 text-center text-gray-700 text-sm">Scan to view profile</div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="absolute top-4 right-4 hidden"
                        onChange={handleFileChange}
                    />
                </section>

                {/* Action Buttons Section - Responsive & prominent like LinkedIn */}


                {portfolio?.resume[0] && portfolio?.resume[0].url.length > 0 && (
                    <section className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6" data-aos="fade-up">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Featured</h2>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-6">
                            <div className="flex-shrink-0 w-full sm:w-fit flex flex-col">
                                <div className="w-full aspect-[8/9] sm:aspect-[4/5] max-w-xs border rounded-lg overflow-hidden bg-gray-50 shadow relative">
                                    <iframe
                                        src={portfolio.resume[0].url}
                                        title="Resume Preview"
                                        className="w-full h-full min-h-[350px] sm:min-h-[400px]"
                                        frameBorder={0}
                                        allow="autoplay; encrypted-media"

                                    />
                                </div>

                            </div>
                            <div className="flex-shrink-0 w-full sm:w-fit flex flex-col">
                                {portfolio?.video_resume && portfolio.video_resume[0] && portfolio.video_resume[0][0]?.url && (
                                    (() => {
                                        const [playing, setPlaying] = React.useState(false);
                                        return (
                                            <div
                                                className="w-full aspect-[16/9] sm:aspect-[16/9] sm:m-1 max-h-[23rem] border rounded-lg overflow-hidden bg-gray-50 shadow group relative cursor-pointer"
                                                onClick={() => setPlaying(true)}
                                            >
                                                {!playing ? (
                                                    <>
                                                        <img
                                                            src={portfolio.video_resume[0][0]?.video_thumbnail || "https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/default-thumbnail.png"}
                                                            alt="Video Resume Thumbnail"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {/* Play Icon on hover */}
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-16 h-16 text-white"
                                                                fill="none"
                                                                viewBox="0 0 48 48"
                                                            >
                                                                <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.5)" />
                                                                <polygon points="20,16 34,24 20,32" fill="white" />
                                                            </svg>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <video
                                                        autoPlay
                                                        controls
                                                        src={portfolio.video_resume[0][0]?.url}
                                                        className="w-full h-full object-cover"
                                                        onClick={e => e.stopPropagation()}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* ========================= */}
                {/* About Section */}
                {/* ========================= */}
                {portfolio?.portfolio_profile[0]?.about_me && portfolio?.portfolio_profile[0]?.about_me.length > 0 && (
                    <section className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6" data-aos="fade-up">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">About</h2>
                            <Pencil className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" aria-label="Edit About" onClick={() => setShowPersonalInfoDialog(true)} />
                        </div>
                        <div className="text-gray-800 leading-relaxed relative">
                            {!aboutExpanded ? (
                                <div className="line-clamp-2 text-gray-600 relative">
                                    {
                                        portfolio?.portfolio_profile[0]?.about_me
                                    }
                                    {
                                        portfolio?.portfolio_profile[0]?.about_me.length > 200 && (
                                            <span className="absolute bottom-0 right-0 bg-white text-gray-500 text-sm pl-1 cursor-pointer hover:underline"
                                                onClick={() => setAboutExpanded(true)}
                                            >
                                                See more
                                            </span>
                                        )
                                    }
                                </div>
                            ) : (
                                <div className="text-gray-600">
                                    <p>{
                                        portfolio?.portfolio_profile[0]?.about_me
                                    }</p>
                                    <button
                                        className="text-gray-600 hover:underline text-sm mt-2"
                                        onClick={() => setAboutExpanded(false)}
                                    >
                                        See less
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                )}



                {/* ========================= */}
                {/* Experience Section */}
                {/* ========================= */}
                {portfolio?.Experience && portfolio?.Experience.length > 0 && (
                    <section className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6" data-aos="fade-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
                            <Pencil className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" aria-label="Edit Experience" />
                        </div>

                        {
                            portfolio?.Experience?.sort((a, b) => {
                                const dateA = new Date(a?.end_date || a?.start_date || "1970-01-01").getTime();
                                const dateB = new Date(b?.end_date || b?.start_date || "1970-01-01").getTime();
                                return dateB - dateA;
                            }).map((experience, index) => (
                                <React.Fragment key={index}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white border overflow-hidden">
                                            <img src={`https://ui-avatars.com/api/?name=${experience?.institute}&background=random&color=fff`} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-0.5 font-sans">{experience?.title}</h3>
                                            <div className="text-gray-700 text-sm sm:text-base mb-0.5 font-sans">{experience?.institute} • {experience?.employment_type}</div>
                                            <div className="text-xs sm:text-sm text-gray-500 mb-0.5 font-sans">
                                                {experience?.start_date
                                                    ? new Date(experience.start_date + "-01").toLocaleString('en-GB', { month: '2-digit', year: 'numeric' })
                                                    : ""}
                                                {" - "}
                                                {experience?.end_date
                                                    ? new Date(experience.end_date + "-01").toLocaleString('en-GB', { month: '2-digit', year: 'numeric' })
                                                    : "Present"}
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-500 mb-0.5 font-sans">{experience?.location}</div>
                                        </div>
                                    </div>
                                    {index < portfolio?.Experience?.length - 1 && <hr className="mb-4 border-gray-200" />}
                                </React.Fragment>
                            ))}


                    </section>
                )
                }

                {
                    portfolio?.Education && portfolio?.Education.length > 0 && (
                        <section className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6" data-aos="fade-up">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                                {/* <FiEdit2 className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" aria-label="Edit Education" /> */}
                            </div>
                            {portfolio.Education.sort((a, b) => {
                                // Sort by end_date descending, fallback to start_date
                                const dateA = new Date(a?.end_date || a?.start_date || "1970-01-01").getTime();
                                const dateB = new Date(b?.end_date || b?.start_date || "1970-01-01").getTime();
                                return dateB - dateA;
                            }).map((edu, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="flex flex-row items-start gap-4 mb-6">
                                        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded border bg-white">
                                            {edu.institute ? (
                                                <img src={`https://ui-avatars.com/api/?name=${edu?.institute}&background=random&color=fff`} alt={edu.institute} className="w-16 h-16 rounded object-contain" />
                                            ) : (
                                                <span className="text-gray-700 rounded font-semibold text-sm">{edu.institute?.slice(0, 4)?.toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 font-sans">{edu.institute}</h3>
                                            <p className="text-gray-600 font-sans">{edu.study_field}</p>
                                            <p className="text-sm text-gray-500 font-sans">
                                                {edu.start_date
                                                    ? new Date(edu.start_date + "-01").toLocaleString('en-GB', { month: '2-digit', year: 'numeric' })
                                                    : ""}
                                                {" - "}
                                                {edu.end_date
                                                    ? new Date(edu.end_date + "-01").toLocaleString('en-GB', { month: '2-digit', year: 'numeric' })
                                                    : "Present"}
                                            </p>
                                            {edu.grade && (
                                                <p className="text-sm text-gray-500 font-sans">{edu.location} • Grade: {edu.grade}</p>
                                            )}
                                            {edu.description && (
                                                <DescriptionWithClamp text={edu.description} className="mt-2 text-gray-200" />
                                            )}
                                            {edu.image_name && (
                                                <Button variant="default" className='text-white' size={'sm'}>
                                                    <a
                                                        href={`https://elms.edulystventures.com/portfolio/${edu?.image_name ? edu.image_name : "#"}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <EyeIcon />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {idx < portfolio.Education.length - 1 && <hr className="mb-6 border-gray-200" />}
                                </React.Fragment>
                            ))}
                        </section>
                    )
                }


                {portfolio?.Certificate && portfolio?.Certificate.length > 0 && (
                    <section className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6" data-aos="fade-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Licenses & Certifications</h2>
                            {/* <FiEdit2 className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" aria-label="Edit Licenses & Certifications" /> */}
                        </div>

                        {portfolio.Certificate.sort((a, b) => {
                            // Sort by end_date descending, fallback to start_date
                            const dateA = new Date(a?.end_date || a?.start_date || "1970-01-01").getTime();
                            const dateB = new Date(b?.end_date || b?.start_date || "1970-01-01").getTime();
                            return dateB - dateA;
                        }).map((cert, idx) => (
                            <div key={idx} className="flex flex-row gap-4 mb-6 items-start">
                                <div className="flex-shrink-0 flex items-center justify-center w-16  h-16 bg-white rounded">
                                    <img src={`https://ui-avatars.com/api/?name=${cert?.institute}&background=random&color=fff`} alt={cert.institute} className="w-16 h-16 object-contain rounded" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-0.5 leading-tight">{cert.institute}</h3>
                                    <div className="text-gray-700 text-sm sm:text-base mb-0.5 font-medium">{cert.title}</div>
                                    <div className="text-xs sm:text-sm text-gray-500 mb-0.5">
                                        Issued {cert.start_date
                                            ? new Date(cert.start_date + "-01").toLocaleString('en-GB', { month: '2-digit', year: 'numeric' })
                                            : ""}
                                    </div>
                                    <a href={`https://elms.edulystventures.com/portfolio/${cert.image_name}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 text-sm sm:text-base border border-gray-300 rounded-full bg-gray-50 hover:bg-gray-100 text-blue-600 font-medium mt-3 mb-2 gap-2">
                                        Show credential
                                        <FaExternalLinkAlt className="w-4 h-4 ml-1" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </section>
                )

                }


                {portfolio?.Project && portfolio?.Project.length > 0 && (
                    <section className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6" data-aos="fade-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                            {/* <FiEdit2 className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" aria-label="Edit Projects" /> */}
                        </div>

                        {portfolio?.Project?.map((project, index) => (
                            <React.Fragment key={`project-${index}`}>
                                <div className="mb-10 group transition-all">
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-gray-900 font-sans">
                                                {project?.title}
                                                {project?.employment_type && (
                                                    <span className="font-normal text-gray-500 ml-2">
                                                        ({project.employment_type})
                                                    </span>
                                                )}
                                            </h3>
                                            <span className="text-sm sm:text-base text-gray-500 font-sans">
                                                {project?.start_date &&
                                                    new Date(project.start_date + "-01").toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                                                {" – "}
                                                {project?.end_date
                                                    ? new Date(project.end_date + "-01").toLocaleString('en-US', { month: 'long', year: 'numeric' })
                                                    : "Present"}
                                            </span>
                                        </div>
                                        {project?.institute && (
                                            <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1 font-sans">
                                                Associated with {project.institute}
                                            </p>
                                        )}
                                        <DescriptionWithClamp text={project?.description ?? ""} className="mb-3" />
                                        <div className="flex-shrink-0 flex items-center justify-center w-40 h-24 bg-white rounded-lg border">
                                            {project?.image_name && getFileType(project?.image_name) === 'pdf' ? (
                                                <embed src={`https://elms.edulystventures.com/portfolio/${project.image_name}`} className="w-full h-full object-contain" />
                                            ) : (
                                                <img
                                                    src={`https://elms.edulystventures.com/portfolio/${project.image_name}`}
                                                    alt={project.title}
                                                    className="w-full h-full object-contain"
                                                />
                                            )}
                                        </div>
                                        {project?.action && (
                                            <div className="mt-4">
                                                <a
                                                    href={project?.action}
                                                    className="text-primary hover:text-indigo-700 flex items-center"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <Link2 size={20} className="mr-2" />
                                                    <span>View Project</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {index < portfolio?.Project.length - 1 && <hr className="my-4 border-gray-200" />}
                            </React.Fragment>
                        ))}
                    </section>

                )

                }


                {portfolio?.Publication && portfolio?.Publication.length > 0 && (
                    <section className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6" data-aos="fade-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Publications</h2>
                            {/* <FiEdit2 className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" aria-label="Edit Publications" /> */}
                        </div>

                        {portfolio?.Publication?.map((data, idx) => (
                            <React.Fragment key={`pub-${idx}`}>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-white rounded border">
                                        <img src={`https://ui-avatars.com/api/?name=${data?.institute}&background=random&color=fff`} alt={data?.institute || "Publication"} className="w-16 h-16 rounded object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-0.5 font-sans">{data.title}</h3>
                                        <div className="text-gray-700 text-sm sm:text-base mb-0.5 font-sans">{data?.institute}</div>
                                        <div className="text-xs sm:text-sm text-gray-500 mb-0.5 font-sans">
                                            {data?.start_date && new Date(data?.start_date + "-01").toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                                            {data?.end_date
                                                ? ` - ${new Date(data?.end_date + "-01").toLocaleString('en-US', { month: 'long', year: 'numeric' })}`
                                                : " - Present"}
                                        </div>
                                        {data?.study_field && (
                                            <div className="text-xs sm:text-sm text-gray-500 mb-1 font-sans">{data.study_field}</div>
                                        )}
                                        {data?.edit_url_professional && (
                                            <a
                                                href={data.edit_url_professional}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1 text-sm sm:text-base border border-gray-300 rounded-full bg-gray-50 hover:bg-gray-100 text-blue-600 font-medium mt-2 gap-2"
                                            >
                                                View Publication
                                                <FaExternalLinkAlt className="w-4 h-4 ml-1" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                {idx < portfolio.Publication.length - 1 && <hr className="my-2 border-gray-200" />}
                            </React.Fragment>
                        ))}
                    </section>
                )

                }

                {portfolio?.Extra && portfolio?.Extra.length > 0 &&
                    (
                        <section className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6" data-aos="fade-up">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Extra Activity</h2>
                                {/* <FiEdit2 className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" aria-label="Edit Extra Activities" /> */}
                            </div>

                            {portfolio?.Extra?.sort((a, b) => new Date(b?.start_date ?? "1970-01").getTime() - new Date(a?.start_date ?? "1970-01").getTime()).map((extra, index) => (
                                <React.Fragment key={`extra-${index}`}>
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-white rounded border">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${extra?.title}&background=random&color=fff`}
                                                alt={extra?.title}
                                                className="w-16 h-16 object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-0.5 font-sans">{extra?.title}</h3>
                                            <div className="text-gray-700 text-sm sm:text-base mb-0.5 font-sans">{extra?.institute}</div>
                                            <div className="text-xs sm:text-sm text-gray-500 mb-0.5 font-sans">
                                                {extra?.start_date
                                                    ? new Date(extra.start_date + "-01").toLocaleString('en-US', { month: 'long', year: 'numeric' })
                                                    : ""}
                                                {extra?.end_date
                                                    ? ` - ${new Date(extra.end_date + "-01").toLocaleString('en-US', { month: 'long', year: 'numeric' })}`
                                                    : " - Present"}
                                            </div>
                                            {extra?.description && (
                                                <div className="text-sm text-gray-700 font-sans">{extra.description}</div>
                                            )}
                                        </div>
                                    </div>
                                    {index < portfolio.Extra.length - 1 && <hr className="my-2 border-gray-200" />}
                                </React.Fragment>
                            ))}
                        </section>

                    )
                }



                {
                    portfolio?.skill && portfolio?.skill.length > 0 && (
                        <div className="bg-white rounded-xl shadow-md border p-4 sm:p-8" data-aos="fade-up">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Skills</h2>
                            <div className="block">
                                {(() => {
                                    // Responsive: show 3 on mobile, 6 on sm+, rest on expand
                                    const [showAll, setShowAll] = React.useState(false);
                                    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 640);

                                    React.useEffect(() => {
                                        const handleResize = () => setIsMobile(window.innerWidth < 640);
                                        window.addEventListener('resize', handleResize);
                                        return () => window.removeEventListener('resize', handleResize);
                                    }, []);

                                    const skills = portfolio.skill;
                                    const minToShow = isMobile ? 3 : 10;
                                    const topSkills = skills.slice(0, minToShow);
                                    const restSkills = skills.slice(minToShow);

                                    return (
                                        <div>
                                            <div className="flex flex-wrap gap-2">
                                                {(showAll ? skills : topSkills).map((skill, idx) => (
                                                    <span
                                                        key={skill?.name || idx}
                                                        className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                                                    >
                                                        {skill?.name}
                                                    </span>
                                                ))}
                                            </div>
                                            {skills.length > minToShow && (
                                                <button
                                                    className="mt-3 text-primary text-sm font-medium underline"
                                                    onClick={() => setShowAll((prev) => !prev)}
                                                >
                                                    {showAll ? "Show less" : `View all (${skills.length})`}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )
                }
                {
                    Array.isArray(portfolio.portfolio_profile) && portfolio.portfolio_profile.length !== 0 && <Export show={exportDailog} setShow={() => setExportDialog(false)} portfolio={portfolio} />
                }
                <AddResume show={addResumeDialog} onClose={setAddResumeDialog} onSuccess={fetchUserPortfolio} />
                <PersonalInfo portfolio={portfolio && portfolio?.portfolio_profile && portfolio?.portfolio_profile?.length !== 0 ? portfolio?.portfolio_profile[0] : null} show={showPersonalInfoDialog} onClose={setShowPersonalInfoDialog} onSuccess={fetchUserPortfolio} />

            </div>
        </div>
    );
};

export default App;