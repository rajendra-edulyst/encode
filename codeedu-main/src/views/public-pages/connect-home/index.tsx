import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '@/components/SEO/SEO'
import { Button } from '@/components/ui/ShadcnButton'
import NewLogo from '@/assets/images/New_Logo.png'
import ConnectHero from './components/ConnectHero'
import TrendingNow from './components/TrendingNow'
import EngineeredForConnection from './components/EngineeredForConnection'
import LatestBlogs from './components/LatestBlogs'
import MeetTheCreators from './components/MeetTheCreators'
import Footer from '../create-home/components/Footer'
import { Post } from '@/@types/learner/Social'

const ConnectHome = () => {
    const navigate = useNavigate()
    const [blogs, setBlogs] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                const response = await fetch('https://encodeapi.codeedu.co/api/get-post?post_type=blog&content_type=21', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'nlms-api-key': '0612b32b39f4b29f48c5c5363028ee916bb99CodeEdu'
                    }
                })
                const result = await response.json()
                setBlogs(result?.data?.post || [])
            } catch (error) {
                console.error("Failed to load blogs", error)
            } finally {
                setLoading(false)
            }
        }
        loadBlogs()
    }, [])

    return (
        <div className="bg-[#0f0f0f] min-h-screen text-white font-sans selection:bg-codepink selection:text-white">
            <style>{`
                header.sticky.top-0:not(.custom-connect-header) {
                    display: none !important;
                }
            `}</style>
            <SEO
                title="Connect | enCODE"
                description="The Home for Your Ideas. Share your unique thoughts, discover inspiring stories, and join a vibrant community of creators."
            />

            <header className="custom-connect-header sticky top-0 z-50 flex items-center justify-between shadow border-b border-gray-800 bg-[#0f0f0f] h-[80px] xl:h-[96px] px-4 md:px-8 xl:px-12">
                <Link to="/">
                    <img src={NewLogo} alt="enCODE Logo" className="w-32 xl:w-40" />
                </Link>
                <div className="flex items-center gap-4">
                    <button
                        className="text-codepink hover:text-white transition-colors font-medium text-sm lg:text-base"
                        onClick={() => navigate('/sign-in')}
                    >
                        Log In
                    </button>
                    <Button
                        className="bg-codepink hover:bg-codepink/90 text-white rounded-full px-6 py-2"
                        onClick={() => navigate('/sign-up')}
                    >
                        Join for free
                    </Button>
                </div>
            </header>

            <div className="w-full px-4 md:px-8 xl:px-12 overflow-hidden">
                <ConnectHero />
                <TrendingNow blogs={blogs} loading={loading} />
                <EngineeredForConnection />
                <LatestBlogs blogs={blogs} loading={loading} />
                <MeetTheCreators />
            </div>

            <Footer />
        </div>
    )
}

export default ConnectHome
