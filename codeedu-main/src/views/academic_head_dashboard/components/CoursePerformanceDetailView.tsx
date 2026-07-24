import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/shared/Loading';
import { COURSE_INSTITUTION_DETAILS } from '../data';
import { fetchInstitutionDashboardStatistics, ApiInstitutionDashboardData } from '../services/DashboardService';

interface CoursePerformanceDetailViewProps {
    institutionId: string;
    onBack: () => void;
    onUpdateExportData?: (data: { sheets: { name: string; data: any[] }[] }) => void;
}

const CoursePerformanceDetailView: React.FC<CoursePerformanceDetailViewProps> = ({ institutionId, onBack, onUpdateExportData }) => {
    const [dashboardData, setDashboardData] = useState<ApiInstitutionDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDetailData = async () => {
            setIsLoading(true);
            const response = await fetchInstitutionDashboardStatistics(institutionId);
            if (response && response.status === 1 && response.data) {
                setDashboardData(response.data);
            } else {
                toast.error('Failed to load institution details. Using fallback data.');
            }
            setIsLoading(false);
        };
        loadDetailData();
    }, [institutionId]);

    const getLocation = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('vivekananda') || lowerName.includes('vgu')) return 'Jaipur, Rajasthan';
        if (lowerName.includes('code')) return 'Jaipur, Rajasthan';
        if (lowerName.includes('iicd')) return 'Jaipur, Rajasthan';
        if (lowerName.includes('ellen')) return 'Jaipur, Rajasthan';
        return 'India';
    };

    // Fallback data
    const fallbackDetails = COURSE_INSTITUTION_DETAILS[institutionId] || COURSE_INSTITUTION_DETAILS['INST-001'];

    // Map dynamic or fallback data
    const details = dashboardData
        ? {
              institutionId: String(dashboardData.organization.id),
              institutionName: dashboardData.organization.name,
              institutionLocation: getLocation(dashboardData.organization.name),
              image: '/img/tech_institute_building.png',
              runningCoursesCount: dashboardData.running_courses,
              totalEnrollments: dashboardData.total_enrollments,
              avgCompletionRate: parseFloat(dashboardData.average_completion) || 0,
              allocatedCourses: dashboardData.assigned_courses,
              totalCourses: dashboardData.total_courses,
              coursesList: dashboardData.courses.map((c) => ({
                  id: c.course_name,
                  name: c.course_name,
                  domain: c.domain,
                  module: c.module,
                  duration: c.duration,
                  status: c.status,
                  instructor: c.instructor,
                  enrolled: c.enrolled,
                  completion: parseFloat(c.completion) || 0,
              })),
          }
        : fallbackDetails;

    useEffect(() => {
        if (onUpdateExportData && details) {
            onUpdateExportData({
                sheets: [
                    {
                        name: 'Institution Course Summary',
                        data: [
                            {
                                'Institution ID': details.institutionId,
                                'Institution Name': details.institutionName,
                                'Location': details.institutionLocation,
                                'Courses Running': details.runningCoursesCount,
                                'Total Enrollments': details.totalEnrollments,
                                'Average Completion Rate': details.avgCompletionRate + '%',
                                'Allocated Courses': details.allocatedCourses,
                                'Total Courses': details.totalCourses
                            }
                        ]
                    },
                    {
                        name: 'Courses List',
                        data: details.coursesList.map(c => ({
                            'Course ID': c.id,
                            'Course Name': c.name,
                            'Domain': c.domain,
                            'Module': c.module,
                            'Duration': c.duration,
                            'Status': c.status,
                            'Instructor': c.instructor,
                            'Enrolled Students': c.enrolled,
                            'Completion Rate': c.completion + '%'
                        }))
                    }
                ]
            });
        }
    }, [details, onUpdateExportData]);

    if (!details) {
        return (
            <div className="bg-[#272727] p-8 rounded-2xl text-center text-zinc-400 border border-zinc-800/70">
                Institution details not found.
                <button
                    className="mt-4 px-4 py-2 bg-zinc-800 text-white rounded-xl text-sm border border-zinc-700 hover:bg-zinc-700 cursor-pointer"
                    onClick={onBack}
                >
                    Back to List
                </button>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Running':
                return 'text-[#009BD8]';
            case 'Completed':
                return 'text-[#7FBC42]';
            case 'Not Assigned':
                return 'text-[#E60086]';
            default:
                return 'text-zinc-400';
        }
    };

    const getProgressBarColor = (status: string) => {
        switch (status) {
            case 'Running':
                return 'bg-[#7FBC42]'; // In mockup, progress bar is green
            case 'Completed':
                return 'bg-[#7FBC42]';
            default:
                return 'bg-zinc-700';
        }
    };

    return (
        <Loading loading={isLoading} type="default">
            <div className="flex flex-col gap-6 bg-[#121212] border border-zinc-800/70 rounded-2xl p-6 shadow-2xl">
                
                {/* Back breadcrumb */}
                <div className="flex items-center">
                    <button
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
                        onClick={onBack}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Course Performance List</span>
                    </button>
                </div>

                {/* Institution Header Profile Card */}
                <div className="bg-[#272727] rounded-2xl p-6 shadow-lg transition-all duration-200 border border-zinc-800/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        {/* Left: Building Image + Info */}
                        <div className="flex flex-col sm:flex-row gap-5 items-start flex-1">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-[#444444] bg-zinc-950 flex-shrink-0 shadow-md">
                                <img
                                    src={details.image || '/img/tech_institute_building.png'}
                                    alt={details.institutionName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{details.institutionName}</h2>
                                <p className="text-zinc-400 text-xs sm:text-sm font-bold uppercase tracking-wider mt-1 mb-4">
                                    {details.institutionId} &bull; <span className="text-zinc-400 normal-case">{details.institutionLocation}</span>
                                </p>

                                {/* running courses, total enrollments, avg completion blocks */}
                                <div className="flex flex-wrap gap-3">
                                    {/* Running Courses */}
                                    <div className="px-4 py-2 bg-[#009BD8] text-white rounded-xl shadow-[0_2px_8px_rgba(0,155,216,0.3)] flex flex-col justify-between min-w-[130px]">
                                        <span className="text-white/80 text-[10px] uppercase font-bold tracking-wider">Running Courses</span>
                                        <span className="text-lg font-extrabold mt-0.5">{details.runningCoursesCount.toLocaleString()}</span>
                                    </div>

                                    {/* Total Enrollments */}
                                    <div className="px-4 py-2 bg-[#7FBC42] text-white rounded-xl shadow-[0_2px_8px_rgba(127,188,66,0.3)] flex flex-col justify-between min-w-[130px]">
                                        <span className="text-white/80 text-[10px] uppercase font-bold tracking-wider">Total Enrollments</span>
                                        <span className="text-lg font-extrabold mt-0.5">{details.totalEnrollments.toLocaleString()}</span>
                                    </div>

                                    {/* Avg. Completion */}
                                    <div className="px-4 py-2 bg-[#E60086] text-white rounded-xl shadow-[0_2px_8px_rgba(230,0,134,0.3)] flex flex-col justify-between min-w-[130px]">
                                        <span className="text-white/80 text-[10px] uppercase font-bold tracking-wider">Avg. Completion</span>
                                        <span className="text-lg font-extrabold mt-0.5">{details.avgCompletionRate}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Allocated / Total Courses view */}
                        <div className="flex flex-col items-start sm:items-end justify-center sm:border-l sm:border-[#444444] sm:pl-8 text-left sm:text-right self-stretch sm:self-auto mt-4 sm:mt-0 min-w-[150px]">
                            <span className="text-[#7FBC42] text-3xl sm:text-4xl font-black tracking-tight leading-none">
                                {details.allocatedCourses.toLocaleString()}/{details.totalCourses.toLocaleString()}
                            </span>
                            <span className="text-white text-3xl sm:text-4xl font-bold mt-2 block">
                                Total Courses
                            </span>
                        </div>
                    </div>
                </div>

                {/* Courses Table Container Card */}
                <div className="bg-[#272727] border border-[#383838]/60 rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-zinc-800/50">
                        <h3 className="text-lg font-bold text-white">Course Distribution & Activity by Institutions</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800/50 bg-[#383838] text-zinc-200 text-xs font-bold uppercase tracking-wider font-sans">
                                    <th className="px-6 py-4">Course Name</th>
                                    <th className="px-6 py-4">Domain</th>
                                    <th className="px-6 py-4">Module</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Instructor</th>
                                    <th className="px-6 py-4">Enrolled</th>
                                    <th className="px-6 py-4">Completion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.coursesList.map((course, idx) => (
                                    <tr key={`${course.id}-${idx}`} className="border-b border-[#333333] hover:bg-zinc-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-extrabold text-white text-sm sm:text-base block">{course.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-300 text-sm font-semibold">{course.domain}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-300 text-sm font-semibold">{course.module}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-300 text-sm font-semibold">{course.duration}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold uppercase tracking-wide ${getStatusColor(course.status)}`}>
                                                {course.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-300 text-sm font-semibold">{course.instructor}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-extrabold text-sm sm:text-base">{course.enrolled.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-zinc-300 text-sm font-bold min-w-[36px]">{course.completion}%</span>
                                                <div className="w-24 bg-zinc-800 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${getProgressBarColor(course.status)}`}
                                                        style={{ width: `${course.completion}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </Loading>
    );
};

export default CoursePerformanceDetailView;
