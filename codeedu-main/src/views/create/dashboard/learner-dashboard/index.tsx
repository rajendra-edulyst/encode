import PackageCard from '@/components/PackageCard'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import Overview from './tabs/overview'
import LearnerCourseCard from './tabs/courses/CourseCard'
import CourseStats from './tabs/courses/CourseStats'
import AllCourses from './tabs/courses/AllCourses'
import CertificatesEarned from './tabs/certifications'
import { CertificateStats } from './tabs/certifications/CertificateStats'
import LearnerProgressDashboard from './tabs/skills&Badge'
import { useLearningStage } from '@/hooks/data/create/useCourses'
import Breadcrumb from '@/components/breadcrumb'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useSessionUser } from '@/store/authStore'
import { useEffect, useMemo, useState, useRef } from 'react'
import { mixpanelService } from '@/services/mixpanel/MixpanelService'
import { LearningProgressCard } from './ProgressCard'
import DashboardSwitcher from '../DashboardSwitcher'
import DashboardTabs from './DashboardTabs'
import TimeFilter from '../TimeFilter'

const LearnerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams?.get('tab') || 'overview'
  const timeFilterParam = searchParams?.get('timeFilter')
  const [timeFilter, setTimeFilter] = useState(timeFilterParam || 'yearly')
  const { profile } = useSessionUser()
  const { data: learningStage } = useLearningStage(timeFilterParam || 'yearly')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (timeFilterParam && timeFilterParam !== timeFilter) {
      setTimeFilter(timeFilterParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilterParam])

  const expectedDashboard = useMemo(() => {
    if (profile === 'mentor') return 'mentor'
    if (profile === 'presenter') return 'instructor'
    return 'learner'
  }, [profile])

  const currentDashboard = useMemo(() => {
    if (location.pathname.includes('/dashboard/instructor')) return 'instructor'
    if (location.pathname.includes('/dashboard/mentor')) return 'mentor'
    return 'learner'
  }, [location.pathname])

  const trackedPageView = useRef(false);
  useEffect(() => {
    // Only track view if we are on the correct dashboard and won't be redirected
    if (currentDashboard === expectedDashboard && !trackedPageView.current) {
      mixpanelService.track('Learner Dashboard Viewed');
      trackedPageView.current = true;
    }
  }, [currentDashboard, expectedDashboard]);

  useEffect(() => {
    if (currentDashboard !== expectedDashboard) {
      const targetPath = `/dashboard/${expectedDashboard}`
      console.log(`Auto-redirecting from ${location.pathname} → ${targetPath} (profile: ${profile})`)
      navigate(targetPath, { replace: true })
    }
  }, [currentDashboard, expectedDashboard, navigate, location.pathname, profile])

  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('tab', value)

    if (timeFilter) {
      newParams.set('timeFilter', timeFilter)
    }
    setSearchParams(newParams)
    mixpanelService.track('Learner Dashboard Tab Changed', { tab: value })
  }

  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value)

    const newParams = new URLSearchParams(searchParams)
    newParams.set('timeFilter', value)
    setSearchParams(newParams)
  }

  const handleDashboardSwitch = (type: string) => {
    mixpanelService.track('Dashboard Switched', { target_dashboard: type })
    const path = `/dashboard/${type}`
    navigate(path)
  }


  const showTimeFilter = ['overview', 'courses', 'certifications', 'skills'].includes(activeTab)

  const tabContent = {
    overview: <Overview timeFilter={timeFilter} />,
    courses: (
      <>
        <CourseStats timeFilter={timeFilter} />
        <LearnerCourseCard timeFilter={timeFilter} />
        <AllCourses timeFilter={timeFilter} />
      </>
    ),
    certifications: (
      <>
        <CertificateStats timeFilter={timeFilter} />
        <CertificatesEarned timeFilter={timeFilter} />
      </>
    ),
    skills: <LearnerProgressDashboard timeFilter={timeFilter} />
  }

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-start flex-wrap gap-4'>
        <Breadcrumb
          items={[
            {
              label: currentDashboard.charAt(0).toUpperCase() + currentDashboard.slice(1),
              path: ''
            }
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

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className='flex justify-between items-center flex-wrap gap-4'>
          <DashboardTabs
            value={activeTab}
            className="mb-6 justify-start overflow-auto"
            onValueChange={handleTabChange}
          />

          {showTimeFilter && (
            <div className="flex items-center gap-2">

              <TimeFilter
                value={timeFilter}
                size="md"
                onChange={handleTimeFilterChange}
              />
            </div>
          )}
        </div>

        {Object.entries(tabContent).map(([tab, content]) => (
          <TabsContent key={tab} value={tab} className="space-y-6 animate-fadeIn">
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default LearnerDashboard