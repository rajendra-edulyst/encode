import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartLine, DatabaseZap, FileText, FileUser, Handshake, List, Plus } from 'lucide-react'
import { Button } from '@/components/ui/ShadcnButton'
import { Link } from 'react-router-dom'
import { FaUserTie } from 'react-icons/fa6'
import { TbBrandGoogleAnalytics } from 'react-icons/tb'
import StatCard from '../../components/StatCard'
import { useDashboardStatData } from '../../hooks/useDashboardStatData'

const Index = () => {

  const { data: stat, isLoading } = useDashboardStatData();

  return (
    <div className="min-h-screen">
      <header className="mb-3">
        <div className="flex items-center justify-between">
          {/* <SidebarTrigger /> */}
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Job Opportunities
            </h1>
            {/* <p className="text-gray-500 mt-1">Check out job analytics</p> */}
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-4 2xl:grid-cols-5 mb-8 gap-4">
        <StatCard loading={isLoading} title={"Opportunities"} value={stat?.opportunities?.toString() || '0'} icon={DatabaseZap} color="blue" />
        <StatCard loading={isLoading} title={"Published Job"} value={stat?.published_job?.toString() || '0'} icon={DatabaseZap} color="blue" />
        <StatCard loading={isLoading} title={"Unpublished Job"} value={stat?.unpublished_job?.toString() || '0'} icon={Handshake} color="red" />
        <StatCard loading={isLoading} title={"Placed"} value={stat?.placed?.toString() || '0'} icon={FileUser} color="purple" />
        <StatCard loading={isLoading} title={"Under Process"} value={stat?.under_process?.toString() || '0'} icon={FileUser} color="teal" />
        <StatCard loading={isLoading} title={"Under Review"} value={stat?.under_review?.toString() || '0'} icon={FileUser} color="teal" />
        <StatCard loading={isLoading} title={"Rejected"} value={stat?.rejected?.toString() || '0'} icon={FileUser} color="teal" />
        <StatCard loading={isLoading} title={"Applied"} value={stat?.applied?.toString() || '0'} icon={FileUser} color="teal" />
        <StatCard loading={isLoading} title={"Placement %"} value={stat?.placement_per?.toString() || '0'} icon={FileUser} color="teal" />
        <StatCard loading={isLoading} title={"Total Profiles"} value={`54`} icon={FileUser} color="teal" />
      </div>
      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-white"><FileText size={25} className="text-blue-600 mr-3" />Resume Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-white">Upload and manage candidate resumes efficiently.</p>
            <div className="flex flex-col space-y-3">
              <Link to="/industry/talent-pool" className="w-full">
                <Button
                  variant="outline"
                  className="!rounded-button whitespace-nowrap cursor-pointer w-full"
                >
                  <List size={20} className="mr-2" />
                  Profiles Listing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-white">
              <FaUserTie size={25} className="text-purple-600 mr-3" />
              Job Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-white">
              Create and manage job listings for your organization.
            </p>
            <div className="flex">
              <Link to="/industry/jobs" className="w-[65%] mr-2">
                <Button
                  variant="outline"
                  className="!rounded-button whitespace-nowrap cursor-pointer w-full"
                >
                  <List size={20} className="mr-2" />
                  Job Listing
                </Button>
              </Link>
              <Link to="/industry/jobs/add" className="w-[35%]">
                <Button className="bg-purple-600 w-full hover:bg-purple-700 text-white !rounded-button whitespace-nowrap cursor-pointer">
                  <Plus size={20} className="mr-2" />
                  Create Job
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-white">
              <TbBrandGoogleAnalytics size={25} className="text-green-600 mr-3" />
              Analytics & Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-white">
              Get insights and analytics on your recruitment process.
            </p>
            <div className="flex flex-col space-y-3">
              <Link to="/industry/analytics" className="w-full">
                <Button className="bg-green-600 w-full hover:bg-green-700 text-white !rounded-button whitespace-nowrap cursor-pointer">
                  <ChartLine size={25} className="mr-2" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Index