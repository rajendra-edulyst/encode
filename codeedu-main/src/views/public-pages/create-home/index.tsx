import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '@/components/SEO/SEO'
import { Button } from '@/components/ui/ShadcnButton'
import NewLogo from '@/assets/images/New_Logo.png'
import HeroSection from './components/HeroSection'
import TrendingCourses from './components/TrendingCourses'
import WorldClassGuidance from './components/WorldClassGuidance'
import ResourceToolsDirectory from './components/ResourceToolsDirectory'
import StatsAndWhyChooseUs from './components/StatsAndWhyChooseUs'
import FooterCTA from './components/FooterCTA'
import Footer from './components/Footer'

const CreateHome = () => {
    const navigate = useNavigate()

    return (
        <div className="bg-[#0f0f0f] min-h-screen text-white font-sans selection:bg-codeblue selection:text-white">
            <style>{`
                header.sticky.top-0:not(.custom-create-header) {
                    display: none !important;
                }
            `}</style>
            <SEO
                title="Create | enCODE"
                description="Master the Art of Creation with enCODE. Access premium learning experiences designed for high-impact professionals."
            />
            
            
            {/* Global Header for Create Home */}
            <header className="custom-create-header sticky top-0 z-50 flex items-center justify-between shadow border-b border-gray-800 bg-[#0f0f0f] h-[80px] xl:h-[96px] px-4 md:px-8 xl:px-12">
                <Link to="/">
                    <img src={NewLogo} alt="enCODE Logo" className="w-32 xl:w-40" />
                </Link>
                <div className="flex items-center gap-4">
                    <button 
                        className="text-codeblue hover:text-white transition-colors font-medium text-sm lg:text-base"
                        onClick={() => navigate('/sign-in')}
                    >
                        Log In
                    </button>
                    <Button 
                        className="bg-codeblue hover:bg-codeblue/90 text-white rounded-full px-6 py-2"
                        onClick={() => navigate('/sign-up')}
                    >
                        Join for free
                    </Button>
                    
                </div>
            </header>

            <div className="w-full px-4 md:px-8 xl:px-12 overflow-hidden">
                <HeroSection />
                <TrendingCourses />
                <WorldClassGuidance />
                <ResourceToolsDirectory />
                <StatsAndWhyChooseUs />
                <FooterCTA />
            </div>

            <Footer />
        </div>
    )
}

export default CreateHome
