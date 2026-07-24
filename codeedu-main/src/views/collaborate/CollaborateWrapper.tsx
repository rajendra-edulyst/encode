import React, { lazy, Suspense } from 'react';
import { useAuth } from '@/auth';
import { INDUSTRY } from '@/constants/roles.constant';
import LoadingSection from '@/components/LoadingSection';

const OnTheAgenda = lazy(() => import('@/views/collaborate/my-analysis/on-the-agenda'));
const Collaborate = lazy(() => import('@/views/collaborate'));

const CollaborateWrapper = () => {
    const { user } = useAuth();

    // Determine if the user is an industry role
    const isIndustry = user?.authority?.includes(INDUSTRY);

    return (
        <Suspense fallback={<LoadingSection isLoading={true} title="Loading..." description="Please wait..." />}>
            {<Collaborate />}
        </Suspense>
    );
};

export default CollaborateWrapper;
