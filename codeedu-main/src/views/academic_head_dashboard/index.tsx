import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import Loading from '@/components/shared/Loading';
import * as XLSX from 'xlsx';

// Shared types and constants
import type { TabType, PeriodType, DashboardData } from './types';
import { DASHBOARD_DATA_BY_PERIOD } from './data';
import { fetchDashboardStatistics, ApiDashboardData } from './services/DashboardService';

// Components
import DashboardHeader from './components/DashboardHeader';
import TabSwitcher from './components/TabSwitcher';
import StatCardsGrid from './components/StatCardsGrid';
import OverviewView from './components/OverviewView';
import InstitutionsListView from './components/InstitutionsListView';
import InstitutionDetailView from './components/InstitutionDetailView';
import CoursePerformanceListView from './components/CoursePerformanceListView';
import CoursePerformanceDetailView from './components/CoursePerformanceDetailView';
import StudentsAnalyticsView from './components/StudentsAnalyticsView';

const mapApiDataToDashboardData = (apiData: ApiDashboardData, fallbackData: DashboardData): DashboardData => {
    // 1. Map stats card
    const stats = [
        { 
            label: 'Total Institute', 
            value: apiData.total_institutes,
            change: apiData.total_institutes_change ?? fallbackData.stats[0]?.change,
            isPositive: apiData.total_institutes_change 
                ? !apiData.total_institutes_change.startsWith('-') 
                : fallbackData.stats[0]?.isPositive
        },
        { 
            label: 'Active Licenses', 
            value: fallbackData.stats[1]?.value,
            change: fallbackData.stats[1]?.change,
            isPositive: fallbackData.stats[1]?.isPositive
        },
        { 
            label: 'Total Students', 
            value: apiData.total_students,
            change: apiData.total_students_change ?? fallbackData.stats[2]?.change,
            isPositive: apiData.total_students_change 
                ? !apiData.total_students_change.startsWith('-') 
                : fallbackData.stats[2]?.isPositive
        },
        { 
            label: 'Total enCODE Instructors', 
            value: apiData.total_encode_instructors,
            change: apiData.total_encode_instructors_change ?? fallbackData.stats[3]?.change,
            isPositive: apiData.total_encode_instructors_change 
                ? !apiData.total_encode_instructors_change.startsWith('-') 
                : fallbackData.stats[3]?.isPositive
        },
        { 
            label: 'Total Contract Value', 
            value: fallbackData.stats[4]?.value 
        },
        { 
            label: 'Total Internal Faculty', 
            value: apiData.total_internal_faculty 
        },
    ];

    // 2. Map growth trends
    const growthTrends = apiData.growth_trends && apiData.growth_trends.length > 0
        ? [...apiData.growth_trends]
            .reverse()
            .map((trend) => ({
                month: dayjs(trend.month_date).format('MMM YY'),
                enrolled: parseInt(trend['SUM(total_students)'], 10) || 0,
            }))
        : fallbackData.growthTrends;

    // 3. Map students progress distribution
    const totalProgress = apiData.students_progress_distribution?.reduce(
        (sum, item) => sum + (parseInt(item['SUM(total)'], 10) || 0),
        0
    ) || 0;

    const progressDistribution = apiData.students_progress_distribution && apiData.students_progress_distribution.length > 0
        ? apiData.students_progress_distribution.map((item) => {
            const count = parseInt(item['SUM(total)'], 10) || 0;
            let percentage = 0;
            if (totalProgress > 0 && count > 0) {
                const rawPercent = (count / totalProgress) * 100;
                percentage = rawPercent < 0.1 ? 0.1 : parseFloat(rawPercent.toFixed(2));
            }

            let color = '#FFEC00'; // Default Not Started color
            if (item.status === 'Completed') {
                color = '#009BD8';
            } else if (item.status === 'In Progress') {
                color = '#7FBC42';
            } else if (item.status === 'Not Assigned') {
                color = '#E60086';
            }

            return {
                name: item.status,
                value: percentage,
                color,
                count,
            };
        })
        : fallbackData.progressDistribution.map(item => {
            const totalStudentsVal = parseInt(String(fallbackData.stats[2]?.value || '0').replace(/[^0-9]/g, ''), 10) || 0;
            return {
                ...item,
                count: Math.round((item.value / 100) * totalStudentsVal),
            };
        });

    // Ensure all 4 segments exist (even if 0) so the chart doesn't break
    const segments = ['Not Started', 'In Progress', 'Completed', 'Not Assigned'];
    segments.forEach((name) => {
        if (!progressDistribution.find((x) => x.name === name)) {
            let color = '#FFEC00';
            if (name === 'Completed') color = '#009BD8';
            else if (name === 'In Progress') color = '#7FBC42';
            else if (name === 'Not Assigned') color = '#E60086';
            progressDistribution.push({ name, value: 0, color, count: 0 });
        }
    });

    // Helper for location
    const getLocation = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('vivekananda') || lowerName.includes('vgu')) return 'Jaipur, Rajasthan';
        if (lowerName.includes('code')) return 'Jaipur, Rajasthan';
        if (lowerName.includes('iicd')) return 'Jaipur, Rajasthan';
        if (lowerName.includes('ellen')) return 'Jaipur, Rajasthan';
        return 'India';
    };

    // 4. Map top institutions
    const topInstitutions = apiData.top_performing_institutions && apiData.top_performing_institutions.length > 0
        ? apiData.top_performing_institutions.map((inst, index) => ({
            rank: index + 1,
            name: inst.organization_name,
            location: getLocation(inst.organization_name),
            studentsEnrolled: inst.students_enrolled,
            internalFaculty: inst.internal_faculty,
            completionRate: parseFloat(inst.completion_percentage) || 0,
        }))
        : fallbackData.topInstitutions;

    return {
        lastUpdated: dayjs().format('MMMM D, YYYY'),
        stats,
        growthTrends,
        progressDistribution,
        topInstitutions,
    };
};

const Index = () => {
    const [period, setPeriod] = useState<PeriodType>('weekly');
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null);
    const [selectedCoursePerfId, setSelectedCoursePerfId] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<string>('');
    const [isFirstPageOfStudentsAnalytics, setIsFirstPageOfStudentsAnalytics] = useState(true);

    const [rawApiData, setRawApiData] = useState<ApiDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [activeExportData, setActiveExportData] = useState<{
        sheets: { name: string; data: any[] }[];
    } | null>(null);

    // Dynamic timestamp updating every minute
    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(dayjs().format('MMMM D, YYYY h:mm A'));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const loadStatistics = async () => {
            setIsLoading(true);
            const response = await fetchDashboardStatistics(period);
            if (response && response.status === 1 && response.data) {
                setRawApiData(response.data);
            } else {
                toast.error('Failed to load live dashboard statistics. Using fallback data.');
            }
            setIsLoading(false);
        };
        loadStatistics();
    }, [period]);

    const currentData = useMemo(() => {
        if (rawApiData) {
            return mapApiDataToDashboardData(rawApiData, DASHBOARD_DATA_BY_PERIOD[period]);
        }
        return DASHBOARD_DATA_BY_PERIOD[period];
    }, [rawApiData, period]);

    // Update active export data when overview currentData changes
    useEffect(() => {
        if (activeTab === 'overview') {
            setActiveExportData({
                sheets: [
                    {
                        name: 'Statistics',
                        data: currentData.stats.map(s => ({
                            Label: s.label,
                            Value: s.value,
                            Change: s.change || ''
                        }))
                    },
                    {
                        name: 'Growth Trends',
                        data: currentData.growthTrends.map(g => ({
                            Month: g.month,
                            'Enrolled Students': g.enrolled
                        }))
                    },
                    {
                        name: 'Progress',
                        data: currentData.progressDistribution.map(p => ({
                            Status: p.name,
                            Percentage: p.value + '%',
                            Count: p.count || 0
                        }))
                    },
                    {
                        name: 'Top Institutions',
                        data: currentData.topInstitutions.map(t => ({
                            Rank: t.rank,
                            'Institution Name': t.name,
                            Location: t.location,
                            'Students Enrolled': t.studentsEnrolled,
                            'Internal Faculty': t.internalFaculty,
                            'Completion Rate': t.completionRate + '%'
                        }))
                    }
                ]
            });
        }
    }, [activeTab, currentData]);

    // Export current active data slice to Excel (.xlsx) file with multiple sheets
    const handleExportData = () => {
        if (!activeExportData || activeExportData.sheets.length === 0) {
            toast.error("No data available to export");
            return;
        }

        const wb = XLSX.utils.book_new();
        const filename = `Academic_Dashboard_${activeTab}_${period}_${dayjs().format('YYYY-MM-DD')}.xlsx`;

        activeExportData.sheets.forEach(sheet => {
            const ws = XLSX.utils.json_to_sheet(sheet.data);
            XLSX.utils.book_append_sheet(wb, ws, sheet.name);
        });

        // Write and download the Excel file
        XLSX.writeFile(wb, filename);
    };

    // Clean reset of sub-views when switching main tabs
    const handleTabChange = (newTab: TabType) => {
        setActiveTab(newTab);
        setSelectedInstitutionId(null);
        setSelectedCoursePerfId(null);
    };

    return (
        <div className="flex flex-col flex-1 w-full min-h-screen bg-black text-white p-4 sm:p-6 md:p-8 font-sans">
            {/* Header section with back navigation and timestamp */}
            <DashboardHeader
                currentTime={currentTime}
                fallbackDate={currentData.lastUpdated}
                onExport={handleExportData}
            />

            <TabSwitcher
                activeTab={activeTab}
                period={period}
                hidePeriodDropdown={
                    (activeTab === 'students_analytics' && !isFirstPageOfStudentsAnalytics) ||
                    (activeTab === 'institutions_licenses' && selectedInstitutionId !== null) ||
                    (activeTab === 'course_performance' && selectedCoursePerfId !== null)
                }
                onTabChange={handleTabChange}
                onPeriodChange={setPeriod}
            />

            {/* Render selected view */}
            {activeTab === 'overview' && (
                <Loading loading={isLoading} type="default">
                    <div className="flex flex-col gap-6">
                        <StatCardsGrid stats={currentData.stats} />
                        <OverviewView currentData={currentData} />
                    </div>
                </Loading>
            )}

            {activeTab === 'institutions_licenses' && (
                <>
                    {selectedInstitutionId === null ? (
                        <InstitutionsListView
                            onViewDetail={(id) => setSelectedInstitutionId(id)}
                            onUpdateExportData={setActiveExportData}
                        />
                    ) : (
                        <InstitutionDetailView
                            institutionId={selectedInstitutionId}
                            onBack={() => setSelectedInstitutionId(null)}
                            onUpdateExportData={setActiveExportData}
                        />
                    )}
                </>
            )}

            {activeTab === 'course_performance' && (
                <>
                    {selectedCoursePerfId === null ? (
                        <CoursePerformanceListView
                            onViewDetail={(id) => setSelectedCoursePerfId(id)}
                            period={period}
                            onUpdateExportData={setActiveExportData}
                        />
                    ) : (
                        <CoursePerformanceDetailView
                            institutionId={selectedCoursePerfId}
                            onBack={() => setSelectedCoursePerfId(null)}
                            onUpdateExportData={setActiveExportData}
                        />
                    )}
                </>
            )}

            {/* Students Analytics Tab */}
            {activeTab === 'students_analytics' && (
                <StudentsAnalyticsView 
                    onLevelChange={(lvl) => setIsFirstPageOfStudentsAnalytics(lvl === 1)} 
                    period={period} 
                    onUpdateExportData={setActiveExportData}
                />
            )}
        </div>
    );
};

export default Index;
