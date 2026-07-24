import LoadingSection from '@/components/LoadingSection'
import { useUserProfile } from '@/hooks/data/useGettingStarted'
import { Edit, ArrowUpFromLine, Share2, Pencil } from 'lucide-react'
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { FaXTwitter } from "react-icons/fa6";
import ShareProfile from './share-profile'
import { memo, useState } from 'react'
import SwitchGroup from '@/components/UserProfileSwitchs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/auth'

const Index = () => {

    const navigate = useNavigate();
    const [shareProfileDialogOpen, setShareProfileDialogOpen] = useState(false);
    const { data: userProfile, isLoading } = useUserProfile();
    const socialLinks = userProfile?.user_profile?.profileSection?.social_links?.[0] || {};
    const preferenceColor = userProfile?.preference?.name === 'Explorer' ? 'text-codeblue' : userProfile?.preference?.name === 'Builder' ? 'text-codepink' : userProfile?.preference?.name === 'Navigator' ? 'text-codegreen' : '';
    const { user } = useAuth();

    return (
        <div className="bg-black text-white mt-10">
            <div className='relative z-10 space-y-10 container mx-auto'>
                <LoadingSection isLoading={isLoading} />
                {userProfile &&
                    <div className="bg-[#1F1F1F] rounded-3xl p-8 relative">
                        <div className="flex gap-2 justify-end">
                            <button className="p-2 hover:bg-gray-700 rounded-lg" onClick={() => navigate('/portfolio')}>
                                <Edit className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-gray-700 rounded-lg" onClick={() => setShareProfileDialogOpen(true)}>
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className='col-span-3'>
                                <div className='flex flex-col md:flex-row justify-center md:justify-start text-center items-center gap-5 mb-5'>
                                    <div className="w-48 h-48 rounded-2xl overflow-hidden bg-gray-700 flex-shrink-0">
                                        <img
                                            src={userProfile?.profile_image ?? 'https://ui-avatars.com/api/?name=' + userProfile?.name + '&background=random&size=256'}
                                            alt={userProfile?.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + userProfile?.name + '&background=random&size=256'
                                            }}
                                        />
                                    </div>
                                    <div className="md:flex flex-col items-start justify-between mb-4 space-y-3">
                                        <h1 className="text-3xl md:text-5xl font-jacques font-bold mb-2 text-left">
                                            Hey, <span className="text-codeblue font-creative"> {user?.role === "industry"
                                                ? userProfile?.organization_name
                                                : (userProfile?.platform_name || userProfile?.name)}</span>
                                        </h1>
                                        <div className='space-y-2'>
                                            <div className="flex items-center justify-center md:justify-start gap-3">
                                                <div className='flex items-center gap-2 justify-center'>
                                                    <img src={userProfile?.packages.icon_code} alt={userProfile?.packages.name} className="w-6 h-10 rounded-full object-contain" />
                                                    <span className={`text-2xl font-jacques`} style={{
                                                        color: userProfile?.packages?.color_code
                                                    }}>
                                                        {userProfile?.packages.name}
                                                    </span>
                                                </div>
                                                {(user?.user_org_type === 'industry' || user?.user_org_type === 'institute') && <button className="p-1 hover:bg-gray-700 rounded text-gray-400 flex gap-2" onClick={() => navigate('/getting-started/preferences?type=edit')}>
                                                    <ArrowUpFromLine className="w-4 h-4 text-[#00E404]" />(Upgrade Plan)
                                                </button>}
                                                {
                                                    (user?.user_org_type !== 'industry' && user?.user_org_type !== 'institute') && <button className="p-1 hover:bg-gray-700 rounded text-gray-400 flex gap-2" onClick={() => navigate('/getting-started/preferences?type=edit')}>
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                }
                                            </div>
                                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                                {userProfile?.user_functional_domain?.map((domain, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-2 bg-[#2A2A2A] rounded-xl text-sm border border-gray-700"
                                                    >
                                                        {domain.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                                            <div className='md:col-span-1'>
                                                <p className="text-gray-400 mb-6">{userProfile?.bio ?? ''}</p>
                                                <div className="flex gap-3">
                                                    <a href={socialLinks?.facebook ?? '#'} className={`w-10 h-10 flex items-center justify-center ${!socialLinks?.facebook ? 'bg-gray-700 opacity-50' : 'bg-[#000] text-gray-400'} rounded-full hover:bg-gray-700 transition`} target='_blank' rel='noopener noreferrer'
                                                        // disable a link if social link is not available
                                                        {...(!socialLinks?.facebook && { onClick: (e) => e.preventDefault() })}
                                                    >
                                                        <FaFacebook className="w-5 h-5" />
                                                    </a>
                                                    <a href={socialLinks?.twitter ?? '#'} className={`w-10 h-10 flex items-center justify-center ${!socialLinks?.twitter ? 'bg-gray-700 opacity-50' : 'bg-[#000]'} rounded-full hover:bg-gray-700 transition`} target='_blank' rel='noopener noreferrer'
                                                        {...(!socialLinks?.twitter && { onClick: (e) => e.preventDefault() })}
                                                    >
                                                        <FaXTwitter className="w-5 h-5" />
                                                    </a>
                                                    <a href={socialLinks?.instagram ?? '#'} className={`w-10 h-10 flex items-center justify-center ${!socialLinks?.instagram ? 'bg-gray-700 opacity-50' : 'bg-[#000]'} rounded-full hover:bg-gray-700 transition`} target='_blank' rel='noopener noreferrer'
                                                        {...(!socialLinks?.instagram && { onClick: (e) => e.preventDefault() })}
                                                    >
                                                        <FaInstagram className="w-5 h-5" />
                                                    </a>
                                                    <a href={socialLinks?.linkedin ?? '#'} className={`w-10 h-10 flex items-center justify-center ${!socialLinks?.linkedin ? 'bg-gray-700 opacity-50' : 'bg-[#000]'} rounded-full hover:bg-gray-700 transition`} target='_blank' rel='noopener noreferrer'
                                                        {...(!socialLinks?.linkedin && { onClick: (e) => e.preventDefault() })}
                                                    >
                                                        <FaLinkedin className="w-5 h-5" />
                                                    </a>
                                                    <a href={socialLinks?.youtube ?? '#'} className={`w-10 h-10 flex items-center justify-center ${!socialLinks?.youtube ? 'bg-gray-700 opacity-50' : 'bg-[#000]'} rounded-full hover:bg-gray-700 transition`} target='_blank' rel='noopener noreferrer'
                                                        {...(!socialLinks?.youtube && { onClick: (e) => e.preventDefault() })}
                                                    >
                                                        <FaYoutube className="w-5 h-5" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                                            <div className='flex items-end'>
                                                <SwitchGroup />
                                            </div>
                                            {(user?.user_org_type === 'industry' || user?.user_org_type === 'institute') && (<div className='md:col-span-2 flex items-end'>
                                                <div className='border border-gray-500 rounded-xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4'>
                                                    <div className='flex flex-col items-center justify-center'>
                                                        <img src={`${userProfile?.packages?.icon_code}?v=${Date.now()}`} alt={userProfile?.packages?.name} className="h-12 object-contain" />
                                                        <span className={`text-lg font-jacques ${preferenceColor}`}>{userProfile?.packages?.name}</span>
                                                        <span className='text-gray-500'>(Plan Includes)</span>
                                                    </div>
                                                    <Card className='bg-[#323232] p-2 gap-0 flex flex-col justify-center items-center'>
                                                        <CardHeader>
                                                            <CardTitle className='text-xs text-center text-codeblue'>CREATE</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className='px-0 text-left'>
                                                            <p>Certification Courses: 15</p>
                                                            <p>Self paced: 2 </p>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className='bg-[#323232] p-2 gap-0 flex flex-col justify-center items-center'>
                                                        <CardHeader>
                                                            <CardTitle className='text-xs text-center text-codepink'>CONNECT</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className='px-0 text-left'>
                                                            <p>Annual Forecasts : 300</p>
                                                            <p>Creative News Trends :50+</p>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className='bg-[#323232] p-2 gap-0 flex flex-col justify-center items-center'>
                                                        <CardHeader className='px-0'>
                                                            <CardTitle className='text-xs text-center text-codegreen'>COLLABORATE</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className='px-0 text-left'>
                                                            <p>Master Classes: 2</p>
                                                            <p>Workshop Annually: 2</p>
                                                            <p>Must Attend : 3</p>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </div>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <div className="rounded-3xl p-8 mb-8 md:flex gap-10 relative z-10">
                    <div className="relative z-10 block md:hidden mb-10">
                        <h1 className="text-2xl 2xl:text-4xl font-jacques font-bold mb-2 text-center text-white opacity-100">
                            How do you want to use the Platform today?
                        </h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-white mx-auto">
                        <div className="relative cursor-pointer hover:transform hover:scale-105 transition-all duration-300" onClick={() => navigate('/create')}>
                            <div className="absolute -top-3 -left-3 w-full h-full bg-codeblue rounded-2xl z-0"></div>
                            <div className="relative bg-[#1F1F1F] p-6 rounded-2xl text-center z-10 shadow-lg min-h-40">
                                <h3 className="text-codeblue text-2xl font-bold mb-2">Create</h3>
                                <p className="text-sm leading-relaxed">Repository of Courses, Mentors & Resources.</p>
                            </div>
                        </div>
                        {/* Connect */}
                        <div className="relative cursor-pointer hover:transform hover:scale-105 transition-all duration-300" onClick={() => navigate('/connect')}>
                            <div className="absolute -top-3 -left-3 w-full h-full bg-codepink rounded-2xl z-0"></div>
                            <div className="relative bg-[#1F1F1F] p-6 rounded-2xl text-center z-10 shadow-lg min-h-40">
                                <h3 className="text-codepink text-2xl font-bold mb-2">Connect</h3>
                                <p className="text-sm leading-relaxed">Community driven learning ecosystem.</p>
                            </div>
                        </div>

                        {/* Collaborate */}
                        <div className="relative cursor-pointer hover:transform hover:scale-105 transition-all duration-300" onClick={() => navigate('/collaborate')}>
                            <div className="absolute -top-3 -left-3 w-full h-full bg-codegreen rounded-2xl z-0"></div>
                            <div className="relative bg-[#1F1F1F] p-6 rounded-2xl text-center z-10 shadow-lg min-h-40">
                                <h3 className="text-codegreen text-2xl font-bold mb-2">Collaborate</h3>
                                <p className="text-sm leading-relaxed">Tech driven interaction industry engine.</p>
                            </div>
                        </div>

                        {/* Ccat */}
                        <div className="relative cursor-pointer hover:transform hover:scale-105 transition-all duration-300" onClick={() => navigate('/ccat-landing-page')}>
                            <div className="absolute -top-3 -left-3 w-full h-full bg-codeyellow rounded-2xl z-0"></div>
                            <div className="relative bg-[#1F1F1F] p-6 rounded-2xl text-center z-10 shadow-lg min-h-40">
                                <h3 className="text-codeyellow text-2xl font-bold mb-2">CCIQ</h3>
                                <p className="text-sm leading-relaxed">Career Coaching and Adaptive Training.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 hidden md:block">
                        <h1 className="text-2xl 2xl:text-4xl font-jacques font-bold mb-2 text-center text-white opacity-100">
                            How do you want to use the Platform today?
                        </h1>
                    </div>
                </div>
            </div>
            <video
                autoPlay
                loop
                muted
                playsInline
                className="fixed bottom-0 left-0 w-full h-96 object-cover z-0 opacity-40 mix-blend-screen pointer-events-none"
            >
                <source src="/video/rainbow.mp4" type="video/mp4" />
            </video>
            <ShareProfile open={shareProfileDialogOpen} onOpenChange={setShareProfileDialogOpen} />
        </div>
    )
}

export default memo(Index);
