import React, { useEffect } from 'react'
import { useAuth } from "@/auth";
import { FACULTY } from '@/constants/roles.constant';
import FacultyDashboard from './faculty/home';
import LearnerDashboard from './create/learner';
import {requestFCMToken, onMessageListener} from '@/services/NotificationService';

function Home() {

    const { user } = useAuth();

    useEffect(() => {
        requestFCMToken();
        const unsubscribe = onMessageListener();
        return () => {
            unsubscribe();
        };
    }, [])

    if (`${user?.authority}` == FACULTY) {
        return <FacultyDashboard />
    }

    if (`${user?.authority}` !== FACULTY) {
        return <LearnerDashboard />
    }

    return (
        <div className="grid gap-4 md:grid-cols-12">
            <div className="col-span-12 md:col-span-12">
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg col-span-12 mb-4">
                    <h2 className="text-primary dark:text-primary capitalize">Hey {user?.name}!</h2>
                    <p className="text-gray-700 dark:text-gray-100 text-[16px]">Dream & Discover - Your Global Education Guide, Always Here For You!</p>
                </div>
            </div>
        </div>
    )
}

export default Home