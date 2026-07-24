import Breadcrumb from '@/components/breadcrumb';
import SafeHtml from '@/components/SafeHtml';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCourseAndContentCertificate, useCourseDetailsV2, useCourseIndustries, useCourseInstructors, useCourseModuleDetails, useCourseModules, useCourseSkillsAndJobRoles, useProgramTools } from '@/hooks/data/create/useCourses';
import { useEffect, useMemo, useState } from 'react';
import { FaStar } from 'react-icons/fa6';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ArrowRight, ChevronDown, ArrowLeft, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import LoadingSection from '@/components/LoadingSection';
import { Progress } from '@/components/ui/progress';
import Swal from 'sweetalert2';
import { saveUserCourseLead, enrollCourse } from '@/services/learner/CourseService';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import appConfig from '@/configs/app.config';
import ContentTypeIcons from '@/views/player/content/icons';
import CertificateManager, { Certificate } from './components/CertificateManager';
import { Textarea } from '@/components/ui/textarea';
import { CourseCategoryDomain } from '@/@types/learner/Courses';
import { useAuth } from '@/auth';
import { FACULTY } from '@/constants/roles.constant';
import CoursePayment from './components/CoursePayment';
import { usePackageAccessCounts } from '@/hooks/data/usePackageAccessCounts';
import { errorToast, successToast } from '@/views/auth/@lib/toastUtils';
import SEO from '@/components/SEO/SEO';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';
import React from 'react';


interface CourseDetailsBaseProps {
  courseSourceOverride?: 'my-courses' | 'recommended' | 'explore' | 'preparatory';
}

const CourseDetailsBase = ({ courseSourceOverride }: CourseDetailsBaseProps) => {

  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const cci = searchParams.get('cci');
  const isEnrolled = searchParams.get('enroll_disabled');

  const courseId = useMemo(() => {
    if (!id) return id;
    const cleanId = id.split('&')[0];
    const match = cleanId.match(/-(\d+)$/);
    if (match) return match[1];
    if (/^\d+$/.test(cleanId)) return cleanId;
    const parts = cleanId.split('-');
    return parts[parts.length - 1] || cleanId;
  }, [id]);

  const [activeModuleId, setActiveModuleId] = useState<number | null>(null)
  const [enrollDialog, setEnrollDialog] = useState(false)
  const [purchaseDialog, setPurchaseDialog] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const { data: courseDetails, refetch: fetchCourse, isLoading: isCourseDetailsLoading } = useCourseDetailsV2(courseId, cci);
  const { data: courseInstructorsAndLeader } = useCourseInstructors(courseId);
  const { data: courseSkillsAndJobRoles } = useCourseSkillsAndJobRoles(courseId);
  const { data: courseIndustries } = useCourseIndustries(courseDetails?.category_id);
  const { data: courseModules } = useCourseModules(courseId);
  const { data: programTools } = useProgramTools(courseId);

  const queryClient = useQueryClient();
  const { data: activeModule, isLoading: moduleLoading } = useCourseModuleDetails(activeModuleId ? String(activeModuleId) : undefined)
  const [whyChooseThisCourse, setWhyChooseThisCourse] = useState<string>("");
  const [showAllJobRoles, setShowAllJobRoles] = useState(false);
  const { isAccessExhausted } = usePackageAccessCounts();

  // Determine whether polling conditions are met:
  // poll every 5s if certificate_id is present AND course is 100% complete
  // but stop once program_certificate data has arrived
  const shouldPollCertificate = useMemo(() => {
    if (!courseDetails) return false;
    const certId = courseDetails.certificate_id;
    const completionVal = courseDetails.program_completion;
    const completion = typeof completionVal === 'number'
      ? completionVal
      : typeof completionVal === 'object'
        ? Number(Object.values(completionVal ?? {})[0] ?? 0)
        : 0;
    return !!certId && completion >= 100;
  }, [courseDetails]);

  const { data: courseAndContentCertificate, refetch: fetchCertificates } = useCourseAndContentCertificate(courseId, shouldPollCertificate);

  const navigate = useNavigate();
  const location = useLocation();
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setShowThankYou(true);
      // Clean up the URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  useEffect(() => {
    if (courseModules?.length) {
      setActiveModuleId((prev) => prev ?? courseModules[0].id)
    }
  }, [courseModules])

  const trackedCourseIdRef = React.useRef<string | number | null>(null);

  useEffect(() => {
    const courseName = courseDetails?.name;
    if (courseDetails?.id && courseName && trackedCourseIdRef.current !== courseDetails.id) {
      mixpanelService.track(`Course :- ${courseName} => Details Viewed`, {
        course_id: courseDetails.id,
        course_name: courseName,
        category: courseDetails.category_name,
        page_path: window.location.pathname,
      });
      trackedCourseIdRef.current = courseDetails.id;
    }
  }, [courseDetails?.id, courseDetails?.name, courseDetails?.category_name])


  const enrollNow = async () => {
    setEnrollDialog(false);

    const isFree = courseDetails?.subscription_type === "open";

    const result = await Swal.fire({
      theme: 'dark',
      title: isFree ? "Enroll in this course?" : "Request to enroll in this course?",
      text: isFree ? "Are you sure you want to enroll in this course?" : "Are you sure you want to request enrollment in this course?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: isFree ? "Yes, Enroll Now" : "Yes, Request Now",
      cancelButtonText: "No, Cancel",
      customClass: {
        confirmButton: 'bg-primary'
      }
    })

    if (result.isConfirmed) {
      if (courseDetails?.is_assigned) {
        return Swal.fire(
          {
            title: "Already Enrolled!",
            text: "You have already enrolled in this course.",
            icon: "info",
            theme: 'dark',
            customClass: {
              confirmButton: 'bg-primary'
            }
          }
        )
      }

      if (!courseDetails?.id) {
        return Swal.fire(
          {
            title: "Course ID not found!",
            text: "Course ID is required to enroll in this course.",
            icon: "error",
            theme: 'dark',
            customClass: {
              confirmButton: 'bg-primary'
            }
          }
        );
      }

      try {
        await saveUserCourseLead({
          program_id: courseDetails?.id,
          wp_center_id: courseDetails?.organization_id,
          reason: whyChooseThisCourse ?? "",
        })

        mixpanelService.track('Course Enrolled', {
          course_id: courseDetails?.id,
          course_name: courseDetails?.name,
        })

        Swal.fire(
          {
            title: isFree ? "Enrolled Successfully!" : "Request Sent!",
            text: isFree ? "You have successfully enrolled in this course." : "You have successfully submitted your enrollment request.",
            icon: "success",
            theme: 'dark',
            customClass: {
              confirmButton: 'bg-primary'
            }
          }
        )

        queryClient.invalidateQueries({ queryKey: ["mycourses"] })
        fetchCourse()
      } catch (err) {
        console.log(err)
        Swal.fire(
          {
            title: "Failed!",
            text: "Failed to enroll in this course. Please try again later.",
            icon: "error",
            theme: 'dark',
            customClass: {
              confirmButton: 'bg-primary'
            }
          }
        )
      }
    }
  }

  const enrollViaCCI = async () => {
    if (!courseDetails?.id) return;

    const result = await Swal.fire({
      theme: 'dark',
      title: 'Enroll in this course?',
      text: 'Are you sure you want to enroll in this course?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Enroll Now',
      cancelButtonText: 'No, Cancel',
      customClass: { confirmButton: 'bg-primary' }
    });

    if (!result.isConfirmed) return;

    try {
      await enrollCourse(courseDetails.id);

      Swal.fire({
        title: 'Enrolled Successfully!',
        text: 'You have successfully enrolled in this course.',
        icon: 'success',
        theme: 'dark',
        customClass: { confirmButton: 'bg-primary' }
      });

      // Refresh course details and modules tab
      fetchCourse();
      queryClient.invalidateQueries({ queryKey: ['courseModules', id] });
      queryClient.invalidateQueries({ queryKey: ['mycourses'] });
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        title: 'Failed!',
        text: err?.response?.data?.message || 'Failed to enroll. Please try again later.',
        icon: 'error',
        theme: 'dark',
        customClass: { confirmButton: 'bg-primary' }
      });
    }
  };


  // Show only external instructors in Course Instructor section
  const courseFaculty =
    courseInstructorsAndLeader?.instructor?.filter(
      (faculty) => faculty.id && Number(faculty.is_external) === 1
    ) || [];
  const courseLeader = courseInstructorsAndLeader?.course_leader?.filter(faculty => faculty.id) || [];

  const calculateCourseCompletion = (): number => {
    const val = courseDetails?.program_completion;
    const num = typeof val === "number" ? val : typeof val === "object" ? Object.values(val ?? {})[0] : 0;
    return Math.round(Number(num) || 0);
  };

  // Derived UI guards to prevent incorrect CTA rendering when backend returns inconsistent flags
  const courseCompletionPct = calculateCourseCompletion()
  const isProgramOngoing = (() => {
    const status = courseDetails?.program_status?.program_status as any;
    if (!status) return true;
    const statusStr = typeof status === 'object' ? (status.name || status.label || '') : String(status);
    return statusStr.toLowerCase() === 'ongoing';
  })();
  const shouldShowCertificateTab =
    courseCompletionPct === 100 || courseDetails?.is_assigned == 1

  const sourceFromState = (location.state as { courseSource?: string } | null)?.courseSource;
  const sourceFromQuery = searchParams.get('source');

  let courseSource = courseSourceOverride || sourceFromState || sourceFromQuery;
  if (!courseSource) {
    if (location.pathname.includes('recommended')) {
      courseSource = 'recommended';
    } else if (location.pathname.includes('my-course')) {
      courseSource = 'my-courses';
    } else if (location.pathname.includes('preparatory')) {
      courseSource = 'preparatory';
    } else {
      courseSource = 'explore';
    }
  }

  const getPlayerBasePath = () => {
    switch (courseSource) {
      case 'my-courses': return '/my-courses';
      case 'recommended': return '/recommended-courses';
      case 'preparatory': return '/preparatory-courses';
      case 'explore': return '/explore-courses';
      default: return '/courses';
    }
  };

  const redirectToContent = (contentId: number, contentName?: string) => {
    if (!courseDetails?.id || !activeModuleId || !contentId) return;

    if (!courseDetails?.is_assigned) {
      return Swal.fire(
        {
          title: "Not Enrolled!",
          text: "You need to enroll in this course to access the content.",
          icon: "warning",
          theme: 'dark',
          customClass: {
            confirmButton: 'bg-primary'
          }
        }
      );
    }

    const targetCci = cci === '1' ? '3' : cci;

    let queryParams = new URLSearchParams();
    if (contentId) queryParams.set('content_id', contentId.toString());
    if (contentName) queryParams.set('contentname', contentName.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    if (targetCci) queryParams.set('cci', targetCci);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    navigate(`${getPlayerBasePath()}/${courseDetails?.id}/modules/${activeModuleId}${queryString}`, { state: { courseSource } });
  }

  const hasProgramCertificate = (): boolean => {
    return calculateCourseCompletion() === 100;
  };
  let courseListingPath = '/courses/explore';
  let breadcrumbLabel = 'Explore Courses';

  if (courseSource === 'my-courses') {
    courseListingPath = '/my-courses';
    breadcrumbLabel = 'My Courses';
  } else if (courseSource === 'recommended') {
    courseListingPath = '/courses/recommended';
    breadcrumbLabel = 'Recommended Courses';
  } else if (courseSource === 'preparatory') {
    courseListingPath = '/courses/preparatory';
    breadcrumbLabel = 'Preparatory Courses';
  }

  const breadcrumbItems = [{ label: breadcrumbLabel, path: courseListingPath }, { label: courseDetails?.name || "Course Details" }];
  const { user, authenticated } = useAuth();
  const isPresenterOrFaculty = `${user?.authority}` === FACULTY;

  // Default to showing the payment flow for all domains
  const isEncodeDomain = false;

  const isCourseAccessExhausted = (key: string) => {
    if (key === 'Self Paced') {
      return (isAccessExhausted('self-paced') || isAccessExhausted('self_paced'));
    } else if (key === 'Live Online') {
      return (isAccessExhausted('live-online') || isAccessExhausted('live_online'));
    } else if (key === 'In-Class') {
      return (isAccessExhausted('in-class') || isAccessExhausted('in_class'));
    } else {
      const normalizedDashKey = key && key.toLowerCase().replace(/[\s_]+/g, '-');
      const normalizedUnderscoreKey = key && key.toLowerCase().replace(/[\s-]+/g, '_');

      return (
        isAccessExhausted(normalizedDashKey) ||
        isAccessExhausted(normalizedUnderscoreKey)
      );
    }
  };

  return (
    <div className={cci === '1' ? 'max-w-[1260px] mx-auto w-full' : ''}>
      {!(Number(cci) > 0) && <Breadcrumb items={breadcrumbItems} />}
      {Number(cci) > 0 && (
        <div className="mb-4">
          <button
            onClick={() => navigate('/courses/explore?cci=1')}
            className="flex items-center gap-2 text-sm font-medium hover:text-gray-300 transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-black dark:text-white cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      )}
      <LoadingSection isLoading={isCourseDetailsLoading} title='Course Details' />
      {(!isCourseDetailsLoading && courseDetails) ? (
        <div className='space-y-6'>
          <SEO
            title={`${courseDetails.name} | enCODE Course`}
            description={courseDetails.short_description || courseDetails.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `Learn ${courseDetails.name} on enCODE`}
            image={courseDetails.image}
            aeoType="Course"
            breadcrumbs={[
              { name: breadcrumbLabel, path: courseListingPath },
              { name: courseDetails.name }
            ]}
          />
          <div className='grid grid-cols-1 md:grid-cols-10 gap-3 bg-card overflow-hidden rounded-[20px]'>
            <Card
              className='md:col-span-6 p-4 bg-center bg-cover rounded-[20px] relative overflow-hidden flex flex-col justify-end'
              style={{
                backgroundImage: `url("${encodeURI(courseDetails?.image || '/images/course-placeholder.jpg')}")`,
              }}
            >
              <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes short-blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.3; }
                    }
                    .animate-short-blink {
                        animation: short-blink 1s ease-in-out infinite;
                    }
                `}} />

              {/* Badges */}
              <div className="absolute top-0 right-0 flex flex-col items-end z-10">
                {cci !== '1' && courseDetails?.course_meta?.mode_of_delivery && (() => {
                  const mode = courseDetails.course_meta.mode_of_delivery;
                  let badgeText = mode;
                  let badgeColor = 'bg-[#FF0080] text-white';

                  if (mode === 'Self Paced') {
                    badgeText = 'Starter';
                    badgeColor = 'bg-[#FF0080] text-white';
                  } else if (mode === 'Live Online') {
                    badgeText = 'Pro';
                    badgeColor = 'bg-[#84cc16] text-white';
                  } else if (mode === 'In-Class') {
                    badgeText = 'Max';
                    badgeColor = 'bg-[#FFDE00] text-black';
                  }

                  return (
                    <div className={cn(
                      "px-6 py-2 rounded-bl-xl font-bold text-lg shadow-md transition-transform hover:scale-105 capitalize",
                      badgeColor
                    )}>
                      {badgeText}
                    </div>
                  );
                })()}
                {/* {courseDetails?.course_meta?.number_of_credits && (
                  <div className="mt-2 bg-white backdrop-blur-sm text-black px-6 py-1.5 rounded-l-xl font-bold text-lg shadow-md border-y border-l border-gray-100/50">
                    {courseDetails.course_meta.number_of_credits} Credits
                  </div>
                )} */}
              </div>

              {/* {courseDetails?.subscription_type === 'paid' && courseDetails?.course_meta?.tuition_fee && (
                <div className="absolute top-0 left-0 bg-primary text-white py-4 px-1.5 rounded-br-2xl shadow-lg z-10 animate-short-blink">
                  <span className="[writing-mode:vertical-rl] font-bold text-[10px] uppercase tracking-tighter block rotate-180">
                    Price: {courseDetails.course_meta.tuition_fee || "$0"}
                  </span>
                </div>
              )} */}

              {/* gradient background */}
              <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-100' />
              <div className='relative z-10 flex justify-between items-end'>
                <div className='flex flex-col justify-end w-2/3'>
                  {/* <h1 className='text-4xl font-bold mb-2 text-white'>{course?.name}</h1> */}
                  <p className='text-white text-xl'>{courseCompletionPct}% Completed</p>
                </div>
                {!courseDetails?.is_assigned && isProgramOngoing && courseCompletionPct !== 100 && (
                  <div className="flex justify-end">
                    {courseDetails?.subscription_type === "open" ? (
                      <div className='bg-codeblue p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black mb-3 cursor-pointer' onClick={enrollNow}>
                        <ArrowRight className='mb-2' />
                        Enroll Now
                      </div>
                    ) : courseDetails?.is_map_id ? (
                      <div className='bg-gray-300 p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black mb-3 cursor-pointer' onClick={() => {
                        Swal.fire({
                          title: "Already Requested!",
                          text: "Request to enroll in this course is already sent.",
                          icon: "info",
                          theme: 'dark'
                        })
                      }}>
                        Requested
                      </div>
                    ) : (
                      <div
                        onMouseEnter={() => {
                          if (Number(isEnrolled) === 1) {
                            successToast('You have reached the maximum limit available under your current package!');
                          }
                        }}
                      >
                        <button
                          className={`bg-codeblue p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black mb-3 ${(Number(isEnrolled) === 1) || isCourseAccessExhausted(courseDetails.course_meta?.mode_of_delivery) ? 'cursor-not-allowed brightness-50' : 'cursor-pointer'}`}
                          disabled={(Number(isEnrolled) === 1) || isCourseAccessExhausted(courseDetails.course_meta?.mode_of_delivery)}
                          onClick={() => cci === '1' ? enrollViaCCI() : isEncodeDomain ? setEnrollDialog(true) : setPurchaseDialog(true)}
                        >
                          <ArrowRight className='mb-2' />
                          {cci === '1' ? 'Enroll Now' : isEncodeDomain ? 'Request Now' : 'Buy Now'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {
                  courseDetails?.is_assigned == 1 && calculateCourseCompletion() !== 100 && <div className='bg-codeblue p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black mb-3 cursor-pointer' onClick={() => navigate(`${getPlayerBasePath()}/${courseDetails?.id}/modules/${courseModules?.[0]?.id}${cci === '1' ? '?cci=3' : (cci ? `?cci=${cci}` : '')}`, { state: { courseSource } })}>
                    <ArrowRight className='mb-2' />
                    Continue Learning
                  </div>
                }

              </div>
              <Progress value={calculateCourseCompletion()} className='h-4 rounded-full bg-[#ACACAC] absolute bottom-0 w-full left-0 rounded-t-none' />
            </Card>
            <Card className='rounded-[20px] md:min-h-96 md:col-span-4 border-none'>
              <CardContent className='space-y-6'>
                <div>
                  <h1 className='text-lg md:text-4xl font-bold mb-2 text-white'>{courseDetails?.name}</h1>
                  <p className='text-white mb-4 text-base'>{courseDetails?.category_name}</p>
                </div>

                {programTools && programTools?.length > 0 && <div>
                  <p className='text-white text-sm mb-2'>Course Tool:</p>
                  {
                    programTools.map((tool, index) => (
                      <div key={`tool-${index}`} className='flex items-center cursor-pointer my-2' onClick={() => window.open(`${tool?.official_url}`, '_blank')}>
                        <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbqzXb0frYPXslo6raQm6Jaw5Nhp46A94orw&s'} alt="Leader Avatar" className='w-10 h-10 rounded-full mr-3' />
                        <div>
                          <h4 className='text-white font-semibold'>{tool?.name}</h4>
                          <p className='text-white text-sm'>{tool?.category}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
                }


                {courseLeader && courseLeader.length > 0 && <div>
                  <p className='text-white text-sm mb-2'>Course Leader:</p>
                  {
                    courseLeader.map((leader, index) => (
                      <div key={`leader-${index}`} className='flex items-center cursor-pointer' onClick={() => navigate(`/portfolio/${appConfig.organization?.profileServiceid}/${leader?.id}`)}>
                        <img src={leader?.profile_image || '/images/user-placeholder.png'} alt="Leader Avatar" className='w-10 h-10 rounded-full mr-3' />
                        <div>
                          <h4 className='text-white font-semibold'>{leader?.name}</h4>
                          {/* <p className='text-white text-sm'>{leader?.email}</p> */}
                        </div>
                      </div>
                    ))
                  }
                </div>
                }
                {Array.isArray(courseFaculty) && courseFaculty.length > 0 && (
                  <div>
                    <p className="text-white text-sm mb-2">Course Instructor:</p>
                    {courseFaculty.map((faculty, index) => {
                      const image = faculty?.profile_image || "/images/user-placeholder.png";
                      const name = faculty?.name || "N/A";
                      return (
                        faculty?.id && <div key={index} className="flex cursor-pointer items-center my-2" onClick={() => navigate(`/portfolio/${appConfig.organization?.profileServiceid}/${faculty.id}`)}>
                          <img
                            src={image}
                            alt="Faculty Avatar"
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                          />
                          <div>
                            <h4 className="text-white font-semibold">{name}</h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <Card className='rounded-[20px]'>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div className="p-4 border-b md:border-b-0 md:border-r-4 border-[#484848] last:border-r-0">
                  <div className="text-sm font-medium dark:text-white text-gray-500 mb-1">Course Pathway</div>
                  <div className="text-xl font-bold dark:text-white text-primary capitalize">{courseDetails?.course_meta?.nature || "-"}</div>
                </div>
                <div className="p-4 border-b md:border-b-0 md:border-r-4 border-[#484848] last:border-r-0">
                  <div className="text-sm font-medium dark:text-white text-gray-500 mb-1">Mode</div>
                  <div className="text-xl font-bold dark:text-white text-primary capitalize truncate">
                    {courseDetails?.course_meta?.mode_of_delivery || "-"}
                  </div>
                </div>
                <div className="p-4 border-b md:border-b-0 md:border-r-4 border-[#484848] last:border-r-0">
                  <div className="text-sm font-medium dark:text-white text-gray-500 mb-1">Duration</div>
                  <div className="text-xl font-bold dark:text-white text-primary">
                    {courseDetails?.course_meta?.duration ? `${courseDetails?.course_meta?.duration} Hrs` : "-"}
                  </div>
                </div>
                {/* <div className="p-4 border-b md:border-b-0 md:border-r-4 border-[#484848] last:border-r-0">
                  <div className="text-sm font-medium dark:text-white text-gray-500 mb-1">Credits</div>
                  <div className="text-xl font-bold dark:text-white text-primary">
                    {courseDetails?.course_meta?.number_of_credits || "-"}
                  </div>
                </div> */}
                <div className="p-4 border-b md:border-b-0 md:border-r-4 border-[#484848] last:border-r-0">
                  <div className="text-sm font-medium dark:text-white text-gray-500 mb-1">Skills</div>
                  <div className="text-xl font-bold dark:text-white text-primary">{courseSkillsAndJobRoles?.skills?.length || "-"}</div>
                </div>
                <div className="py-4 pl-4 pr-0">
                  <div className="text-sm font-medium dark:text-white text-gray-500 mb-1">Rating</div>
                  <div className="text-xl font-bold dark:text-white text-primary flex items-center justify-center gap-1">
                    <FaStar size={16} className="text-yellow-500" />
                    {courseDetails?.course_meta?.rating || "-"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Tabs
                defaultValue={cci === '1' ? 'course' : (shouldShowCertificateTab && courseCompletionPct === 100 ? 'certificate' : (courseDetails?.is_assigned ? 'modules' : 'course'))}
                onValueChange={(val) => {
                  mixpanelService.track('Tab Changed', {
                    tab_name: val,
                    course_id: courseDetails?.id,
                    page_path: window.location.pathname,
                  })
                  if (val === 'certificate') {
                    fetchCertificates();
                  }
                }}
              >
                {authenticated && (
                  <div className='flex justify-between items-center mb-6'>
                    <TabsList className='bg-[#5A5A5A] rounded-xl p-0 h-fit mb-6'>
                      <TabsTrigger value="course" className='text-white md:px-8 py-2 rounded-l-xl rounded-r-none'>Course</TabsTrigger>
                      <TabsTrigger value="modules" className='text-white md:px-8 py-2 rounded-none'>Modules</TabsTrigger>
                      {shouldShowCertificateTab && (
                        <TabsTrigger
                          value="certificate"
                          className='text-white md:px-8 py-2 rounded-r-xl rounded-l-none'
                        >
                          Certificate
                        </TabsTrigger>
                      )}
                    </TabsList>
                  </div>
                )}
                <TabsContent value="course" className='space-y-6'>
                  <Card className='bg-[#323232] border-0 shadow-none'>
                    <CardHeader>
                      <CardTitle className='text-xl text-white'>Course Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SafeHtml html={courseDetails?.description || "<p>No description available.</p>"} />
                    </CardContent>
                  </Card>
                  <Card className='bg-[#323232] border-0 shadow-none'>
                    <CardHeader>
                      <CardTitle className='text-xl text-white'>Skills You Will Gain</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {courseSkillsAndJobRoles && courseSkillsAndJobRoles?.skills?.length > 0 ? (
                        <div className='flex flex-wrap gap-3'>
                          {courseSkillsAndJobRoles.skills.map((skill, index) => (
                            <Badge key={index} className='bg-[#5A5A5A] text-white rounded-lg md:py-3 md:px-4'>{skill}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className='text-white text-base'>No skills available.</p>
                      )}
                    </CardContent>
                  </Card>
                  <Card className='bg-[#323232] border-0 shadow-none'>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className='text-xl text-white'>Matching Job Roles</CardTitle>
                      {courseSkillsAndJobRoles && courseSkillsAndJobRoles.job_role?.length > 5 && (
                        <button
                          className="underline text-sm text-codeblue"
                          onClick={() => setShowAllJobRoles(!showAllJobRoles)}
                        >
                          {showAllJobRoles ? "View Less" : "View All"}
                        </button>
                      )}
                    </CardHeader>
                    <CardContent>
                      {courseSkillsAndJobRoles && courseSkillsAndJobRoles?.job_role?.length > 0 ? (
                        <div className='flex flex-wrap gap-3'>
                          {(showAllJobRoles ? courseSkillsAndJobRoles.job_role : courseSkillsAndJobRoles.job_role.slice(0, 5))?.map((role, index) => (
                            <div key={index} className="bg-primary text-white rounded-lg px-2 md:py-4 md:px-6 flex md:items-center md:justify-center md:text-center break-words md:max-w-[250px] md:min-h-[120px]">
                              {role}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className='text-white text-base'>No job roles available.</p>
                      )}
                    </CardContent>
                  </Card>
                  <IndustryDomainsCard industryDomains={courseIndustries} />
                  {
                    courseDetails?.course_meta?.learning_outcome && <Card className='bg-[#323232] border-0 shadow-none gap-0'>
                      <CardHeader>
                        <CardTitle className='text-xl text-white'>Key Learning Outcomes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SafeHtml html={courseDetails?.course_meta?.learning_outcome || "<p>No information available.</p>"} />
                      </CardContent>
                    </Card>
                  }
                </TabsContent>
                <TabsContent value="modules" className="relative">
                  {!courseDetails?.is_assigned && (
                    <div className="absolute inset-0 z-20 flex justify-center items-center backdrop-blur-sm bg-black/30 rounded-lg">
                      <Lock size={64} className="text-white opacity-80" />
                    </div>
                  )}
                  <div className={!courseDetails?.is_assigned ? "opacity-50 pointer-events-none" : ""}>
                    {courseModules && courseModules.length ? (
                      <div className="space-y-4">
                        {courseModules.map((module) => {
                          const isOpen = activeModuleId === module.id;
                          return (
                            <Collapsible key={module.id} open={isOpen} className='bg-[#323232] rounded-lg p-4' onOpenChange={() => setActiveModuleId(isOpen ? null : module.id)}>
                              <CollapsibleTrigger className="w-full flex justify-between items-center">
                                <h1 className="text-white font-medium text-xl">{module.name}</h1>
                                <div>
                                  <ChevronDown className={`text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="CollapsibleContent">
                                <div className='flex md:flex-row flex-col md:justify-between md:items-start mt-2'>
                                  <div className="mt-4 md:max-w-xl">
                                    <SafeHtml html={module.description || "<p>No description available.</p>"} className='text-sm' />
                                  </div>
                                  {courseDetails?.is_assigned && <div className='bg-codeblue p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black cursor-pointer mt-2 md:mt-0'
                                    onClick={() => navigate(`${getPlayerBasePath()}/${courseDetails?.id}/modules/${module?.id}${cci === '1' ? '?cci=3' : (cci ? `?cci=${cci}` : '')}`, { state: { courseSource } })}
                                  >
                                    <ArrowRight className='mb-2' />
                                    Continue Learning
                                  </div>
                                  }
                                </div>
                                {/* contents */}
                                <div className='mt-4'>
                                  <LoadingSection isLoading={moduleLoading} className='dark:bg-[#2A2A2A]' />
                                  {
                                    activeModule && <div>
                                      {
                                        activeModule?.contents.filter((item) => {
                                          if (isPresenterOrFaculty) {
                                            return true;
                                          }
                                          return !isPresenterOrFaculty && item.quiz_type !== 'industry';
                                        })?.map((content, index) => {
                                          const contentCompletion = (content.content_type === 'survey' && content.is_attempt === 1) ? 100 : (Number(content?.completion) || 0);
                                          return (
                                            // <Link key={`content-${index}`} to={`/courses/${course?.id}/modules/${module?.id}?content_id=${content?.program_content_id}`} >
                                            <div key={`content-${index}`} className='mb-4 p-4 bg-[#2A2A2A] rounded-lg grid md:grid-cols-3 grid-cols-1 gap-4 justify-center items-center border border-transparent hover:border-codeblue cursor-pointer transition-all duration-200 group'
                                              onClick={() => redirectToContent(content?.program_content_id, content?.title)}
                                            >
                                              <div className='flex items-center gap-4'>
                                                <ContentTypeIcons content_type={content.content_type} completion={contentCompletion === 100} />
                                                <p className='text-white font-semibold group-hover:text-primary'>{content.title}</p>
                                              </div>
                                              <span className='text-sm capitalize text-primary'>{content.content_type}</span>
                                              <div className='flex gap-3 items-center'>
                                                <span className='text-white text-sm capitalize flex-nowrap w-40'>
                                                  {(content.content_type === "notes" || content.content_type === "assignment") && `${content.duration_in_minutes ?? 0} ${content.duration_in_minutes === 1 ? 'Page' : 'Pages'}`}
                                                  {(content.content_type === 'video' || content.content_type === 'video_yts' || content.content_type === 'zoomclass' || content.content_type === 'assessment') && `ETA- ${content.duration_in_minutes ?? 0} Min`}
                                                </span>
                                                {courseDetails?.is_assigned && <div className='flex items-center gap-3 w-full'>
                                                  <Progress value={contentCompletion} className='bg-[#ACACAC] w-full' />
                                                  <p className='text-white text-sm mt-1'>{contentCompletion}%</p>
                                                </div>}
                                              </div>
                                            </div>
                                            // </Link>
                                          )
                                        })}
                                      {
                                        (activeModule?.contents?.length === 0 && !moduleLoading) && <p className='text-white text-base'>No contents available for this module.</p>
                                      }
                                    </div>
                                  }
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-white text-base">No modules available for this course.</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="certificate">
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Left Side - Course Info and Actions */}
                    <div className='space-y-6'>
                      {/* Header with Logo */}
                      <div className='flex gap-4 items-start'>
                        <img
                          src={courseDetails?.organization_logo}
                          alt="Organization Logo"
                          className='w-20 h-20 object-contain bg-black rounded-lg flex-shrink-0'
                        />
                        <div className='flex-1'>
                          <h1 className='text-2xl md:text-3xl font-bold text-white'>
                            {courseDetails?.name} Certificate
                          </h1>
                        </div>
                      </div>

                      {/* Achievement Message */}
                      <div className='space-y-2'>
                        {hasProgramCertificate() ? (
                          <h2 className='text-white text-3xl md:text-4xl font-semibold leading-tight'>
                            You&apos;ve achieved <br />
                            <span className='text-codeblue font-creative text-5xl'>Greatness!</span>
                          </h2>
                        ) : (
                          <h2 className='text-white text-3xl md:text-4xl font-semibold leading-tight'>
                            Just a blink away from <br />
                            <span className='text-codeblue font-creative text-5xl'>Greatness</span>
                          </h2>
                        )}
                      </div>

                      {/* Progress */}
                      <div className='space-y-2'>
                        <p className='text-white text-lg'>{calculateCourseCompletion()}% Completed</p>
                        <Progress value={calculateCourseCompletion()} className='h-3 rounded-full bg-[#ACACAC]' />
                      </div>

                      {/* Certificate Manager Component */}
                      <CertificateManager
                        programCertificates={Array.isArray(courseAndContentCertificate?.program_certificate) ? courseAndContentCertificate.program_certificate : courseAndContentCertificate?.program_certificate ? [courseAndContentCertificate.program_certificate] : []}
                        contentCertificates={Array.isArray(courseAndContentCertificate?.content_certificate) ? courseAndContentCertificate.content_certificate : courseAndContentCertificate?.content_certificate ? [courseAndContentCertificate.content_certificate] : []}
                        courseCompletion={calculateCourseCompletion()}
                        userName={sessionStorage.getItem("user_name") || "Student"}
                        courseName={courseDetails?.name || ""}
                        organizationName={courseDetails?.organization_name || appConfig.organization?.name || "Organization"}
                        organizationLogo={courseDetails?.organization_logo || appConfig.organization?.logoUrl || ""}
                        skills={courseSkillsAndJobRoles?.skills?.slice(0, 5)}
                        courseLeader={courseLeader?.[0]?.name}
                        selectedCertificate={selectedCertificate}
                        onCertificateSelect={setSelectedCertificate}
                      />

                      {/* Continue Learning Button */}
                      {cci != '1' && calculateCourseCompletion() < 100 && (
                        <div className='pt-4'>
                          <div
                            className='bg-codeblue p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black cursor-pointer hover:bg-codeblue/80 transition-colors'
                            onClick={() => navigate(`${getPlayerBasePath()}/${courseDetails?.id}/modules/${courseModules?.[0]?.id}`, { state: { courseSource } })}
                          >
                            <ArrowRight className='mb-2' />
                            Continue Learning
                          </div>
                        </div>
                      )}

                      {/* Continue to Next Stage Button — shown only when cci=1 and certificate is available/earned */}
                      {cci === '1' && (calculateCourseCompletion() === 100 || (Array.isArray(courseAndContentCertificate?.program_certificate) ? courseAndContentCertificate.program_certificate.length > 0 : !!courseAndContentCertificate?.program_certificate) || (Array.isArray(courseAndContentCertificate?.content_certificate) ? courseAndContentCertificate.content_certificate.length > 0 : !!courseAndContentCertificate?.content_certificate)) && (
                        <div className='pt-2'>
                          <div
                            className='p-3 rounded-xl h-[96px] w-[140px] flex flex-col justify-center items-center text-center text-black cursor-pointer transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95 shadow-md'
                            style={{ backgroundColor: '#FFE600' }}
                            onClick={() => navigate('/cci-stage-2')}
                          >
                            <span className="font-normal text-base leading-tight">Continue to<br />Next Stage</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Side - Certificate Preview */}
                    <div className='flex flex-col justify-center items-center'>
                      <div className='relative w-full'>
                        <CertificateManager
                          programCertificates={Array.isArray(courseAndContentCertificate?.program_certificate) ? courseAndContentCertificate.program_certificate : courseAndContentCertificate?.program_certificate ? [courseAndContentCertificate.program_certificate] : []}
                          contentCertificates={Array.isArray(courseAndContentCertificate?.content_certificate) ? courseAndContentCertificate.content_certificate : courseAndContentCertificate?.content_certificate ? [courseAndContentCertificate.content_certificate] : []}
                          courseCompletion={calculateCourseCompletion()}
                          userName={sessionStorage.getItem("user_name") || "Student"}
                          courseName={courseDetails?.name || ""}
                          organizationName={courseDetails?.organization_name || appConfig.organization?.name || "Organization"}
                          organizationLogo={courseDetails?.organization_logo || appConfig.organization?.logoUrl || ""}
                          skills={courseSkillsAndJobRoles?.skills?.slice(0, 5)}
                          courseLeader={courseLeader?.[0]?.name}
                          showOnlyPreview={true}
                          selectedCertificate={selectedCertificate}
                          onCertificateSelect={setSelectedCertificate}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      ) : (!isCourseDetailsLoading && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Course Not Found</h2>
          <p className="text-gray-400 mb-8 text-lg">The course you are looking for does not exist or may have been removed.</p>
          <button onClick={() => navigate('/courses/all')} className="bg-codeblue text-black font-semibold py-3 px-8 rounded-lg hover:bg-codeblue/90 transition-colors">
            Browse Courses
          </button>
        </div>
      ))}
      {/* Enroll Dialog */}
      <Dialog open={enrollDialog} onOpenChange={setEnrollDialog}>
        <DialogContent className="p-6 rounded-lg shadow-lg max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold dark:text-white text-center mb-4">Why do you want to choose this course?</DialogTitle>
            <DialogDescription>
              <Textarea
                value={whyChooseThisCourse}
                placeholder="Tell us why you're interested in this course..."
                className="w-full p-4 border border-gray-300 rounded-lg mt-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
                rows={5}
                onChange={(e) => setWhyChooseThisCourse(e.target.value)}
              />
              <button
                className="bg-primary hover:bg-primary/50 text-white px-8 py-4 rounded-lg font-medium transition-colors w-full mt-4 shadow-sm hover:shadow-md"
                onClick={enrollNow}
              >
                Enroll Now
              </button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Thank You Dialog */}
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="p-10 rounded-[32px] bg-[#222222] border-white/10 max-w-lg text-center">
          <DialogHeader className="sm:text-center sm:items-center">
            <DialogTitle className="text-4xl font-bold text-white mb-6 flex justify-center w-full">Thank you✨</DialogTitle>
            <DialogDescription className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-sm mx-auto sm:text-center">
              You have been successfully enrolled into <br />
              <span className="font-medium text-white">“{courseDetails?.name}”</span> <br />
              course.<br />
              <span className="inline-block mt-4">
                We are happy that you are on the right path <br />
                of achieving extraordinary.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                setShowThankYou(false);
                fetchCourse();
              }}
              className="bg-codeblue text-black px-10 py-4 rounded-xl font-bold hover:bg-codeblue/90 transition-all text-base"
            >
              Continue Learning
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CoursePayment is only rendered on non-encode domains */}
      {!isEncodeDomain && (
        <CoursePayment
          courseDetails={courseDetails}
          user={user}
          programTools={programTools || []}
          courseLeader={courseLeader || []}
          courseFaculty={courseFaculty || []}
          purchaseDialog={purchaseDialog}
          setPurchaseDialog={setPurchaseDialog}
          setEnrollDialog={setEnrollDialog}
          fetchCourse={fetchCourse}
        />
      )}
    </div>
  )
}


const IndustryDomainsCard = ({ industryDomains }: { industryDomains: CourseCategoryDomain[] | undefined }) => {
  const [showAll, setShowAll] = useState(false);

  const VISIBLE_COUNT = 5;

  const visibleDomains = showAll
    ? industryDomains
    : industryDomains?.slice(0, VISIBLE_COUNT);

  return (
    <Card className="bg-[#323232] border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl text-white">Industry Relevance</CardTitle>
        {/* {industryDomains && industryDomains.length > VISIBLE_COUNT && (
          <button
            className="underline text-sm text-codeblue"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "View Less" : "View All"}
          </button>
        )} */}
      </CardHeader>
      <CardContent>
        {industryDomains && industryDomains?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {visibleDomains?.map((domain, index) => (
              <div
                key={index}
                className="bg-primary text-white rounded-lg px-2 md:py-4 md:px-6 flex md:items-center md:justify-center md:text-center break-words md:max-w-[250px] md:min-h-[120px]"
              >
                {domain.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-base">No industry domains available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseDetailsBase;