import React from 'react'
import { BookMarked } from 'lucide-react'

interface DepartmentLicenseProps {
    name: string
    hod: string
    totalLicenses: number
    distribution: {
        explorer: number
        builder: number
        navigator: number
    }
    onClick?: () => void
}

const CHART_COLORS = {
    explorer: "#00A8E9",
    builder: "#E60086",
    navigator: "#7FBC42",
}

const DepartmentLicenseCard: React.FC<DepartmentLicenseProps> = ({
    name,
    hod,
    totalLicenses,
    distribution,
    onClick
}) => {
    const total = distribution.explorer + distribution.builder + distribution.navigator
    const explorerPercent = (distribution.explorer / total) * 100
    const builderPercent = (distribution.builder / total) * 100
    const navigatorPercent = (distribution.navigator / total) * 100

    return (
        <div
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 cursor-pointer hover:border-lime-400 transition-all"
            onClick={onClick}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <BookMarked className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold line-clamp-1 text-white">{name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-1">{hod}</p>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-gray-400 text-sm">Total Licenses: <span className="text-white font-semibold">{totalLicenses}</span></p>
            </div>

            {/* Stacked Bar */}
            <div className="mb-4">
                <div className="flex h-8 rounded-lg overflow-hidden">
                    <div
                        className="flex items-center justify-center text-black text-xs font-bold"
                        style={{
                            width: `${explorerPercent}%`,
                            backgroundColor: CHART_COLORS.explorer
                        }}
                    >
                        {distribution.explorer > 0 && distribution.explorer}
                    </div>
                    <div
                        className="flex items-center justify-center text-white text-xs font-bold"
                        style={{
                            width: `${builderPercent}%`,
                            backgroundColor: CHART_COLORS.builder
                        }}
                    >
                        {distribution.builder > 0 && distribution.builder}
                    </div>
                    <div
                        className="flex items-center justify-center text-black text-xs font-bold"
                        style={{
                            width: `${navigatorPercent}%`,
                            backgroundColor: CHART_COLORS.navigator
                        }}
                    >
                        {distribution.navigator > 0 && distribution.navigator}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS.explorer }}
                    ></div>
                    <span className="text-gray-300">Explorer</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS.builder }}
                    ></div>
                    <span className="text-gray-300">Builder</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS.navigator }}
                    ></div>
                    <span className="text-gray-300">Navigator</span>
                </div>
            </div>
        </div>
    )
}

export default DepartmentLicenseCard
