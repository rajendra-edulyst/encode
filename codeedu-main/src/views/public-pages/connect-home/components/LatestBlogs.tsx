import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/ShadcnButton'
import { Post } from '@/@types/learner/Social'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface LatestBlogsProps {
    blogs: Post[]
    loading: boolean
}

const LatestBlogs = ({ blogs, loading }: LatestBlogsProps) => {
    const navigate = useNavigate()
    
    const generateSlug = (title: string) => {
        if (!title) return 'blog-post'
        return title.toLowerCase().replace(/[^a-z0-9]/g, '-')
    }
    
    if (loading) {
        return <div className="py-16 text-center text-gray-400">Loading latest blogs...</div>
    }

    // Sort blogs by sort_date descending
    const sortedBlogs = [...blogs].sort((a, b) => {
        return new Date((b as any).sort_date || (b as any).created_at || 0).getTime() - new Date((a as any).sort_date || (a as any).created_at || 0).getTime()
    })

    const featuredBlog = sortedBlogs[0]
    const quickReads = sortedBlogs.slice(1, 5)

    if (!featuredBlog) return null;

    const featuredAuthorName = (featuredBlog as any)?.user_name || 'Anonymous'
    const featuredAuthorPic = (featuredBlog as any)?.user_profile_image || `https://i.pravatar.cc/150?u=${(featuredBlog as any).id}`
    const featuredDescRaw = (featuredBlog as any)?.description || (featuredBlog as any)?.content || ''
    const featuredDesc = featuredDescRaw.replace(/<[^>]*>?/gm, '').substring(0, 200) + (featuredDescRaw.length > 200 ? '...' : '')
    const featuredImage = (featuredBlog as any)?.multi_file_uploads?.[0] || (featuredBlog as any)?.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'

    return (
        <section className="mb-8">
            <div className="bg-[#1D1D1D] rounded-2xl p-6 md:p-8">
                        <h2 className="text-[30px] lg:text-[32px] font-semibold text-codepink mb-8">
                Latest Blogs</h2>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Featured Blog */}
                <div 
                    className="flex-1 bg-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-lg border border-transparent hover:border-gray-800 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/connect/blogs/${generateSlug((featuredBlog as any).title)}/pid?pid=${(featuredBlog as any).id}`)}
                >
                    <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                        <img src={featuredImage} alt="Featured Blog" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80' }}/>
                    </div>
                    <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <img src={featuredAuthorPic} alt={featuredAuthorName} className="w-6 h-6 rounded-full object-cover border border-gray-700" />
                                <span className="text-sm text-gray-300 font-medium">{featuredAuthorName}</span>
                            </div>
                            <span className="text-xs text-gray-500">{dayjs((featuredBlog as any).sort_date || (featuredBlog as any).created_at).fromNow()}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-codepink mb-4 leading-tight line-clamp-2">
                            {(featuredBlog as any).title || 'The Philosophy of High-Fidelity Human Connection'}
                        </h3>
                        <p className="text-gray-400 text-[15px] leading-relaxed mb-8 line-clamp-4">
                            {featuredDesc || 'Why we chose a digital environment that prioritizes depth over speed, and how "focused engagement" leads to better creative collaboration among global teams.'}
                        </p>
                        <div>
                            <Button className="bg-[#00b7ff] hover:bg-[#00b7ff]/90 text-black font-semibold rounded-lg px-6 py-2.5 text-sm">
                                Read Full Article
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Quick Reads */}
                <div className="w-full lg:w-[350px] xl:w-[400px] flex flex-col gap-4">
                    <h3 className="text-codepink font-bold text-xxl mb-2">Quick Reads</h3>
                    {quickReads.map((blog, idx) => {
                        const descRaw = (blog as any).description || (blog as any).content || ''
                        const desc = descRaw.replace(/<[^>]*>?/gm, '').substring(0, 60) + (descRaw.length > 60 ? '...' : '')
                        const readTime = Math.max(3, Math.floor(desc.length / 50)) // dummy read time
                        return (
                            <div 
                                key={(blog as any).id || idx} 
                                className="bg-[#1a1a1a] rounded-xl p-5 hover:bg-[#222] transition-colors cursor-pointer group border border-transparent hover:border-gray-800"
                                onClick={() => navigate(`/connect/blogs/${generateSlug((blog as any).title)}/pid?pid=${(blog as any).id}`)}
                            >
                                <h4 className="text-white font-bold text-[15px] mb-1.5 group-hover:text-[#00b7ff] transition-colors line-clamp-1">
                                    {(blog as any).title || 'Micro-Interactions in 2026'}
                                </h4>
                                <p className="text-gray-400 text-sm mb-3 line-clamp-1">
                                    {desc || 'How haptic feedback is coming to web UI'}
                                </p>
                                <span className="text-codepink text-xs font-semibold">{readTime} min read</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            </div>
        </section>
    )
}

export default LatestBlogs
