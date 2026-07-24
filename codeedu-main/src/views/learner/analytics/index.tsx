

import CourseStatics from './course';
import Attendance from './attendance';
import CommunityStatistics from './community';
import EventStatistics from './events';
import ActivityHours from './activityHours';

const Index = () => {
    // const { user } = useAuth()
    return (
        <div className="grid gap-4 md:grid-cols-12 px-6">
            <div className="col-span-12 md:col-span-9">
                {/* <div className="bg-white dark:bg-gray-900 p-3 rounded-lg col-span-12 mb-4">
                    <h2 className="text-primary dark:text-primary capitalize">Create Analytics</h2>
                    <p className="text-gray-700 dark:text-gray-100 text-[16px]">Dream &amp; Discover - Your Global Education Guide, Always Here For You!</p>
                </div> */}
                <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-semibold">Create Analytics</span>
                        </div>
                </div>
                {/* <img src='/img/others/ana.jpg' alt='ana' className='w-full object-contain rounded-lg' /> */}
                <div className="grid gap-4 md:grid-cols-2 mt-5">
                    <CourseStatics />
                    <Attendance />
                    <ActivityHours />
                    <CommunityStatistics />
                    <EventStatistics />
                </div>
            </div>
            {/* <div className="col-span-12 md:col-span-3">
                <Profile />
                <WeeklyCalendar />
                <Event />
                <Announcement />
                <QuickAction />
                <Internship />
            </div> */}
        </div>
    );
};

export default Index;
