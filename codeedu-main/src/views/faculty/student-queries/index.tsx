import React, { useState, useMemo } from 'react';
import { useStudentQueries } from '@/hooks/data/faculty/useStudentQueries';
import { StudentJobLead } from '@/services/faculty/StudentQueriesService';
import StudentQueryRow from './components/StudentQueryRow';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Download, FileText, Table } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Breadcrumb from '@/components/breadcrumb';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { formatedApiDate } from '@/utils/dateFormat';

export default function StudentQueriesDashboard() {
    const { data: response, isLoading, error } = useStudentQueries();
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    let rawData = response as any;

    // In case the backend returns a JSON string instead of parsed JSON
    if (typeof rawData === 'string') {
        try {
            rawData = JSON.parse(rawData);
        } catch (e) {
            console.error("Failed to parse API response string", e);
        }
    }

    const queries: StudentJobLead[] = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
            ? rawData.data
            : Array.isArray(rawData?.data?.data)
                ? rawData.data.data
                : [];

    console.log("StudentQueries Response:", rawData, "Parsed Queries:", queries);

    const filteredQueries = useMemo(() => {
        let filtered = queries;

        // Filter by tab type
        if (activeTab !== 'all') {
            const typeFilter = parseInt(activeTab);
            filtered = filtered.filter(q => q.type === typeFilter);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(q =>
                (q.name && q.name.toLowerCase().includes(query)) ||
                (q.email && q.email.toLowerCase().includes(query)) ||
                (q.company_name && q.company_name.toLowerCase().includes(query)) ||
                (q.domain_name && q.domain_name.toLowerCase().includes(query))
            );
        }

        return filtered;
    }, [queries, activeTab, searchQuery]);

    const getTypeLabel = (type: number) => {
        switch (type) {
            case 1: return 'Offer Received';
            case 2: return 'Opted Out';
            case 3: return 'Still Looking';
            case 4: return 'Needs Help';
            case 5: return 'Feedback';
            default: return 'Unknown';
        }
    };

    const handleDownloadCSV = () => {
        if (!filteredQueries || filteredQueries.length === 0) return;
        const headers = ["Student Name", "Email", "Status", "Company", "Role", "Designation", "Package", "Location", "Duration", "Joining Date", "Domain Name", "Mentor Name", "PDF Link"];
        const csvRows = [headers.join(',')];

        filteredQueries.forEach(query => {
            const values = [
                `"${query.name || ''}"`,
                `"${query.email || ''}"`,
                `"${getTypeLabel(query.type)}"`,
                `"${query.company_name || ''}"`,
                `"${query.job_role || ''}"`,
                `"${query.designation || ''}"`,
                `"${query.salary_package || ''}"`,
                `"${query.location || ''}"`,
                `"${query.duration ? query.duration + ' Months' : ''}"`,
                `"${query.joining_date ? formatedApiDate(query.joining_date) : ''}"`,
                `"${query.domain_name || ''}"`,
                `"${query.mentor_name || ''}"`,
                `"${query.pdf_path || ''}"`
            ];
            csvRows.push(values.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Student_Queries_Export.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadPDF = async () => {
        const tableElement = document.getElementById('student-queries-table');
        if (!tableElement) return;

        try {
            const canvas = await html2canvas(tableElement, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape A4
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Student_Queries_Export.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF", error);
        }
    };

    // Counts for tabs
    const counts = useMemo(() => {
        return {
            all: queries.length,
            type1: queries.filter(q => q.type === 1).length,
            type2: queries.filter(q => q.type === 2).length,
            type3: queries.filter(q => q.type === 3).length,
            type4: queries.filter(q => q.type === 4).length,
            type5: queries.filter(q => q.type === 5).length,
        };
    }, [queries]);

    return (
        <div className="w-full">
            <Breadcrumb items={[{ label: 'Student Queries' }]} />

            <div className="mb-6 mt-4">
                <p className="text-gray-500 dark:text-gray-400 mt-1">Review and respond to student internship and job inquiries.</p>
            </div>

            {/* Controls Row (Tabs) */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-6">
                {/* Tabs */}
                <div className="overflow-x-auto max-w-full pb-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-w-max">
                        <TabsList className="bg-[#5A5A5A] rounded-xl overflow-hidden p-0 h-auto flex divide-x divide-gray-400 w-fit">
                            <TabsTrigger value="all" className="rounded-none text-white py-2.5 px-5 transition-all hover:bg-white/10 text-sm font-medium">
                                All Queries ({counts.all})
                            </TabsTrigger>
                            <TabsTrigger value="1" className="rounded-none text-white py-2.5 px-5 transition-all hover:bg-white/10 text-sm font-medium">
                                Offers Received ({counts.type1})
                            </TabsTrigger>
                            <TabsTrigger value="2" className="rounded-none text-white py-2.5 px-5 transition-all hover:bg-white/10 text-sm font-medium">
                                Opted Out ({counts.type2})
                            </TabsTrigger>
                            <TabsTrigger value="3" className="rounded-none text-white py-2.5 px-5 transition-all hover:bg-white/10 text-sm font-medium">
                                Still Looking ({counts.type3})
                            </TabsTrigger>
                            <TabsTrigger value="4" className="rounded-none text-white py-2.5 px-5 transition-all hover:bg-white/10 text-sm font-medium">
                                Needs Help ({counts.type4})
                            </TabsTrigger>
                            <TabsTrigger value="5" className="rounded-none text-white py-2.5 px-5 transition-all hover:bg-white/10 text-sm font-medium">
                                Feedback ({counts.type5})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Export Button */}
                <div className="shrink-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 bg-primary hover:bg-primary-deep text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[#323232] border-gray-200 dark:border-gray-700">
                            <DropdownMenuItem
                                className="cursor-pointer flex items-center gap-2 py-2.5"
                                onClick={handleDownloadCSV}
                            >
                                <Table className="w-4 h-4 text-gray-500" />
                                <span>Download as CSV</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer flex items-center gap-2 py-2.5"
                                onClick={handleDownloadPDF}
                            >
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span>Download as PDF</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Container */}
            <div className="w-full bg-[#2a2a2a] rounded-xl overflow-hidden border border-[#3f3f3f] shadow-lg">
                {/* Header with Title and Search */}
                <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-[#3f3f3f]">
                    <h2 className="text-xl font-bold text-white mb-4 md:mb-0">Student Queries</h2>
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[#424242] border-none rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
                        />
                    </div>
                </div>

                {/* Content Area */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-10 w-10 text-[#8cc63f] animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500 bg-[#352525] m-6 rounded-xl">
                        <p className="font-semibold text-lg">Error loading queries</p>
                        <p className="text-sm opacity-80 mt-1">{error.message || 'Please try again later.'}</p>
                    </div>
                ) : filteredQueries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <img
                            src="/img/others/comm-img.png"
                            alt="No queries found"
                            className="w-60 h-60 mb-6 object-contain opacity-50"
                        />
                        <p className="text-gray-400 text-lg">No student queries found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table id="student-queries-table" className="w-full text-left border-collapse bg-[#2a2a2a]">
                            <thead>
                                <tr className="border-b border-[#3f3f3f]">
                                    <th className="py-5 px-4 text-xs font-bold text-white uppercase tracking-wider w-[20%]">Student</th>
                                    <th className="py-5 px-4 text-xs font-bold text-white uppercase tracking-wider w-[20%]">Status & Details</th>
                                    <th className="py-5 px-4 text-xs font-bold text-white uppercase tracking-wider w-[25%]">Company</th>
                                    <th className="py-5 px-4 text-xs font-bold text-white uppercase tracking-wider w-[20%]">Job Details</th>
                                    <th className="py-5 px-4 text-xs font-bold text-white uppercase tracking-wider text-right w-[15%]">Attachment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQueries.map(query => (
                                    <StudentQueryRow key={query.id} query={query} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
