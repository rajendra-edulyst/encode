/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { toast } from "sonner";
import { Button } from "@/components/ui/ShadcnButton";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { ScrollArea } from "@/components/ui/scroll-area";
import Assignments from "@/views/player/assignment";
import Assessment from "@/views/player/assessment";
import VideoPlayer from "@/views/player/video";
import Notes from "@/views/player/notes";
import Streaming from "@/views/player/stream";
import YoutubeVideoPlayer from "@/views/player/youtube";
import { ArrowLeft, ArrowRight, File, Upload } from "lucide-react";
import Breadcrumb from "@/components/breadcrumb";
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import Survey from "@/views/player/survey";
import { useAuth } from "@/auth";
import { FACULTY } from '@/constants/roles.constant';
import OfflineClass from "@/views/player/offlineclass";
import LockContent from "@/views/create/learner/courses/player/LockContent";
import { fetchEventById } from "@/services/collaborate/EventService";
import { fetchEventActivityContentById } from "@/services/learner/EventService";

interface ContentItem {
    id: number;
    title: string;
    description: string;
    content_type?: string;
    start_date: string;
    end_date: string | null;
    status: string;
    difficulty_level: string;
    expected_duration: any;
    content_type_label: string | null;
    zoom_url?: string | null;
    zoom_passkey?: string | null;
    duration?: number;
    venue?: string | null;
    is_locked?: number;
    stream_file_id?: string | null;
    /** From competitins-details program.contents — non-null after survey submitted */
    attempt_id?: number | null;
    program_content_id?: number;
}

type ProgramContentAttemptMeta = {
    id?: number;
    program_content_id?: number;
    attempt_id?: number | null;
};

interface ProgramDetails {
    name: string;
    description: string;
    image: string;
    start_date: string;
    end_date: string;
    status: string;
    is_published: number;
    competition_level: string;
    organization_name: string;
    organization_logo: string;
    organization_id: number;
    com_status: {
        program_status: string;
        program_time: string;
    };
    contents: ContentItem[];
    event_details: {
        venue: string;
        event_link: string | null;
        event_registration_link: string | null;
        functional_domain: string;
        domain_name: string | null;
        event_category_id: number;
        event_category_name: string;
        job_role: string;
        event_expert_id: string | null;
        event_datetime: string;
        subscription_type: string;
    };
    job_details: any;
    certificate_url: string;
}

const ActivityPlayer: React.FC = () => {
    const [activeContent, setActiveContent] = useState<any>(null);
    const [activeContentId, setActiveContentId] = useState<string | number>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isContentLoading, setIsContentLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();




    const { id: internshipId, contentId: routeContentId } = useParams<{
        id: string;
        contentId: string
    }>();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);


    const urlContentId = searchParams.get("content_id");
    const userCalendarId = searchParams.get("user_calender_id") || '';
    const contentId = urlContentId || routeContentId || '';

    const [uploadAssignmentDialog, setUploadAssignmentDialog] = useState<boolean>(false);
    const [isZoomJoining, setIsZoomJoining] = useState<boolean>(false);

    const [programDetails, setProgramDetails] = useState<ProgramDetails | null>(null);
    const [contentList, setContentList] = useState<ContentItem[]>([]);
    const { user } = useAuth();
    const isPresenterOrFaculty = `${user?.authority}` === FACULTY;
    const isSurveyContent = activeContent?.content_type === 'survey';
    const isCalendarFeedbackFlow = Boolean(userCalendarId);
    const shouldHideRightNavigator = isSurveyContent && isCalendarFeedbackFlow;

    const loadEventDetails = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            if (!internshipId) {
                throw new Error('Event ID is undefined');
            }

            const response = await fetchEventById(internshipId, undefined, userCalendarId || undefined);
            if (response && response.competitions_details?.program) {
                // EventDetails.program omits some fields TS knows about; runtime payload matches ProgramDetails.
                const program = response.competitions_details.program as unknown as ProgramDetails;
                setProgramDetails(program);
                await loadContentList(internshipId, program.contents);
            } else {
                setError('Event details not found.');
            }

        } catch (err) {
            setError('Failed to load event details. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [internshipId, userCalendarId]);

    const loadContentList = useCallback(async (
        eventId: string | number,
        programContents?: ProgramDetails['contents']
    ) => {
        if (!eventId) return;

        setIsContentLoading(true);
        try {
            const response = await fetchEventActivityContentById(eventId.toString());

            if (response?.status === 1 && response.data?.list) {
                const raw = response.data.list as unknown as ContentItem[];
                const contents = raw.map((item) => {
                    const itemId = Number(item.id);
                    const itemProgramContentId = Number(item.program_content_id);

                    const match = (programContents as unknown as ProgramContentAttemptMeta[] | undefined)?.find((p) => {
                        const candidateId = Number(p?.id);
                        const candidateProgramContentId = Number(p?.program_content_id);
                        return (
                            (!Number.isNaN(candidateId) && candidateId === itemId) ||
                            (!Number.isNaN(candidateProgramContentId) && candidateProgramContentId === itemId) ||
                            (!Number.isNaN(candidateId) && candidateId === itemProgramContentId) ||
                            (!Number.isNaN(candidateProgramContentId) && candidateProgramContentId === itemProgramContentId)
                        );
                    });

                    if (!match || match.attempt_id === undefined) return item;
                    return { ...item, attempt_id: match.attempt_id };
                });
                setContentList(contents);


                if (contents.length > 0) {
                    const currentId = contentId?.toString();
                    const contentItem = contents.find((c: ContentItem) =>
                        c?.id?.toString() === currentId
                    );

                    if (contentItem) {
                        setActiveContentId(contentItem.id);

                    } else {

                        const firstContent = contents[0];
                        setActiveContentId(firstContent.id);
                        updateContentId(firstContent.id);
                    }
                }
            } else {
                console.warn('No content list found in response');
                setContentList([]);
            }
        } catch (err) {
            console.error("Failed to load content list:", err);
            setContentList([]);
        } finally {
            setIsContentLoading(false);
        }
    }, [contentId, internshipId]);

    const refreshEventAfterSurveySubmit = useCallback(async () => {
        if (!internshipId) return;
        try {
            const response = await fetchEventById(internshipId, undefined, userCalendarId || undefined);
            if (response?.competitions_details?.program) {
                const program = response.competitions_details.program as unknown as ProgramDetails;
                setProgramDetails(program);
                await loadContentList(internshipId, program.contents);
            }
        } catch (e) {
            console.error(e);
        }
    }, [internshipId, loadContentList, userCalendarId]);

    useEffect(() => {
        if (contentList.length > 0 && activeContentId) {
            const currentItem = contentList.find(c => c.id.toString() === activeContentId.toString());
            if (currentItem) {
                setActiveContent(currentItem);
            }
        }
    }, [activeContentId, contentList]);

    useEffect(() => {
        loadEventDetails();
    }, [loadEventDetails]);

    const updateContentId = (newContentId: any) => {
        setActiveContentId(newContentId);
        navigate(`/details/${internshipId}/event-activity/${newContentId}`, { replace: true });
    };

    const handleContentNavigation = (direction: 'next' | 'prev') => {
        if (!contentList || contentList.length === 0) return;

        const currentIndex = contentList.findIndex((c: ContentItem) => c.id.toString() === activeContentId.toString());
        const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

        if (newIndex >= 0 && newIndex < contentList.length) {
            const newContent = contentList[newIndex];
            setActiveContentId(newContent.id);
            updateContentId(newContent.id);
        }
    };

    const handleZoomClassJoin = useCallback(async (id: number) => {
        setIsZoomJoining(true);
        try {
            navigate(`/zoom/meeting/${id}`);
        } finally {
            setIsZoomJoining(false);
        }
    }, [navigate]);

    const getBreadcrumbItems = () => {
        const category = programDetails?.event_details?.event_category_name;
        const isMustAttend = category === 'Career Drive' || category === 'Immersion Programs' || programDetails?.event_details?.event_category_id === 3;

        const parentLabel = isMustAttend ? 'Must Attend' : 'On the Agenda';
        const parentPath = isMustAttend ? '/collaborate/must-attend' : `/collaborate/agenda${category ? `?category=${category}` : ''}`;
        const detailsPath = isMustAttend ? `/must-attend/details/${internshipId}` : `/agenda/details/${internshipId}`;

        if (programDetails?.name) {
            return [
                { label: parentLabel, path: parentPath },
                { label: category || 'Details', path: `${detailsPath}${category ? `?category=${category}` : ''}` },
                { label: programDetails.name }
            ];
        } else {
            return [
                { label: parentLabel, path: parentPath },
                { label: 'Details' }
            ];
        }
    };

    if (isLoading) return <Loading loading={isLoading} />;
    if (error) return <Alert title={error} type="danger" />;
    if (!programDetails) return <Alert title="No event details found" type="warning" />;

    const breadcrumbItems = getBreadcrumbItems();
    return (
        <div>
            {!userCalendarId && (
                <Breadcrumb items={breadcrumbItems} />
            )}
            <Card className={shouldHideRightNavigator ? "bg-transparent border-none shadow-none" : undefined}>
                {!shouldHideRightNavigator && <CardHeader>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-2">
                            {activeContent?.title || 'Content Player'}
                        </h1>
                        <p className="text-primary text-base">{programDetails?.name}</p>
                    </div>
                    <CardAction>
                        <div className="flex gap-2">
                            <div>
                                {(!isPresenterOrFaculty && activeContent?.content_type === 'assignment') && (() => {
                                    const isAssignmentExpired = !!(activeContent?.end_date && new Date(activeContent.end_date).getTime() < Date.now());
                                    return (
                                        <div 
                                            className={isAssignmentExpired ? "cursor-not-allowed opacity-50" : ""}
                                            onMouseEnter={() => {
                                                if (isAssignmentExpired) {
                                                    toast.error("Assignment submission date has passed!", { id: "assignment-expired" });
                                                }
                                            }}
                                        >
                                            <Button 
                                                title="Upload Assignment" 
                                                className='text-white' 
                                                onClick={() => {
                                                    if (isAssignmentExpired) {
                                                        toast.error("Assignment submission date has passed!", { id: "assignment-expired" });
                                                    } else {
                                                        setUploadAssignmentDialog(true);
                                                    }
                                                }}
                                                disabled={isAssignmentExpired}
                                            >
                                                <Upload size={18} /> Submit Assignment
                                            </Button>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </CardAction>
                </CardHeader>}
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-10 gap-5">
                        <div className={shouldHideRightNavigator ? "md:col-span-10" : "md:col-span-7"}>
                            {isContentLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loading loading={true} />
                                    <span className="ml-2">Loading content...</span>
                                </div>
                            ) : activeContent ? (
                                <>
                                    {(activeContent?.is_locked !== 1) && (
                                        <div>
                                            {activeContent?.content_type === 'assessment' && (isPresenterOrFaculty ? (
                                                <Survey
                                                    content={activeContent}
                                                    onSurveySubmitted={refreshEventAfterSurveySubmit}
                                                />
                                            ) : (<Assessment content={activeContent} />))}
                                            {activeContent?.content_type === 'survey' && (
                                                <Survey
                                                    content={activeContent}
                                                    onSurveySubmitted={refreshEventAfterSurveySubmit}
                                                />
                                            )}
                                            {activeContent?.content_type === 'video' && (
                                                <>
                                                    {activeContent?.stream_file_id && <Streaming content={activeContent} videoId={activeContent?.stream_file_id} />}
                                                    {!activeContent?.stream_file_id && <VideoPlayer content={activeContent} />}
                                                </>
                                            )}
                                            {activeContent?.content_type === 'video_yts' && (
                                                <>
                                                    <YoutubeVideoPlayer content={activeContent} />
                                                </>
                                            )}
                                            {activeContent?.content_type === 'notes' && (<Notes content={activeContent} />)}
                                            {activeContent?.content_type === 'assignment' && (isPresenterOrFaculty ? (
                                                <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-6 shadow-sm dark:bg-[#323232] h-full">
                                                    <div className="flex items-center justify-center py-8">
                                                        <Link
                                                            to={`/create/subjects/assignments/${activeContent.id}`}
                                                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                                                        >
                                                            <File size={20} />
                                                            Go to Assignment
                                                        </Link>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Assignments
                                                    content={activeContent}
                                                    uploadAssignmentDialog={uploadAssignmentDialog}
                                                    setUploadAssignmentDialog={setUploadAssignmentDialog}
                                                />
                                            ))}
                                            {activeContent?.content_type === 'teamsclass' && (
                                                <div className="rounded-lg overflow-hidden flex justify-center items-center mb-6 bg-gray-100 h-[450px] border py-16 text-white">
                                                    <Button
                                                        className=""
                                                        disabled={isZoomJoining}
                                                        onClick={() => window.open(activeContent?.zoom_url, "_blank")}
                                                    >
                                                        {isZoomJoining ? (
                                                            <>
                                                                <span className="inline-block animate-spin mr-2">⟳</span>
                                                                Joining...
                                                            </>
                                                        ) : (
                                                            'Join Teams Class'
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                            {activeContent?.content_type === 'zoomclass' && (
                                                <div className="rounded-lg overflow-hidden flex justify-center items-center mb-6 bg-gray-100 h-[450px] border py-16 text-white">
                                                    <Button
                                                        className=""
                                                        disabled={isZoomJoining}
                                                        onClick={() => handleZoomClassJoin(Number(activeContentId) || activeContent.id)}
                                                    >
                                                        {isZoomJoining ? (
                                                            <>
                                                                <span className="inline-block animate-spin mr-2">⟳</span>
                                                                Joining...
                                                            </>
                                                        ) : (
                                                            'Join Zoom Class'
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                            {activeContent?.content_type === 'offlineclass' && (
                                                <OfflineClass
                                                    courseId={internshipId}
                                                    content={activeContent}
                                                />
                                            )}
                                        </div>
                                    )}
                                    {(activeContent?.is_locked === 1) && (
                                        <LockContent content_id={activeContent?.id} />
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-64 text-gray-500">
                                    {contentList.length === 0 ? 'No content available' : 'Select a content to view'}
                                </div>
                            )}
                        </div>
                        {!shouldHideRightNavigator && (
                        <div className="md:col-span-3">
                            <Card className="dark:bg-[#323232]">
                                <CardContent>
                                    <ScrollArea className="max-h-[350px] overflow-auto">
                                        {contentList?.filter((c: ContentItem) => {
                                            if (c.content_type !== 'industry') return true;
                                            if (!isPresenterOrFaculty) return false;
                                            return true;
                                        })?.map((contentItem: ContentItem, index: number) => (
                                            <button
                                                key={contentItem.id}
                                                className={`w-full text-left dark:bg-[#5A5A5A] p-3 rounded-xl transition-colors border-2 mb-3 ${activeContentId?.toString() === contentItem?.id?.toString() ? "border-codeblue" : "hover:border-codeblue border-transparent"}`}
                                                onClick={() => {
                                                    updateContentId(contentItem?.id);
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full dark:text-white">
                                                        <div className="flex justify-between items-center">
                                                            <p className="flex-1 truncate dark:text-white text-sm">
                                                                {index + 1}. &nbsp;
                                                                {contentItem?.title?.length > 25 ? contentItem?.title?.slice(0, 25) + '...' : contentItem?.title}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </ScrollArea>
                                    <div className="mt-6 flex justify-end gap-4">
                                        <button
                                            className={`p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black mb-3 bg-primary disabled:bg-[#848484] disabled:cursor-not-allowed`}
                                            disabled={!activeContentId || activeContentId === contentList[0]?.id || contentList.length === 0}
                                            onClick={() => handleContentNavigation('prev')}
                                        >
                                            <ArrowLeft className='mb-2' />
                                            Previous
                                        </button>
                                        <button
                                            className={`p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black mb-3 bg-primary disabled:bg-[#848484] disabled:cursor-not-allowed`}
                                            disabled={!activeContentId || activeContentId === contentList[contentList?.length - 1]?.id || contentList.length === 0}
                                            onClick={() => handleContentNavigation('next')}
                                        >
                                            <ArrowRight className='mb-2' />
                                            Next
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ActivityPlayer;