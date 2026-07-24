import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/ShadcnButton'
import { Link } from 'react-router-dom'

const MeetTheCreators = () => {
    const [creators, setCreators] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCreators = async () => {
            try {
                const res = await fetch('https://encodeapi.codeedu.co/api/v1/get-infocus-promotions', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'nlms-api-key': '0612b32b39f4b29f48c5c5363028ee916bb99CodeEdu'
                    }
                })
                const json = await res.json()

                if (json?.data && Array.isArray(json.data)) {
                    const fetchedCreators = json.data.map((item: any) => {
                        const profile = item.profiles?.[0] || {}
                        return {
                            id: item.id,
                            name: item.display_name || profile.name || 'Creator',
                            role: item.placeholder || profile.org_description || 'Creator',
                            image: profile.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.display_name || 'Creator')}`
                        }
                    })
                    setCreators(fetchedCreators)
                }
            } catch (error) {
                console.error("Failed to fetch creators", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCreators()
    }, [])
    return (
        <section className="mb-8">
            <div className="bg-[#1D1D1D] rounded-2xl p-6 md:p-8">
                <div className="bg-[#151515] rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden text-center border border-gray-800">
                    {/* Abstract Background pattern placeholder */}
                    <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-[#151515] opacity-80 z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-[#151515] via-transparent to-[#151515] opacity-80 z-0"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 font-serif italic tracking-wide">Meet the Creators</h2>

                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16">
                            {loading ? (
                                <div className="text-gray-400">Loading creators...</div>
                            ) : creators.length > 0 ? (
                                creators.map((creator, idx) => (
                                    <div key={creator.id || idx} className="flex flex-col items-center">
                                        <img
                                            src={creator.image}
                                            alt={creator.name}
                                            className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover border-[3px] border-gray-800 mb-4 transition-all duration-300"
                                        />
                                        <h4 className="text-white font-bold text-[15px]">{creator.name}</h4>
                                        <p className="text-gray-500 text-xs">{creator.role}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-400">No creators found.</div>
                            )}
                        </div>

                        <div className="flex justify-center gap-4">
                            <Link to="/register">
                                <Button className="bg-[#00b7ff] hover:bg-[#00b7ff]/90 text-black rounded-lg px-8 py-2.5 font-semibold text-sm">
                                    Get Started Now
                                </Button>
                            </Link>

                            <Link to="/register">
                                <Button className="bg-codepink hover:bg-codepink/90 text-white rounded-lg px-8 py-2.5 font-semibold text-sm">
                                    Add a Blog
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MeetTheCreators
