import React from 'react'
import { CheckCircle2 } from 'lucide-react'

const StatsAndWhyChooseUs = () => {
    return (
        <section className="mb-8 w-full max-w-6xl mx-auto">
            <div className="bg-[#1D1D1D] rounded-2xl p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-center">
                {/* Left: Stats Grid */}
                <div className="grid grid-cols-2 gap-6 w-full lg:w-1/2">
                    <div className="bg-[#1a1a1a] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-codeblue mb-2">50k+</span>
                        <span className="text-[13px] text-codeblue uppercase tracking-widest font-normal">GLOBAL STUDENTS</span>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-codepink mb-2">200+</span>
                        <span className="text-[13px] text-codepink uppercase tracking-widest font-normal">ELITE MENTORS</span>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-codegreen mb-2">95%</span>
                        <span className="text-[13px] text-codegreen uppercase tracking-widest font-normal">SUCCESS RATE</span>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-codeyellow mb-2">24/7</span>
                        <span className="text-[13px] text-codeyellow uppercase tracking-widest font-normal">DIRECT SUPPORT</span>
                    </div>
                </div>

                {/* Right: Why Choose Us Checklist */}
                <div className="w-full lg:w-1/2">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                        Why Professionals Choose Us
                    </h2>
                    <p className="text-gray-400 text-base mb-10 leading-relaxed max-w-lg">
                        We don't just teach skills; we provide the environment and tools used by the world's leading creative engineers.
                    </p>

                    <div className="space-y-8">
                        <div className="flex gap-4 items-start">
                            <CheckCircle2 className="text-codegreen w-6 h-6 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-white font-bold text-base mb-1">Cinematic Course Quality</h4>
                                <p className="text-gray-500 text-sm">4K high-production video content designed for focus.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <CheckCircle2 className="text-codegreen w-6 h-6 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-white font-bold text-base mb-1">Integrated Sandbox Labs</h4>
                                <p className="text-gray-500 text-sm">Build as you learn in our cloud-based creative studio.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <CheckCircle2 className="text-codegreen w-6 h-6 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-white font-bold text-base mb-1">Career Acceleration</h4>
                                <p className="text-gray-500 text-sm">Direct referral pipeline to our partner tech firms.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </section>
    )
}

export default StatsAndWhyChooseUs
