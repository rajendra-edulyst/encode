import { useEffect, type ReactNode } from 'react'
import type { CommonProps } from '@/@types/common'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '@/components/template/Logo';
import { useThemeStore } from '@/store/themeStore';
import { useAuth } from '@/auth';
import { Button } from '@/components/ui/ShadcnButton';

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({ children }: SimpleProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { authenticated } = useAuth();
    const setMode = useThemeStore((state) => state.setMode);

    useEffect(() => {
        setMode('dark');
    }, [setMode]);

    const handleLoginClick = () => {
        const currentPath = location.pathname + location.search;
        navigate(`/sign-in?redirectUrl=${encodeURIComponent(currentPath)}`);
    };

    const isBlogPage = location.pathname.includes('/blogs/');

    return (
        <>
            <header className="sticky top-0 z-50 flex items-center justify-between shadow border-b border-gray-200 dark:border-gray-700 bg-black h-[80px] xl:h-[126px] px-8">
                {/* Left spacer for centering logo */}
                <div className="w-[120px] invisible md:block" />

                <Link to={`/`} className='flex items-center gap-1'>
                    <Logo imgClass="w-[140px] xl:w-[189px]" mode='dark' type="full" />
                    <h5 className='text-base dark:text-white'>BETA</h5>
                </Link>

                <div className="w-[120px] flex justify-end">
                    {!authenticated && isBlogPage && (
                        <Button
                            onClick={handleLoginClick}
                            className="bg-codeblue hover:bg-codeblue/80 text-white font-semibold px-6 py-2 rounded-lg"
                        >
                            Login
                        </Button>
                    )}
                </div>
            </header>
            <main>
                {children}
            </main>
        </>
    )
}

export default Simple