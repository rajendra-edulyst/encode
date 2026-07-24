import React from 'react'
import { Button } from '@/components/ui/ShadcnButton'
import { Link } from 'react-router-dom'

const ConnectHero = () => {
    return (
        <section className="py-16 md:py-24 relative flex flex-col md:flex-row items-center min-h-[550px]">
            {/* Background 3D Graphic */}
            <div className="absolute right-0 md:-right-10 top-0 w-full md:w-[65%] h-full z-0 opacity-30 md:opacity-80 pointer-events-none flex items-center justify-end overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
                    alt="Creative 3D Abstract" 
                    className="w-full h-full object-cover mix-blend-screen mask-image-gradient"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-transparent to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent z-10"></div>
            </div>

            <div className="relative z-10 max-w-2xl text-left w-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight tracking-tight">
                    The Home for
                </h1>
                
                <h2 className="text-[3.5rem] md:text-7xl lg:text-[6rem] font-black text-codepink mb-8 italic tracking-tighter font-serif leading-none" style={{ textShadow: '0 4px 30px rgba(236, 72, 153, 0.4)'}}>
                    Your Ideas
                </h2>
                
                <p className="text-gray-300 text-base md:text-lg mb-10 max-w-md leading-relaxed font-light">
                    Share your unique thoughts, discover inspiring stories, and join a vibrant community of creators within a high-fidelity digital environment.
                </p>
                
                <div className="flex flex-wrap gap-4">
                   <Link to ="/register">
                    <Button className="bg-codepink hover:bg-codepink/90 text-white rounded-lg px-8 py-2.5 font-semibold text-sm shadow-lg shadow-codepink/20">
                        Start Posting
                    </Button>
                     </Link>
                    <Link to ="/connect-home/blogs">
                    <Button variant="outline" className="border border-gray-600 text-white hover:bg-gray-800 rounded-lg px-8 py-2.5 bg-transparent font-medium text-sm">
                        Explore Blogs
                    </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default ConnectHero
