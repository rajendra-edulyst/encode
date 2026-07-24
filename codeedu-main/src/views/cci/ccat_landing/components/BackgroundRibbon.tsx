import React from 'react'

interface BackgroundRibbonProps {
    className?: string
}

const BackgroundRibbon: React.FC<BackgroundRibbonProps> = ({ className = '' }) => {
    return (
        <div className={`pointer-events-none ${className}`}>
            <video 
                src="/video/getty.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover mix-blend-screen opacity-70"
            />
        </div>
    )
}

export default BackgroundRibbon
