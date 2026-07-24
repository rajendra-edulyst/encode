import { useEffect, type ReactNode } from 'react'
import type { CommonProps } from '@/@types/common'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '@/components/template/Logo';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/ShadcnButton';
import { Search, Facebook, Instagram, Linkedin, YoutubeIcon } from 'lucide-react';
import { BsTwitterX } from "react-icons/bs";
import NewLogo from '@/assets/images/New_Logo.png';
import { useSettings } from '@/hooks/data/useSettings';
import { setPrimaryColorFromHex } from '@/hooks/usePrimaryColor';

interface CourseDiscoveryLayoutProps extends CommonProps {
    content?: ReactNode
}

const CourseDiscoveryLayout = ({ children }: CourseDiscoveryLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const setMode = useThemeStore((state) => state.setMode);

    const { data: settings } = useSettings();
    const social_links = settings?.configuration?.social_links || {};
    const policies = settings?.configuration?.policies || [];

    useEffect(() => {
        setMode('dark');
        setPrimaryColorFromHex('#009BD8');
    }, [setMode]);

    const handleLoginClick = () => {
        const currentPath = location.pathname + location.search;
        navigate(`/sign-in?redirectUrl=${encodeURIComponent(currentPath)}`);
    };

    const handleSignUpClick = () => {
        const currentPath = location.pathname + location.search;
        navigate(`/sign-up?redirectUrl=${encodeURIComponent(currentPath)}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <header className="sticky top-0 z-50 flex items-center justify-between shadow border-b border-gray-200 dark:border-gray-800 bg-black h-[80px] xl:h-[96px] px-4 md:px-8">
                <div className="flex items-center gap-8">
                    <Link to={`/`} className='flex items-center gap-1'>
                        <Logo imgClass="w-[140px] xl:w-[160px]" mode='dark' type="full" />
                        <h5 className='text-base text-white ml-2'>BETA</h5>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleLoginClick}
                        variant="ghost"
                        className="text-gray-300 hover:text-white hover:bg-gray-800 hidden sm:flex"
                    >
                        Login
                    </Button>
                    <Button
                        onClick={handleSignUpClick}
                        className="bg-codeblue hover:bg-codeblue/90 text-white font-semibold px-6 py-2 rounded-lg"
                    >
                        Sign Up
                    </Button>
                </div>
            </header>

            <main className="flex-grow">
                {children}
            </main>

           <footer className="bg-black text-white border-t border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className='flex justify-end mb-6'>
                        <div className="flex gap-3 items-center">
                            {social_links.facebook && (
                                <a aria-label="facebook" href={social_links.facebook} className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-800" target='_blank' rel='noreferrer'>
                                    <Facebook className="w-5 h-5 text-white" />
                                </a>
                            )}
                            {social_links.twitter && (
                                <a aria-label="x" href={social_links.twitter} className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-800" target='_blank' rel='noreferrer'>
                                    <BsTwitterX className="w-5 h-5 text-white" />
                                </a>
                            )}
                            {social_links.instagram && (
                                <a aria-label="instagram" href={social_links.instagram} className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-800" target='_blank' rel='noreferrer'>
                                    <Instagram className="w-5 h-5 text-white" />
                                </a>
                            )}
                            {social_links.linkedin && (
                                <a aria-label="linkedin" href={social_links.linkedin} className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-800" target='_blank' rel='noreferrer'>
                                    <Linkedin className="w-5 h-5 text-white" />
                                </a>
                            )}
                            {social_links.youtube && (
                                <a aria-label="youtube" href={social_links.youtube} className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-800" target='_blank' rel='noreferrer'>
                                    <YoutubeIcon className="w-5 h-5 text-white" />
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Logo and tagline */}
                        <div className="flex flex-col gap-6">
                            <div className="w-40">
                                <img src={NewLogo} alt="CODE EDU" className="w-full h-auto" loading='lazy' />
                            </div>
                            <p className="text-white max-w-sm">
                                Creative Learning Network — building skills through community, mentorship and real projects.
                            </p>
                        </div>

                        {/* Policy links (center) */}
                        <div className="flex flex-col md:flex-row md:justify-center gap-6">
                            <ul className="space-y-3 text-gray-300">
                                {
                                    policies.map((policy, index) => (
                                        <li key={index}>
                                            <a href={policy.url} className="text-white" target='_blank' rel='noreferrer'>{policy.title}</a>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        {/* Contact & Social (right) */}
                        <div className="flex flex-col items-start lg:items-end gap-6">
                            <div className="text-white text-sm">
                                <div>Location : 1007-8, Horizon Tower,</div>
                                <div>Jewel of India, Jaipur, Rajasthan</div>
                                <div className="mt-2">Email : <a href="mailto:info@codeedu.co" className="hover:underline">info@codeedu.co</a></div>
                                <div>Mobile : +91-8696922922</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-gray-800 pt-6 text-center">
                        <div className="flex flex-col lg:flex-row justify-center items-center text-white text-sm gap-4">
                            <div>© Copyrights {new Date().getFullYear()} All rights reserved by CODE EDU</div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default CourseDiscoveryLayout;
