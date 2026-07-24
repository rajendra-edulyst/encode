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

import React, { useCallback, useState } from "react";
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
// import ContentTypeIcons from "@/views/player/content/icons";
import Assessment from "@/views/player/assessment";
import VideoPlayer from "@/views/player/video";
import Notes from "@/views/player/notes";
import Streaming from "@/views/player/stream";
import { Progress } from "@/components/ui/progress";
import YoutubeVideoPlayer from "@/views/player/youtube";
import { useCourseModuleDetails } from "@/hooks/data/create/useCourses";
import { saveCourseTimespan } from "@/services/learner/CourseService";
import { stripHtmlTags } from "@/utils/stripHtmlTags";
import { ArrowLeft, ArrowRight, ChevronRight, File, Upload } from "lucide-react";
import Breadcrumb from "@/components/breadcrumb";
import LockContent from "./LockContent";
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import Survey from "@/views/player/survey";
import { useAuth } from "@/auth";
import { FACULTY } from '@/constants/roles.constant';
import OfflineClass from "@/views/player/offlineclass";

const Player: React.FC = () => {
  const [activeContent, setActiveContent] = useState<CommonModuleContent | null>(null);
  const navigate = useNavigate();
  const { courseId, moduleId } = useParams<{ courseId: string, moduleId: string }>();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const contentId = searchParams.get("content_id") || '';
  const isCCI = searchParams.get("cci") === '1' || searchParams.get("cci") === '2';

  const [uploadAssignmentDialog, setUploadAssignmentDialog] = useState<boolean>(false);
  const [isZoomJoining, setIsZoomJoining] = useState<boolean>(false);
  const [isAssessmentReviewing, setIsAssessmentReviewing] = useState<boolean>(false);
  const { data: moduleDetails, isLoading, isError, error } = useCourseModuleDetails(moduleId);
  const { user } = useAuth();
  const content = moduleDetails?.contents || [];
  const module = moduleDetails?.module_details;
  const course = moduleDetails?.course_details;
  const nextModule = moduleDetails?.next_module || null;
  const prevModule = moduleDetails?.previous_module || null;
  // const completedContents = content.filter(con => con?.completion);
  // const moduleCompletion = Math.round((completedContents.length / content.length) * 100) || 0;

  const updateContentId = (newContentId: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("content_id", newContentId.toString());
    window.history.replaceState({}, "", url.toString());
  };

  // Handle active content based on content_id parameter or show first content
  React.useEffect(() => {
    if (content?.length > 0) {
      if (contentId) {
        // If content_id exists in URL params, try to find and activate that content
        const contentItem = content.find(c => c?.program_content_id?.toString() === contentId);
        if (contentItem) {
          // Content found in current module, activate it
          setActiveContent(contentItem);
        } else {
          // Content ID doesn't exist in current module, show first content and update URL
          setActiveContent(content[0]);
          updateContentId(content[0].program_content_id);
        }
      } else {
        // No content_id in URL, show first content and add it to URL
        setActiveContent(content[0]);
        updateContentId(content[0].program_content_id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, contentId, content?.length]);

  React.useEffect(() => {
    if (activeContent?.program_content_id && courseId && moduleId) {
      saveCourseTimespan({
        program_id: Number(courseId),
        module_id: Number(moduleId),
        content_id: activeContent.program_content_id,
        timestamp: Math.floor(Date.now() / 1000),
        flag: 0
      }).catch(err => console.error("Error tracking course timespan flag 0", err));
    }
  }, [activeContent?.program_content_id, courseId, moduleId]);

  const handleContentNavigation = (direction: 'next' | 'prev') => {
    if (!content) return;

    const currentIndex = content.findIndex(c => c.program_content_id === activeContent?.program_content_id) || 0;
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < content?.length) {
      setActiveContent(content[newIndex]);
      updateContentId(content[newIndex].program_content_id);
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


  if (moduleId === 'null' || !moduleId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-10 border-2 border-dashed border-gray-700 rounded-lg text-center bg-[#1c1c1c] text-white max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-2 text-gray-200">No content available</h3>
        <p className="text-gray-400 mb-6">
          There are no modules available for this course yet.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-primary text-black px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isLoading) return <Loading loading={isLoading} />;
  if (isError) return <Alert title={error.message} type="danger" />;


  const courseSource = (location.state as any)?.courseSource || (course?.is_assigned == 1 ? 'my-courses' : 'explore');

  const playerBasePath = courseSource === 'my-courses' ? '/my-courses' :
                         courseSource === 'recommended' ? '/recommended-courses' :
                         courseSource === 'preparatory' ? '/preparatory-courses' :
                         courseSource === 'explore' ? '/explore-courses' : '/courses';

  const courseListingPath = courseSource === 'my-courses'
    ? '/my-courses'
    : courseSource === 'recommended'
      ? '/courses/recommended'
      : courseSource === 'preparatory'
        ? '/courses/preparatory'
        : '/courses/explore';

  const courseListingLabel = courseSource === 'my-courses'
    ? 'My Courses'
    : courseSource === 'recommended'
      ? 'Recommended Courses'
      : courseSource === 'preparatory'
        ? 'Preparatory Courses'
        : 'Explore Courses';

  const courseDetailsPath = courseSource === 'my-courses'
    ? `/my-courses/${course?.id}`
    : courseSource === 'recommended'
      ? `/recommended-course/${course?.id}`
      : courseSource === 'preparatory'
        ? `/preparatory-course/${course?.id}`
        : `/explore-course/${course?.id}`;

  const breadcrumbItems = [
    { label: courseListingLabel, path: courseListingPath },
    { label: course?.name || 'Course Details', path: courseDetailsPath },
    isAssessmentReviewing
      ? { label: module?.name || 'Module Details', onClick: () => setIsAssessmentReviewing(false) }
      : { label: module?.name || 'Module Details' }
  ];

  if (isAssessmentReviewing) {
    breadcrumbItems.push({ label: 'Assessment Review' } as any);
  }
  const isPresenterOrFaculty = `${user?.authority}` === FACULTY;
  const isSurveyContent = activeContent?.content_type === 'survey';

  const getAttendanceCompletion = (contentItem: CommonModuleContent) => {
    const completionValue = Number(contentItem?.completion) || 0;

    if (contentItem?.content_type === 'survey' && contentItem?.is_attempt === 1) {
      return {
        progressValue: 100,
        progressText: '100%',
      };
    }

    const isAttendanceBasedContent =
      contentItem?.content_type === "zoomclass" || contentItem?.content_type === "offlineclass";

    const attendedRaw = (contentItem as CommonModuleContent & { is_attended?: unknown })?.is_attended;
    const hasAttendanceFlag = attendedRaw !== undefined && attendedRaw !== null;
    const isAttended =
      attendedRaw === true ||
      attendedRaw === 1 ||
      attendedRaw === "1" ||
      attendedRaw === "true";

    // For class-type content, keep progress in sync with details screen:
    // never downgrade a valid completion value because of stale attendance flags.
    if (isAttendanceBasedContent && hasAttendanceFlag) {
      const attendanceValue = isAttended ? 100 : 0;
      const resolvedValue = Math.max(completionValue, attendanceValue);
      return {
        progressValue: resolvedValue,
        progressText: `${resolvedValue}%`,
      };
    }

    return {
      progressValue: completionValue,
      progressText: `${completionValue}%`,
    };
  };

  const getZoomClassUiState = (contentItem: CommonModuleContent) => {
    const action = (contentItem.liveclass_action || "").toLowerCase();
    const subHeading = (contentItem.liveclass_sub_heading || "").toLowerCase();
    const status = (contentItem.liveclass_status || contentItem.status || "").toLowerCase();

    const isConcluded =
      action.includes("concluded") ||
      subHeading.includes("concluded") ||
      status.includes("concluded");

    const joinLabel = action || status || "join class";
    const isJoinable = !isConcluded && (joinLabel.includes("join") || joinLabel.includes("start"));

    return { isConcluded, isJoinable };
  };

  return (
    <div>
      {!(Number(searchParams.get("cci")) > 0) && <Breadcrumb items={breadcrumbItems} />}
      {Number(searchParams.get("cci")) > 0 && (
        <div className="mb-4">
          <button
            onClick={() => { navigate(`${courseDetailsPath}?cci=${searchParams.get("cci")}`); }}
            className="flex items-center gap-2 text-sm font-medium hover:text-gray-300 transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-black dark:text-white cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      )}
      <Card className={isSurveyContent ? "bg-transparent border-none shadow-none" : undefined}>
        {!isSurveyContent && !isAssessmentReviewing && <CardHeader>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-2">{activeContent?.title}</h1>
            <p className="text-primary text-base">{module?.name}</p>
          </div>
          <CardAction>
            <div className="flex gap-2">
              <div >
                {(!isPresenterOrFaculty && activeContent?.content_type === 'assignment') && (() => {
                  const isOfflineMode = activeContent?.submisson_mode === 'Offline' || activeContent?.submisson_mode === '0' || (activeContent as any)?.submisson_mode === 0 || (activeContent as any)?.submission_mode === 0;

                  let isExpired = false;
                  if (activeContent?.end_date) {
                    if (typeof activeContent.end_date === 'string') {
                      isExpired = new Date((activeContent.end_date as any).replace(' ', 'T')).getTime() < Date.now();
                    } else if (typeof activeContent.end_date === 'number') {
                      const ms = activeContent.end_date < 1e12 ? activeContent.end_date * 1000 : activeContent.end_date;
                      isExpired = ms < Date.now();
                    }
                  }

                  if (isOfflineMode) {
                    return (
                      <div className="flex items-center text-sm font-medium text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
                        <p>This assignment uses Offline Submission mode. Please submit offline.</p>
                      </div>
                    );
                  }

                  return (
                    <div
                      className={isExpired ? "cursor-not-allowed opacity-50" : ""}
                      onMouseEnter={() => {
                        if (isExpired) {
                          toast.error("Assignment submission date has passed!", { id: "assignment-expired" });
                        }
                      }}
                    >
                      <Button
                        title="Upload Assignment"
                        className='text-white'
                        onClick={() => {
                          if (isExpired) {
                            toast.error("Assignment submission date has passed!", { id: "assignment-expired" });
                          } else {
                            setUploadAssignmentDialog(true);
                          }
                        }}
                        disabled={isExpired}
                      >
                        <Upload size={18} />  Submit Assignment
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
            <div className={isCCI || isSurveyContent || isAssessmentReviewing ? "md:col-span-10" : "md:col-span-7"}>

              {(activeContent && activeContent?.is_locked !== 1) && (
                <div>
                  {activeContent?.content_type === 'assessment' && (<Assessment content={activeContent} isReviewing={isAssessmentReviewing} onReviewToggle={setIsAssessmentReviewing} />)}
                  {activeContent?.content_type === 'survey' && (<Survey content={activeContent} />)}
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
                  {activeContent?.content_type === 'assignment' && (isPresenterOrFaculty ? (<div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-6 shadow-sm dark:bg-[#323232] h-full">
                    <div className="flex items-center justify-center py-8">
                      <Link
                        to={`/create/subjects/assignments/${activeContent.program_content_id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                      >
                        <File size={20} />
                        Go to Assignment
                      </Link>
                    </div></div>) : (<Assignments content={activeContent} uploadAssignmentDialog={uploadAssignmentDialog} setUploadAssignmentDialog={setUploadAssignmentDialog} />))}
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
                          <div className="rounded-lg overflow-hidden flex justify-center items-center mb-6 bg-[#161616] h-[450px] border border-white/10 py-16 text-white">
                            <Button
                              disabled={isZoomJoining}
                              onClick={() => handleZoomClassJoin(activeContent.program_content_id)}
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
                        );
                      })()
                    )
                  }
                  {
                    activeContent?.content_type === 'offlineclass'
                    && <OfflineClass
                      courseId={courseId}
                      content={activeContent} />
                  }
                </div>
              )}
              {(activeContent && activeContent?.is_locked === 1) && (
                <LockContent content_id={activeContent?.program_content_id} />
              )}
            </div>
            {!isCCI && !isSurveyContent && !isAssessmentReviewing && (
              <div className="md:col-span-3">
                <Card className="dark:bg-[#323232]">
                  <CardContent>
                    <ScrollArea className="max-h-[350px] overflow-auto">
                      {content?.filter((c) => {
                        if (c.quiz_type !== 'industry') return true;
                        if (!isPresenterOrFaculty) return false;
                        return true;
                      })?.map((contentItem: CommonModuleContent, index: number) => (
                        (() => {
                          const { progressValue, progressText } = getAttendanceCompletion(contentItem);
                          return (
                            <button
                              key={contentItem?.program_content_id}
                              className={`w-full text-left dark:bg-[#5A5A5A] p-3 rounded-xl transition-colors border-2 mb-3 ${activeContent?.program_content_id === contentItem?.program_content_id ? "border-codeblue" : "hover:border-codeblue border-transparent"}`}
                              onClick={() => {
                                setActiveContent(contentItem);
                                updateContentId(contentItem?.program_content_id);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-full dark:text-white">
                                  <div className="flex justify-between items-center">
                                    <p className="flex-1 truncate dark:text-white text-sm">{index + 1}. &nbsp;{contentItem?.title?.length > 25 ? contentItem?.title?.slice(0, 25) + '...' : contentItem?.title}</p>
                                    <p className="text-xs dark:text-white">{progressText}</p>
                                  </div>
                                  <div className="flex justify-between items-center gap-3 mt-1">
                                    <Progress color="#000" value={progressValue} className="h-3 rounded-full bg-gray-300" />
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })()
                      ))}
                    </ScrollArea>
                    <div className="mt-6 flex justify-end gap-4">
                      <button className={`p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black mb-3 bg-primary disabled:bg-[#848484] disabled:cursor-not-allowed`}
                        disabled={activeContent?.program_content_id === content[0]?.program_content_id}
                        onClick={() => handleContentNavigation('prev')}
                      >
                        <ArrowLeft className='mb-2' />
                        Previous
                      </button>
                      <button className={`p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black mb-3 bg-primary disabled:bg-[#848484] disabled:cursor-not-allowed`}
                        disabled={activeContent?.program_content_id === content[content?.length - 1]?.program_content_id}
                        onClick={() => handleContentNavigation('next')}
                      >
                        <ArrowRight className='mb-2' />
                        Next
                      </button>
                    </div>
                    {
                      prevModule && prevModule?.name && (
                        <div className="mt-5">
                          <span className="text-gray-600 mt-4 dark:text-white text-base">Previous</span>
                          <Link to={`${playerBasePath}/${courseId}/modules/${prevModule?.id}${searchParams.get("cci") ? `?cci=${searchParams.get("cci")}` : ''}`} state={{ courseSource }}>
                            <div className="p-4 mt-2 bg-white dark:bg-[#5A5A5A] rounded shadow cursor-pointer group flex justify-between items-center">
                              <div>
                                <h2 className="text-sm font-bold text-gray-800 dark:text-white mb-2 group-hover:text-primary capitalize">
                                  {prevModule?.name}
                                </h2>
                                <p className="line-clamp-2 text-gray-500 dark:text-white text-xs">{stripHtmlTags(prevModule?.description || '--')}</p>
                              </div>
                              <div>
                                <ChevronRight size={25} className="text-gray-400 group-hover:text-primary float-right" />
                              </div>
                            </div>
                          </Link>
                        </div>
                      )
                    }
                    {
                      nextModule && nextModule?.name && (
                        <div className="mt-5">
                          <span className="text-gray-600 mt-4 dark:text-white text-base">Coming Next</span>
                          <Link to={`${playerBasePath}/${courseId}/modules/${nextModule?.id}${searchParams.get("cci") ? `?cci=${searchParams.get("cci")}` : ''}`} state={{ courseSource }}>
                            <div className="p-4 mt-2 bg-white dark:bg-[#5A5A5A] rounded shadow cursor-pointer group flex justify-between items-center">
                              <div>
                                <h2 className="text-sm font-bold text-gray-800 dark:text-white mb-2 group-hover:text-primary capitalize">
                                  {nextModule?.name}
                                </h2>
                                <p className="line-clamp-2 text-gray-500 dark:text-white text-xs">{stripHtmlTags(nextModule?.description || '--')}</p>
                              </div>
                              <div>
                                <ChevronRight size={25} className="text-gray-400 group-hover:text-primary float-right" />
                              </div>
                            </div>
                          </Link>
                        </div>
                      )
                    }
                  </CardContent>
                </Card>
              </div>
            )}

          </div>
        </CardContent>
      </Card>
      {/* <div className="grid md:grid-cols-12 gap-5">
                <Card className="md:col-span-9">
                    <CardContent>
                        <div>
                            {(activeContent && activeContent?.is_locked !== 1) && (
                                <>
                                    <div className="mb-2 flex items-center justify-between">
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white line-clamp-2 mb-2">{activeContent?.title}</h1>
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
                                            {/* {
                                        activeContent?.content_type === 'assignment' && (
                                            <Button title="Upload Assignment" className='text-white' onClick={() => setUploadAssignmentDialog(true)}>
                                                Upload Assignment
                                            </Button>
                                        )
                                            {
                                                activeContent?.content_type === "assignment" && (
                                                    <Button

                                                        className="flex items-center gap-2 mb-6 text-white bg-primary hover:bg-primary/90"
                                                        onClick={() => setUploadAssignmentDialog(true)}
                                                    >

                                                        <Upload size={18} />

                                                        Assignment



                                                    </Button>
                                                )
                                            }
                                        </div>
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
                                            <div className="rounded-lg overflow-hidden flex justify-center items-center mb-6 bg-gray-100 h-[450px] border py-16">
                                                <Button
                                                    className=""
                                                    onClick={() => window.open(activeContent?.url, '_blank')}
                                                >
                                                    Join Zoom Class
                                                </Button>
                                            </div>
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
                    </CardContent>
                </Card>
                <div className="bg-gray-100 border-gray-200 col-span-1 md:col-span-3">
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
                                    <Link to={`${playerBasePath}/${courseId}/modules/${nextModule?.id}${searchParams.get("cci") ? `?cci=${searchParams.get("cci")}` : ''}`} state={{ courseSource }}>
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
            </div > */}
    </div >
  );
};

export default Player;