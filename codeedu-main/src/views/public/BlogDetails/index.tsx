import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import parse from 'html-react-parser';
import { usePublicBlogs } from '@/hooks/data/public/usePublicBlogs';
import { getBlogFAQs } from '@/utils/blogFaqs';
import { Skeleton } from '@/components/ui/skeleton';
import dayjs from 'dayjs';
import { useAuth } from '@/auth';
import { Helmet } from 'react-helmet-async';
import SEO from '@/components/SEO/SEO';
import { Button } from '@/components/ui/ShadcnButton';
import { Calendar, Clock, Facebook, Linkedin, MessageCircleMore, Twitter, Instagram, YoutubeIcon } from 'lucide-react';
import { useSettings } from '@/hooks/data/useSettings';
import { BsTwitterX } from "react-icons/bs";
import NewLogo from '@/assets/images/New_Logo.png';

const stripHtml = (html: string) => {
    return (html || '').replace(/<[^>]*>?/gm, '').trim();
};

const generateKeywords = (title: string, description: string) => {
    const combined = `${title} ${stripHtml(description)}`;
    const words = combined.toLowerCase().split(/\W+/);
    const keywords = [...new Set(words)]
        .filter(word => word.length > 4) // Filter out short words
        .slice(0, 10); // Limit to 10 keywords
    return keywords.join(', ');
};

const truncateDescription = (description?: string) => {
    const plainText = stripHtml(description || '');
    return plainText.substring(0, 160) || 'Read this amazing article.';
};

const BlogDetails = () => {
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { authenticated } = useAuth();
    const { data: settings } = useSettings();
    const social_links = settings?.configuration?.social_links || {};
    const policies = settings?.configuration?.policies || [];

    const { data: allBlogs = [], isLoading: blogsLoading } = usePublicBlogs();

    const blog = useMemo(() => {
        let postId = parseInt(location.search.replace('?', '').replace('pid=', ''));
        if (isNaN(postId)) {
            postId = parseInt(new URLSearchParams(location.search).get('pid') ?? '0');
        }
        return allBlogs.find(b => b.id === postId) || null;
    }, [allBlogs, location.search]);

    const otherBlogs = useMemo(() => {
        const seen = new Set<number>();
        const filtered = allBlogs.filter(b => {
            const isBlog = Number(b.content_type) === 21 || Number(b.content_type) === 1;
            if (!isBlog) return false;
            const idNum = Number(b.id);
            if (seen.has(idNum)) return false;
            seen.add(idNum);
            return true;
        });
        if (!blog) return filtered;
        return filtered.filter(b => b.id !== blog.id);
    }, [allBlogs, blog]);

    const loading = blogsLoading;

    const parsedDescription = useMemo(() => {
        if (!blog?.description) return null;
        return parse(blog.description);
    }, [blog?.description]);

    const faqs = useMemo(() => getBlogFAQs(blog), [blog]);

    const isAeoBlog = useMemo(() => {
        return (
            slug?.toLowerCase() === 'aeo' ||
            blog?.title?.toLowerCase() === 'aeo'
        );
    }, [slug, blog]);

    // Enforce strict slug matching
    useEffect(() => {
        if (blog && blog.title) {
            const expectedSlug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            if (slug && slug !== expectedSlug) {
                const basePath = location.pathname.startsWith('/connect') ? '/connect/blogs' : '/blogs';
                navigate(`${basePath}/${expectedSlug}/pid${location.search}`, { replace: true });
            }
        }
    }, [blog, slug, location.pathname, location.search, navigate]);

    // Scroll to top on navigation
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.search]);



    if (authenticated && !location.pathname.startsWith('/connect')) {
        return <Navigate to={`/connect/blogs/${slug}/pid${location.search}`} replace />;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="lg:w-2/3">
                            <Skeleton className="h-12 w-3/4 mb-6" />
                            <div className="flex gap-6 mb-8">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="w-full aspect-video rounded-xl mb-10" />
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                        <div className="lg:w-1/3">
                            <Skeleton className="h-8 w-1/2 mb-6" />
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-4">
                                        <Skeleton className="w-24 h-24 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-3 w-2/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center gap-4">
                <h2 className="text-3xl font-bold">Blog not found</h2>
                <Button onClick={() => navigate('/')} className="bg-codeblue hover:bg-codeblue/80 text-white">
                    Go Home
                </Button>
            </div>
        );
    }

    const shareUrl = window.location.href;
    const shareTitle = `${blog.title} - enCODE Blog`;

    const aeoSummaryText = "Summary Section: AI loves summaries. Key Takeaways: ✔ Speak confidently. ✔ Smile. ✔ Introduce yourself. ✔ Grab attention. ✔ End with a call to action.";

    const seoDescription = isAeoBlog
        ? `${aeoSummaryText} ${truncateDescription(blog.description)}`
        : truncateDescription(blog.description);

    const articleBodyText = isAeoBlog
        ? `${aeoSummaryText} ${stripHtml(blog.description || '')}`
        : stripHtml(blog.description || '');

    const seoKeywords = blog?.tag
        ? blog.tag.split(',').map(tag => tag.trim().replace(/^#+/, '')).join(', ')
        : generateKeywords(blog.title, blog.description || '');
    const authorName = `enCODE : ${blog?.name || blog?.created_by_name || 'CODE Edu'}`;
    const authorImage = blog?.created_by_profile_image || blog?.created_by_image;
    const publishDate = blog.created_at ? new Date(blog.created_at * 1000).toISOString().split('T')[0] : undefined;
    const encodedShareUrl = encodeURIComponent(shareUrl);
    const encodedShareTitle = encodeURIComponent(shareTitle);
    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareTitle}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col justify-between">
            <SEO
                title={`${blog.title} | enCODE Blog`}
                description={seoDescription}
                author={authorName}
                url={shareUrl}
                canonical={shareUrl}
                image={blog.thumbnail_url || 'https://encode.codeedu.co/img/logo/logo-light-full.png'}
                type="article"
                publishDate={publishDate}
                twitterHandle="@codeeduofficial"
                aeoType="BlogPosting"
                authorDetails={{
                    type: 'Person',
                    name: blog.name || "CODE Edu",
                    profilePhoto: blog.created_by_profile_image || blog.created_by_image || undefined
                }}
                breadcrumbs={[
                    { name: "Blogs", path: "/blogs" },
                    { name: blog.title }
                ]}
                speakableSelectors={[".blog-title", ".blog-content"]}
                articleBody={articleBodyText}
                keywords={seoKeywords}
                articleSection={blog?.tag?.split(',')[0]?.trim().replace(/^#+/, '') || undefined}
                faqData={faqs}
                readingTime={blog.read_time ? `${blog.read_time} minutes` : "4 minutes"}
            />
            <Helmet>
                {/* Preload critical LCP image */}
                {blog.thumbnail_url && (
                    <link
                        rel="preload"
                        as="image"
                        href={blog.thumbnail_url}
                        fetchPriority="high"
                    />
                )}
            </Helmet>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full py-12 flex-grow">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        <h1 className="text-3xl md:text-5xl font-jacques font-bold mb-6 leading-tight blog-title">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8 border-b border-gray-800 pb-8">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{dayjs(blog.created_at * 1000).format('MMMM DD, YYYY')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>{blog.read_time || '5'} min read</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {authorImage ? (
                                    <img
                                        src={authorImage}
                                        alt={authorName}
                                        className="w-7 h-7 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-gray-500/30 flex items-center justify-center">
                                        <span className="text-xs font-semibold text-white">
                                            {authorName.replace('enCODE : ', '').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <span className="text-sm font-medium text-gray-200">{authorName}</span>
                            </div>
                        </div>

                        {blog.thumbnail_url && (
                            <div className="w-full aspect-video rounded-xl mb-10 overflow-hidden bg-gray-900 border border-gray-800">
                                <img
                                    src={blog.thumbnail_url}
                                    alt={blog.title}
                                    className="w-full h-full object-cover shadow-lg"
                                    {...({ fetchpriority: "high" } as Record<string, unknown>)}
                                    loading="eager"
                                    width={1200}
                                    height={675}
                                />
                            </div>
                        )}

                        {/* Summary Section / Key Takeaways for AEO */}
                        {isAeoBlog && (
                            <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-[#1c1c24] to-[#121217] border border-[#3b3b4a] shadow-2xl relative overflow-hidden group hover:border-[#00A8E9]/60 transition-all duration-300">
                                <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-[#00A8E9]/5 blur-3xl pointer-events-none group-hover:bg-[#00A8E9]/15 transition-all duration-500" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="flex h-2 w-2 rounded-full bg-[#00A8E9] animate-pulse" />
                                        <span className="text-xs font-semibold tracking-wider text-[#00A8E9] uppercase">Summary Section</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2 font-jacques">
                                        Key Takeaways
                                    </h2>
                                    <p className="text-sm text-gray-400 mb-6 italic">
                                        &quot;AI loves summaries.&quot;
                                    </p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            "Speak confidently",
                                            "Smile",
                                            "Introduce yourself",
                                            "Grab attention",
                                            "End with a call to action"
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-200 hover:text-white transition-colors duration-200">
                                                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#00A8E9]/15 text-[#00A8E9] border border-[#00A8E9]/30">
                                                    ✔
                                                </span>
                                                <span className="text-sm font-medium leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-light leading-relaxed mb-12 blog-content">
                            {parsedDescription}
                        </div>
                        {blog?.tag && (
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8 -mt-4">
                                {blog.tag.split(',').map((tag, index) => (
                                    <span key={index} className="text-primary font-medium hover:underline cursor-pointer transition-colors">
                                        {tag.trim().replace(/^#+/, '')}
                                    </span>
                                ))}
                            </div>
                        )}

                        {faqs && faqs.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-gray-800 faq-section">
                                <h2 className="text-2xl font-bold font-jacques mb-6">Frequently Asked Questions</h2>
                                <div className="space-y-6">
                                    {faqs.map((faq, index) => (
                                        <div key={index} className="space-y-2">
                                            <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                                            <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-gray-800 pt-8 mt-12">
                            <h2 className="text-xl font-bold mb-4 font-jacques">Share this article</h2>
                            <div className="flex gap-4">
                                <a
                                    href={shareLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Share on Facebook"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
                                >
                                    <Facebook size={18} />
                                </a>
                                <a
                                    href={shareLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Share on Twitter"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:opacity-90 transition-opacity"
                                >
                                    <Twitter size={18} />
                                </a>
                                <a
                                    href={shareLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Share on LinkedIn"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-90 transition-opacity"
                                >
                                    <Linkedin size={18} />
                                </a>
                                <a
                                    href={shareLinks.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Share on WhatsApp"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white hover:opacity-90 transition-opacity"
                                >
                                    <MessageCircleMore size={18} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Left/Right Sidebar - Other Blogs Buzz */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-24">
                            <h2 className="text-2xl font-bold font-jacques mb-6 border-b border-gray-800 pb-4">
                                Explore more blog buzz
                            </h2>
                            <div className="flex flex-col gap-6">
                                {otherBlogs.map(otherBlog => {
                                    const imageUrl = otherBlog.thumbnail_url || otherBlog.multi_file_uploads?.[0] || '';
                                    return (
                                        <div
                                            key={otherBlog.id}
                                            className="group cursor-pointer"
                                            onClick={() => {
                                                const slug = otherBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                                const baseRoute = location.pathname.startsWith('/connect') ? '/connect/blogs' : '/blogs';
                                                const targetUrl = `${baseRoute}/${slug}/pid?pid=${otherBlog.id}`;
                                                navigate(targetUrl);
                                            }}
                                        >
                                            <div className="flex gap-4 items-start">
                                                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden relative border border-gray-800 bg-gray-900">
                                                    <img
                                                        src={imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherBlog.title || 'Unknown')}&background=random`}
                                                        alt={otherBlog.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        loading="lazy"
                                                        width={96}
                                                        height={96}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(otherBlog.title || 'Unknown')}&background=random`;
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="font-bold text-base line-clamp-2 group-hover:text-codeblue transition-colors mb-2">
                                                        {otherBlog.title}
                                                    </h3>
                                                    <span className="text-xs text-gray-500">
                                                        {dayjs(otherBlog.created_at * 1000).format('MMM DD, YYYY')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {otherBlogs.length === 0 && (
                                    <div className="text-gray-500 text-sm">No other blogs available.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black text-white border-t border-gray-800 w-full shrink-0">
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
                                    policies.map((policy: { url: string; title: string }, index: number) => (
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
    );
};

export default BlogDetails;
