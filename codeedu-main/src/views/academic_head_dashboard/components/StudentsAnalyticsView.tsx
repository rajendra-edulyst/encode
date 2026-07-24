import React, { useState } from 'react';
import { Search, Eye, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import Loading from '@/components/shared/Loading';
import {
    fetchAcademicHeadDashboardStatistics,
    ApiAcademicHeadDashboardData,
    fetchAcademicHeadDepartmentStatistics,
    ApiAcademicHeadDepartmentData,
    fetchAcademicHeadCourseStatistics,
    ApiAcademicHeadCourseData,
    fetchAcademicHeadStudentStatistics,
    ApiAcademicHeadStudentData
} from '../services/DashboardService';
import {
    STUDENT_ANALYTICS_STATS,
    STUDENT_INST_SUMMARIES,
    STUDENT_DEPT_SUMMARIES,
    STUDENT_COURSE_SUMMARIES,
    STUDENT_DETAIL_ROWS
} from '../data';

interface StudentsAnalyticsViewProps {
    onLevelChange?: (level: number) => void;
    period?: string;
    onUpdateExportData?: (data: { sheets: { name: string; data: any[] }[] }) => void;
}

const StudentsAnalyticsView: React.FC<StudentsAnalyticsViewProps> = ({ onLevelChange, period, onUpdateExportData }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInstId, setSelectedInstId] = useState<string | null>(null);
    const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [apiData, setApiData] = useState<ApiAcademicHeadDashboardData | null>(null);
    const [deptApiData, setDeptApiData] = useState<ApiAcademicHeadDepartmentData | null>(null);
    const [courseApiData, setCourseApiData] = useState<ApiAcademicHeadCourseData | null>(null);
    const [studentApiData, setStudentApiData] = useState<ApiAcademicHeadStudentData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        const loadStats = async () => {
            setIsLoading(true);
            if (selectedCourseId) {
                const res = await fetchAcademicHeadStudentStatistics(selectedCourseId, selectedDeptId || undefined);
                if (res && res.status === 1) {
                    setStudentApiData(res.data);
                }
            } else if (selectedDeptId) {
                const res = await fetchAcademicHeadCourseStatistics(selectedDeptId);
                if (res && res.status === 1) {
                    setCourseApiData(res.data);
                }
            } else if (selectedInstId) {
                const res = await fetchAcademicHeadDepartmentStatistics(selectedInstId);
                if (res && res.status === 1) {
                    setDeptApiData(res.data);
                }
            } else {
                const res = await fetchAcademicHeadDashboardStatistics(period);
                if (res && res.status === 1) {
                    setApiData(res.data);
                }
            }
            setIsLoading(false);
        };
        loadStats();
    }, [period, selectedInstId, selectedDeptId, selectedCourseId]);

    const instSummaries = apiData 
        ? apiData.institutions.map(inst => ({
            institutionId: String(inst.organization_id),
            institutionName: inst.organization_name,
            institutionLocation: 'India',
            totalEnrolled: inst.total_students,
            facultyCount: inst.faculty,
            completedCount: inst.completed,
            inProgressCount: inst.in_progress,
            notStartedCount: inst.not_started
        }))
        : STUDENT_INST_SUMMARIES;

    // Determine current level
    const level = !selectedInstId 
        ? 1 
        : !selectedDeptId 
        ? 2 
        : !selectedCourseId 
        ? 3 
        : 4;

    React.useEffect(() => {
        if (onLevelChange) {
            onLevelChange(level);
        }
    }, [level, onLevelChange]);

    // Helpers to find names for breadcrumbs
    const getInstName = (id: string | null) => {
        if (!id) return '';
        const inst = instSummaries.find(x => x.institutionId === id);
        return inst ? inst.institutionName : id;
    };

    const getDeptName = (id: string | null) => {
        if (!id) return '';
        if (deptApiData) {
            const d = deptApiData.departments.find(x => String(x.department_id) === id);
            if (d) return d.department;
        }
        if (id === 'CSE') return 'Computer Science & Engineering';
        if (id === 'IT') return 'Information Technology';
        if (id === 'CE') return 'Civil Engineering';
        if (id === 'ME') return 'Mechanical Engineering';
        return id;
    };

    const getCourseName = (id: string | null) => {
        if (!id) return '';
        if (courseApiData) {
            const c = courseApiData.courses.find(x => String(x.course_id) === id);
            if (c) return c.course_name;
        }
        if (id === 'CSE112') return 'Adobe Tools & Application Design-1';
        return 'Adobe Tools & Application Design-1';
    };

    // Filter Level 1 summaries based on search
    const filteredInsts = instSummaries.filter((inst) => {
        return (
            inst.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inst.institutionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inst.institutionLocation.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Get statistics data based on level
    const getLevelStats = () => {
        if (level === 1) {
            if (apiData) {
                return [
                    { 
                        label: 'Total Assigned Students', 
                        value: apiData.total_assigned_students, 
                        change: apiData.total_students_change, 
                        isPositive: apiData.total_students_change ? !apiData.total_students_change.startsWith('-') : true 
                    },
                    { 
                        label: 'Completed (100%)', 
                        value: apiData.completed, 
                        change: apiData.completed_change, 
                        isPositive: apiData.completed_change ? !apiData.completed_change.startsWith('-') : true 
                    },
                    { 
                        label: 'In Progress', 
                        value: apiData.in_progress, 
                        change: apiData.in_progress_change, 
                        isPositive: apiData.in_progress_change ? !apiData.in_progress_change.startsWith('-') : true 
                    },
                    { 
                        label: 'Not Started Yet', 
                        value: apiData.not_started
                    }
                ];
            }
            return STUDENT_ANALYTICS_STATS;
        } else if (level === 2) {
            if (deptApiData) {
                return [
                    { 
                        label: 'Total Department', 
                        value: deptApiData.total_departments, 
                    },
                    { 
                        label: 'Total Courses', 
                        value: deptApiData.total_courses, 
                    },
                    { 
                        label: 'Total Students', 
                        value: deptApiData.total_students, 
                    },
                    { 
                        label: 'Total Faculty', 
                        value: deptApiData.total_faculty, 
                    }
                ];
            }
            return [
                { label: 'Total Department', value: 4 },
                { label: 'Total Courses', value: 39 },
                { label: 'Total Students', value: 1490 },
                { label: 'Total Faculty', value: 53 }
            ];
        } else if (level === 3) {
            if (courseApiData) {
                return [
                    { 
                        label: 'Total Courses', 
                        value: courseApiData.total_courses
                    },
                    { 
                        label: 'Total Students', 
                        value: courseApiData.total_students
                    },
                    { 
                        label: 'Avg. Completion', 
                        value: courseApiData.avg_completion
                    }
                ];
            }
            return [
                { label: 'Total Courses', value: 10 },
                { label: 'Total Students', value: 855 },
                { label: 'Avg. Completion', value: '66%' }
            ];
        } else {
            if (studentApiData) {
                return [
                    { 
                        label: 'Total Students', 
                        value: studentApiData.total_students
                    },
                    { 
                        label: 'Completed', 
                        value: studentApiData.completed
                    },
                    { 
                        label: 'In Progress', 
                        value: studentApiData.in_progress
                    },
                    { 
                        label: 'Not Started', 
                        value: studentApiData.not_started
                    }
                ];
            }
            return [
                { label: 'Total Students', value: 113 },
                { label: 'Completed', value: 3 },
                { label: 'In Progress', value: 100 },
                { label: 'Not Started', value: 10 }
            ];
        }
    };

    const stats = getLevelStats();

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'bg-[#7FBC42]/10 text-[#7FBC42] border border-[#7FBC42]/30';
            case 'In Progress':
                return 'bg-[#ffc531]/10 text-[#ffc531] border border-[#ffc531]/30';
            case 'Not Started':
                return 'bg-[#E60086]/10 text-[#E60086] border border-[#E60086]/30';
            default:
                return 'bg-zinc-800 text-zinc-400';
        }
    };

    const getCompletionColorClass = (rate: number) => {
        if (rate >= 85) return 'bg-[#7FBC42]';
        if (rate >= 50) return 'bg-[#ffc531]';
        return 'bg-[#E60086]';
    };

    // Level 2 data lookup
    const deptList = deptApiData
        ? deptApiData.departments.map(dept => ({
            departmentId: String(dept.department_id),
            departmentName: dept.department,
            hodName: dept.hod,
            coursesAlignedCount: dept.courses_aligned,
            studentsEnrolledCount: dept.students_enrolled,
            facultyCount: dept.faculty,
            avgCompletionRate: parseFloat(dept.avg_completion.replace('%', '')) || 0
        }))
        : (STUDENT_DEPT_SUMMARIES[selectedInstId || ''] || STUDENT_DEPT_SUMMARIES['INST-001']);

    // Level 3 data lookup
    const compositeKey3 = `${selectedInstId || 'INST-001'}_${selectedDeptId || 'CSE'}`;
    const courseList = courseApiData
        ? courseApiData.courses.map(course => ({
            courseId: String(course.course_id),
            courseName: course.course_name,
            module: course.module,
            instructorName: course.instructor,
            studentsEnrolledCount: course.students_enrolled,
            duration: course.duration,
            completionRate: parseFloat(course.completion_rate.replace('%', '')) || 0
        }))
        : (STUDENT_COURSE_SUMMARIES[compositeKey3] || STUDENT_COURSE_SUMMARIES['INST-001_CSE']);

    // Level 4 data lookup
    const compositeKey4 = `${selectedInstId || 'INST-001'}_${selectedDeptId || 'CSE'}_${selectedCourseId || 'CSE112'}`;
    const studentList = studentApiData
        ? studentApiData.students.map(std => ({
            studentName: std.student_name,
            studentEmail: std.student_email,
            status: std.status,
            assignmentsFraction: std.assignments,
            progressPercentage: parseFloat(std.progress.replace('%', '')) || 0,
            grade: std.grade,
            lastActive: std.last_active
        }))
        : (STUDENT_DETAIL_ROWS[compositeKey4] || STUDENT_DETAIL_ROWS['INST-001_CSE_CSE112']);

    React.useEffect(() => {
        if (!onUpdateExportData) return;

        if (level === 1) {
            onUpdateExportData({
                sheets: [
                    {
                        name: 'Institution Summaries',
                        data: filteredInsts.map(inst => ({
                            'Institution ID': inst.institutionId,
                            'Institution Name': inst.institutionName,
                            'Location': inst.institutionLocation,
                            'Total Enrolled': inst.totalEnrolled,
                            'Faculty Count': inst.facultyCount,
                            'Completed Count': inst.completedCount,
                            'In Progress Count': inst.inProgressCount,
                            'Not Started Count': inst.notStartedCount
                        }))
                    }
                ]
            });
        } else if (level === 2) {
            onUpdateExportData({
                sheets: [
                    {
                        name: 'Department Summaries',
                        data: deptList.map(dept => ({
                            'Department ID': dept.departmentId,
                            'Department Name': dept.departmentName,
                            'HOD Name': dept.hodName,
                            'Courses Aligned': dept.coursesAlignedCount,
                            'Students Enrolled': dept.studentsEnrolledCount,
                            'Faculty Count': dept.facultyCount,
                            'Avg Completion Rate': dept.avgCompletionRate + '%'
                        }))
                    }
                ]
            });
        } else if (level === 3) {
            onUpdateExportData({
                sheets: [
                    {
                        name: 'Course Summaries',
                        data: courseList.map(c => ({
                            'Course ID': c.courseId,
                            'Course Name': c.courseName,
                            'Module': c.module,
                            'Instructor Name': c.instructorName,
                            'Students Enrolled': c.studentsEnrolledCount,
                            'Duration': c.duration,
                            'Completion Rate': c.completionRate + '%'
                        }))
                    }
                ]
            });
        } else if (level === 4) {
            onUpdateExportData({
                sheets: [
                    {
                        name: 'Enrolled Students',
                        data: studentList.map(s => ({
                            'Student Name': s.studentName,
                            'Student Email': s.studentEmail,
                            'Status': s.status,
                            'Assignments Completed': s.assignmentsFraction,
                            'Progress': s.progressPercentage + '%',
                            'Grade': s.grade,
                            'Last Active': s.lastActive
                        }))
                    }
                ]
            });
        }
    }, [level, filteredInsts, deptList, courseList, studentList, onUpdateExportData]);

    return (
        <Loading loading={isLoading} type="default">
            <div className="flex flex-col gap-6">
            
            {/* Level stats cards grid */}
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
                            {('change' in stat) && stat.change && (
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

            {/* Breadcrumb Path navigation */}
            {level > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 text-sm font-bold text-zinc-400 select-none">
                    <button 
                        className="hover:text-white transition-colors cursor-pointer"
                        onClick={() => {
                            setSelectedInstId(null);
                            setSelectedDeptId(null);
                            setSelectedCourseId(null);
                        }}
                    >
                        Institutes
                    </button>
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                    
                    <button 
                        className={`hover:text-white transition-colors cursor-pointer ${level === 2 ? 'text-[#009BD8] font-black font-sans' : ''}`}
                        disabled={level === 2}
                        onClick={() => {
                            setSelectedDeptId(null);
                            setSelectedCourseId(null);
                        }}
                    >
                        {getInstName(selectedInstId)}
                    </button>

                    {level >= 3 && (
                        <>
                            <ChevronRight className="w-4 h-4 text-zinc-600" />
                            <button 
                                className={`hover:text-white transition-colors cursor-pointer ${level === 3 ? 'text-[#009BD8] font-black font-sans' : ''}`}
                                disabled={level === 3}
                                onClick={() => {
                                    setSelectedCourseId(null);
                                }}
                            >
                                {getDeptName(selectedDeptId)}
                            </button>
                        </>
                    )}

                    {level >= 4 && (
                        <>
                            <ChevronRight className="w-4 h-4 text-zinc-600" />
                            <span className="text-[#009BD8] font-black font-sans">
                                {getCourseName(selectedCourseId)}
                            </span>
                        </>
                    )}
                </div>
            )}

            {/* LEVEL 1 VIEW */}
            {level === 1 && (
                <>
                    {/* Search Field */}
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

                    {/* Table of institutions */}
                    <div className="bg-[#121212] border border-zinc-800/70 rounded-2xl shadow-xl overflow-hidden hover:border-zinc-800 transition-all duration-200">
                        <div className="p-6 border-b border-zinc-800/70">
                            <h3 className="text-lg font-bold text-white">Select Institution to View Departments</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse font-sans">
                                <thead>
                                    <tr className="bg-[#272727] text-zinc-200 text-xs font-bold uppercase tracking-wider border-b border-zinc-800">
                                        <th className="px-6 py-4">Institution Details</th>
                                        <th className="px-6 py-4">Total Enrolled</th>
                                        <th className="px-6 py-4">Faculty</th>
                                        <th className="px-6 py-4">Completed</th>
                                        <th className="px-6 py-4">In Progress</th>
                                        <th className="px-6 py-4">Not Started</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInsts.length > 0 ? (
                                        filteredInsts.map((row, idx) => (
                                            <tr key={`${row.institutionId}-${idx}`} className="border-b border-[#333333] hover:bg-zinc-900/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-extrabold text-white text-sm sm:text-base">{row.institutionName}</div>
                                                    <div className="text-zinc-500 text-xs mt-0.5 font-semibold tracking-wide uppercase">
                                                        {row.institutionId} &bull; <span className="normal-case">{row.institutionLocation}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-white font-extrabold text-sm sm:text-base">{row.totalEnrolled.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-white font-extrabold text-sm sm:text-base">{row.facultyCount.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-white font-extrabold text-sm sm:text-base">{row.completedCount.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-white font-extrabold text-sm sm:text-base">{row.inProgressCount.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-white font-extrabold text-sm sm:text-base">{row.notStartedCount.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#009BD8] hover:bg-[#008bc2] text-white text-xs font-black rounded-lg transition-all shadow-[0_2px_8px_rgba(0,155,216,0.3)] hover:scale-105 cursor-pointer"
                                                        onClick={() => setSelectedInstId(row.institutionId)}
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>View Departments</span>
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
                </>
            )}

            {/* LEVEL 2 VIEW: DEPARTMENTS */}
            {level === 2 && (
                <div className="bg-[#121212] border border-zinc-800/70 rounded-2xl shadow-xl overflow-hidden hover:border-zinc-800 transition-all duration-200">
                    <div className="p-6 border-b border-zinc-800/70">
                        <h3 className="text-lg font-bold text-white">Select Department to View Courses</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse font-sans">
                            <thead>
                                <tr className="bg-[#272727] text-zinc-200 text-xs font-bold uppercase tracking-wider border-b border-zinc-800">
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">HOD</th>
                                    <th className="px-6 py-4">Courses Aligned</th>
                                    <th className="px-6 py-4">Students Enrolled</th>
                                    <th className="px-6 py-4">Faculty</th>
                                    <th className="px-6 py-4">Avg. Completion</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deptList.map((row, idx) => (
                                    <tr key={`${row.departmentId}-${idx}`} className="border-b border-[#333333] hover:bg-zinc-900/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-extrabold text-white text-sm sm:text-base">{row.departmentName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-300 text-sm font-semibold">{row.hodName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-extrabold text-sm sm:text-base">{row.coursesAlignedCount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-extrabold text-sm sm:text-base">{row.studentsEnrolledCount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-extrabold text-sm sm:text-base">{row.facultyCount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-zinc-300 text-sm font-bold min-w-[36px]">{row.avgCompletionRate}%</span>
                                                <div className="w-24 bg-zinc-800 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${getCompletionColorClass(row.avgCompletionRate)}`}
                                                        style={{ width: `${row.avgCompletionRate}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#009BD8] hover:bg-[#008bc2] text-white text-xs font-black rounded-lg transition-all shadow-[0_2px_8px_rgba(0,155,216,0.3)] hover:scale-105 cursor-pointer"
                                                onClick={() => setSelectedDeptId(row.departmentId)}
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>View Courses</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* LEVEL 3 VIEW: COURSES */}
            {level === 3 && (
                <div className="bg-[#121212] border border-zinc-800/70 rounded-2xl shadow-xl overflow-hidden hover:border-zinc-800 transition-all duration-200">
                    <div className="p-6 border-b border-zinc-800/70">
                        <h3 className="text-lg font-bold text-white">Select Course to View Students</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse font-sans">
                            <thead>
                                <tr className="bg-[#272727] text-zinc-200 text-xs font-bold uppercase tracking-wider border-b border-zinc-800">
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">#ID</th>
                                    <th className="px-6 py-4">Module</th>
                                    <th className="px-6 py-4">Instructor</th>
                                    <th className="px-6 py-4">Students Enrolled</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4">Completion Rate</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courseList.map((row, idx) => (
                                    <tr key={`${row.courseId}-${idx}`} className="border-b border-[#333333] hover:bg-zinc-900/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-extrabold text-white text-sm sm:text-base">{row.courseName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-400 font-extrabold text-sm uppercase tracking-wide">{row.courseId}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-300 text-sm font-semibold">{row.module}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-300 text-sm font-semibold">{row.instructorName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-extrabold text-sm sm:text-base">{row.studentsEnrolledCount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-300 text-sm font-semibold">{row.duration}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-zinc-300 text-sm font-bold min-w-[36px]">{row.completionRate}%</span>
                                                <div className="w-24 bg-zinc-800 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full bg-[#7FBC42]`}
                                                        style={{ width: `${row.completionRate}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#009BD8] hover:bg-[#008bc2] text-white text-xs font-black rounded-lg transition-all shadow-[0_2px_8px_rgba(0,155,216,0.3)] hover:scale-105 cursor-pointer"
                                                onClick={() => setSelectedCourseId(row.courseId)}
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>View Students</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* LEVEL 4 VIEW: STUDENTS */}
            {level === 4 && (
                <div className="bg-[#121212] border border-zinc-800/70 rounded-2xl shadow-xl overflow-hidden hover:border-zinc-800 transition-all duration-200">
                    <div className="p-6 border-b border-zinc-800/70">
                        <h3 className="text-lg font-bold text-white">Enrolled Students</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse font-sans">
                            <thead>
                                <tr className="bg-[#272727] text-zinc-200 text-xs font-bold uppercase tracking-wider border-b border-zinc-800">
                                    <th className="px-6 py-4">Student Details</th>
                                    <th className="px-6 py-4">#ID</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Assignments</th>
                                    <th className="px-6 py-4">Progress</th>
                                    <th className="px-6 py-4">Grade</th>
                                    <th className="px-6 py-4">Last Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentList.map((row, idx) => (
                                    <tr key={`${row.studentEmail}-${idx}`} className="border-b border-[#333333] hover:bg-zinc-900/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-extrabold text-white text-sm sm:text-base block">{row.studentName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-400 text-sm font-semibold">{row.studentEmail}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(row.status)}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-300 font-extrabold text-sm sm:text-base">{row.assignmentsFraction}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-zinc-300 text-sm font-bold min-w-[36px]">{row.progressPercentage}%</span>
                                                <div className="w-24 bg-zinc-800 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${getCompletionColorClass(row.progressPercentage)}`}
                                                        style={{ width: `${row.progressPercentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-extrabold text-sm sm:text-base">{row.grade}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-400 text-xs font-semibold">{row.lastActive}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
        </Loading>
    );
};

export default StudentsAnalyticsView;
