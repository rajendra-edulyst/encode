import React from 'react'
import { AudienceSectionProps } from './types'
// Import the image provided by the user
import audienceImage from './ChatGPT Image Jul 9, 2026, 04_12_20 PM-Photoroom.png'

const AudienceSection: React.FC<AudienceSectionProps> = ({
    title,
    subtitle
}) => {
    return (
        <section className="w-full py-20 px-4 md:px-10 2xl:px-20 relative z-10">
            <div className="w-full flex flex-col items-start relative z-10">
                <div className="text-left mb-12 max-w-3xl">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                        {title}
                    </h2>
                    <p className="text-gray-300 text-xl sm:text-2xl font-light mt-6">
                        {subtitle}
                    </p>
                </div>
                
                <div className="w-full relative flex justify-start items-start">
                    {/* Tightly wrap the image to ensure percentage positioning works correctly */}
                    <div className="relative w-[45%] md:w-[40%] lg:w-[45%] max-w-[600px] xl:max-w-[700px] ml-0">
                        <img 
                            src={audienceImage} 
                            alt="Audience Graphic" 
                            className="w-full h-auto object-contain"
                        />
                        
                        {/* Center Circle Text */}
                        <div className="absolute top-[51%] left-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center z-20 w-[80%]">
                            <span className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif text-white mb-1">CCIQ</span>
                            <span className="text-[10px] sm:text-sm md:text-base lg:text-lg text-white font-light leading-tight">Competitive<br/>Capability Index</span>
                        </div>
                        
                        {/* 1. Yellow - Aspiring Designers */}
                        <div className="absolute top-[8%] left-[57%] w-[200px] sm:w-[300px] md:w-[350px] lg:w-[450px]">
                            <h3 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#FFDE00] mb-1">Aspiring Designers</h3>
                            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 leading-tight">For those pursuing or planning B.Des, B.Arch, BFA, NID, NIFT & other design programs.</p>
                        </div>

                        {/* 2. Orange - Curious Creators */}
                        <div className="absolute top-[26%] left-[90%] w-[200px] sm:w-[300px] md:w-[350px] lg:w-[450px]">
                            <h3 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#FFA500] mb-1">Curious Creators</h3>
                            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 leading-tight">Turn your curiosity into clarity and direction.</p>
                        </div>

                        {/* 3. Green - Creative Industries */}
                        <div className="absolute top-[48%] left-[98%] w-[200px] sm:w-[300px] md:w-[350px] lg:w-[450px]">
                            <h3 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#39FF14] mb-1">Creative Industries</h3>
                            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 leading-tight">For creative industries that prioritize originality, design, and expression.</p>
                        </div>

                        {/* 4. Blue - Future Innovators */}
                        <div className="absolute top-[70%] left-[90%] w-[200px] sm:w-[300px] md:w-[350px] lg:w-[450px]">
                            <h3 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#00BFFF] mb-1">Future Innovators</h3>
                            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 leading-tight">Understand how you think, solve, and build what's next.</p>
                        </div>

                        {/* 5. Purple - Talent-Forward Institutions */}
                        <div className="absolute top-[88%] left-[58%] w-[200px] sm:w-[300px] md:w-[350px] lg:w-[450px]">
                            <h3 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#8A2BE2] mb-1">Talent-Forward Institutions</h3>
                            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 leading-tight">Identify and nurture creative capability beyond academic scores.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AudienceSection
