import React from 'react'
import { EventDetails } from '@/@types/collaborate/events'

interface ExpertDetailsTabProps {
    expert: EventDetails['expert']
}

const ExpertDetailsTab: React.FC<ExpertDetailsTabProps> = ({ expert }) => {
    if (!expert || (!expert.name && !expert.role)) {
        return (
            <div className="bg-[#222222] rounded-2xl p-8 text-center border border-white/5">
                <p className="text-gray-400 text-lg">No expert details available.</p>
            </div>
        )
    }

    return (
        <div className="bg-[#222222] rounded-2xl p-6 md:p-8 shadow-sm border border-white/5">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Expert Details</h2>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shrink-0 border-4 border-[#323232]">
                    {expert.profile_image ? (
                        <img 
                            src={expert.profile_image} 
                            alt={expert.name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-400">
                            {expert.name?.charAt(0) || '?'}
                        </div>
                    )}
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-3 pt-2">
                    <div>
                        <h3 className="text-2xl font-bold text-white">{expert.name}</h3>
                        <p className="text-cyan-400 font-medium mt-1">{expert.role}</p>
                    </div>
                    
                    {expert.email && (
                        <p className="text-gray-400 text-sm">
                            <span className="text-gray-500 mr-2">Contact:</span> 
                            <a href={`mailto:${expert.email}`} className="hover:text-white transition-colors">
                                {expert.email}
                            </a>
                        </p>
                    )}

                    {expert.skills && expert.skills.length > 0 && (
                        <div className="pt-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Skills & Expertise</h4>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                {expert.skills.map((skill, idx) => (
                                    <span 
                                        key={idx} 
                                        className="bg-white/5 text-gray-300 px-3 py-1 text-xs rounded-full border border-white/10"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ExpertDetailsTab
