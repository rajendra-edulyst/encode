import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import { useQueries } from '@tanstack/react-query';
import { BookOpen, Loader2, Download, Search } from 'lucide-react';
import CourseStatCard from '../course-sessions/CourseStatCard';
import CourseTabs from '../course-sessions/CourseTabs';
import AssignmentList from './components/AssignmentList';
import StudentList from './components/StudentList';
import GradingPane from './components/GradingPane';
import { fetchAssignments, fetchAssignmentSubmissionReport } from '@/services/faculty/AssignmentService';
import { Assignment } from '@/@types/faculty/assignment';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui';
import { fetchModuleByCourseId } from '@/services/learner/CourseService';
import { useBatches, useMyAssignedPrograms } from '@/hooks/data/faculty/useProgram';
import { cn } from '@/lib/utils';

const AssignmentsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: batches = [] } = useBatches();
  const { data: assignedPrograms = [] } = useMyAssignedPrograms();

  const handleExportReport = async () => {
    if (selectedCourse === 'all') return;
    try {
      setIsExporting(true);
      const response = await fetchAssignmentSubmissionReport(selectedCourse, selectedBatch !== 'all' ? selectedBatch : undefined);

      if (response.status === 1) {
        if (!response.data || response.data.length === 0) {
          alert("No data available for the selected course and batch.");
          return;
        }

        const data = response.data;
        const moduleCount = response.module_count || 0;

        // Dynamic headers
        const baseHeaders = ['S.N.', 'Learner Name', 'Username', 'Email', 'Batch Name', 'Status', 'Department', 'Program Name'];
        const moduleHeaders: string[] = [];
        for (let i = 1; i <= moduleCount; i++) {
          moduleHeaders.push(`Module ${i} Name`, `Module ${i} Submit Status`, `Module ${i} Marked Status`);
        }
        const headers = [...baseHeaders, ...moduleHeaders, 'Completion %'];

        const csvRows = [];
        csvRows.push(headers.join(','));

        data.forEach((item) => {
          const row = [
            item.sn || '',
            `"${item.learner_name || ''}"`,
            `"${item.username || ''}"`,
            `"${item.email || ''}"`,
            `"${item.batch_name || ''}"`,
            `"${item.status || ''}"`,
            `"${item.department || ''}"`,
            `"${item.program_name || ''}"`,
          ];

          for (let i = 1; i <= moduleCount; i++) {
            row.push(
              `"${item[`module_${i}_name`] || ''}"`,
              `"${item[`module_${i}_submit_status`] || ''}"`,
              `"${item[`module_${i}_marked_status`] || ''}"`
            );
          }
          row.push(`"${item.completion_per || '0%'}"`);
          csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `assignment_report_${selectedCourse}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert(response.message || "Failed to generate report.");
      }
    } catch (error) {
      console.error("Failed to export report:", error);
      alert("An error occurred while generating the report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const getAssignments = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (selectedBatch !== 'all') {
          params.append('batch_id', selectedBatch);
        }
        const data = await fetchAssignments(params);
        setAssignments(data);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getAssignments();
  }, [selectedBatch]);

  const availableCourses = useMemo(() => {
    const uniqueCourses = new Map<string, string>();

    // Add all assigned programs from API
    assignedPrograms.forEach((program) => {
      uniqueCourses.set(program.id.toString(), program.name);
    });

    // Fallback: Add any courses found in the assignments list (handles names as IDs if needed)
    assignments.forEach((assignment) => {
      const id = assignment.program_id ? assignment.program_id.toString() : assignment.program_name;
      if (id && !uniqueCourses.has(id)) {
        uniqueCourses.set(id, assignment.program_name);
      }
    });

    return Array.from(uniqueCourses.entries()).map(([id, name]) => ({ id, name }));
  }, [assignedPrograms, assignments]);

  const uniqueModuleIds = useMemo(
    () => Array.from(new Set(assignments.map((assignment) => assignment.module_id).filter(Boolean))),
    [assignments]
  );

  const moduleNameQueries = useQueries({
    queries: uniqueModuleIds.map((moduleId) => ({
      queryKey: ['courseModule', String(moduleId)],
      queryFn: () => fetchModuleByCourseId(String(moduleId)),
      staleTime: 1000 * 60 * 5,
      retry: 1,
      enabled: !!moduleId,
    })),
  });

  const moduleNamesById = useMemo(() => {
    const resolved: Record<number, string> = {};

    assignments.forEach((assignment) => {
      if (assignment.module_name) {
        resolved[assignment.module_id] = assignment.module_name;
      } else if (assignment.module_title) {
        resolved[assignment.module_id] = assignment.module_title;
      }
    });

    uniqueModuleIds.forEach((moduleId, index) => {
      const moduleName = moduleNameQueries[index]?.data?.module_details?.name;
      if (moduleName) {
        resolved[moduleId] = moduleName;
      }
    });

    return resolved;
  }, [assignments, uniqueModuleIds, moduleNameQueries]);

  /** Faculty list omits `is_graded`; module-content-list exposes it per assignment (program_content_id matches assignment id). */
  const assignmentGradedFromModuleContent = useMemo(() => {
    const map = new Map<number, boolean>();
    uniqueModuleIds.forEach((_, index) => {
      const moduleData = moduleNameQueries[index]?.data;
      const contents = moduleData?.contents ?? [];
      for (const raw of contents) {
        const c = raw as {
          content_type?: string;
          program_content_id?: number;
          is_graded?: number;
        };
        if (c.content_type !== 'assignment' || c.program_content_id == null) continue;
        map.set(c.program_content_id, c.is_graded === 1);
      }
    });
    return map;
  }, [uniqueModuleIds, moduleNameQueries]);

  const isAssignmentGraded = useCallback(
    (a: Assignment) => {
      const fromModule = assignmentGradedFromModuleContent.get(a.id);
      if (fromModule !== undefined) return fromModule;
      return a.is_graded === 1;
    },
    [assignmentGradedFromModuleContent]
  );

  const filteredAssignments = useMemo(() => {
    let filtered = assignments;

    if (activeTab !== "all") {
      const now = dayjs();
      filtered = filtered.filter(a => {
        switch (activeTab) {
          case "pending review":
            return a.total_submissions > 0;
          case "graded":
            return isAssignmentGraded(a);
          case "active":
            return now.isBetween(dayjs(a.start_date), dayjs(a.end_date), 'day', '[]');
          case "completed":
            return a.total_submissions !== 0;
          default:
            return true;
        }
      });
    }

    if (selectedCourse !== 'all') {
      filtered = filtered.filter((assignment) => {
        const programId = assignment.program_id ? assignment.program_id.toString() : assignment.program_name;
        return programId === selectedCourse;
      });
    }

    return filtered;
  }, [assignments, activeTab, selectedCourse, isAssignmentGraded]);

  const sortedAssignments = useMemo(() => {
    const getModuleLabel = (assignment: Assignment) =>
      moduleNamesById[assignment.module_id] ||
      assignment.module_name ||
      assignment.module_title ||
      '';

    const getUnitNumber = (label: string) => {
      const match = label.match(/(\d+)/);
      return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
    };

    return [...filteredAssignments].sort((a, b) => {
      const aLabel = getModuleLabel(a);
      const bLabel = getModuleLabel(b);
      const aUnit = getUnitNumber(aLabel);
      const bUnit = getUnitNumber(bLabel);

      if (aUnit !== bUnit) return aUnit - bUnit;
      if (a.module_id !== b.module_id) return a.module_id - b.module_id;
      return a.title.localeCompare(b.title);
    });
  }, [filteredAssignments, moduleNamesById]);

  useEffect(() => {
    if (!filteredAssignments.length) {
      setSelectedAssignmentId(null);
      setSelectedStudentId(null);
      return;
    }

    const isStillInList = filteredAssignments.some(
      (a) => a.id.toString() === selectedAssignmentId
    );
    if (!isStillInList) {
      setSelectedAssignmentId(null);
      setSelectedStudentId(null);
    }
  }, [filteredAssignments, selectedAssignmentId]);

  const stats = useMemo(() => {
    const total = assignments.length;
    const pendingReview = assignments.filter((a) => a.total_submissions > 0).length;
    const gradedCount = assignments.filter((a) => isAssignmentGraded(a)).length;
    const totalLearners = assignments.reduce((acc, curr) => acc + curr.total_learner, 0);
    const totalSubmissions = assignments.reduce((acc, curr) => acc + curr.total_submissions, 0);
    const avgScore =
      total > 0 ? `${Math.round((totalSubmissions / (totalLearners || 1)) * 100)}%` : '0%';

    return {
      total,
      pendingReview,
      gradedCount,
      avgScore,
    };
  }, [assignments, isAssignmentGraded]);

  return (
    <div className="space-y-4">
      {/* Main Content Area */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <CourseStatCard title="Total Assignments" value={stats.total.toString()} />
          <CourseStatCard title="Pending Review" value={stats.pendingReview.toString()} />
          <CourseStatCard title="Graded" value={stats.gradedCount.toString()} />
          <CourseStatCard title="Avg Score" value={stats.avgScore} />
        </div>

        <div className="rounded-2xl border border-[#4a4a4a] bg-[#141414] p-5 lg:p-6">
          {/* Header Section: Dropdowns, Last Updated, Export */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-[300px] max-w-2xl">
                <div className="flex-1">
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="h-12 bg-[#262626] border-none text-white rounded-xl focus:ring-0 focus:ring-offset-0">
                      <div className="flex items-center gap-2 text-neutral-300 w-full pr-2">
                        <SelectValue placeholder="Choose Course" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-[#262626] border-[#434343] text-white">
                      <SelectItem value="all">Choose Course</SelectItem>
                      {availableCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-[240px]">
                  <Select
                    value={selectedBatch}
                    onValueChange={(val) => {
                      setSelectedBatch(val);
                    }}
                  >
                    <SelectTrigger className="h-12 bg-[#262626] border-none text-white rounded-xl focus:ring-0 focus:ring-offset-0">
                      <div className="flex items-center gap-2 text-neutral-300">
                        <SelectValue placeholder="Choose Batch" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-[#262626] border-[#434343] text-white">
                      <SelectItem value="all">Choose Batch</SelectItem>
                      {batches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id.toString()}>
                          {batch.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-tight">Last Updated</p>
                  <p className="text-sm text-white font-medium">April 7, 2026</p>
                </div> */}

                <Button
                  onClick={handleExportReport}
                  loading={isExporting}
                  disabled={selectedCourse === 'all' || selectedBatch === 'all'}
                  className={cn(
                    "rounded-xl h-12 px-6 flex items-center gap-2 font-medium transition-all !bg-[#00a3ff] text-white disabled:opacity-50 disabled:cursor-not-allowed",
                    (selectedCourse === 'all' || selectedBatch === 'all') && "opacity-50"
                  )}
                >
                  {!isExporting && <Download className="w-4 h-4" />}
                  Export
                </Button>
              </div>
            </div>

            {/* Row 2: Search and Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[300px] max-w-2xl">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-neutral-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search Students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 bg-[#262626] border-none text-white pl-10 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500/50 placeholder:text-neutral-500"
                />
              </div>

              <div className="flex items-center">
                <div className="bg-[#262626] rounded-xl flex items-center overflow-hidden h-12 border border-neutral-800/50">
                  {["All", "Pending Review", "Graded", "Active", "Completed"].map((tab, index) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={cn(
                        "px-5 h-full text-[11px] font-bold transition-all whitespace-nowrap",
                        activeTab === tab.toLowerCase()
                          ? "bg-[#00A3FF] text-white"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-800/50",
                        index !== 0 && activeTab !== tab.toLowerCase() && activeTab !== ["All", "Pending Review", "Graded", "Active", "Completed"][index - 1].toLowerCase() && "border-l border-neutral-700/50"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
              <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Loading Assignments...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[800px]">
              {/* Column 1: Assignments List */}
              <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
                <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2 px-1">Select Assignment</h3>
                <AssignmentList
                  assignments={sortedAssignments}
                  moduleNamesById={moduleNamesById}
                  onSelect={(id) => {
                    setSelectedAssignmentId(id);
                    setSelectedStudentId(null);
                  }}
                  selectedId={selectedAssignmentId}
                />
              </div>

              {/* Column 2: Students List */}
              <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
                <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2 px-1">Students List</h3>
                <StudentList
                  assignmentId={selectedAssignmentId}
                  onSelect={setSelectedStudentId}
                  selectedId={selectedStudentId}
                  refreshKey={refreshKey}
                  searchQuery={searchQuery}
                  activeTab={activeTab}
                />
              </div>

              {/* Column 3: Assignment Overview */}
              <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
                <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2 px-1">
                  Assignment Overview
                </h3>
                <GradingPane
                  assignmentId={selectedAssignmentId}
                  studentId={selectedStudentId}
                  onGradeUpdate={() => {
                    setRefreshKey(prev => prev + 1);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;
