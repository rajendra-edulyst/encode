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

**/

import React, { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { Button } from "@/components/ui/ShadcnButton";
import { CommonModuleContent } from "@/@types/learner/Courses";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { ScrollArea } from "@/components/ui/scroll-area";
import Assignments from "@/views/player/assignment";
import ContentTypeIcons from "@views/player/content/icons";
import Assessment from "@views/player/assessment";
import VideoPlayer from "@views/player/video";
import Notes from "@views/player/notes";
import Streaming from "@views/player/stream";
import { Progress } from "@/components/ui/progress";
import YoutubeVideoPlayer from "@views/player/youtube";
import Breadcrumb from "@/components/breadcrumb";
import { useCourseModuleDetails } from "@/hooks/data/create/useCourses";

const Player: React.FC = () => {
    const [activeContent, setActiveContent] = useState<CommonModuleContent>();
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
        { label: 'Subjects', path: '/subjects' },
        { label: course?.name ?? 'Subject Details', path: `/subjects/${courseId}` },
        { label: 'Content', },
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <div className="grid md:grid-cols-12 gap-5">
                <div className="bg-white rounded-lg p-5 col-span-1 md:col-span-9">
                    {activeContent ? (
                        <>
                            <div className="mb-2 flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{activeContent?.title}</h1>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <ContentTypeIcons content_type={activeContent?.content_type} />
                                        <span className="text-primary">{module?.name}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {activeContent?.content_type === 'assessment' && (
                                        activeContent?.attempt_date ? (
                                            <>
                                                <Link to={`/assessment/attempt/instructions/${courseId}/${activeContent?.program_content_id}`}>
                                                    <Button className="text-white">Re-Attempt</Button>
                                                </Link>

                                            </>
                                        ) : (
                                            <Link to={`/assessment/attempt/instructions/${courseId}/${activeContent?.program_content_id}`}>
                                                <Button className="text-white">Attempt</Button>
                                            </Link>
                                        )
                                    )}
                                    {
                                        activeContent?.content_type === 'assignment' && (
                                            <Button title="Upload Assignment" className='text-white' onClick={() => setUploadAssignmentDialog(true)}>
                                                Upload Assignment
                                            </Button>
                                        )
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
                            {activeContent?.content_type === 'assignment' && (<Assignments content_url={activeContent?.assignment_file} content_id={activeContent.program_content_id} uploadAssignmentDialog={uploadAssignmentDialog} setUploadAssignmentDialog={setUploadAssignmentDialog} />)}
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
                                                <Button onClick={() => window.open(activeContent?.url, '_blank')}>
                                                    Join Zoom Class
                                                </Button>
                                            </div>
                                        );
                                    })()
                                )
                            }
                        </>
                    ) : (
                        <div className="text-center text-gray-600">No content found</div>
                    )}
                </div >
                <div className="bg-gray-100 border-gray-200 col-span-1 md:col-span-3">
                    <div className="sticky top-20">
                        {content && content.length > 0 ? (
                            <div className="bg-white rounded-lg shadow-sm mb-6">
                                <div className="p-4 border-b border-gray-100">
                                    <h2 className="text-sm font-semibold text-gray-800 mb-2">
                                        {module?.name}
                                    </h2>
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
                                                    <div className="w-full md:w-[70%]">
                                                        <span>{index + 1}</span><span className="flex-1 truncate">.&nbsp;{
                                                            contentItem?.title?.length > 25 ? contentItem?.title?.slice(0, 25) + '...' : contentItem?.title
                                                        }</span>
                                                        <div className="flex justify-between items-center gap-3 mt-1">
                                                            <Progress color="#000" value={contentItem?.completion} className="h-1 bg-gray-300 rounded" />
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
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors !rounded-button whitespace-nowrap"
                                onClick={() => handleContentNavigation('prev')}
                            >
                                <i className="fas fa-arrow-left mr-2"></i>
                                Previous
                            </button>
                            <button
                                className={`px-4 py-2 bg-primary text-white rounded hover:bg-primary/50 transition-colors !rounded-button whitespace-nowrap`}
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
                                        <div className="p-4 border-b border-gray-100 mt-2 bg-white rounded shadow cursor-pointer group">
                                            <h2 className="text-sm font-semibold text-gray-800 mb-2 group-hover:text-blue-600">
                                                {nextModule?.name}
                                            </h2>
                                            <p className="line-clamp-2"
                                                dangerouslySetInnerHTML={{ __html: nextModule?.description }}
                                            ></p>
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