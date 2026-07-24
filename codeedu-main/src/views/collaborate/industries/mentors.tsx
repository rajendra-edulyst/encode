import MentorCard from '@/components/MentorCard'
import { useIndustriesMentors } from '@/hooks/data/create/useMentor'
import React from 'react'

interface MentorsProps {
  org_id: string | number;
}

const Mentors = ({ org_id }: MentorsProps) => {

  const params = new URLSearchParams();
  params.append('org_id', org_id.toString());
  params.append('is_admin', '1');

  const { data: mentors } = useIndustriesMentors(params);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {mentors?.map((mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} />
      ))}
    </div>
  )
}

export default Mentors