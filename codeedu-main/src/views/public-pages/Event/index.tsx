import React, { useState } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import SEO from '@/components/SEO/SEO'
import { Button } from '@/components/ui/ShadcnButton'
import NewLogo from '@/assets/images/New_Logo.png'
import Footer from '@/views/public-pages/create-home/components/Footer'
import { useEventById } from '@/hooks/data/collaborate/useEvents'
import HeroBanner from './components/HeroBanner'
import TabsNavigation from './components/TabsNavigation'
import OverviewTab from './components/OverviewTab'
import ExpertDetailsTab from './components/ExpertDetailsTab'
import OtherEvents from './components/OtherEvents'
import LoadingSection from '@/components/LoadingSection'

const EventPage = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [searchParams] = useSearchParams()
    const category = searchParams.get('category') || undefined

    const [activeTab, setActiveTab] = useState<'overview' | 'expert'>('overview')

    // Fetch the event data
    const { data: event, isLoading, error } = useEventById(id, category)

    if (isLoading) {
        return (
            <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center">
                <LoadingSection title="Loading Event Details..." isLoading={true} />
            </div>
        )
    }

    if (error || !event || !event.competitions_details) {
        return (
            <div className="bg-[#0f0f0f] min-h-screen text-white flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
                <p className="text-gray-400 mb-8">We couldn't find the event you're looking for.</p>
                <Button onClick={() => navigate(-1)} className="bg-codeblue hover:bg-codeblue/90 text-white rounded-full px-6">
                    Go Back
                </Button>
            </div>
        )
    }

    const { competitions_details: details, expert } = event
    const program = details.program

    return (
        <div className="bg-[#0f0f0f] min-h-screen text-white font-sans selection:bg-codeblue selection:text-white flex flex-col">
            <style>{`
                header.sticky.top-0:not(.custom-create-header) {
                    display: none !important;
                }
            `}</style>
            <SEO
                title={`${program.name} | enCODE`}
                description={program.description.replace(/<[^>]+>/g, '').substring(0, 160)}
                image={program.image}
            />
            
            {/* Global Header */}
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
                        Join for Free
                    </Button>
                </div>
            </header>

            <main className="flex-1 w-full px-4 md:px-8 xl:px-12 py-8 md:py-12 space-y-8">
                <HeroBanner 
                    // title={program.name} 
                    image={program.image} 
                    // organizer={program.organization_name} 
                />

                <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

                {activeTab === 'overview' ? (
                    <OverviewTab details={details} />
                ) : (
                    <ExpertDetailsTab expert={expert} />
                )}

                {/* Other Events Section */}
                <OtherEvents 
                    currentEventId={id!} 
                    categoryId={details.event_details?.event_category_id}
                    categoryName={category}
                />
            </main>

            

            <Footer />
        </div>
    )
}

export default EventPage
