import { CommonModuleContent } from '@/@types/learner/Courses';
import { useAuth } from '@/auth';
import { FACULTY } from '@/constants/roles.constant';
import { useCourseInstructors } from '@/hooks/data/create/useCourses';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useSessionUsersStore } from '@/store/faculty/SessionStore';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

interface OfflineClassProps {
  content: CommonModuleContent;
  courseId: string | undefined;
}

function OfflineClass({ content, courseId }: OfflineClassProps) {
  const { user } = useAuth();
  const { data: courseInstructorsAndLeader } = useCourseInstructors(courseId);
  const showPresentorView = `${user?.authority}` === FACULTY && courseInstructorsAndLeader?.instructor?.some((instructor) => instructor.id === user?.id);

  const { users, error, loading, session, fetchSessionUsers, changeAttendanceStatus, bulkChangeAttendanceStatus } = useSessionUsersStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);




  const trackedContentId = useRef<number | string | null>(null);

  useEffect(() => {
    if (!content.program_content_id) {
      toast.error("Something went wrong, Please try again later.");
      return;
    }
    fetchSessionUsers(content.program_content_id)

    if (trackedContentId.current !== content.program_content_id) {
      mixpanelService.track('Course Content Viewed', {
        content_type: 'offlineclass',
        content_name: content.title,
        course_id: content.program_id,
        content_id: content.program_content_id
      });
      trackedContentId.current = content.program_content_id;
    }
  }, [fetchSessionUsers, content.program_content_id, content.program_id, content.title]);


  const attendanceStatus = users?.filter((u)=> u.user_id == user?.id)[0]?.status;

  const getAttendanceStatusBadge = (status : any) => {
    switch (status) {
      case 'attended':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900 flex items-center gap-1 w-fit">
            <CheckCircle2 size={16} />
            Present
          </Badge>
        );
      case 'absent':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900 flex items-center gap-1 w-fit">
            <XCircle size={16} />
            Absent
          </Badge>
        );
      case 'Invited':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-900 flex items-center gap-1 w-fit">
            <Clock size={16} />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-6 shadow-sm dark:bg-[#323232] h-full">
      {showPresentorView ? (
        <div className="flex items-center justify-center py-8">
          <Link
            to={`/sessions/${content.program_content_id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Calendar size={20} />
            Go to Sessions
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Class Name */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {content.title}
            </h1>
          </div>

          {/* Attendance Status */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Attendance Status
            </h2>
            {getAttendanceStatusBadge(attendanceStatus)}
          </div>

          {/* Class Description */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Class Description
            </h2>
            <div
              className="text-gray-600 dark:text-gray-400 leading-relaxed prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default OfflineClass;