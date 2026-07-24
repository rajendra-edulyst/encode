import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AssignedProgram, CommonModuleContent, ProgramDetails } from '@/@types/faculty/program';
import { fetchAssignedPrograms, fetchModulesContents, fetchProgramDetails } from '@/services/faculty/ProgramService';
import { Session } from '@/@types/faculty/session';
import { fetchSessions } from '@/services/faculty/SessionsService';
import { fetchBatches } from '@/services/faculty/BatchService';
import { Batch } from '@/@types/faculty/batch';
import { Assessment, AssessmentInstructions, AssessmentLearner } from '@/@types/faculty/assessment';
import { assignAssessmentCertificate, fetchAssessment, fetchAssessmentAttemptsUsers, fetchAssessments } from '@/services/faculty/AssessmentService';
import { fetchAssignment, fetchAssignments, fetchAssignmentSubmissionUsers, fetchUserAssignmentSubmission, addReviewComment, assignAssignmentCertificate } from '@/services/faculty/AssignmentService';
import { Assignment, AssignmentLearner, AssignmentSubmission } from '@/@types/faculty/assignment';
import { toast } from 'sonner';

export const useMyAssignedPrograms = (params?: URLSearchParams) => {
    return useQuery<Array<AssignedProgram>>({
        queryKey: ['my-assigned-programs', params?.toString()],
        queryFn: async () => {
            const res = await fetchAssignedPrograms(params);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

// fetchProgramDetails
export const useProgramDetails = (programId: number | string | undefined) => {
    return useQuery<ProgramDetails>({
        queryKey: ['program-details', programId],
        queryFn: async () => {
            const res = await fetchProgramDetails(programId);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!programId,
    });
}

// fetchModulesContents
export const useModuleContents = (moduleId: number | string | undefined) => {
    return useQuery<Array<CommonModuleContent>>({
        queryKey: ['module-contents', moduleId],
        queryFn: async () => {
            const res = await fetchModulesContents(moduleId);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!moduleId,
    });
}


export const useMySessions = (params?: URLSearchParams) => {
    return useQuery<Array<Session>>({
        queryKey: ['my-sessions'],
        queryFn: async () => {
            const res = await fetchSessions(params);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};


export const useBatches = (params?: URLSearchParams) => {
    return useQuery<Array<Batch>>({
        queryKey: ['batches', params],
        queryFn: async () => {
            const res = await fetchBatches(params);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};


// content
export const useAssessments = (params?: URLSearchParams) => {
    return useQuery<Array<Assessment>>({
        queryKey: ['assessments', params?.toString()],
        queryFn: async () => {
            const res = await fetchAssessments(params);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};


export const useAssessmentDetails = (assessmentId: string | undefined) => {
    return useQuery<AssessmentInstructions>({
        queryKey: ['assessment-details', assessmentId],
        queryFn: async () => {
            const res = await fetchAssessment(assessmentId);
            if (!res) throw new Error('Assessment not found');
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!assessmentId,
    });
}

export const useAssessmentAttemptsUsers = (assessmentId: string | undefined) => {
    return useQuery<Array<AssessmentLearner>>({
        queryKey: ['assessment-attempts-users', assessmentId],
        queryFn: async () => {
            const res = await fetchAssessmentAttemptsUsers(assessmentId);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!assessmentId,
    });
};

// assignments

export const useAssignments = (params?: URLSearchParams) => {
    return useQuery<Array<Assignment>>({
        queryKey: ['assignments', params?.toString()],
        queryFn: async () => {
            const res = await fetchAssignments(params);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
}

// assignment details
export const useAssignmentDetails = (assignmentId: string | undefined) => {
    return useQuery<Assignment | null>({
        queryKey: ['assignment-details', assignmentId],
        queryFn: async () => {
            const res = await fetchAssignment(assignmentId);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!assignmentId,
    });
}

// assignment learners
export const useAssignmentLearners = (assignmentId: string | undefined) => {
    return useQuery<Array<AssignmentLearner>>({
        queryKey: ['assignment-learners', assignmentId],
        queryFn: async () => {
            const res = await fetchAssignmentSubmissionUsers(assignmentId);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!assignmentId,
    });
}

// submission details
export const useAssignmentSubmissionDetails = (assignmentId: string | undefined, userId: number | undefined) => {
    return useQuery<Array<AssignmentSubmission>>({
        queryKey: ['assignment-submission-details', assignmentId, userId],
        queryFn: async () => {
            const res = await fetchUserAssignmentSubmission(assignmentId, userId);
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!assignmentId && !!userId,
    });
}

// Review assignment submission
export const useReviewAssignment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: FormData) => {
            return await addReviewComment(data);
        },
        onSuccess: (_, variables) => {
            toast.success('Review submitted successfully!');
            // Invalidate relevant queries
            const contentId = variables.get('content_id');
            const userId = variables.get('user_id');
            queryClient.invalidateQueries({ queryKey: ['assignment-submission-details', contentId, Number(userId)] });
            queryClient.invalidateQueries({ queryKey: ['assignment-learners'] });
        },
        onError: (error) => {
            toast.error('Failed to submit review: ' + error);
        },
    });
}

// Assign assessment certificate
export const useAssignAssessmentCertificate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ content_id, user_id }: { content_id: string; user_id: number }) => {
            return await assignAssessmentCertificate(content_id, user_id);
        },
        onSuccess: (_, variables) => {
            toast.success('Certificate assigned successfully!');
            // Invalidate assessment learners to refresh the list
            queryClient.invalidateQueries({ queryKey: ['assessment-attempts-users', variables.content_id] });
        },
        onError: (error) => {
            toast.error('Failed to assign certificate: ' + error);
        },
    });
}

// Assign assignment certificate
export const useAssignAssignmentCertificate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ content_id, user_id }: { content_id: number; user_id: number }) => {
            return await assignAssignmentCertificate(content_id, user_id);
        },
        onSuccess: (_, variables) => {
            toast.success('Certificate assigned successfully!');
            // Invalidate assignment submission details to refresh
            queryClient.invalidateQueries({ queryKey: ['assignment-submission-details', variables.content_id.toString(), variables.user_id] });
            queryClient.invalidateQueries({ queryKey: ['assignment-learners'] });
        },
        onError: (error) => {
            toast.error('Failed to assign certificate: ' + error);
        },
    });
}