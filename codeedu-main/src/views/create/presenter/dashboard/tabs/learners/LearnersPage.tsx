import React, { useState } from 'react';
import CourseStatCard from '../course-sessions/CourseStatCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import CourseTabs from '../course-sessions/CourseTabs';
import CourseSummaryList from './components/CourseSummaryList';
import LearnersList from './components/LearnersList';
import LearnerDetailPane from './components/LearnerDetailPane';

import { useInstructorLearnerStats } from '@/hooks/data/instructor/useInstructor';

interface LearnersPageProps {
    timeFilter?: string;
}

const LearnersPage = ({ timeFilter = 'yearly' }: LearnersPageProps) => {
    const { data: stats } = useInstructorLearnerStats(timeFilter);
    const [activeTab, setActiveTab] = useState("all");
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);
    const handleSelectCourse = (id: string) => {
        setSelectedCourseId(id);
        setSelectedLearnerId(null);
    };
    const [searchQuery, setSearchQuery] = useState("");
    const learnerStats = [
        { title: "Total Students", value: stats?.total_students ?? "0" },
        { title: "Active Students", value: stats?.active_students ?? "0" },
        { title: "Course Completion", value: stats?.course_completion ?? "0%" },
        { title: "Avg Performance", value: stats?.avg_performance ?? "0%" },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {learnerStats.map((stat) => (
                    <CourseStatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-[#141414] rounded-3xl p-8 border border-white/5 shadow-2xl space-y-5">
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <Input
                            placeholder="Search assignments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-[#1c1c1c] border-white/5 text-white placeholder:text-neutral-600 rounded-xl h-11"
                        />
                    </div>
                    <CourseTabs
                        active={activeTab}
                        onChange={setActiveTab}
                        tabs={["All", "Pending Review", "Graded", "Active", "Completed"]}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:items-start">
                    {/* Column 1: Course Summary List — no inner scroll (page scrolls) */}
                    <div className="lg:col-span-3 flex flex-col gap-4 min-w-0">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest px-1 shrink-0">Select Course</h3>
                        <CourseSummaryList
                            onSelect={handleSelectCourse}
                            selectedId={selectedCourseId}
                            timeFilter={timeFilter}
                        />
                    </div>

                    {/* Column 2: Learners List — wider than before */}
                    <div className="lg:col-span-4 flex flex-col gap-4 min-w-0">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest px-1 shrink-0">Learners List</h3>
                        <LearnersList
                            courseId={selectedCourseId}
                            onSelect={setSelectedLearnerId}
                            selectedId={selectedLearnerId}
                            searchQuery={searchQuery}
                            activeTab={activeTab}
                        />
                    </div>

                    {/* Column 3: Learner Detail Pane — spacer matches middle column heading so tops align with Learners List cards */}
                    <div className="lg:col-span-5 min-w-0 flex flex-col gap-4">
                        <h3
                            className="text-white font-bold text-sm uppercase tracking-widest px-1 shrink-0 invisible pointer-events-none select-none"
                            aria-hidden
                        >
                            Learners List
                        </h3>
                        <LearnerDetailPane
                            courseId={selectedCourseId}
                            learnerId={selectedLearnerId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnersPage;
