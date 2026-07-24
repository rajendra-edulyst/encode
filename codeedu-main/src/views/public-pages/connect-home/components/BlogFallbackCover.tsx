import React from 'react'

interface BlogFallbackCoverProps {
    title: string
}

const BlogFallbackCover = ({ title }: BlogFallbackCoverProps) => {
    return (
        <div className="relative w-full h-full bg-[#E2DFD2] flex items-center justify-center p-6 text-center border border-gray-200">
            <div className="absolute top-4 left-4">
                <img 
                    src="/logo-light-full-1@2x.png" 
                    alt="Logo" 
                    className="h-6 object-contain opacity-80"
                />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 line-clamp-3">
                {title || 'Blog Post'}
            </h3>
        </div>
    )
}

export default BlogFallbackCover
