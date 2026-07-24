import { useEffect } from 'react'
import type { ReactNode } from 'react'
import type { CommonProps } from '@/@types/common'
import Logo from '@/components/template/Logo'
import { Link, useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { X } from 'lucide-react'

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({ children }: SimpleProps) => {
    const setMode = useThemeStore((state) => state.setMode);
    const navigate = useNavigate();

    useEffect(() => {
        setMode('dark');
    }, [setMode]);


    const signUpRoutes = ['/personal-info', '/why-join', '/eula', '/sign-up'];
    const loginRoutes = ['/sign-in', '/reference-number'];

    const isSignUpRoute = signUpRoutes.some((route) => window.location.pathname.includes(route));
    const isLoginRoute = loginRoutes.some((route) => window.location.pathname.includes(route));

    return (
        <div className="relative h-screen overflow-hidden bg-black flex flex-col">
            <div className='relative z-10 flex flex-col flex-1 h-screen'>
                {/* Header */}
                <header className={`relative flex justify-center items-center shadow border-1 border-b border-gray-200 dark:border-gray-700 bg-black h-[60px] md:h-[80px] lg:h-[90px] shrink-0`}>
                    <Link to={`/`} className='flex items-center'>
                        <Logo imgClass="w-[120px] md:w-[140px] lg:w-[160px]" mode='dark' type="full" />
                        <h5 className='text-base dark:text-white'>BETA</h5>
                    </Link>
                </header>
                {/* Center Card */}
                <main className="flex-1 flex justify-center items-center px-4 relative z-10 overflow-hidden">
                    <div className={`auth-scale-responsive rounded-3xl shadow-md relative w-full ${isSignUpRoute ? 'md:max-w-5xl 2xl:max-w-7xl' : 'max-w-md lg:max-w-lg 2xl:max-w-[558px] p-6 lg:p-8 2xl:p-12 bg-[#1D1D1D]'}`}>
                        {!isLoginRoute && <X className=" top-5 right-6 w-6 h-6 absolute text-white cursor-pointer" onClick={() => navigate('/sign-in')} />}
                        {children}
                    </div>
                </main>
            </div>
            {/* Bottom Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-1/2 left-1/2 w-[200vw] h-[200vh] object-cover z-0 opacity-80 -translate-x-1/2 -translate-y-1/2 -rotate-[50deg]"
            >
                <source src="/video/rainbow.mp4" type="video/mp4" />
            </video>
        </div>
    )
}

export default Simple