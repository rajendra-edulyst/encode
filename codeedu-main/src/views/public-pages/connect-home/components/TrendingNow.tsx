import React, { useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Post } from '@/@types/learner/Social'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface TrendingNowProps {
    blogs: Post[]
    loading: boolean
}

const TrendingNow = ({ blogs, loading }: TrendingNowProps) => {
    const navigate = useNavigate()
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const generateSlug = (title: string) => {
        if (!title) return 'blog-post'
        return title.toLowerCase().replace(/[^a-z0-9]/g, '-')
    }

    const scrollPrev = useCallback(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    }, [])

    const scrollNext = useCallback(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    }, [])

    return (
        <section className="mb-8">
            <div className="bg-[#1D1D1D] rounded-2xl p-6 md:p-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-[30px] lg:text-[32px] font-semibold text-codegreen">Trending Now

                        </h2>
                        <p className="mt-2 text-[30px] lg:text-[22px] font-normal leading-[1.1] text-#FFFFFF max-w-3xl">
                            The conversations shaping our community today.</p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <Link to="/connect-home/blogs"
                            className="text-xs font-bold text-[#86efac] tracking-wider hover:text-white transition-colors mt-2">
                            VIEW ALL
                        </Link>
                    </div>
                </div>

                <div className="relative group">
                    <style>{`
                    .hide-scroll::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scroll {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
                    <div
                        className="flex gap-6 pb-8 pt-4 px-2 overflow-x-auto snap-x snap-mandatory hide-scroll scroll-smooth"
                        ref={scrollContainerRef}
                    >
                        {loading ? (
                            <div className="text-gray-400 p-4">Loading trending blogs...</div>
                        ) : blogs.slice(0, 10).map((blog, idx) => {
                            const authorName = (blog as any)?.user_name || 'Anonymous'
                            const authorPic = (blog as any)?.user_profile_image || `https://i.pravatar.cc/150?u=${(blog as any).id || idx}`
                            // Format content (strip html)
                            const rawContent = (blog as any)?.title || (blog as any)?.description || ''
                            const description = rawContent.replace(/<[^>]*>?/gm, '')

                            return (
                                <div
                                    key={(blog as any).id || idx}
                                    className="flex-[0_0_85%] md:flex-[0_0_calc(50%-12px)] xl:flex-[0_0_calc(25%-18px)] min-w-0 cursor-pointer snap-start"
                                    onClick={() => navigate(`/connect/blogs/${generateSlug((blog as any).title)}/pid?pid=${(blog as any).id}`)}
                                >
                                    <div className="bg-[#1a1a1a] rounded-[24px] overflow-hidden flex flex-col h-full group hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-800">
                                        <div className="h-56 overflow-hidden relative">
                                            <img
                                                src={(blog as any)?.multi_file_uploads?.[0] || (blog as any)?.thumbnail_url || `https://images.unsplash.com/photo-${1550000000000 + idx}?auto=format&fit=crop&w=600&h=400`}
                                                alt="Blog thumbnail"
                                                className="w-full h-full object-fit:cover group-hover:scale-105 transition-transform duration-700"
                                                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=400' }}
                                            />
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={authorPic} alt={authorName} className="w-8 h-8 rounded-full object-cover" />
                                                    <span className="text-[15px] text-codepink font-semibold">{authorName}</span>
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium">{dayjs((blog as any).sort_date || (blog as any).created_at).fromNow()}</span>
                                            </div>
                                            <p className="text-gray-400 text-[15px] leading-relaxed mb-6 flex-1 line-clamp-3">
                                                {description || 'Join the conversation by reading this amazing blog post written by one of our top community members.'}
                                            </p>

                                            <div className="flex items-center gap-6 text-[15px] pt-2">
                                                <div className="flex items-center gap-2 cursor-pointer group">
                                                    <img
                                                        src="/img/icons/connect/Applaud_Full.png"
                                                        alt="Applaud"
                                                        className="w-5 h-5 object-contain group-hover:scale-110 transition-transform"
                                                    />
                                                    <span className="text-white font-bold">{(blog as any).like_count || '0'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 cursor-pointer group">
                                                    <img
                                                        src="/img/icons/connect/Comment_Full.png"
                                                        alt="Comment"
                                                        className="w-5 h-5 object-contain group-hover:scale-110 transition-transform"
                                                    />
                                                    <span className="text-white font-bold">{(blog as any).comment_count || '0'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 cursor-pointer group">
                                                    <img
                                                        src="/img/icons/connect/share_windows.png"
                                                        alt="Share"
                                                        className="w-5 h-5 object-contain group-hover:scale-110 transition-transform"
                                                    />
                                                    <span className="text-white font-bold">{(blog as any).repost_count || (blog as any).view_count || '0'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <button
                        className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#00b7ff] bg-[#1a1a1a] flex items-center justify-center hover:bg-[#222] transition-colors z-10 shadow-lg hidden md:flex opacity-0 group-hover:opacity-100"
                        onClick={scrollPrev}
                    >
                        <ChevronLeft className="w-6 h-6 text-[#00b7ff]" />
                    </button>
                    <button
                        className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#00b7ff] bg-[#1a1a1a] flex items-center justify-center hover:bg-[#222] transition-colors z-10 shadow-lg hidden md:flex opacity-0 group-hover:opacity-100"
                        onClick={scrollNext}
                    >
                        <ChevronRight className="w-6 h-6 text-[#00b7ff]" />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default TrendingNow
