import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { INSTITUTION_DETAILS } from '../data';

interface InstitutionDetailViewProps {
    institutionId: string;
    onBack: () => void;
    onUpdateExportData?: (data: { sheets: { name: string; data: any[] }[] }) => void;
}

const InstitutionDetailView: React.FC<InstitutionDetailViewProps> = ({ institutionId, onBack, onUpdateExportData }) => {
    // Lookup details or fallback to Tech Valley Institute (INST-004) if ID is not found.
    const details = INSTITUTION_DETAILS[institutionId] || INSTITUTION_DETAILS['INST-004'];

    React.useEffect(() => {
        if (onUpdateExportData && details) {
            onUpdateExportData({
                sheets: [
                    {
                        name: 'General Information',
                        data: [
                            {
                                'Institution ID': details.id,
                                'Name': details.name,
                                'Location': details.location,
                                'Type': details.basicInfo.type,
                                'Date Onboarded': details.basicInfo.dateOnboarded,
                                'Last Platform Activity': details.basicInfo.lastPlatformActivity,
                                'Email': details.basicInfo.email,
                                'Phone': details.basicInfo.phone,
                                'Students Completed': details.studentsCompleted,
                                'Students In Progress': details.studentsInProgress,
                                'Students Not Started': details.studentsNotStarted
                            }
                        ]
                    },
                    {
                        name: 'Licenses & Users',
                        data: [
                            {
                                'Total Purchased': details.licensesUsers.totalPurchased,
                                'Activated': details.licensesUsers.activated,
                                'Available': details.licensesUsers.available,
                                'Explorer': details.licensesUsers.explorer,
                                'Builder': details.licensesUsers.builder,
                                'Navigator': details.licensesUsers.navigator,
                                'Students Enrolled': details.licensesUsers.studentsEnrolled,
                                'Internal Faculty': details.licensesUsers.internalFaculty,
                                'Courses Assigned': details.licensesUsers.coursesAssigned
                            }
                        ]
                    },
                    {
                        name: 'Course Performance',
                        data: [
                            {
                                'Most Active Course': details.courseActivity.mostActive,
                                'Least Active Course': details.courseActivity.leastActive,
                                'Total Courses Available': details.courseActivity.totalAvailable,
                                'Average Course Completion': details.courseActivity.avgCompletion + '%'
                            }
                        ]
                    },
                    {
                        name: 'Contract & Engagement',
                        data: [
                            {
                                'Engagement Status': details.engagementContract.status,
                                'Contract Value': details.engagementContract.contractValue,
                                'Renewal Date': details.engagementContract.renewalDate,
                                'Days Until Renewal': details.engagementContract.daysUntilRenewal
                            }
                        ]
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
                    className="mt-4 px-4 py-2 bg-zinc-800 text-white rounded-xl text-sm border border-zinc-700 hover:bg-zinc-700"
                    onClick={onBack}
                >
                    Back to List
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 bg-[#121212] border border-zinc-800/70 rounded-2xl p-6 shadow-2xl">
            
            {/* Back to list navigation breadcrumb */}
            <div className="flex items-center">
                <button
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
                    onClick={onBack}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Institutions & Licenses Allocation</span>
                </button>
            </div>

            {/* Institution Header Profile Card - Sleek nested card styling with bg-[#272727] */}
            <div className="bg-[#272727] rounded-2xl p-6 shadow-lg transition-all duration-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    {/* Left: Building Image + Info */}
                    <div className="flex flex-col sm:flex-row gap-5 items-start flex-1">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-[#444444] bg-zinc-950 flex-shrink-0 shadow-md">
                            <img
                                src={details.image || '/img/tech_institute_building.png'}
                                alt={details.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{details.name}</h2>
                            <p className="text-zinc-400 text-xs sm:text-sm font-bold uppercase tracking-wider mt-1 mb-4">
                                {details.id} &bull; <span className="text-zinc-400 normal-case">{details.location}</span>
                            </p>

                            {/* Completed, in-progress, not completed boxes inline directly below name/subtitle */}
                            <div className="flex flex-wrap gap-3">
                                {/* Completed box */}
                                <div className="px-4 py-2 bg-[#0ea5e9] text-white rounded-xl shadow-[0_2px_8px_rgba(14,165,233,0.3)] flex flex-col justify-between min-w-[130px]">
                                    <span className="text-white/80 text-[10px] uppercase font-bold tracking-wider">Students Completed</span>
                                    <span className="text-lg font-extrabold mt-0.5">{details.studentsCompleted.toLocaleString()}</span>
                                </div>

                                {/* In-Progress box */}
                                <div className="px-4 py-2 bg-[#7FBC42] text-white rounded-xl shadow-[0_2px_8px_rgba(127,188,66,0.3)] flex flex-col justify-between min-w-[130px]">
                                    <span className="text-white/80 text-[10px] uppercase font-bold tracking-wider">Students In-Progress</span>
                                    <span className="text-lg font-extrabold mt-0.5">{details.studentsInProgress.toLocaleString()}</span>
                                </div>

                                {/* Not Started box */}
                                <div className="px-4 py-2 bg-[#E60086] text-white rounded-xl shadow-[0_2px_8px_rgba(230,0,134,0.3)] flex flex-col justify-between min-w-[130px]">
                                    <span className="text-white/80 text-[10px] uppercase font-bold tracking-wider">Students Not Started</span>
                                    <span className="text-lg font-extrabold mt-0.5">{details.studentsNotStarted.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Total Licenses large view matching mockup */}
                    <div className="flex flex-col items-start sm:items-end justify-center sm:border-l sm:border-[#444444] sm:pl-8 text-left sm:text-right self-stretch sm:self-auto mt-4 sm:mt-0 min-w-[150px]">
                        <span className="text-[#7FBC42] text-3xl sm:text-4xl font-black tracking-tight leading-none">
                            {details.allocatedLicenses.toLocaleString()}/{details.totalLicenses.toLocaleString()}
                        </span>
                        <span className="text-white text-3xl sm:text-4xl font-bold mt-2 block">
                            Total Licenses
                        </span>
                    </div>
                </div>
            </div>

            {/* Basic Information Section */}
            <div className="bg-[#272727] rounded-2xl p-6 shadow-lg transition-all duration-200">
                <h3 className="text-base sm:text-lg font-bold text-white mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Institution Type */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Institution Type</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5">{details.basicInfo.type}</span>
                    </div>
                    {/* Location */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Location</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5">{details.basicInfo.location}</span>
                    </div>
                    {/* Date of Onboarding */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Date of Onboarding</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5">{details.basicInfo.dateOnboarded}</span>
                    </div>
                    {/* Last Platform Activity */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Last Platform Activity</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5">{details.basicInfo.lastPlatformActivity}</span>
                    </div>
                    {/* Email Address */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Email Address</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5 truncate">{details.basicInfo.email}</span>
                    </div>
                    {/* Contact Phone */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Contact Phone</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5">{details.basicInfo.phone}</span>
                    </div>
                </div>
            </div>

            {/* Licenses & Users Section */}
            <div className="bg-[#272727] rounded-2xl p-6 shadow-lg transition-all duration-200">
                <h3 className="text-base sm:text-lg font-bold text-white mb-4">Licenses & Users</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Total Licenses Purchased */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Total Licenses Purchased</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5">{details.licensesUsers.totalPurchased.toLocaleString()}</span>
                    </div>
                    {/* Licenses Activated */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Licenses Activated</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5">{details.licensesUsers.activated.toLocaleString()}</span>
                    </div>
                    {/* Available Licenses */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Available Licenses</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5">{details.licensesUsers.available.toLocaleString()}</span>
                    </div>
                    {/* Explorer Licenses */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Explorer Licenses</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5">{details.licensesUsers.explorer.toLocaleString()}</span>
                    </div>
                    {/* Builder Licenses */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Builder Licenses</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5">{details.licensesUsers.builder.toLocaleString()}</span>
                    </div>
                    {/* Navigator Licenses */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Navigator Licenses</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5">{details.licensesUsers.navigator.toLocaleString()}</span>
                    </div>
                    {/* Total Students Enrolled */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Total Students Enrolled</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5">{details.licensesUsers.studentsEnrolled.toLocaleString()}</span>
                    </div>
                    {/* Total Internal Faculty */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Total Internal Faculty</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5">{details.licensesUsers.internalFaculty.toLocaleString()}</span>
                    </div>
                    {/* Courses Assigned */}
                    <div className="bg-[#444444] p-4 rounded-xl">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Courses Assigned</span>
                        <span className="text-white text-sm sm:text-base font-extrabold block mt-1.5">
                            {details.licensesUsers.coursesAssigned}
                        </span>
                    </div>
                </div>
            </div>

            {/* Course Activity & Performance Section */}
            <div className="bg-[#272727] rounded-2xl p-6 shadow-lg transition-all duration-200">
                <h3 className="text-base sm:text-lg font-bold text-white mb-4">Course Activity & Performance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Most Active Course */}
                    <div className="bg-[#444444] p-4 rounded-xl flex flex-col justify-between">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Most Active Course</span>
                        <span className="text-[#7FBC42] text-sm sm:text-base font-extrabold mt-1.5 leading-snug">{details.courseActivity.mostActive}</span>
                    </div>
                    {/* Least Active Course */}
                    <div className="bg-[#444444] p-4 rounded-xl flex flex-col justify-between">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Least Active Course</span>
                        <span className="text-[#E60086] text-sm sm:text-base font-extrabold mt-1.5 leading-snug">{details.courseActivity.leastActive}</span>
                    </div>
                    {/* Total Course Available */}
                    <div className="bg-[#444444] p-4 rounded-xl flex flex-col justify-between">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Total Course Available</span>
                        <span className="text-white text-sm sm:text-base font-extrabold mt-1.5">{details.courseActivity.totalAvailable.toLocaleString()}</span>
                    </div>
                    {/* Average Course Completion */}
                    <div className="bg-[#444444] p-4 rounded-xl flex flex-col justify-between">
                        <div>
                            <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Average Course Completion</span>
                            <span className="text-[#ffc531] text-sm sm:text-base font-black mt-1.5 block">{details.courseActivity.avgCompletion}%</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mt-3">
                            <div className="h-full bg-[#ffc531] rounded-full" style={{ width: `${details.courseActivity.avgCompletion}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Engagement Status & Contract Details Section */}
            <div className="bg-[#272727] rounded-2xl p-6 shadow-lg transition-all duration-200">
                <h3 className="text-base sm:text-lg font-bold text-white mb-4">Engagement Status & Contract Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Engagement Status */}
                    <div className="bg-[#1a365d]/30 border border-[#2b6cb0]/40 p-4 rounded-xl shadow-inner">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Engagement Status</span>
                        <span className="text-sky-400 text-lg sm:text-xl font-black block mt-2 tracking-wide uppercase">{details.engagementContract.status}</span>
                    </div>
                    {/* Contract Value */}
                    <div className="bg-[#701a75]/20 border border-[#d946ef]/30 p-4 rounded-xl shadow-inner">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Contract Value</span>
                        <span className="text-[#f472b6] text-lg sm:text-xl font-black block mt-2 tracking-wide">{details.engagementContract.contractValue}</span>
                    </div>
                    {/* Contract Renewal Date */}
                    <div className="bg-[#713f12]/20 border border-[#eab308]/30 p-4 rounded-xl shadow-inner">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Contract Renewal Date</span>
                        <span className="text-[#ffc531] text-sm sm:text-base font-extrabold block mt-2.5 tracking-tight">{details.engagementContract.renewalDate}</span>
                    </div>
                    {/* Days Until Renewal */}
                    <div className="bg-[#14532d]/20 border border-[#22c55e]/30 p-4 rounded-xl shadow-inner">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Days Until Renewal</span>
                        <span className="text-[#7FBC42] text-lg sm:text-xl font-black block mt-2 tracking-wide">{details.engagementContract.daysUntilRenewal}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstitutionDetailView;
