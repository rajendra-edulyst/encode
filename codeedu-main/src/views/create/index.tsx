import LearnerDashboard from "./learner";
import InstructorDashboard from "./presenter";
import MentorDashboard from "./mentor/dashboard";
import ProfileCard from "@/components/ProfileCard";
import { requestFCMToken } from '@/services/NotificationService';
import { useEffect, useRef } from "react";
import { useSessionUser } from "@/store/authStore";
import { FACULTY } from "@/constants/roles.constant";
import WeeklyCalendar from './partials/WeeklyCalendar';
import Announcement from './partials/Announcement';
import Advitisement from '@/views/connect/components/advitisement';
import ResourceHub from "./partials/featured-resource-tools";
import TrendingCourses from "./learner/courses/components/TrendingCourses";
import SpotlightMentors from "./mentor/components/SpotlightMentors";
import Cat from '@/views/common/components/cat';
import Resources from "./partials/Resource";
import { mixpanelService } from "@/services/mixpanel/MixpanelService"

const Dashboard = () => {
    useEffect(() => {
        requestFCMToken();
    }, [])

    const { user, profile } = useSessionUser();
    const trackedPageView = useRef(false);
    useEffect(() => {
        if (!trackedPageView.current) {
            mixpanelService.track("Create Page Viewed");
            trackedPageView.current = true;
        }
    }, []);


    return (
        <div className="flex flex-col gap-6">
            <ProfileCard />
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-8 gap-y-6">
                <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
                    {(user?.is_mentor === 1 && profile === 'mentor') && <MentorDashboard />}
                    {(user?.role === FACULTY && profile === 'presenter') && <InstructorDashboard />}
                    {profile !== 'presenter' && <LearnerDashboard />}
                </div>
                <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
                    <WeeklyCalendar />
                    <TrendingCourses />
                    <SpotlightMentors />
                    <ResourceHub />
                    <Cat />
                    <Announcement />
                    <Advitisement />
                </div>
            </div>
            <Resources />
        </div>
    )
}

export default Dashboard

// myth Busters Monday