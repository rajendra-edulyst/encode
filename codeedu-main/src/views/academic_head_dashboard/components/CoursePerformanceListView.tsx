import React, { useState, useEffect } from 'react';
import { Search, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/shared/Loading';
import { COURSE_PERFORMANCE_STATS, COURSE_ACTIVITY_SUMMARIES } from '../data';
import { fetchCourseDashboardStatistics, ApiCourseDashboardData } from '../services/DashboardService';

interface CoursePerformanceListViewProps {
    onViewDetail: (id: string) => void;
    period?: string;
    onUpdateExportData?: (data: { sheets: { name: string; data: any[] }[] }) => void;
}

const CoursePerformanceListView: React.FC<CoursePerformanceListViewProps> = ({ onViewDetail, period, onUpdateExportData }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [dashboardData, setDashboardData] = useState<ApiCourseDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const response = await fetchCourseDashboardStatistics(period);
            if (response && response.status === 1 && response.data) {
                setDashboardData(response.data);
            } else {
                toast.error('Failed to load course statistics. Using fallback data.');
            }
            setIsLoading(false);
        };
        loadData();
    }, [period]);

    const getLocation = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('vivekananda') || lowerName.includes('vgu')) return 'Jaipur, Rajasthan';
        if (lowerName.includes('code')) return 'Jaipur, Rajasthan';
        if (lowerName.includes('iicd')) return 'Jaipur, Rajasthan';
        if (lowerName.includes('ellen')) return 'Jaipur, Rajasthan';
        return 'India';
    };

    const stats = dashboardData
        ? [
              {
                  label: 'Total Courses',
                  value: dashboardData.total_courses,
                  change: dashboardData.total_courses_change,
                  isPositive: dashboardData.total_courses_change ? !dashboardData.total_courses_change.startsWith('-') : true
              },
              {
                  label: 'Assigned Courses',
                  value: dashboardData.assigned_courses,
                  change: dashboardData.assigned_courses_change,
                  isPositive: dashboardData.assigned_courses_change ? !dashboardData.assigned_courses_change.startsWith('-') : false
              },
              {
                  label: 'Course Running',
                  value: dashboardData.running_courses,
                  change: dashboardData.running_courses_change,
                  isPositive: dashboardData.running_courses_change ? !dashboardData.running_courses_change.startsWith('-') : true
              },
              { 
                  label: 'Average Completion', 
                  value: typeof dashboardData.average_completion === 'string' && dashboardData.average_completion.endsWith('%') 
                      ? dashboardData.average_completion 
                      : `${dashboardData.average_completion}%` 
              }
          ]
        : COURSE_PERFORMANCE_STATS;

    const summaries = dashboardData
        ? dashboardData.course_distribution_by_institutions.map(item => ({
              institutionId: String(item.organization_id),
              institutionName: item.institution_name,
              institutionLocation: getLocation(item.institution_name),
              coursesAvailable: item.course_available,
              coursesAssigned: item.course_assigned,
              coursesRunning: item.courses_running,
              mostActiveCourse: item.most_active_course || 'N/A',
              leastActiveCourse: item.least_active_course || 'N/A'
          }))
        : COURSE_ACTIVITY_SUMMARIES;

    const filteredSummaries = summaries.filter((summary) => {
        return (
            summary.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            summary.institutionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            summary.institutionLocation.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    useEffect(() => {
        if (onUpdateExportData) {
            onUpdateExportData({
                sheets: [
                    {
                        name: 'Course Performance List',
                        data: filteredSummaries.map(summary => ({
                            'Institution ID': summary.institutionId,
                            'Institution Name': summary.institutionName,
                            'Location': summary.institutionLocation,
                            'Courses Available': summary.coursesAvailable,
                            'Courses Assigned': summary.coursesAssigned,
                            'Courses Running': summary.coursesRunning,
                            'Most Active Course': summary.mostActiveCourse,
                            'Least Active Course': summary.leastActiveCourse
                        }))
                    }
                ]
            });
        }
    }, [filteredSummaries, onUpdateExportData]);

    return (
        <Loading loading={isLoading} type="default">
            <div className="flex flex-col gap-6">
                
                {/* Stat Cards Row */}
                <div className="flex flex-wrap gap-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-[#121212] border border-zinc-800/70 p-5 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-all duration-200 group shadow-lg w-full sm:w-[240px]"
                        >
                            <span className="text-zinc-400 text-xs sm:text-sm font-semibold tracking-wide">
                                {stat.label}
                            </span>
                            <div className="flex items-baseline justify-between mt-2 gap-2">
                                <span className="text-2xl sm:text-3xl font-black group-hover:scale-105 transition-transform duration-200 origin-left">
                                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                                </span>
                                {stat.change && (
                                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                                        stat.isPositive 
                                            ? 'text-[#7FBC42] bg-[#7FBC42]/10' 
                                            : 'text-[#E60086] bg-[#E60086]/10'
                                    }`}>
                                        {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        <span>{stat.change}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search by Institution Name or ID..."
                            value={searchQuery}
                            className="w-full pl-11 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Container Card */}
                <div className="bg-[#121212] border border-zinc-800/70 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-800/70">
                        <h3 className="text-lg font-bold text-white">Course Distribution & Activity by Institutions</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#272727] text-zinc-200 text-xs font-bold uppercase tracking-wider font-sans border-b border-zinc-800">
                                    <th className="px-6 py-4">Institution Details</th>
                                    <th className="px-6 py-4">Course Available</th>
                                    <th className="px-6 py-4">Course Assigned</th>
                                    <th className="px-6 py-4">Courses Running</th>
                                    <th className="px-6 py-4">Most Active Course</th>
                                    <th className="px-6 py-4">Least Active Course</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSummaries.length > 0 ? (
                                    filteredSummaries.map((row, idx) => (
                                        <tr key={`${row.institutionId}-${idx}`} className="border-b border-[#333333] hover:bg-zinc-900/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-extrabold text-white text-sm sm:text-base">{row.institutionName}</div>
                                                <div className="text-zinc-500 text-xs mt-0.5 font-semibold tracking-wide uppercase">
                                                    {row.institutionId} &bull; <span className="normal-case">{row.institutionLocation}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white font-extrabold text-sm sm:text-base">{row.coursesAvailable.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white font-extrabold text-sm sm:text-base">{row.coursesAssigned.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white font-extrabold text-sm sm:text-base">{row.coursesRunning.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[#7FBC42] font-bold text-sm sm:text-base">{row.mostActiveCourse}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[#E60086] font-bold text-sm sm:text-base">{row.leastActiveCourse}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#009BD8] hover:bg-[#008bc2] text-white text-xs font-black rounded-lg transition-all shadow-[0_2px_8px_rgba(0,155,216,0.3)] hover:scale-105 cursor-pointer"
                                                    onClick={() => onViewDetail(row.institutionId)}
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>View More</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-zinc-500 text-sm">
                                            No institutions match the search criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </Loading>
    );
};

export default CoursePerformanceListView;
