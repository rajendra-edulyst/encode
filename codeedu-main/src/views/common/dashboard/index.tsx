import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Section from "./components/Section";
import StatCard from "./components/StatCard";
import StatusCard from "./components/StatusCard";
import AlertCard from "./components/AlertCard";
import AvgCard from "./components/AvgCard";
import PackageCard from "./components/PackageCard";
import AllocationCard from "./components/AllocationCard";
import { fetchInstituteAdminDashboard } from "@/services/faculty/DashboardService";
import { DashboardData } from "@/@types/faculty/dashboard";
import Breadcrumb from "@/components/breadcrumb";
import Loading from "@/components/shared/Loading";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    {
      label: "Analytics",
    },
  ];

  const [searchParams] = useSearchParams();

  const loadDashboardData = () => {
      fetchInstituteAdminDashboard().then((response) => {
        setData(response.data);
        setLoading(false);
      });
  }
  

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading loading />;
  if (!data) return <div className="text-red-400">Failed to load</div>;

  return (
    <div className="text-white space-y-8">

      <Breadcrumb items={breadcrumbItems} />

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            📊
          </div>
          <div>
            <h1 className="text-xl font-semibold">
              {data.heading}
            </h1>
            <p className="text-sm text-gray-400">
              Learning, Engagement & Employability Platform
            </p>
          </div>
        </div>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Programs" value={data.total_programs} change="8%" color="pink" />
        <StatCard title="Total Courses" value={data.total_courses} change="15%" color="green" />
        <StatCard title="Students Registered" value={data.students_registered} change="22%" color="cyan" />
        <StatCard title="Course Mappings" value={data.course_mappings} subtitle="Total student-course" />
      </div>

      {/* COURSE STATUS */}
      <Section title="Course Status Overview">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <StatusCard title="Not Started" value={data.not_started} percent={`${data.not_started_per}%`} total={data.course_mappings} />
          <StatusCard title="In Progress" value={data.in_progress} percent={`${data.in_progress_per}%`} total={data.course_mappings} />
          <StatusCard title="Completed" value={data.completed} percent={`${data.completed_per}%`} total={data.course_mappings} />
          <StatusCard title="Assessments Done" value={data.assessments_done} percent={`${data.assessments_done_per}%`} total={data.tot_assessment} />
          <StatusCard title="Present" value={data.present} percent={`${data.present_per}%`} total={data.total_cnt} />
          <StatusCard title="Certificates Released" value={data.certificates_released} percent={`${data.certificates_released_per}%`} total={data.tot_certificates} />
        </div>
      </Section>

      {/* ALERTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertCard title="Assessments Pending" value={data.assessments_pending} />
        <AlertCard title="Absent" value={data.absent} />
        <AlertCard title="Certificates Pending" value={data.certificates_pending} />
      </div>

      {/* AVERAGES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AvgCard title="Avg Completion" value={`${data.avg_completion}%`} />
        <AvgCard title="Avg Assessment Score" value={`${data.avg_assessment_score}%`} />
        <AvgCard title="Avg Attendance" value={`${data.avg_attendance}%`} />
      </div>

      {/* PACKAGE ALLOCATION (STATIC UI) */}
      {/*<Section title="University Package Allocation" action="View Student Allocations">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PackageCard title="Total Purchased" value="26,500" />
          <PackageCard title="Allocated" value="21,670" />
          <PackageCard title="Available" value="4,830" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <AllocationCard title="Explorer" purchased="12,500" allocated="9,800" available="2,700" percent="78%" />
          <AllocationCard title="Builder" purchased="8,200" allocated="6,950" available="1,250" percent="85%" />
          <AllocationCard title="Navigator" purchased="5,800" allocated="4,920" available="880" percent="85%" />
        </div>
      </Section>*/}
    </div>
  );
}
