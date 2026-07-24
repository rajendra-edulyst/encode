import React from 'react'
import { EvaluationCardProps } from './types'

// Import the 5 frame backgrounds for the cards (names reflect their actual rendered colors)
import framePinkImg from './Frame 1410081288 (1).png'
import frameGreenImg from './Frame 1410081288 (2).png'
import frameOrangeImg from './Frame 1410081288 (4).png'
import framePurpleImg from './Frame 1410081288 (5).png'
import frameCyanImg from './Frame 1410081288 (6).png'

// Import the 5 icons
import iconFlowchart from './flowchart.png' // Pink/Magenta icon
import iconPalette from './palette.png'     // Cyan icon
import iconExtension from './extension.png' // Orange icon
import iconNeurology from './neurology.png' // Purple icon
import iconDiversity from './diversity_1.png' // Green icon

const EvaluationCard: React.FC<EvaluationCardProps> = ({
    title,
    description,
    colorTheme = 'purple'
}) => {
    // Map the themes to the corresponding frame image with matching color
    const frames: Record<string, string> = {
        purple: framePurpleImg,
        orange: frameOrangeImg,
        cyan: frameCyanImg,
        pink: framePinkImg,
        green: frameGreenImg
    }
    
    // Map the themes to the corresponding PNG icons with matching color
    const icons: Record<string, string> = {
        purple: iconNeurology,     // Purple icon (Brain/Creative)
        orange: iconExtension,     // Orange icon (Puzzle/Problem Solving)
        cyan: iconPalette,         // Cyan icon (Palette/Expressions)
        pink: iconFlowchart,       // Pink icon (Flowchart/AI Fluency)
        green: iconDiversity       // Green icon (People/Collaboration)
    }

    const frameImage = frames[colorTheme]
    const iconImage = icons[colorTheme]

    return (
        <div className="relative w-full max-w-[420px] pt-6 mt-6 group flex flex-col items-center justify-center">
            <div className="relative w-full h-auto transform transition-transform duration-300 group-hover:-translate-y-2">
                {/* The frame image serves as the complete background */}
                <img 
                    src={frameImage} 
                    alt={title} 
                    className="w-full h-auto object-contain"
                />
                
                {/* Text and Icon overlaid on top of the frame. */}
                <div className="absolute inset-0 z-10 w-full h-full">
                    {/* Render the static PNG icon smaller and higher up */}
                    <img 
                        src={iconImage} 
                        alt={`${colorTheme} icon`} 
                        className="absolute top-[16%] left-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    />
                    
                    {/* Title and Description block aligned with the white dots (~46% down) */}
                    <div className="absolute top-[46%] left-0 w-full px-8 sm:px-12 -translate-y-[35%] flex flex-col items-center text-center">
                        <h3 className="text-white font-bold text-xl sm:text-2xl lg:text-[26px] leading-tight whitespace-pre-line mb-3 sm:mb-5">
                            {title}
                        </h3>
                        <p className="text-gray-300 text-[13px] sm:text-[15px] font-light leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EvaluationCard
