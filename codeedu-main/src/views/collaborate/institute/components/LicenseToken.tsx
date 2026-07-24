import React from 'react'

interface LicenseTokenProps {
    explorerLicenses: {
        used: number
        total: number
    }
    builderLicenses: {
        used: number
        total: number
    }
    navigatorLicenses: {
        used: number
        total: number
    }
}

const LicenseToken: React.FC<LicenseTokenProps> = ({
    explorerLicenses,
    builderLicenses,
    navigatorLicenses
}) => {
    return (
        <div className="bg-[#1a1a1a] rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full overflow-hidden">
            {/* Left side - Title */}
            <div className="flex-shrink-0">
                <h2 className="text-white text-xl md:text-2xl font-bold whitespace-nowrap">
                    Licenses<br />Token
                </h2>
            </div>

            {/* Right side - License Cards */}
            <div className="flex gap-2 md:gap-4 flex-1 w-full min-w-0">
                {/* Explorer Card */}
                <div className="bg-[#2a2a2a] rounded-xl p-2 md:p-4 flex-1 min-w-0 border border-gray-700 hover:border-[#00A8E9] transition-all">
                    <div className="text-center">
                        <h3 className="text-[#00A8E9] text-xs md:text-sm font-bold mb-1 md:mb-2 uppercase tracking-wide truncate">
                            EXPLORER
                        </h3>
                        <div className="text-white">
                            <span className="text-lg md:text-2xl font-bold">{explorerLicenses.used}</span>
                            <span className="text-gray-400 text-sm md:text-lg">/{explorerLicenses.total}</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">Licenses</p>
                    </div>
                </div>

                {/* Builder Card */}
                <div className="bg-[#2a2a2a] rounded-xl p-2 md:p-4 flex-1 min-w-0 border border-gray-700 hover:border-[#E60086] transition-all">
                    <div className="text-center">
                        <h3 className="text-[#E60086] text-xs md:text-sm font-bold mb-1 md:mb-2 uppercase tracking-wide truncate">
                            BUILDER
                        </h3>
                        <div className="text-white">
                            <span className="text-lg md:text-2xl font-bold">{builderLicenses.used}</span>
                            <span className="text-gray-400 text-sm md:text-lg">/{builderLicenses.total}</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">Licenses</p>
                    </div>
                </div>

                {/* Navigator Card */}
                <div className="bg-[#2a2a2a] rounded-xl p-2 md:p-4 flex-1 min-w-0 border border-gray-700 hover:border-[#7FBC42] transition-all">
                    <div className="text-center">
                        <h3 className="text-[#7FBC42] text-xs md:text-sm font-bold mb-1 md:mb-2 uppercase tracking-wide truncate">
                            NAVIGATOR
                        </h3>
                        <div className="text-white">
                            <span className="text-lg md:text-2xl font-bold">{navigatorLicenses.used}</span>
                            <span className="text-gray-400 text-sm md:text-lg">/{navigatorLicenses.total}</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">Licenses</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LicenseToken
