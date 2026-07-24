import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMemo, useState } from 'react'
import { OverviewIndex } from './components/overview'
import { SessionIndex } from './components/session'
import { SessionHistoryIndex } from './components/session-history'
import Breadcrumb from '@/components/breadcrumb'
import PackageCard from '@/components/PackageCard'
import { useLearningStage } from '@/hooks/data/create/useCourses'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import TimeFilter from '../../dashboard/TimeFilter'
import DashboardSwitcher from '../../dashboard/DashboardSwitcher'
import { LearningProgressCard } from '../../dashboard/learner-dashboard/ProgressCard'


const MentorDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'
  const [timeFilter, setTimeFilter] = useState('yearly')

  const navigate = useNavigate()
  const location = useLocation()

  const { data: learningStage } = useLearningStage(timeFilter)

  const currentDashboard = useMemo(() => {
    if (location.pathname.includes('/dashboard/instructor')) return 'instructor'
    if (location.pathname.includes('/dashboard/mentor')) return 'mentor'
    return 'learner'
  }, [location.pathname])

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value })
  }

  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value)
    console.log('Time filter changed to:', value)
  }

  const handleDashboardSwitch = (type: string) => {
    const path = `/dashboard/${type}`
    navigate(path)
  }


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className='flex justify-between items-start flex-wrap gap-4'>
        <Breadcrumb
          items={[

            { label: currentDashboard.charAt(0).toUpperCase() + currentDashboard.slice(1), path: '' }
          ]}
          className="mb-0"
        />
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

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className='flex justify-between items-center flex-wrap gap-4'>
          <TabsList className='bg-[#5A5A5A] rounded-xl overflow-hidden p-0 h-auto mb-6'>
            <TabsTrigger className='rounded-none text-white py-3 px-5' value="overview">Overview</TabsTrigger>
            <TabsTrigger className='rounded-none text-white py-3 px-5' value="upcoming_sessions">Upcoming Sessions</TabsTrigger>
            <TabsTrigger className='rounded-none text-white py-3 px-5' value="sessions_history">Session History</TabsTrigger>
          </TabsList>
          <TimeFilter
            value={timeFilter}

            size="md"
            onChange={handleTimeFilterChange}
          />
        </div>

        {/* Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          {activeTab === 'overview' && <OverviewIndex timeFilter={timeFilter} />}
        </TabsContent>
        <TabsContent value="upcoming_sessions" className="space-y-6">
          {activeTab === 'upcoming_sessions' && <SessionIndex timeFilter={timeFilter} />}
        </TabsContent>
        <TabsContent value="sessions_history" className="space-y-6">
          {activeTab === 'sessions_history' && <SessionHistoryIndex timeFilter={timeFilter} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MentorDashboard