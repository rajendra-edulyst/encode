import React from 'react'
import { Facebook, Instagram, Linkedin, YoutubeIcon } from 'lucide-react'
import { BsTwitterX } from "react-icons/bs"
import NewLogo from '@/assets/images/New_Logo.png'
import { useSettings } from '@/hooks/data/useSettings'

const Footer = () => {
    const { data: settings } = useSettings()
    const social_links = settings?.configuration?.social_links || {}
    const policies = settings?.configuration?.policies || []

    return (
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
    )
}

export default Footer
