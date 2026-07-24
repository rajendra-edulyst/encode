
import { SubmittedAssignment } from '@/@types/learner/assignment';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import React from 'react'
import { FaEye } from 'react-icons/fa6';
import { LuDownload } from 'react-icons/lu';
import { RiFilePdfFill } from 'react-icons/ri';
import UploadAssignment from './upload';
import { Badge } from '@/components/ui/badge';
import ReviewAssignment from './review';
import { Button } from '@/components/ui/ShadcnButton';
import { useLearnerSubmittedAssignments } from '@/hooks/data/create/useCourses';
import { formatDate } from '@/utils/commonDateFormat';
import { CommonModuleContent } from '@/@types/learner/Courses';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

interface AssignmentProps {
    content: CommonModuleContent;
    uploadAssignmentDialog: boolean;
    setUploadAssignmentDialog: (value: boolean) => void;
}

function Assignments({ content, uploadAssignmentDialog, setUploadAssignmentDialog }: AssignmentProps) {
    const [reviewAssignmentDialog, setReviewAssignmentDialog] = React.useState(false);
    const [reviewAssignment, setReviewAssignment] = React.useState<SubmittedAssignment | null>(null);
    const [pdfLoading, setPdfLoading] = React.useState(true);
    const [pdfError, setPdfError] = React.useState(false);

    React.useEffect(() => {
        setPdfLoading(true);
        setPdfError(false);
        
        if (content) {
            mixpanelService.track('Assignment Started', {
                assignment_id: content.program_content_id,
                assignment_title: content.title,
                course_id: content.program_id
            });
        }
    }, [content?.assignment_file, content?.program_content_id]);

    const { data: assignmentData, isLoading, isError, error } = useLearnerSubmittedAssignments(content?.program_content_id);
    const submissions = assignmentData?.submission_details;

    if (isLoading) {
        return <Loading loading={isLoading} />
    }

    if (isError) {
        return <Alert title={error.message} type="danger" />
    }

    const handleDownload = (url: string, fileName: string) => {
        fetch(url).then(response => {
            response.blob().then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
            });
        });
    }

    const pdfUrl = content?.assignment_file ?? assignmentData?.file;

    return (
        <div>
            {pdfUrl && (
                <div className="overflow-hidden mb-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm h-[350px] md:h-[500px]">
                    {pdfLoading && (
                        <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-gray-500">Loading PDF preview...</p>
                            </div>
                        </div>
                    )}
                    {pdfError ? (
                        <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-900 gap-4 p-4 text-center">
                            <RiFilePdfFill className="w-12 h-12 text-red-400" />
                            <p className="text-sm text-gray-500">Unable to preview PDF in browser.</p>
                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-blue-500 underline hover:text-blue-700"
                            >
                                Open PDF in new tab
                            </a>
                        </div>
                    ) : (
                        <iframe
                            key={pdfUrl}
                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
                            className="w-full h-full"
                            style={{ border: 'none', display: pdfLoading ? 'none' : 'block' }}
                            onLoad={() => setPdfLoading(false)}
                            onError={() => { setPdfLoading(false); setPdfError(true); }}
                            title="Assignment PDF Preview"
                            allow="fullscreen"
                        />
                    )}
                </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Submitted Assignments
                    <span className="text-sm text-gray-500 ml-2">({submissions?.length})</span>
                </h2>

                <div className='flex flex-wrap gap-2 md:gap-3'>
                    {
                        assignmentData?.certificate_url !== "" && (
                            <Button asChild className='text-black bg-white border border-gray-200 hover:bg-gray-50'>
                                <a
                                    href={assignmentData?.certificate_url}
                                    title="View Certificate"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    Certificate <LuDownload className="w-4 h-4 md:w-5 md:h-5" />
                                </a>
                            </Button>
                        )
                    }
                </div>
            </div>
            <div>
                {
                    submissions?.length === 0 && (
                        <p className="text-gray-500">No assignments submitted yet.</p>
                    )
                }
            </div>
            {Array.isArray(submissions) && submissions?.map((assignment: SubmittedAssignment, index: number) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-3 md:p-4 flex flex-col sm:flex-row items-start gap-4 mb-3">
                    <div className="flex items-start gap-4 flex-1 w-full">
                        <RiFilePdfFill className="w-6 h-6 text-red-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold mb-1 text-gray-900 dark:text-white truncate">Assignment {submissions?.length - index}</h3>
                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{assignment.user_notes}</p>
                            <p className="text-sm text-gray-400 m-0">
                                {formatDate(assignment.updated_at, "ddd, DD/MM/YY HH:mm A")} · {"2MB"}
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-row sm:flex-col items-center sm:items-stretch justify-between w-full sm:w-auto gap-3 relative sm:h-20 min-h-[40px] mt-2 sm:mt-0'>
                        <div className="flex gap-2 sm:gap-4 justify-end items-center">
                            {(
                                <Badge variant="outline" className={`md:text-xs py-1 px-2 md:py-2 md:px-3 font-extrabold text-2xl ${assignment?.grade !== null || "" ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                                    {assignment?.grade || ""}
                                </Badge>
                            )}

                            <Badge variant="outline" className={`text-[10px] md:text-xs py-1 px-2 md:py-2 md:px-3 ${assignment?.grade && assignment.grade !== null || "" ? 'text-[#10b981]' : 'text-[#f59e0b]'}`}>
                                {assignment?.grade && assignment.grade !== null || "" ? 'Approved' : 'Pending'}
                            </Badge>
                            <div className="flex gap-2">
                                <Button asChild size={'icon'} variant={'outline'} className="h-8 w-8 md:h-10 md:w-10">
                                    <a
                                        href={assignment?.file}
                                        title="View"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <FaEye className="w-4 h-4 md:w-5 md:h-5 text-gray-500 hover:text-gray-700" />
                                    </a>
                                </Button>
                                <Button
                                    size={'icon'}
                                    variant={'outline'}
                                    className="h-8 w-8 md:h-10 md:w-10"
                                    title="Download"
                                    onClick={() => handleDownload(assignment?.file, assignment.user_notes ?? "")}
                                >
                                    <LuDownload className="w-4 h-4 md:w-5 md:h-5 text-gray-500 hover:text-gray-700" />
                                </Button>
                            </div>
                        </div>
                        {assignment?.teacher_notes && <div className="text-[10px] md:text-xs text-gray-400 absolute bottom-[-4px] sm:bottom-0 right-0">
                            <button className="text-blue-500 font-medium" onClick={() => { setReviewAssignment(assignment); setReviewAssignmentDialog(true) }}>View Review</button>
                        </div>
                        }
                    </div>
                </div>
            ))}
            {content?.program_content_id && <UploadAssignment
                show={uploadAssignmentDialog}
                content_id={content.program_content_id}
                onClose={() => setUploadAssignmentDialog(false)}
            />}

            {
                reviewAssignment && <ReviewAssignment
                    show={reviewAssignmentDialog}
                    assignment={reviewAssignment}
                    onClose={() => setReviewAssignmentDialog(false)}
                />
            }

        </div>
    )
}

export default Assignments