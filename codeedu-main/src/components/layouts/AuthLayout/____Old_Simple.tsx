import { cloneElement, useEffect, useState } from 'react'
import type { ReactNode, ReactElement } from 'react'
import type { CommonProps } from '@/@types/common'
import Logo from '@/components/template/Logo'
import { useThemeStore } from '@/store/themeStore'
import { Link, useLocation } from 'react-router-dom'
import studenticon from '@assets/images/student.png'
import industry from '@assets/images/industry.png'
import institute from '@assets/images/institute.png'

interface SimpleProps extends CommonProps {
    content?: ReactNode
}


const items = [
    { type: 'designer', label: 'Designer', icon: <img src={studenticon} alt="Designer Icon" className="w-12 h-12" />, angle: 30 * 6 },
    { type: 'institute', label: 'Institute', icon: <img src={institute} alt="Student Icon" className="w-12 h-12" />, angle: 30 * 5 },
    { type: 'industry', label: 'Industry', icon: <img src={industry} alt="Student Icon" className="w-12 h-12" />, angle: 30 * 4 },
];


const CircleItems = () => {
    const radius = 250;
    const center = 250;

    const { setLoginProfile, loginProfile } = useThemeStore((state) => state);
    const [hoveredType, setHoveredType] = useState<string | null>(null);

    const { setMode } = useThemeStore((state) => state);


    useEffect(() => {
        setMode('light');
    }, [setMode]);

    return (
        <div className="relative md:w-[500px] md:h-[500px]  bg-white/40 rounded-[250px] backdrop-blur-md -right-48 ">
            {items.map((item, index) => {
                const angleInRadians = (item.angle * Math.PI) / 150;
                const x = center + radius * Math.cos(angleInRadians) - 40;
                const y = center + radius * Math.sin(angleInRadians) - 75;

                return (
                    <div
                        key={index}
                        className="absolute w-28 h-28 bg-[#E7BFD7]/90 backdrop-blur-3xl border border-white/30 ring-1 ring-white/20 rounded-full flex flex-col items-center justify-center text-sm font-medium shadow-lg hover:scale-125 transition-transform duration-300 cursor-pointer"
                        style={{ top: y, left: x }}
                        onClick={() => {
                            setLoginProfile(item.type);
                        }}
                        onMouseEnter={() => setHoveredType(item.type)}
                        onMouseLeave={() => setHoveredType(null)}
                    >
                        <div className={` ${loginProfile === item.type || hoveredType === item.type ? '' : 'opacity-50'} p-2 rounded-lg`}>{item.icon}</div>
                        <span className="hover:text-black  text-xs text-center block break-words" dangerouslySetInnerHTML={{ __html: item.label }}></span>
                    </div>
                );
            })}
        </div>

    );
};



const Simple = ({ children, content, ...rest }: SimpleProps) => {
    // get current route
    const navigate = useLocation();
    const isSignup = (navigate.pathname === '/sign-up') || (navigate.pathname === '/sign-in');
    const isotp = (navigate.pathname === '/account-verify' || (navigate.pathname === '/student-reg'));
    return (
        <div className="min-h-screen flex flex-col bg-[url('https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/auth-bg.png')] bg-cover items-center justify-center relative py-10 md:py-0">
            <Link to="/" aria-label="Go to homepage">
                <Logo className="absolute top-4 left-4" />
            </Link>
            {!isSignup && <h1 className="text-white text-2xl">{ }</h1>}
            <div className={`relative ${!isSignup ? '' : 'md:-left-[8rem]'} flex justify-center items-center gap-6 mt-6 w-full max-w-6xl px-4`}> {/* ${isSignup ? '' : 'md:-left-[8rem]'} */}
                {isSignup && (
                    <div className="relative hidden md:block">
                        <CircleItems />
                    </div>
                )}
                <div className={`bg-white rounded-3xl p-12 w-full ${isSignup && 'md:-ml-20'} ${(isSignup || isotp) ? 'md:max-w-[550px]' : 'md:max-w-[950px]'}  z-10`}> {/* ${!isSignup && 'md:-ml-20'} */}
                    {content}
                    {children
                        ? cloneElement(children as ReactElement, {
                            ...rest,
                        })
                        : null}
                </div>
            </div>
        </div>
    );
}

export default Simple

