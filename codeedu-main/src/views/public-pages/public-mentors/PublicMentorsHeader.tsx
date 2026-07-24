import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '@/components/template/Logo';
import { Button } from '@/components/ui/ShadcnButton';
import { useAuth } from '@/auth';

const PublicMentorsHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { authenticated } = useAuth();

    const handleLoginClick = () => {
        const currentPath = location.pathname + location.search;
        navigate(`/sign-in?redirectUrl=${encodeURIComponent(currentPath)}`);
    };

    const handleSignUpClick = () => {
        const currentPath = location.pathname + location.search;
        navigate(`/sign-up?redirectUrl=${encodeURIComponent(currentPath)}`);
    };

    return (
        <header className="custom-mentors-header sticky top-0 z-50 flex items-center justify-between shadow border-b border-gray-200 dark:border-gray-800 bg-black h-[80px] xl:h-[96px] px-4 md:px-8">
            {/* Logo on the left */}
            <div className="flex items-center gap-8">
                <Link to={`/`} className='flex items-center gap-1'>
                    <Logo imgClass="w-[140px] xl:w-[160px]" mode='dark' type="full" />
                    <h5 className='text-base text-white ml-2'>BETA</h5>
                </Link>
            </div>

            {/* Auth Buttons on the right */}
            {!authenticated && (
                <div className="flex gap-4 items-center">
                    <Button
                        onClick={handleLoginClick}
                        variant="ghost"
                        className="text-gray-300 hover:text-white hover:bg-gray-800 hidden sm:flex"
                    >
                        Login
                    </Button>
                    <Button
                        onClick={handleSignUpClick}
                        className="bg-codeblue hover:bg-codeblue/80 text-white font-semibold px-6 py-2 rounded-lg"
                    >
                        Sign Up
                    </Button>
                </div>
            )}
            
            {/* If authenticated, could show a dashboard link or similar, but for now we'll just let it be handled or left empty since it's a public route designed for non-auth primarily */}
            {authenticated && (
                <div className="flex gap-4 items-center">
                    <Button
                        onClick={() => navigate('/dashboard/learner')}
                        className="bg-codeblue hover:bg-codeblue/80 text-white font-semibold px-6 py-2 rounded-lg"
                    >
                        Dashboard
                    </Button>
                </div>
            )}
        </header>
    );
};

export default PublicMentorsHeader;
