import React from 'react'
import CourseProgressGraph from '@/components/create/CourseProgressGraph'
import { CertificateProgress } from '@/components/create/CertificateProgress'
import MentorSessionsGraph from '@/components/create/MentorSessionsGraph'
import { OpinionPollProgress } from '@/components/create/OpinionPollProgress'
import Milestones from '@/components/create/milestones'
import CourseStats from './stats'
import WeeklyActivity from '@/views/create/mentor/dashboard-mentor/components/overview/WeeklyActivity'
import MonthlyTrends from '@/views/create/mentor/dashboard-mentor/components/overview/MonthlyTrends'

interface OverviewProps {
  timeFilter?: string
}

const Overview: React.FC<OverviewProps> = ({ timeFilter = 'yearly' }) => {
  return (
    <>
      {/* Dynamic Instructor Stats Cards */}
      <div className="mb-6">
        <CourseStats timeFilter={timeFilter} />
      </div>

    </>
  )
}

export default Overview

