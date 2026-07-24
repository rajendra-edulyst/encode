import { useQuery, useMutation } from '@tanstack/react-query';
import { ContinuePreviousContent, CourseCategoryDomain, CourseDetails, CourseDetailsV2, CourseInstructorAndCourseLeader, CourseModule, CourseModuleV2, CoursesApiResponse, CourseSkilsAndJobRoles, ModeOfDeliveryResponse, PreAssignCourse, ProgramAndContentCertificate, Resource } from '@/@types/learner/Courses';
import { fetchCourseById, fetchCourses, fetchModuleByCourseId, getPendingContent, preAssignedCourses, fetchModes, fetchRecommendedCourses, getCourseIndustries, fetchCourseByIdV2, fetchCourseInstructors, fetchCourseSkillsAndJobRoles, featchCourseModules, fetchCourseAndContentCertificate, fetchUserAssessmentList } from '@/services/learner/CourseService';
import { fetchBadges, fetchCertificateStats, fetchCertificationsSummary, fetchCourseCategoryList, fetchCoursesProgress, fetchCoursesStatCount, fetchCurrentCourse, fetchDomainProgress, fetchEarnedCertificates, fetchLearningHours, fetchLearningStage, fetchMentorSessions, fetchMilestones, fetchOpinionPolls, fetchSkillsBadgesSummary, fetchSkillsProgress } from '@/services/create/CourseService';
import { AssessmentAttempt, AssessmentInstruction, AssessmentResult, AssessmentReview, BadgeItem, CertificateStatsData, CertificationsSummary, CourseLearningHours, CoursesProgress, CoursesStatCount, CurrentCourse, DomainProgressItem, EarnedCertificate, LearningStageData, MentorSessions, MilestonesData, OpinionPolls, ProgramCategory, SkillsBadgesSummaryData, SkillsProgressData } from '@/@types/create/courses';
import { fetchAssignment } from '@/services/learner/assignmentService';
import { Assignment } from '@/@types/learner/assignment';
import { fetchQuestions, assessmentQuestionSave, fetchAssessmentReview, fetchAssessmentInsruction, fetchAssessmentResult, fetchProgramTools, fetchZoomContentJoinLink, fetchProgramUserList, fetchProgramStudentReviewed } from '@/services/create/AssessmentService';


export const useCertificationSummary = (type: string) => {
  return useQuery<CertificationsSummary>({
    queryKey: ['certificationSummary', type],
    queryFn: async () => {
      const res = await fetchCertificationsSummary(type);
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useCoursesProgress = (type: string) => {
  return useQuery<CoursesProgress>({
    queryKey: ['coursesProgress', type],
    queryFn: async () => {
      const res = await fetchCoursesProgress(type);
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useMentorSessions = (type: string) => {
  return useQuery<MentorSessions>({
    queryKey: ['mentorSessions', type],
    queryFn: async () => {
      const res = await fetchMentorSessions(type);
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useOpinionPolls = (type: string) => {
  return useQuery<OpinionPolls>({
    queryKey: ['opinionPolls', type],
    queryFn: async () => {
      const res = await fetchOpinionPolls(type);
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useMilestones = (type: string) => {
  return useQuery<MilestonesData>({
    queryKey: ['milestones', type],
    queryFn: async () => {
      const res = await fetchMilestones(type);
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useCurrentCourse = (type: string) => {
  return useQuery<CurrentCourse>({
    queryKey: ['currentCourse', type],
    queryFn: async () => {
      const res = await fetchCurrentCourse(type);
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useCertificateStats = (type: string) => {
  return useQuery<CertificateStatsData>({
    queryKey: ['certificateStats', type],
    queryFn: async () => {
      const res = await fetchCertificateStats(type);
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useEarnedCertificates = (type: string) => {
  return useQuery<EarnedCertificate[]>({
    queryKey: ['earnedCertificates', type],
    queryFn: async () => {
      const res = await fetchEarnedCertificates(type);
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useSkillsBadgesSummary = (type: string) => {
  return useQuery<SkillsBadgesSummaryData>({
    queryKey: ['skillsBadgesSummary', type],
    queryFn: async () => {
      const res = await fetchSkillsBadgesSummary(type);
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useLearningStage = (type: string) => {
  return useQuery<LearningStageData>({
    queryKey: ['learningStage', type],
    queryFn: async () => {
      const res = await fetchLearningStage(type);
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useSkillsProgress = (type: string) => {
  return useQuery<SkillsProgressData>({
    queryKey: ['skillsProgress', type],
    queryFn: async () => {
      const res = await fetchSkillsProgress(type);
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useDomainProgress = (type: string) => {
  return useQuery<DomainProgressItem[]>({
    queryKey: ['domainProgress', type],
    queryFn: async () => {
      const res = await fetchDomainProgress(type);
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useBadges = (type: string) => {
  return useQuery<BadgeItem[]>({
    queryKey: ['badges', type],
    queryFn: async () => {
      const res = await fetchBadges(type);
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useLearningHours = () => {
  return useQuery<CourseLearningHours[]>({
    queryKey: ['learningHours'],
    queryFn: async () => {
      const res = await fetchLearningHours();
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export const useCourseStatCounts = (type: string) => {
  return useQuery<CoursesStatCount>({
    queryKey: ['courseStatCounts', type],
    queryFn: async () => {
      const res = await fetchCoursesStatCount(type);
      return res || { enrolled_courses: 0, completed_courses: 0, in_progress_courses: 0 };
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCourseCategories = () => {
  return useQuery<Array<ProgramCategory>>({
    queryKey: ['courseCategories'],
    queryFn: async () => {
      const res = await fetchCourseCategoryList();
      return res || [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};

export const useMyCourses = (type?: string) => {
  return useQuery<Array<PreAssignCourse>>({
    queryKey: ['mycourses', type],
    queryFn: async () => {
      const res = await preAssignedCourses(type);
      return res ?? [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUserAssessmentList = (type: string) => {
  return useQuery({
    queryKey: ['userAssessmentList', type],
    queryFn: async () => {
      const res = await fetchUserAssessmentList(type);
      return res;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};


export const useCourses = (params?: URLSearchParams) => {
  return useQuery<CoursesApiResponse>({
    queryKey: ['courses', params?.toString()],
    queryFn: async () => {
      const res = await fetchCourses(params);
      return res || [];
    },
    retry: 1,
    staleTime: 0,
  });
};

export const useRecommendedCourses = (params?: URLSearchParams) => {
  return useQuery<CoursesApiResponse>({
    queryKey: ['recommendedCourses', params?.toString()],
    queryFn: async () => {
      const res = await fetchRecommendedCourses(params);
      return res || [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};



export const useCourseDeliveryMode = (params?: URLSearchParams) => {
  return useQuery<ModeOfDeliveryResponse>({
    queryKey: ['course-delivery-mode', params?.toString()],
    queryFn: async () => {
      const res = await fetchModes(params);
      return res || [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};


export const useCourse = (id: string | undefined) => {
  return useQuery<CourseDetails>({
    queryKey: ['course', id],
    queryFn: async () => {
      const res = await fetchCourseById(id);
      return res || null;
    },
    retry: 1,
    enabled: !!id,
    staleTime: 0,
  });
};

// // v1/course-details-v2/5445
export const useCourseDetailsV2 = (id: string | undefined, cci?: string | null) => {
  return useQuery<CourseDetailsV2>({
    queryKey: ['courseDetailsV2', id, cci],
    queryFn: async () => {
      const res = await fetchCourseByIdV2(id, cci);
      return res || null;
    },
    retry: 1,
    enabled: !!id,
    staleTime: 0,
  });
};

// fetchCourseInstructors
export const useCourseInstructors = (course_id: string | undefined) => {
  return useQuery<CourseInstructorAndCourseLeader>({
    queryKey: ['courseInstructors', course_id],
    queryFn: async () => {
      const res = await fetchCourseInstructors(course_id);
      return res || null;
    },
    retry: 1,
    enabled: !!course_id,
    staleTime: 1000 * 60 * 5,
  });
};

// fetchCourseSkillsAndJobRoles
export const useCourseSkillsAndJobRoles = (course_id: string | undefined) => {
  return useQuery<CourseSkilsAndJobRoles>({
    queryKey: ['courseSkillsAndJobRoles', course_id],
    queryFn: async () => {
      const res = await fetchCourseSkillsAndJobRoles(course_id);
      return res || null;
    },
    retry: 1,
    enabled: !!course_id,
    staleTime: 1000 * 60 * 5,
  });
};


// featchCourseModules
export const useCourseModules = (course_id: string | undefined) => {
  return useQuery<Array<CourseModuleV2>>({
    queryKey: ['courseModules', course_id],
    queryFn: async () => {
      const res = await featchCourseModules(course_id);
      return res || [];
    },
    retry: 1,
    staleTime: 0,
    enabled: !!course_id,
  });
};

// course module details
export const useCourseModuleDetails = (module_id: string | undefined) => {
  return useQuery<CourseModule>({
    queryKey: ['courseModule', module_id],
    queryFn: async () => {
      const res = await fetchModuleByCourseId(module_id);
      return res || [];
    },
    retry: 1,
    staleTime: 0,
    enabled: !!module_id && module_id !== 'null',
  });
};

export const useCourseAndContentCertificate = (
  course_id: string | undefined,
  shouldPoll = false
) => {
  return useQuery<ProgramAndContentCertificate>({
    queryKey: ['courseAndContentCertificate', course_id],
    queryFn: async () => {
      const res = await fetchCourseAndContentCertificate(course_id);
      return res;
    },
    retry: 1,
    //staleTime: 1000 * 60 * 5,
    staleTime: 0,
    enabled: !!course_id,
    // Poll every 5 seconds when conditions are met; stop as soon as
    // program_certificate has at least one entry.
    refetchInterval: shouldPoll
      ? (query) => {
        const data = query.state.data as ProgramAndContentCertificate | undefined;
        const hasCert = Array.isArray(data?.program_certificate)
          ? data.program_certificate.length > 0
          : !!data?.program_certificate;
        return hasCert ? false : 5000;
      }
      : false,
  });
}

// content

export const useLearnerSubmittedAssignments = (content_id: number | undefined) => {
  return useQuery<Assignment>({
    queryKey: ['learnerSubmittedAssignments', content_id],
    queryFn: async () => {
      const res = await fetchAssignment(content_id);
      return res || [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!content_id,
  });
};

// get continue reading courses - getPendingContent
export const useContinueReadingCourses = (content_id: number) => {
  return useQuery<ContinuePreviousContent>({
    queryKey: ['continueReadingCourses', content_id],
    queryFn: async () => {
      const res = await getPendingContent(content_id);
      return res || [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!content_id,
    // persist data false
    gcTime: 0,
  });
};

// getCourseIndustries
export const useCourseIndustries = (course_category_id: number | undefined) => {
  return useQuery<Array<CourseCategoryDomain>>({
    queryKey: ['courseIndustries', course_category_id],
    queryFn: async () => {
      const res = await getCourseIndustries(course_category_id);
      return res || [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!course_category_id,
  });
}



// assessments hooks and mutations


export const useAssessmentDetailsWithQuestions = (
  content_id: string | undefined,
  student_id?: string,
  user_calender_id?: number
) => {
  return useQuery<AssessmentAttempt>({
    queryKey: ['assessment-questions', content_id, student_id, user_calender_id],
    queryFn: async () => {
      const res = await fetchQuestions(content_id, student_id, user_calender_id);
      return res || [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!content_id,
  });
}

// Save assessment answer mutation
export const useSaveAssessmentAnswer = () => {
  return useMutation({
    mutationFn: async (data: {
      content_id: string;
      question_id: number;
      option_id?: number | number[];
      answer_statement?: string;
      match_answers?: Record<number, string>;
      mark_review: number;
      durationSec: number;
      student_id?: number;
      question_sequence?: string;
    }) => {
      return await assessmentQuestionSave(data);
    },
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

// fetchAssessmentReview query
export const useAssessmentReview = (assessment_id: string | undefined, attempt_id: string | undefined) => {
  return useQuery<AssessmentReview>({
    queryKey: ['assessment-questions', assessment_id, attempt_id],
    queryFn: async () => {
      const res = await fetchAssessmentReview(assessment_id, attempt_id);
      return res || [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!attempt_id || !!assessment_id,
  });
}

// assessment Instructions query
export const useAssessmentInstructions = (content_id: number | undefined) => {
  return useQuery<AssessmentInstruction>({
    queryKey: ['assessment-instructions', content_id],
    queryFn: async () => {
      const res = await fetchAssessmentInsruction(content_id);
      return res || [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!content_id,
  });
}

// assessment-result
export const useAssessmentResult = (assessment_id: string | undefined) => {
  return useQuery<AssessmentResult>({
    queryKey: ['assessment-result', assessment_id],
    queryFn: async () => {
      const res = await fetchAssessmentResult(assessment_id);
      return res || [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!assessment_id,
  });
}


// program tools 
export const useProgramTools = (program_id: string | undefined) => {
  return useQuery<Array<Resource>>({
    queryKey: ['program-tools', program_id],
    queryFn: async () => {
      const res = await fetchProgramTools(program_id);
      return res || [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!program_id,
  });
}


export const useZoomContentJoinLink = (content_id: number | undefined) => {
  return useQuery<string | null>({
    queryKey: ['zoom-content-join-link', content_id],
    queryFn: async () => {
      const res = await fetchZoomContentJoinLink(content_id);
      return res || null;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!content_id,
  });
}


export const useProgramUserList = (program_id: string | undefined) => {
  return useQuery<Array<{ id: number; name: string; email: string; profile_image: string; batch_name: string; }>>({
    queryKey: ['program-user-list', program_id],
    queryFn: async () => {
      const res = await fetchProgramUserList(program_id);
      return res || [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!program_id,
  });
}
export const useProgramStudentReviewed = (content_id: string | undefined) => {
  return useQuery<Record<string, number>>({
    queryKey: ['program-student-reviewed', content_id],
    queryFn: async () => {
      const res = await fetchProgramStudentReviewed(content_id);
      return res || {};
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!content_id,
  });
}