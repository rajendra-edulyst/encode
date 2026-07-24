import React from 'react'
import { Button } from '@/components/ui/ShadcnButton'
import { ArrowUpRight, Facebook, Instagram, Linkedin, YoutubeIcon } from 'lucide-react'
import GreetingHeading from '@/components/GreetingHeading'
import AnimatedStats from '@/components/AnimatedStats'
import { useNavigate } from 'react-router-dom'

import PatnersImages from '@/components/PatnersImages'
import { useSettings } from '@/hooks/data/useSettings'
import { BsTwitterX } from "react-icons/bs";
import NewLogo from '@/assets/images/New_Logo.png';
import SEO from '@/components/SEO/SEO';


const index = () => {

    const navigate = useNavigate();

    const { data: settings } = useSettings();
    const organization_goal = settings?.configuration?.organization_goal || [];
    const social_links = settings?.configuration?.social_links || {};
    const policies = settings?.configuration?.policies || [];


    const platforms = [
        {
            title: 'Create',
            subtitle: 'Learn at your Pace',
            description: 'Repository of Courses, Mentors & Resources.',
            link: '/create',
            color: 'text-codeblue',
        },
        {
            title: 'Connect',
            subtitle: 'Add value to your experience',
            description: 'Community driven learning ecosystem.',
            link: '/community',
            color: 'text-codepink',
        },
        {
            title: 'Collaborate',
            subtitle: 'Fuel your growth with exposure',
            description: 'Tech driven interaction industry engine.',
            link: '/collaborate',
            color: 'text-codegreen',
        },
    ];


    const folderImages = ['folder-blue', 'folder-pink', 'folder-yellow', 'folder-green'];
    const bgColors = ['bg-codeblue', 'bg-codepink', 'bg-[#DCCB00]', 'bg-codegreen'];

    return (
        <div className='bg-black'>
            <SEO
                title="enCODE | AI-Powered Learning Platform for Students, Universities & Professionals"
                description="enCODE empowers learners through AI-driven, multidisciplinary, creative, and industry-connected learning. Join our community of students, universities, and professionals."
                aeoType="WebPage"
                image="https://encode.codeedu.co/img/logo/logo-light-full.png"
                imageDetails={{
                    width: 1200,
                    height: 630,
                    caption: "enCODE - AI-Powered Learning Platform"
                }}
                speakableSelectors={[".design-section-heading", ".ecosystem-heading"]}
            />
            <div className="flex flex-col min-h-[calc(100vh-80px)] xl:min-h-[calc(100vh-126px)]">
                <section className="relative flex-1 flex items-center overflow-hidden">
                <video autoPlay loop muted className="w-full h-auto absolute rotate-[-35deg] -right-[38rem] -bottom-[11rem]">
                    <source src="/video/rainbow.mp4" type="video/mp4" />
                </video>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        {/* Left Content */}
                        <div className="lg:col-span-7 space-y-4 2xl:space-y-6 z-10 py-6 lg:py-2 2xl:py-10">
                            <div className='space-y-4 2xl:space-y-10 z-10'>
                                <div className='space-y-1 2xl:space-y-3'>
                                    {/* Dynamic greeting based on local time */}
                                    <GreetingHeading />
                                    <h6 className="text-[28px] lg:text-[26px] xl:text-[28px] 2xl:text-[32px] text-white font-light font-jacques leading-8 2xl:leading-10">Learn from a living network that grows with you.</h6>
                                </div>
                                <p className="text-white text-[20px] lg:text-[20px] 2xl:text-[24px] font-light font-jacques">Because learning isn’t static- its alive, evolving with every mind it touches.</p>
                            </div>
                            <div className='text-center gap-2 2xl:gap-3 bg-codeyellow w-[140px] 2xl:w-[168px] h-[90px] 2xl:h-[120px] rounded-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform font-jacques text-black font-bold' onClick={() => navigate('/sign-in')}>
                                <ArrowUpRight className="w-6 h-6 2xl:w-7 2xl:h-7" />
                                Get Started
                            </div>
                        </div>
                        {/* Right Image - Placeholder for now */}
                        <div className="relative hidden lg:flex justify-center lg:col-span-5 items-end">
                            <img src='/img/landing/group.png' alt="Hero" className="rounded-lg shadow-lg max-h-[450px] 2xl:max-h-none lg:-mb-[14rem] 2xl:-mb-[19rem] xxl:mb-0" />
                        </div>
                    </div>
                </div>
            </section>
            <section className='bg-no-repeat bg-cover bg-center w-full px-5 md:px-0 bg-[#1D1D1D]'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-10 py-4 2xl:py-6 md:px-16 mx-auto'>
                    {
                        platforms.map((platform, index) => (
                            <div key={index} className={`relative px-5 py-4 2xl:py-6 space-y-[4px] cursor-pointer w-full ${platforms.length !== index + 1 ? 'before:content-[""] before:absolute before:md:right-0 before:bottom-0 before:md:w-[3px] before:w-full before:md:h-full before:h-[3px] before:md:top-0 before:bg-[#727272] before:via-white/20 before:to-white/0 before:rounded-lg' : ''}`} onClick={() => navigate('/community')}>
                                <div className='space-y-[6px] 2xl:space-y-[10px]'>
                                    <h1 className={`${platform.color}`}>{platform.title}</h1>
                                    <h6 className='text-white'>{platform.subtitle}</h6>
                                </div>
                                <p>{platform.description}</p>
                            </div>
                        ))
                    }
                </div>
            </section>
            </div>
            <section className="py-16 lg:py-44 relative relative overflow-hidden">
                <video autoPlay loop muted className="w-full h-auto absolute rotate-[-51deg] -left-[40rem] bottom-[4rem]">
                    <source src="/video/rainbow.mp4" type="video/mp4" />
                </video>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative pb-24">
                    <div className="mb-32">
                        <h2 className="text-3xl lg:text-5xl font-jacques font-bold mb-4 text-white design-section-heading">
                            Design your Own Education</h2>
                        <p className="text-white text-lg lg:text-3xl font-light leading-10">
                            Craft a learning path as unique as you.
                        </p>
                    </div>
                    <img src='/img/vector/vecotor1.png' alt="" className='absolute left-0 top-[30%]' />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
                        {
                            organization_goal.map((goal, index) => {
                                const folderImage = folderImages[index % folderImages.length];
                                const bgColor = bgColors[index % bgColors.length];
                                return (
                                    <div key={index} className='flex'>
                                        <div className='relative lg:w-[93%]'>
                                            <img src={`/img/icons/${folderImage}.png?v=1`} alt="" className='absolute inset-0' />
                                            <div className='relative p-10 space-y-2'>
                                                <h6 className='text-white font-bold text-2xl'>{goal.title}</h6>
                                                <p className='text-white text-base'>{goal.description}</p>
                                            </div>
                                            <div className={`absolute top-0 -right-7 p-4 text-white w-[83px] h-[83px] ${bgColor} rounded-full border-[5px] border-white flex justify-center items-center text-2xl font-bold`}>{index + 1}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </section>
            <section className="py-16 relative overflow-hidden">
                <video autoPlay loop muted className="w-full h-auto absolute rotate-[-35deg] -right-[38rem] -bottom-[11rem]">
                    <source src="/video/rainbow.mp4" type="video/mp4" />
                </video>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div>
                        <h1 className='text-3xl lg:text-5xl font-jacques font-bold mb-4 text-white'> An ecosystem powered by<br /> people and purpose.</h1>
                        <p className='text-white text-lg lg:text-3xl font-light leading-10'>Educators, creators, and leaders shaping new ways to grow.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-16">
                        <div className='flex flex-col gap-10 justify-center items-center h-64 md:h-auto'>
                            <AnimatedStats />
                        </div>
                        <div>
                            <PatnersImages />
                        </div>
                    </div>
                </div>
                <div className='relative mt-32'>
                    <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                        <div className='flex justify-between' onClick={() => navigate('/sign-in')}>
                            <div>
                                <h1 className='text-white'>Join the Creative Community!</h1>
                            </div>
                            <div className='text-center gap-3 bg-codeyellow w-[168px] h-[120px] rounded-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform font-jacques text-black font-bold'>
                                <ArrowUpRight size={28} />
                                Get Started
                            </div>
                            <div className='bg-[#1D1D1D] rounded-lg flex justify-center items-center px-10 py-10 md:py-auto hidden'>
                                <div className='flex gap-2 w-full'>
                                    <input type='text' className='bg-transparent border border-gray-600 rounded-lg py-2 px-4 w-full' placeholder='Enter your email' />
                                    <Button className='bg-codeblue hover:bg-codeblue/80 text-white rounded-lg'>Subscribe</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </section>


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
export default index