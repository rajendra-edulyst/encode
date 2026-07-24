import React from 'react'

interface HeroBannerProps {
    title?: string
    image: string
    organizer?: string
}

const HeroBanner: React.FC<HeroBannerProps> = ({ title, image, organizer }) => {
    return (
        <div className="relative w-full h-[350px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden group">
            {/* Background Image */}
            <img 
                src={image} 
                alt={title || "Event Banner"} 
                className="absolute inset-0 w-full h-full object-fill transform scale-[1.01] transition-transform duration-700 group-hover:scale-[1.05]"
            />

            {/* Content Container (Empty since text is in image) */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col justify-end pointer-events-none">
                {title && (
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">
                        {title}
                    </h1>
                )}
                {organizer && (
                    <p className="text-gray-300 text-sm md:text-base font-medium">
                        Organized by <span className="text-cyan-400 underline decoration-cyan-400/50 underline-offset-4">{organizer}</span>
                    </p>
                )}
            </div>
        </div>
    )
}

export default HeroBanner
