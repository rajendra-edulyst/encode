import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AvatarComponents from "@/components/ui/avatar";
const { Avatar, AvatarFallback, AvatarImage } = AvatarComponents;
import { Mail, Clock, MapPin, FileText, Download, X } from "lucide-react";
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

interface StudentQueryCardProps {
    query: StudentJobLead;
}

const getTypeLabel = (type: number) => {
    switch (type) {
        case 1: return { label: 'OFFER RECEIVED', className: 'bg-[#e6f7ec] text-[#00b87c]' };
        case 2: return { label: 'OPTED OUT', className: 'bg-gray-100 text-gray-600' };
        case 3: return { label: 'STILL LOOKING', className: 'bg-blue-50 text-blue-600' };
        case 4: return { label: 'NEEDS HELP', className: 'bg-yellow-50 text-yellow-600' };
        case 5: return { label: 'FEEDBACK', className: 'bg-purple-50 text-purple-600' };
        default: return { label: 'UNKNOWN', className: 'bg-gray-100 text-gray-600' };
    }
};

export default function StudentQueryCard({ query }: StudentQueryCardProps) {
    const typeInfo = getTypeLabel(query.type);

    const handleDownload = async (url: string, filename: string) => {
        try {
            // Fetch the file as a blob
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();
            
            // Create a temporary object URL and trigger a download
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed, opening in new tab instead.', error);
            // Fallback: If CORS blocks the fetch, open in a new tab
            window.open(url, '_blank');
        }
    };

    return (
        <Card className="flex flex-col rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#323232] relative mb-4">
            {/* Primary left border accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
            
            {/* Badge - Absolute Top Right */}
            <Badge 
                variant="outline" 
                className={`absolute top-0 right-0 rounded-none rounded-bl-xl bg-primary text-white border-0 px-4 py-1.5 font-bold tracking-wide uppercase text-xs shadow-sm`}
            >
                {typeInfo.label}
            </Badge>
            
            <div className="p-6 pl-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8 pr-16">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14 border-2 border-gray-100 dark:border-gray-700">
                            <AvatarImage src={query.profile_image || ''} alt={query.name} />
                            <AvatarFallback>{query.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">{query.name}</h3>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                <Mail className="w-3.5 h-3.5 mr-1.5" />
                                {query.email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2-Column Info Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                    <div>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Company & Role</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-200">{query.company_name || '-'}</p>
                        {query.job_role && <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-0.5">{query.job_role}</p>}
                    </div>
                    
                    <div>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Designation & Package</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-200">{query.designation || '-'}</p>
                        {query.salary_package && <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-0.5">{query.salary_package}</p>}
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Duration & Date</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-200">{query.duration ? `${query.duration} Months` : '-'}</p>
                        {query.joining_date && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{formatedApiDate(query.joining_date)}</p>}
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Location</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-200">{query.location || '-'}</p>
                        {query.company_full_address && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2" title={query.company_full_address}>
                                {query.company_full_address}
                            </p>
                        )}
                    </div>

                    {(query.domain_name || query.mentor_name) && (
                        <div className="col-span-2 bg-gray-50/50 dark:bg-gray-800/30 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Domain & Mentor</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-200">{query.domain_name || '-'}</p>
                            {query.mentor_name && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    Mentor: {query.mentor_name}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* PDF Link Modal */}
                {query.pdf_path && (
                    <div className="mb-6">
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors text-sm font-semibold">
                                    <FileText className="w-4 h-4" />
                                    View Attached Document
                                </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden">
                                <DialogHeader className="px-6 py-4 border-b flex-row justify-between items-center space-y-0 sticky top-0 bg-white dark:bg-gray-900 z-10">
                                    <DialogTitle>Attached Document</DialogTitle>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleDownload(query.pdf_path!, `OfferLetter_${query.name?.replace(/\s+/g, '_') || 'Student'}.pdf`)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white hover:bg-primary/90 rounded-md transition-colors text-sm font-medium"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                        <DialogClose asChild>
                                            <button className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors text-gray-500 dark:text-gray-400">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </DialogClose>
                                    </div>
                                </DialogHeader>
                                <div className="flex-1 w-full bg-gray-100 dark:bg-gray-950">
                                    <iframe 
                                        src={`${query.pdf_path}#toolbar=0`} 
                                        className="w-full h-full border-0"
                                        title="Document Viewer"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                {/* Details Section */}
                {query.project_details && (
                    <div className="mb-6">
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Details</p>
                        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300">{query.project_details}</p>
                        </div>
                    </div>
                )}

                {/* Additional Notes */}
                {query.note && (
                    <div>
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Additional Notes</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                            {query.note.startsWith('{') ? 'See attached details' : query.note}
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}
