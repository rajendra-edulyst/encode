import React from 'react'
import { cn } from '@/lib/utils'

interface TabsNavigationProps {
    activeTab: 'overview' | 'expert'
    setActiveTab: (tab: 'overview' | 'expert') => void
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex items-center bg-[#525252] rounded-lg overflow-hidden w-fit">
            <button
                onClick={() => setActiveTab('overview')}
                className={cn(
                    "px-8 py-2.5 text-sm font-medium text-white transition-all duration-300",
                    activeTab === 'overview' 
                        ? "bg-[#00b0f0]" 
                        : "hover:bg-white/5"
                )}
            >
                Overview
            </button>
            <button
                onClick={() => setActiveTab('expert')}
                className={cn(
                    "px-8 py-2.5 text-sm font-medium text-white transition-all duration-300",
                    activeTab === 'expert' 
                        ? "bg-[#00b0f0]" 
                        : "hover:bg-white/5"
                )}
            >
                Expert Details
            </button>
        </div>
    )
}

export default TabsNavigation
