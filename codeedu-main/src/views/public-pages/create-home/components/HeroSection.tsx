import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/ShadcnButton'
import { Search } from 'lucide-react'
import HeroVideo from './CREATE Hero Section.mp4'

const HeroSection = () => {
    const navigate = useNavigate()

    return (
        <section className="relative w-full min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden py-20 lg:py-32 -mx-4 md:-mx-8 xl:-mx-12 px-4 md:px-8 xl:px-12">
            {/* Background Video for the full section */}
            <div className="absolute inset-0 z-0 bg-transparent overflow-hidden pointer-events-none">
                <video 
                    src={HeroVideo} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto">
                <div className="max-w-2xl space-y-6">
                    <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-white tracking-tight">
                        Master the Art <br />
                        <span className="flex items-center gap-4 mt-2">
                            <span className="text-2xl lg:text-3xl font-medium mt-4">of</span>
                            <span className="text-codeblue text-6xl lg:text-[100px] leading-none tracking-tight" style={{ fontFamily: '"Playfair Display", "Times New Roman", serif', fontStyle: 'italic' }}>
                                Creation
                            </span>
                        </span>
                    </h1>
                    <p className="text-gray-400 text-sm lg:text-base max-w-md font-light leading-relaxed pt-4">
                        A curated ecosystem for the modern creator. Access elite mentorship, powerful AI tools, and cinematic learning experiences designed for high-impact professionals.
                    </p>

                    {/* Search Bar */}
                    <div className="relative mt-10 max-w-md flex items-center bg-[#222] rounded-xl p-1.5 border border-gray-800 shadow-2xl">
                        <Search className="text-gray-500 w-5 h-5 ml-3 absolute pointer-events-none" />
                        <input 
                            type="text" 
                            placeholder="Search courses, tools, mentors..."
                            className="bg-transparent text-gray-300 placeholder:text-gray-600 w-full pl-10 pr-4 py-2.5 outline-none text-sm"
                        />
                        <Button className="bg-codeblue hover:bg-codeblue/90 text-white rounded-lg px-6 py-2.5 shrink-0 text-sm font-medium">
                            Search
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
