import React from 'react'
import { Button } from '@/components/ui/ShadcnButton'
import { Link } from 'react-router-dom'
import HeroVideo from './GettyImages-1130274754 (1).mp4'

const FooterCTA = () => {
    return (
        <section className="w-[100vw] relative left-[50%] -translate-x-[50%] overflow-hidden bg-[#111] my-16">
            <video 
                src={HeroVideo} 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="none"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            
            <div className="absolute inset-0 bg-black/40"></div>
            
            <div className="relative py-24 px-4 flex flex-col items-center justify-center text-center z-10 w-full max-w-7xl mx-auto">
                <h2 className="text-4xl lg:text-5xl font-bold text-white font-jacques mb-6">
                    Start Your Creative Journey Today
                </h2>
                <p className="text-gray-300 text-base lg:text-lg max-w-2xl mb-10">
                    Join 50,000+ creators building the next generation of digital artifacts, film blockbusters. Prepare for Next. 1000.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6">
                    <Link to ="/register">
                    <Button className="bg-codeblue hover:bg-codeblue/90 text-white rounded-lg px-8 py-6 text-base font-semibold">
                        Get Started Now
                    </Button>
                    </Link>
                   <Link to="/mentor/all">
                    <Button className="bg-codepink hover:bg-codepink/90 text-white rounded-lg px-8 py-6 text-base font-semibold">
                          Connect Live Mentor
                    </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default FooterCTA
