import { useAuth } from '@/auth';
import { Progress } from '@/components/ui/progress'
import { userPortfolio } from '@/services/learner/PortfolioService';
import { usePortfolioStore } from '@/store/learner/portfolioStore';
import React, { useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Profile() {
    const { user } = useAuth();

    const { setPortfolio, portfolio, setError, loading, setLoading } = usePortfolioStore();
    const [presentage, setPresentage] = React.useState(0);

    const fetchUserPortfolio = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await userPortfolio();
            setPortfolio(data);
            console.log(data);
        } catch (error) {
            setError("Failed to fetch portfolio");
            console.error(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }, [setLoading, setPortfolio, setError]);

    useEffect(() => {
        if (!portfolio) {
            fetchUserPortfolio();
        }
    }, [fetchUserPortfolio, portfolio]);

    useEffect(() => {
        if (portfolio) {
            let total = 0;
            if (portfolio?.portfolio_profile) {
                total += 15;
            }
            if (portfolio?.Experience) {
                total += 14;
            }
            if (portfolio?.Education) {
                total += 14;
            }
            if (portfolio?.skill) {
                total += 14;
            }
            if (portfolio?.Project) {
                total += 14;
            }

            if (portfolio?.Certificate) {
                total += 14;
            }

            if (portfolio?.portfolio_social) {
                total += 15;
            }

            setPresentage(total);
        }
    }, [portfolio]);

    return (
        <div className='bg-white p-4 rounded-lg dark:bg-gray-800 mb-3 border'>
            {/* profile card */}
            <div className="flex items-center justify-between">
                <Link to={`/portfolio`} className="flex items-center gap-3">
                    <img src={user.profile_image ? user.profile_image : `https://ui-avatars.com/api/?name=${user.name}`} alt={`${user?.userName}`} className='rounded-full outline outline-primary outline-offset-1 w-12 h-12' />
                    <div className='overflow-hidden'>
                        <h2 className="text-xl font-semibold capitalize">{user.name}</h2>
                        <p className="dark:text-gray-300">{user.email}</p>
                    </div>
                </Link>
            </div>
            {!loading && <div>
                <Link to={`/portfolio/edit`} className="flex items-center gap-3">
                    {
                        presentage == 100 ? <p className="text-gray-700 dark:text-gray-300 mt-5 text-xs">Edit Profile</p> :
                            <p className="text-gray-700 dark:text-gray-300 mt-5 text-xs">Complete Profile</p>
                    }
                </Link>
                <div className="w-full flex items-center gap-2">
                    <Progress value={presentage ?? 0} className="w-full h-2 border" />
                    <span className="text-xs text-gray-500 dark:text-gray-300">{presentage}%</span>
                </div>
            </div>
            }
        </div>
    )
}

export default Profile