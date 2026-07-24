/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 20 March 2025
@author:: Edulyst Ventures  
@purpose : This component specifically for the learner to view the course content and navigate through the course content
@dependency :  This component is dependent on the course_id and module_id to fetch the course content

@@ Use case (if any use case) and solutions 

@modification history :

@date : 01 April 2025
@modification : Added Video streaming for the course content

@updatedAt : 16 Sep 2025 optemized the code and api handling with tankstack query

**/

import React, { useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { toast } from "sonner";
import { Button } from "@/components/ui/ShadcnButton";
import { CommonModuleContent } from "@/@types/learner/Courses";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { ScrollArea } from "@/components/ui/scroll-area";
import Assignments from "@/views/player/assignment";
import ContentTypeIcons from "@/views/player/content/icons";
import Assessment from "@/views/player/assessment";
import VideoPlayer from "@/views/player/video";
import Notes from "@/views/player/notes";
import Streaming from "@/views/player/stream";
import { Progress } from "@/components/ui/progress";
import YoutubeVideoPlayer from "@/views/player/youtube";
import { useCourseModuleDetails } from "@/hooks/data/create/useCourses";
import { stripHtmlTags } from "@/utils/stripHtmlTags";
import { ChevronRight, IdCard, Upload } from "lucide-react";
import Breadcrumb from "@/components/breadcrumb";
import LockContent from "./LockContent";

const Player: React.FC = () => {
    const [activeContent, setActiveContent] = useState<CommonModuleContent | null>(null);
    const navigate = useNavigate();
    const { courseId, moduleId } = useParams<{ courseId: string, moduleId: string }>();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const contentId = searchParams.get("content_id") || '';
    const [uploadAssignmentDialog, setUploadAssignmentDialog] = useState<boolean>(false);
    const { data: moduleDetails, isLoading, isError, error } = useCourseModuleDetails(moduleId);
    const content = moduleDetails?.contents || [];
    const module = moduleDetails?.module_details;
    const course = moduleDetails?.course_details;
    const nextModule = moduleDetails?.next_module || null;
    const completedContents = content.filter(con => con?.completion);
    const moduleCompletion = Math.round((completedContents.length / content.length) * 100) || 0;

    if (contentId && !activeContent && content.length > 0) {
        const contentItem = content.find(c => c?.program_content_id?.toString() === contentId);
        if (contentItem) {
            setActiveContent(contentItem);
        }
    }
    else {
        if (content.length > 0 && !activeContent) {
            setActiveContent(content[0]);
        }
    }

    const handleContentNavigation = (direction: 'next' | 'prev') => {
        if (!content) return;

        const currentIndex = content.findIndex(c => c.program_content_id === activeContent?.program_content_id) || 0;
        const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

        if (newIndex >= 0 && newIndex < content.length) {
            setActiveContent(content[newIndex]);
            updateContentId(content[newIndex].program_content_id);
        }
    };

    const updateContentId = (newContentId: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set("content_id", newContentId.toString());
        window.history.replaceState({}, "", url.toString());
    };

    const getZoomClassUiState = (contentItem: CommonModuleContent) => {
        const action = (contentItem.liveclass_action || "").toLowerCase();
        const subHeading = (contentItem.liveclass_sub_heading || "").toLowerCase();
        const status = (contentItem.liveclass_status || contentItem.status || "").toLowerCase();
        const isConcluded = action.includes("concluded") || subHeading.includes("concluded") || status.includes("concluded");
        const joinLabel = action || status || "join class";
        const isJoinable = !isConcluded && (joinLabel.includes("join") || joinLabel.includes("start"));
        return { isConcluded, isJoinable };
    };

    if (isLoading) return <Loading loading={isLoading} />;
    if (isError) return <Alert title={error.message} type="danger" />;


    const breadcrumbItems = [
        { label: 'Courses', path: '/courses/explore' },
        { label: course?.name || 'Course Details', path: `/courses/${course?.id}` },
        { label: module?.name || 'Module Details' }
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="bg-white rounded-lg p-4 md:p-5 col-span-1 md:col-span-9 order-1">
                    {(activeContent && activeContent?.is_locked !== 1) && (
                        <>
                            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="w-full md:w-auto">
                                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 line-clamp-2 mb-1">{activeContent?.title}</h1>
                                    <div className="flex items-center gap-2 text-gray-600 mb-2 md:mb-0">
                                        <ContentTypeIcons content_type={activeContent?.content_type} />
                                        <span className="text-primary text-sm md:text-base">{module?.name}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                                    {activeContent?.content_type === 'assessment' && (
                                        activeContent?.attempt_date ? (
                                            <Link to={`/assessment/attempt/instructions/${courseId}/${activeContent?.program_content_id}`}>
                                                <Button className="text-white w-full">Re-Attempt</Button>
                                            </Link>
                                        ) : (
                                            <Link to={`/assessment/attempt/instructions/${courseId}/${activeContent?.program_content_id}`}>
                                                <Button className="text-white w-full">Attempt</Button>
                                            </Link>
                                        )
                                    )}
                                    {
                                        activeContent?.content_type === "assignment" && (() => {
                                            const isAssignmentExpired = !!(activeContent?.end_date && new Date(activeContent.end_date).getTime() < Date.now());
                                            return (
                                                <div 
                                                    className={isAssignmentExpired ? "cursor-not-allowed opacity-50 w-full md:w-auto" : "w-full md:w-auto"}
                                                    onMouseEnter={() => {
                                                        if (isAssignmentExpired) {
                                                            toast.error("Assignment submission date has passed!", { id: "assignment-expired" });
                                                        }
                                                    }}
                                                >
                                                    <Button
                                                        className="flex items-center gap-2 w-full text-white bg-primary hover:bg-primary/90"
                                                        onClick={() => {
                                                            if (isAssignmentExpired) {
                                                                toast.error("Assignment submission date has passed!", { id: "assignment-expired" });
                                                            } else {
                                                                setUploadAssignmentDialog(true);
                                                            }
                                                        }}
                                                        disabled={isAssignmentExpired}
                                                    >
                                                        <Upload size={18} />
                                                        Submit Assignment
                                                    </Button>
                                                </div>
                                            );
                                        })()
                                    }
                                </div>
                            </div>

                            <div className="bg-white rounded-lg mb-3">
                                <p className="text-gray-600 leading-relaxed">{activeContent?.description}</p>
                            </div>
                            {activeContent?.content_type === 'assessment' && (<Assessment content={activeContent} />)}
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
                            {activeContent?.content_type === 'assignment' && (<Assignments content={activeContent} uploadAssignmentDialog={uploadAssignmentDialog} setUploadAssignmentDialog={setUploadAssignmentDialog} />)}
                            {
                                activeContent?.content_type === 'zoomclass' && (
                                    (() => {
                                        const { isConcluded, isJoinable } = getZoomClassUiState(activeContent);
                                        if (!isJoinable || isConcluded) {
                                            return (
                                                <div className="rounded-lg overflow-hidden flex justify-center items-center mb-6 bg-[#161616] h-[450px] border border-white/10 py-16 px-6">
                                                    <div className="text-center space-y-3 max-w-md">
                                                        <div className="mx-auto w-16 h-16 rounded-full bg-[#1f2937] border border-[#334155] flex items-center justify-center">
                                                            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#38bdf8]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                                <rect x="3" y="5" width="14" height="12" rx="2" />
                                                                <path d="M17 9l4-3v10l-4-3" />
                                                                <path d="M4 18l16-12" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-white text-xl font-semibold tracking-tight">Live Class Ended</p>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="rounded-lg overflow-hidden flex justify-center items-center mb-6 bg-[#161616] h-[450px] border border-white/10 py-16">
                                                <Button onClick={() => navigate(`/zoom/meeting/${activeContent?.program_content_id}`)}>
                                                    Join Zoom Class
                                                </Button>
                                            </div>
                                        );
                                    })()
                                )
                            }
                        </>
                    )}
                    {
                        (activeContent && activeContent?.is_locked === 1) && (
                            <LockContent content_id={activeContent?.program_content_id} />
                        )
                    }
                </div>
                <div className="bg-gray-100 border-gray-200 col-span-1 md:col-span-3 order-2">
                    <div className="sticky top-20">
                        {content && content.length > 0 ? (
                            <div className="bg-white rounded-lg shadow-sm mb-6">
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-sm font-semibold text-gray-800 capitalize">{module?.name}</h2>
                                        <p className="text-xs text-gray-500 mb-2">{moduleCompletion}%</p>
                                    </div>
                                    <div className="h-1 bg-gray-200 rounded">
                                        <Progress value={moduleCompletion} className="h-1 bg-gray-300 rounded" />
                                    </div>
                                </div>
                                <div className="p-2">
                                    <ScrollArea className="max-h-[350px] overflow-auto">
                                        {content.map((contentItem: CommonModuleContent, index: number) => (
                                            <button
                                                key={index}
                                                className={`w-full text-left p-3 rounded-lg transition-colors ${activeContent?.program_content_id === contentItem?.program_content_id
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "hover:bg-gray-50"
                                                    } !rounded-button whitespace-nowrap`}
                                                onClick={() => { setActiveContent(contentItem); updateContentId(contentItem?.program_content_id) }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <ContentTypeIcons content_type={contentItem?.content_type} />
                                                    <div className="w-full">
                                                        <span>{index + 1}</span><span className="flex-1 truncate">.&nbsp;{
                                                            contentItem?.title?.length > 25 ? contentItem?.title?.slice(0, 25) + '...' : contentItem?.title
                                                        }</span>
                                                        <div className="flex justify-between items-center gap-3 mt-1">
                                                            <Progress color="#000" value={parseInt(`${contentItem?.completion}`)} className="h-1 bg-gray-300 rounded" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </ScrollArea>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-600">No modules found</div>
                        )}
                        <div className="mt-6 flex justify-between">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors !rounded-button whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={activeContent?.program_content_id === content[0]?.program_content_id}
                                onClick={() => handleContentNavigation('prev')}
                            >
                                <i className="fas fa-arrow-left mr-2"></i>
                                Previous
                            </button>
                            <button
                                className={`px-4 py-2 bg-primary text-white rounded hover:bg-primary/50 transition-colors !rounded-button whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed`}
                                disabled={activeContent?.program_content_id === content[content.length - 1]?.program_content_id}
                                onClick={() => handleContentNavigation('next')}
                            >
                                Next
                                <i className="fas fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                        {
                            nextModule && nextModule?.name && (
                                <div className="mt-5">
                                    <span className="text-gray-600 text-xs mt-4">Next Module</span>
                                    <Link to={`/courses/${courseId}/modules/${nextModule?.id}`}>
                                        <div className="p-4 border-b border-gray-100 mt-2 bg-white rounded shadow cursor-pointer group flex justify-between items-center">
                                            <div>
                                                <h2 className="text-sm font-semibold text-gray-800 mb-2 group-hover:text-cpink capitalize">
                                                    {nextModule?.name}
                                                </h2>
                                                <p className="line-clamp-2 text-gray-500">{stripHtmlTags(nextModule?.description || '--')}</p>
                                            </div>
                                            <div>
                                                <ChevronRight size={25} className="text-gray-400 group-hover:text-cpink float-right" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Player;