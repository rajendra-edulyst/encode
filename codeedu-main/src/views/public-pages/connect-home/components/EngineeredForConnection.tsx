import React from 'react'
import { Layers, FileText, Users } from 'lucide-react'

const EngineeredForConnection = () => {
    return (
        <section className="mb-8">
            <div className="bg-[#1D1D1D] rounded-2xl p-6 md:p-8">
                        <h2 className="text-[30px] lg:text-[32px] font-semibold text-codeblue">
                Engineered for Connection</h2>
                    <p className="mt-2 text-[30px] lg:text-[22px] font-normal leading-[1.1] text-#FFFFFF max-w-3xl mb-8">
Where authentic connections happen.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {/* Card 1 */}
                <div className="bg-[#1a1a1a] rounded-[24px] p-10 flex flex-col items-center text-center hover:bg-[#1e1e1e] transition-colors border border-transparent hover:border-gray-800">
                    <div className="w-18 h-18 rounded-3xl bg-[#282828] flex items-center justify-center mb-6">
                        <Layers className="w-10 h-10 text-[#00b7ff]" />
                    </div>
                    <h3 className="text-white font-bold text-[20px] mb-4">Universal Feed</h3>
                    <p className="text-[#888] text-[18px] leading-relaxed">
                        Post anything from quick thoughts to vibrant photos. Our algorithm prioritizes quality over quantity.
                    </p>
                </div>
                
                {/* Card 2 */}
                <div className="bg-[#1a1a1a] rounded-[24px] p-10 flex flex-col items-center text-center hover:bg-[#1e1e1e] transition-colors border border-transparent hover:border-gray-800">
                    <div className="w-18 h-18 rounded-3xl bg-[#282828] flex items-center justify-center mb-6">
                        <FileText className="w-10 h-10 text-codepink" />
                    </div>
                    <h3 className="text-white font-bold text-[20px] mb-4">Premium Blogs</h3>
                    <p className="text-[#888] text-[18px] leading-relaxed">
                        Go beyond the surface with long-form articles. Beautiful typography and distraction-free reading.
                    </p>
                </div>
                
                {/* Card 3 */}
                <div className="bg-[#1a1a1a] rounded-[24px] p-10 flex flex-col items-center text-center hover:bg-[#1e1e1e] transition-colors border border-transparent hover:border-gray-800">
                    <div className="w-18 h-18 rounded-2xl bg-[#282828] flex items-center justify-center mb-6">
                        <Users className="w-10 h-10 text-[#86efac]" />
                    </div>
                    <h3 className="text-white font-bold text-[20px] mb-4">True Community</h3>
                    <p className="text-[#888] text-[18px] leading-relaxed">
                        Engage in meaningful conversations in a safe, moderated space that values your contributions.
                    </p>
                </div>
            </div>
            </div>
        </section>
    )
}

export default EngineeredForConnection
