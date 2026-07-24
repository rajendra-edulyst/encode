import PackageCard from '@/components/PackageCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLearningStage } from '@/hooks/data/create/useCourses'
import Breadcrumb from '@/components/breadcrumb'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { LearningProgressCard } from '../../dashboard/learner-dashboard/ProgressCard'
import Overview from './tabs/overview'
import DashboardSwitcher from '../../dashboard/DashboardSwitcher'
import TimeFilter from '../../dashboard/TimeFilter'
import TopCourses from './tabs/overview/TopCourses'
import WeeklyActivityChart from './tabs/overview/WeeklyActivityChart'
import MonthlyEnrollmentChart from './tabs/overview/MonthlyEnrollmentChart'
import CourseStatCard from './tabs/course-sessions/CourseStatCard'
import AllCourses from '../../dashboard/learner-dashboard/tabs/courses/AllCourses'
import SessionsPage from './tabs/course-sessions/SessionsPage'
import AssignmentsPage from './tabs/assignments/AssignmentsPage'
import LearnersPage from './tabs/learners/LearnersPage'
import CCIQPage from './tabs/cciq/CCIQPage'
import { fetchSessions } from '@/services/faculty/SessionsService'
import { useInstructorOverview } from '@/hooks/data/instructor/useInstructor'

const PresenterDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  const activeTab = searchParams?.get('tab') || 'overview'
  const timeFilterParam = searchParams?.get('timeFilter') || 'yearly'
  const [timeFilter, setTimeFilter] = useState(timeFilterParam)

  useEffect(() => {
    if (timeFilterParam !== timeFilter) {
      setTimeFilter(timeFilterParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilterParam])

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1))
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      }
    }
  }, [location, activeTab])

  const { data: learningStage } = useLearningStage(timeFilter)
  const { data: instructorStats } = useInstructorOverview(timeFilter)
  const { data: sessions = [] } = useQuery({
    queryKey: ['presenter-sessions', timeFilter],
    queryFn: () => fetchSessions(),
    staleTime: 1000 * 60 * 5,
  })

  const currentDashboard = useMemo(() => {
    if (location.pathname.includes('/dashboard/instructor')) return 'instructor'
    if (location.pathname.includes('/dashboard/mentor')) return 'mentor'
    return 'learner'
  }, [location.pathname])

  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('tab', value)
    setSearchParams(newParams)
  }

  const handleTimeFilterChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('timeFilter', value)
    setSearchParams(newParams)
  }

  const handleDashboardSwitch = (type: string) => {
    const path = `/dashboard/${type === 'instructor' ? 'instructor' : type}`
    navigate(path)
  }

  const breadcrumbItems = useMemo(() => {
    const items = [{ label: 'Instructor', path: '/dashboard/instructor' }]
    const tabLabels: Record<string, string> = {
      'overview': 'Overview',
      'courses-sessions': 'Courses & Sessions',
      'assignments': 'Assignments',
      'learners': 'Learners',
      'cciq': 'CCIQ'
    }
    if (tabLabels[activeTab]) {
      items.push({ label: tabLabels[activeTab], path: '' })
    }
    return items
  }, [activeTab])

  const courseSessionStats = useMemo(() => {
    const now = dayjs()

    const totalCourses = instructorStats?.total_courses?.value ?? 0
    const activeCourses = instructorStats?.active_courses?.value ?? 0

    const totalSessions = sessions.length
    const completedSessions = sessions.filter((s) => {
      const classStatus = (s.class_status || '').toLowerCase()
      if (classStatus === 'concluded') return true
      return dayjs(s.end_date).isValid() && dayjs(s.end_date).isBefore(now)
    }).length

    const activeSessions = sessions.filter((s) => {
      const classStatus = (s.class_status || '').toLowerCase()
      if (classStatus === 'live') return false
      const start = dayjs(s.start_date)
      const end = dayjs(s.end_date)
      return start.isValid() && end.isValid() && now.isBetween(start, end, 'minute', '[]')
    }).length

    const upcomingSessions = sessions.filter((s) => {
      const classStatus = (s.class_status || '').toLowerCase()
      if (classStatus === 'upcoming') return false
      const start = dayjs(s.start_date)
      return start.isValid() && start.isAfter(now)
    }).length

    const totalUsers = sessions.reduce((acc, s) => acc + (Number(s.total_users) || 0), 0)
    const attendedUsers = sessions.reduce((acc, s) => acc + (Number(s.attended_count) || 0), 0)
    const avgAttendance = totalUsers > 0 ? `${Math.round((attendedUsers / totalUsers) * 100)}%` : '0%'

    return [
      { title: 'Total Courses', value: String(totalCourses) },
      { title: 'Active Courses', value: String(activeCourses) },
      { title: 'Total Sessions', value: String(totalSessions) },
      // { title: 'Active Sessions', value: String(activeSessions) },
      { title: 'Completed Sessions', value: String(completedSessions) },
      { title: 'Upcoming Sessions', value: String(upcomingSessions) },
      { title: 'Avg Attendance', value: avgAttendance },
    ]
  }, [sessions, instructorStats])

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-start flex-wrap gap-4'>
        <Breadcrumb items={breadcrumbItems} className="mb-6 text-white" />
        <DashboardSwitcher
          activeDashboard={currentDashboard}
          onSwitch={handleDashboardSwitch}
        />
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-[60%] h-full">
            <PackageCard />
          </div>
          <LearningProgressCard
            learningStage={{
              program: { percentage: learningStage?.program?.percentage || 0 },
              skill: { percentage: learningStage?.skill?.percentage || 0 },
              domain: { percentage: learningStage?.domain?.percentage || 0 },
            }}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className='flex justify-between items-center flex-wrap gap-4'>
          <TabsList className='bg-[#5A5A5A] rounded-xl overflow-hidden p-0 h-auto mb-6'>
            <TabsTrigger className='border-r border-white/20 last:border-0 rounded-none text-white py-3 px-5 data-[state=active]:bg-primary' value="overview">Overview</TabsTrigger>
            <TabsTrigger className='border-r border-white/20 last:border-0 rounded-none text-white py-3 px-5 data-[state=active]:bg-primary' value="courses-sessions">Courses & Sessions</TabsTrigger>
            <TabsTrigger className='border-r border-white/20 last:border-0 rounded-none text-white py-3 px-5 data-[state=active]:bg-primary' value="assignments">Assignments</TabsTrigger>
            <TabsTrigger className='border-r border-white/20 last:border-0 rounded-none text-white py-3 px-5 data-[state=active]:bg-primary' value="learners">Learners</TabsTrigger>
            <TabsTrigger className='border-r border-white/20 last:border-0 rounded-none text-white py-3 px-5 data-[state=active]:bg-primary' value="cciq">CCIQ</TabsTrigger>
          </TabsList>
          <TimeFilter
            value={timeFilter}
            size="md"
            onChange={handleTimeFilterChange}
          />
        </div>

        <TabsContent value="overview" className="space-y-6">
          <Overview timeFilter={timeFilter} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WeeklyActivityChart />
            <MonthlyEnrollmentChart />
          </div>
          <TopCourses />


        </TabsContent>

        <TabsContent value="courses-sessions" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {courseSessionStats.slice(0, 5).map((stat) => (
              <CourseStatCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {courseSessionStats.slice(5).map((stat) => (
              <CourseStatCard key={stat.title} {...stat} />
            ))}
          </div>
          <div id="courses-section" className="mt-8">
            <AllCourses />
          </div>

          <div id="sessions-section" className="mt-12 bg-[#141414] rounded-3xl p-8 border border-white/5 shadow-2xl">
            <SessionsPage />
          </div>
        </TabsContent>
        <TabsContent id="assignments-section" value="assignments" className="space-y-6">
          <AssignmentsPage />
        </TabsContent>
        <TabsContent value="learners" className="space-y-6">
          <LearnersPage timeFilter={timeFilter} />
        </TabsContent>
        <TabsContent value="cciq" className="space-y-6">
          <CCIQPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PresenterDashboard;