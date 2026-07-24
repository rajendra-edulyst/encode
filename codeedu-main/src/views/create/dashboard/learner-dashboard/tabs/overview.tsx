// pages/dashboard/learner/tabs/overview/index.tsx - Updated
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCourseStatCounts } from '@/hooks/data/create/useCourses'
import CourseProgressGraph from '@/components/create/CourseProgressGraph'
import { CertificateProgress } from '@/components/create/CertificateProgress'
import MentorSessionsGraph from '@/components/create/MentorSessionsGraph'
import { OpinionPollProgress } from '@/components/create/OpinionPollProgress'
import Milestones from '@/components/create/milestones'

interface OverviewProps {
  timeFilter?: string;
}

const Overview: React.FC<OverviewProps> = ({ timeFilter = 'yearly' }) => {
  const navigate = useNavigate()
  const { data: stats, isLoading } = useCourseStatCounts(timeFilter)
  const statCardBase =
    'bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-300 dark:border-gray-800 cursor-pointer transition hover:border-codeblue hover:bg-gray-200 hover:dark:bg-gray-800'

  return (
    <>

      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">

          <div
            className={statCardBase}
            onClick={() => navigate(`/dashboard/learner/courses?timeFilter=${timeFilter}`)}
          >
            <p className="text-gray-400 text-sm mb-2 dark:text-white">
              Courses Enrolled
            </p>
            <h3 className="text-3xl font-bold dark:text-white">
              {stats?.courses_enrolled?.count ?? 0}
            </h3>

          </div>


          <div
            className={statCardBase}
            onClick={() => navigate('/dashboard/learner/learning-hours')}
          >
            <p className="text-gray-400 text-sm mb-2 dark:text-white">
              Total Learning Hours
            </p>
            <h3 className="text-3xl font-bold dark:text-white">
              {stats?.learning_hours?.count ?? 0}
            </h3>

          </div>


          <div
            className={statCardBase}
            onClick={() =>
              navigate('/dashboard/learner/assessment-details')
            }
          >
            <p className="text-gray-400 text-sm mb-2 dark:text-white">
              Avg Assessment Score
            </p>
            <h3 className="text-3xl font-bold dark:text-white">
              {stats?.avg_assessment_score?.count ?? 0}
            </h3>

          </div>


          <div
            className={statCardBase}
            onClick={() => navigate('/dashboard/learner/certificates')}
          >
            <p className="text-gray-400 text-sm mb-2 dark:text-white">
              Certificates Earned
            </p>
            <h3 className="text-3xl font-bold dark:text-white">
              {stats?.certifcate_earned?.count ?? 0}
            </h3>

          </div>


          <div
            className={statCardBase}
            onClick={() =>
              navigate('/dashboard/learner/avg-session-duration')
            }
          >
            <p className="text-gray-400 text-sm mb-2 dark:text-white">
              Avg Session Duration
            </p>
            <h3 className="text-3xl font-bold dark:text-white">
              {stats?.avg_session_duration?.count ?? 0}
            </h3>

          </div>
        </div>
      )}


      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <CertificateProgress
          className="xl:col-span-1"
          timeFilter={timeFilter}
        />
        <CourseProgressGraph
          className="xl:col-span-2"
          timeFilter={timeFilter}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <MentorSessionsGraph
          className="xl:col-span-2"
          timeFilter={timeFilter}
        />
        <OpinionPollProgress
          className="xl:col-span-1"
          timeFilter={timeFilter}
        />
      </div>

      <Milestones timeFilter={timeFilter} />
    </>
  )
}

export default Overview