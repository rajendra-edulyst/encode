import { useAuth } from "@/auth"
import WeeklyCalendar from "@faculty/dashboard/Calendar"
import QuickAction from "@/views/faculty/dashboard/QuickAction"
import AssignedProgram from "@faculty/dashboard/assigned-program"
import Sessions from "@faculty/dashboard/sessions"
import RecentActivity from "../dashboard/recent-activity"
import Announcement from '@faculty/dashboard/Announcement';
import RecommendedCourses from "@/views/create/learner/courses/components/RecommendedCourses"
import Posts from "@/views/connect/components/dasboard-posts"
import MentoringSessions from "../dashboard/mentoringSessions"
import StatCount from "@/views/create/partials/stat-count"


const FacultyDashboard = () => {
    const { user } = useAuth()
    return (
        <div className="grid gap-4 md:grid-cols-12">
            <div className="col-span-12 md:col-span-9 space-y-5">
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg col-span-12 mb-4">
                    <h2 className="text-primary dark:text-primary capitalize">Hey {user?.name}!</h2>
                    <p className="text-gray-700 dark:text-gray-100 text-[16px]">Dream & Discover – Guiding Your Global Education Journey, Always by Your Side.</p>
                </div>
                <StatCount />
                <Sessions />
                <MentoringSessions />
                <AssignedProgram />
                <RecommendedCourses />
                <Posts />
            </div>
            <div className="col-span-12 md:col-span-3">
                <WeeklyCalendar />
                <Announcement />
                <QuickAction />
                <RecentActivity />
            </div>
        </div >
    )
}

export default FacultyDashboard