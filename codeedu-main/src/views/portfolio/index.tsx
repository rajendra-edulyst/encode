import React, { useEffect, useMemo } from 'react'
import { usePortfolioDetailsStore } from '@/store/portfolio/PortfolioStore'
import Loading from '@/components/shared/Loading';
import { Link2, ChevronLeft, Calendar, Briefcase, Award } from 'lucide-react';
import { getFileType } from '@/utils/getFileType';
import { FaFacebook, FaBehance } from 'react-icons/fa6';
import { BsInstagram, BsLinkedin } from 'react-icons/bs';
import deafultprofile from '@/assets/images/defaultprofile.jpg';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const InfoCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-[#161618] rounded-xl border border-[#2D2D30] p-5 mb-4 shadow-sm">
        <h3 className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-3">{title}</h3>
        <div className="text-gray-200 text-sm leading-relaxed">
            {children || <span className="text-gray-500 italic">No data yet.</span>}
        </div>
    </div>
);

function Portfolio() {
    const { orgId, id } = useParams();
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

    const calculateYears = (items: { start_date?: string, end_date?: string }[]) => {
        if (!items || items.length === 0) return 0;
        let totalMonths = 0;
        items.forEach(item => {
            const start = new Date((item.start_date || "1970-01-01") + "-01");
            const end = item.end_date ? new Date(item.end_date + "-01") : new Date();
            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            totalMonths += Math.max(0, months);
        });
        return Math.round(totalMonths / 12);
    }

    const experienceYears = useMemo(() => calculateYears(portfolio?.Experience || []), [portfolio]);
    const academicYears = useMemo(() => calculateYears(portfolio?.Education || []), [portfolio]);
    const topExpertise = useMemo(() => portfolio?.skill?.[0]?.name || "", [portfolio]);

    if (loading) {
        return <Loading loading={loading} />
    }

    if (!portfolio || error) {
        return (
            <div className="min-h-screen bg-[#0B0B0C] flex flex-col items-center justify-center">
                <div className="bg-[#1A1A1A] rounded-lg border border-[#333] shadow-lg p-8 max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Portfolio Not Found</h2>
                    <p className="text-gray-400 mb-6">The portfolio you are looking for does not exist.</p>
                    <button onClick={() => navigate('/dashboard')} className="w-full bg-[#00AEEF] hover:bg-[#0095CC] text-white py-3 rounded-lg font-semibold transition">
                        Go Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    const profileData = Array.isArray(portfolio?.portfolio_profile) ? portfolio.portfolio_profile[0] : portfolio?.portfolio_profile || {};
    const fullName = `${profileData.name || portfolio?.name || ''} ${profileData.lastName || ''}`.trim();
    // Assuming role or title might be stored in 'about_me' or we use a fallback if not provided
    const displayRole = profileData.role || profileData.designation || "Assistant Professor";

    return (
        <div className="min-h-screen bg-[#0B0B0C] text-white pb-12 font-sans">
            {/* Mobile App Bar */}
            <div className="flex md:hidden items-center px-4 py-4 bg-[#0B0B0C] sticky top-0 z-50 border-b border-[#1A1A1A]">
                <button onClick={() => navigate(-1)} className="p-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-lg mr-4 transition border border-[#2D2D30]">
                    <ChevronLeft size={20} color="#FFF" />
                </button>
                <h1 className="text-lg font-bold text-white tracking-wide">Mentor Profile</h1>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-10">
                {/* Hero Card */}
                <div className="bg-[#1C1C1E] rounded-2xl border border-[#2D2D30] overflow-hidden relative border-l-4 border-l-[#00AEEF] shadow-xl">
                    <div className="p-5 md:p-8 flex flex-col md:flex-row relative">

                        {/* Social Icons (Top Right) */}
                        <div className="absolute top-5 right-5 flex space-x-4">
                            {portfolio?.portfolio_social?.[0]?.insta && (
                                <a href={portfolio.portfolio_social[0].insta} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                                    <BsInstagram size={18} />
                                </a>
                            )}
                            {portfolio?.portfolio_social?.[0]?.linkedin && (
                                <a href={portfolio.portfolio_social[0].linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                                    <BsLinkedin size={18} />
                                </a>
                            )}
                            {portfolio?.portfolio_social?.[0]?.facebook && (
                                <a href={portfolio.portfolio_social[0].facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                                    <FaFacebook size={18} />
                                </a>
                            )}
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <FaBehance size={18} />
                            </a>
                        </div>

                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                            <img
                                src={portfolio?.image || deafultprofile}
                                alt="Profile"
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border border-[#444] shadow-md"
                                onError={(e) => e.currentTarget.src = deafultprofile}
                            />
                        </div>

                        {/* Profile Info */}
                        <div className="mt-5 md:mt-0 md:ml-6 flex flex-col justify-center flex-1">
                            <h1 className="text-2xl font-extrabold text-white tracking-tight">
                                {fullName}
                            </h1>
                            <p className="text-gray-400 text-sm mt-1 font-medium">
                                {displayRole}
                            </p>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-3 mt-3">
                                {experienceYears > 0 && (
                                    <div className="flex items-center space-x-1.5 bg-[#00AEEF]/10 px-3 py-1.5 rounded border border-[#00AEEF]/20">
                                        <Briefcase size={12} className="text-[#00AEEF]" />
                                        <span className="text-xs text-[#00AEEF] font-semibold">{experienceYears} years</span>
                                    </div>
                                )}
                                {topExpertise && (
                                    <div className="flex items-center space-x-1.5 bg-[#00AEEF]/10 px-3 py-1.5 rounded border border-[#00AEEF]/20">
                                        <Award size={12} className="text-[#00AEEF]" />
                                        <span className="text-xs text-[#00AEEF] font-semibold">{topExpertise}</span>
                                    </div>
                                )}
                            </div>

                            {/* Book & Connect Button */}
                            <div className="mt-6 w-full">
                                {(portfolio as any)?.slot_available === 1 || (portfolio?.portfolio_profile as any)?.slot_available === 1 ? (
                                    <button className="w-full bg-[#00AEEF] hover:bg-[#0095CC] text-white py-3.5 rounded-md font-bold flex justify-center items-center transition shadow-lg shadow-[#00AEEF]/20">
                                        <Calendar size={18} className="mr-2" /> Book & Connect
                                    </button>
                                ) : (
                                    <button disabled className="w-full bg-[#2A2A2A] text-gray-500 py-3.5 rounded-md font-bold flex justify-center items-center cursor-not-allowed">
                                        <Calendar size={18} className="mr-2" /> Book & Connect
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Cards Stack */}
                <div className="mt-6 flex flex-col space-y-1">
                    <InfoCard title="Profile Information">
                        {profileData?.about_me || profileData?.description || displayRole}
                    </InfoCard>

                    <InfoCard title="Academic Experience">
                        {academicYears > 0 ? `${academicYears}+ years` : ''}
                    </InfoCard>

                    <InfoCard title="Experience Summary">
                        {experienceYears > 0 ? `${experienceYears} years` : ''}
                    </InfoCard>

                    <InfoCard title="Areas of Expertise">
                        {portfolio?.skill?.map((s: any) => s.name).join(' & ') || ''}
                    </InfoCard>

                    <InfoCard title="Tools & Software" children={undefined}>
                        {/* Assuming tools data might not be distinct from skills, leaving blank as per screenshot if empty */}
                    </InfoCard>
                </div>

                {/* Keep existing projects/publications if any, but restyle them slightly for dark mode */}
                {portfolio?.Project && portfolio.Project.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-xl font-bold text-white mb-4">Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {portfolio.Project.map((project: any, index: number) => (
                                <div key={index} className="bg-[#1C1C1E] rounded-xl border border-[#2D2D30] overflow-hidden">
                                    {project?.image_name && getFileType(project?.image_name) !== 'pdf' && (
                                        <img src={`https://elms.edulystventures.com/portfolio/${project.image_name}`} alt={project.title} className='w-full h-40 object-cover opacity-80 hover:opacity-100 transition' />
                                    )}
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-white">{project?.title}</h3>
                                        <p className="mt-2 text-gray-400 text-sm line-clamp-2">{project.description}</p>
                                        {project?.action && (
                                            <a href={project?.action} className="mt-4 text-[#00AEEF] hover:text-[#0095CC] text-sm font-medium flex items-center" target="_blank" rel="noreferrer">
                                                <Link2 size={16} className="mr-1.5" /> View Project
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Portfolio
