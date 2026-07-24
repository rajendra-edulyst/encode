
import MentorCard from './MentorCard';
import type { AllMentorList, LMSMentor, Mentor } from '@/@types/create/mentor';
import { cn } from '@/lib/utils';

type Props = {
  mentors: Mentor[];
  onOpenProfile: (mentor: Mentor) => void;
  onOpenSocial: (url?: string) => void;
  mentorRatings?: (LMSMentor | AllMentorList)[];
  hideSlotsBadge?: boolean;
  isPublic?: boolean;
};

const MentorGrid = ({ mentors, onOpenProfile, onOpenSocial, mentorRatings, hideSlotsBadge, isPublic }: Props) => {


  return (
    <div className={cn(
      "grid gap-4",
      isPublic ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    )}>
      {mentors.map((mentor, idx) => {
        const uid = String(mentor.uniqueIdentifier ?? '');
        const mentorEmail = mentor?.profileSection?.basic_info?.[0]?.email;
        const specificRating = mentorRatings?.find((r) => {
          const rid = 'id' in r && r.id != null ? String(r.id) : '';
          return (rid && rid === uid) || (mentorEmail && r.email === mentorEmail);
        });

        return (
          <MentorCard
            key={`${mentor.uniqueIdentifier || mentor._id || idx} `}
            mentor={mentor}
            mentorRating={specificRating}
            onOpenProfile={onOpenProfile}
            onOpenSocial={onOpenSocial}
            hideSlotsBadge={hideSlotsBadge}
            isPublic={isPublic}
          />
        )
      })}
     
    </div>
  );
};

export default MentorGrid;