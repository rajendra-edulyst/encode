import React from 'react';
import AvatarComponents from "@/components/ui/avatar";
const { Avatar, AvatarFallback, AvatarImage } = AvatarComponents;
import { Download, X, FileText } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import type { StudentJobLead } from '@/services/faculty/StudentQueriesService';
import { formatedApiDate } from '@/utils/dateFormat';

interface StudentQueryRowProps {
    query: StudentJobLead;
}

const getTypeLabel = (type: number) => {
    switch (type) {
        case 1: return { label: 'Offer Received', className: 'text-primary' };
        case 2: return { label: 'Opted Out', className: 'text-gray-400' };
        case 3: return { label: 'Still Looking', className: 'text-blue-400' };
        case 4: return { label: 'Needs Help', className: 'text-yellow-400' };
        case 5: return { label: 'Feedback', className: 'text-purple-400' };
        default: return { label: 'Unknown', className: 'text-gray-400' };
    }
};

export default function StudentQueryRow({ query }: StudentQueryRowProps) {
    const typeInfo = getTypeLabel(query.type);

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed, opening in new tab instead.', error);
            window.open(url, '_blank');
        }
    };

    return (
        <tr className="border-b border-gray-700/50 hover:bg-white/[0.02] transition-colors group">
            <td className="py-4 px-4 align-top w-[20%] break-words">
                <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 border border-gray-600 shrink-0">
                        <AvatarImage src={query.profile_image || ''} alt={query.name} />
                        <AvatarFallback>{query.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate" title={query.name}>{query.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate" title={query.email}>{query.email}</p>
                    </div>
                </div>
            </td>

            <td className="py-4 px-4 align-top w-[20%] break-words">
                <span className={`text-sm font-medium ${typeInfo.className}`}>
                    {typeInfo.label}
                </span>
                {query.problem_challenge && (
                    <div className="mt-2 text-xs">
                        <span className="text-gray-500 font-semibold">Issue:</span> <span className="text-gray-400">{query.problem_challenge}</span>
                    </div>
                )}
                {query.project_details && (
                    <div className="mt-1 text-xs">
                        <span className="text-gray-500 font-semibold">Project:</span> <span className="text-gray-400">{query.project_details}</span>
                    </div>
                )}
            </td>

            <td className="py-4 px-4 align-top w-[25%] break-words">
                <p className="text-sm font-semibold text-gray-200">{query.company_name || '-'}</p>
                {query.location && <p className="text-xs text-gray-400 mt-1">{query.location}</p>}
                {query.company_full_address && (
                    <p className="text-xs text-gray-400 mt-0.5" title={query.company_full_address}>
                        {query.company_full_address}
                    </p>
                )}
                {(query.company_email || query.company_mobile) && (
                    <div className="mt-2 text-xs text-gray-500 flex flex-col gap-0.5">
                        {query.company_email && <span>{query.company_email}</span>}
                        {query.company_mobile && <span>{query.company_mobile}</span>}
                    </div>
                )}
            </td>

            <td className="py-4 px-4 align-top w-[20%] break-words">
                {query.designation ? (
                    <p className="text-sm font-medium text-gray-200">{query.designation}</p>
                ) : (
                    <p className="text-sm text-gray-500">-</p>
                )}
                {query.job_role && <p className="text-xs text-gray-400 mt-1 capitalize">{query.job_role}</p>}
                {query.salary_package && <p className="text-xs text-primary mt-1 font-medium">{query.salary_package}</p>}
                {(query.duration || query.joining_date) && (
                    <div className="mt-2 flex flex-col gap-0.5 text-xs text-gray-400">
                        {query.duration && <span>{query.duration} Months</span>}
                        {query.joining_date && <span>Joining: {formatedApiDate(query.joining_date)}</span>}
                    </div>
                )}
            </td>

            <td className="py-4 px-4 align-top text-right w-[15%]">
                {query.pdf_path ? (
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="flex justify-end">
                                <button className="p-2 text-primary hover:text-primary-deep hover:bg-primary/10 rounded-lg transition-colors" title="View Offer Letter">
                                    <FileText className="w-5 h-5" />
                                </button>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden bg-[#1e1e1e] text-white border-gray-700">
                            <DialogHeader className="px-6 py-4 border-b border-gray-700 flex-row justify-between items-center space-y-0 sticky top-0 bg-[#252525] z-10">
                                <DialogTitle>Attached Document</DialogTitle>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleDownload(query.pdf_path!, `OfferLetter_${query.name?.replace(/\s+/g, '_') || 'Student'}.pdf`)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white hover:bg-primary-deep rounded-md transition-colors text-sm font-medium"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                    <DialogClose asChild>
                                        <button className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-gray-300">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </DialogClose>
                                </div>
                            </DialogHeader>
                            <div className="flex-1 w-full bg-[#121212]">
                                <iframe
                                    src={`${query.pdf_path}#toolbar=0`}
                                    className="w-full h-full border-0"
                                    title="Document Viewer"
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                ) : (
                    <div className="flex justify-end pr-3">
                        <span className="text-sm text-gray-500">-</span>
                    </div>
                )}
            </td>
        </tr>
    );
}
