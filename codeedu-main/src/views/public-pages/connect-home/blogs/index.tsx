import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '@/components/SEO/SEO'
import { Button } from '@/components/ui/ShadcnButton'
import NewLogo from '@/assets/images/New_Logo.png'
import Footer from '../../create-home/components/Footer'
import { Post } from '@/@types/learner/Social'
import BlogFallbackCover from '../components/BlogFallbackCover'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const generateSlug = (title: string) => {
    if (!title) return 'blog-post'
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

const ConnectBlogs = () => {
    const navigate = useNavigate()
    const [blogs, setBlogs] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                // Using the blog API instead of the user profile API provided, since we want to list blogs.
                const response = await fetch('https://encodeapi.codeedu.co/api/get-post?post_type=blog&content_type=21', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'nlms-api-key': '0612b32b39f4b29f48c5c5363028ee916bb99CodeEdu'
                    }
                })
                const result = await response.json()
                const fetchedBlogs = result?.data?.post || []

                // Sort by date descending
                const sortedBlogs = [...fetchedBlogs].sort((a, b) => {
                    return new Date((b as any).sort_date || (b as any).created_at || 0).getTime() - new Date((a as any).sort_date || (a as any).created_at || 0).getTime()
                })
                setBlogs(sortedBlogs)
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
                title="All Blogs | Connect | enCODE"
                description="Explore all our latest blogs and articles."
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

            <div className="w-full px-4 md:px-8 xl:px-12 py-12">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        All <span className="text-codepink">Blogs</span>
                    </h1>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-gray-400 text-lg">Loading blogs...</div>
                ) : blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {blogs.map((blog: any) => {
                            const descRaw = blog.description || blog.content || ''
                            const desc = descRaw.replace(/<[^>]*>?/gm, '').substring(0, 100) + (descRaw.length > 100 ? '...' : '')
                            const authorName = blog.user_name || 'Anonymous'
                            const authorPic = blog.user_profile_image || `https://i.pravatar.cc/150?u=${blog.id}`
                            const blogImage = blog.multi_file_uploads?.[0] || blog.thumbnail_url

                            return (
                                <div
                                    key={blog.id}
                                    className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg border border-transparent hover:border-gray-800 transition-colors cursor-pointer group flex flex-col"
                                    onClick={() => navigate(`/connect/blogs/${generateSlug(blog.title)}/pid?pid=${blog.id}`)}
                                >
                                    <div className="h-48 relative overflow-hidden">
                                        {blogImage ? (
                                            <img src={blogImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                                        ) : (
                                            <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
                                                <BlogFallbackCover title={blog.title || ''} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-2">
                                                <img src={authorPic} alt={authorName} className="w-6 h-6 rounded-full object-cover border border-gray-700" />
                                                <span className="text-xs text-gray-300 font-medium line-clamp-1">{authorName}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-500 whitespace-nowrap">{dayjs(blog.sort_date || blog.created_at).fromNow()}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-3 leading-tight line-clamp-2 group-hover:text-[#00b7ff] transition-colors">
                                            {blog.title || 'Untitled Blog'}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                                            {desc || 'No description available for this blog post.'}
                                        </p>
                                        <div className="mt-auto">
                                            <span className="text-codepink text-xs font-semibold hover:underline">Read Article →</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="py-16 text-center text-gray-400">No blogs found.</div>
                )}
            </div>

            <Footer />
        </div>
    )
}

export default ConnectBlogs
