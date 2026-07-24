import MyCourses from "@/views/create/learner/courses/components/MyCourses";
import PreparatoryCourses from "@/views/create/learner/courses/components/PreparatoryCourses";
import RecommendedCourses from "@/views/create/learner/courses/components/RecommendedCourses";
import SessionsCard from '@/views/create/partials/MyLearningSessions';
import ExploreCourses from "@/views/create/learner/courses/components/ExploreCourses";


const LearnerDashboard = () => {

    return (
        <div className="flex flex-col gap-6">
            <MyCourses />
            <SessionsCard />
            <PreparatoryCourses />
            <RecommendedCourses />
            <ExploreCourses />
        </div>
    )
}

export default LearnerDashboard