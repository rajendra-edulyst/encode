import React from 'react'
import { useAuth } from "@/auth";
import { FACULTY, LEARNER } from '@/constants/roles.constant';
import LearnerUserQueries from './LearnerUserQueries';
import FacultyUserQueries from './FacultyUserQueries';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';
import { useEffect, useRef } from 'react';

const Queries = () => {
    const { user } = useAuth();
    const trackedPageView = useRef(false);

    useEffect(() => {
        if (!trackedPageView.current) {
            mixpanelService.track("Queries Page Viewed");
            trackedPageView.current = true;
        }
    }, []);

    if (`${user?.authority}` === LEARNER || `${user?.authority}` !== FACULTY) {
        return <LearnerUserQueries />
    }
    if (`${user?.authority}` === FACULTY) {
        return <FacultyUserQueries />
    }
};

export default Queries;