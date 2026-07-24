import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/ShadcnButton'
import { MoveRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

interface CreativeDirectoryProps {
  data: {
    id: string | number;
    name?: string;
    about?: string;
    type: string;
    display_name?: string;
    banner?: string;
    placeholder?: string;
    file?: string;
    reference_id?: string | number;
    profile?: {
      id?: string | number;
      org_type?: string;
    };
    profiles?: Array<{
      id?: string | number;
      org_type?: string;
    }>;
  };
}

const CreativeDirectory: React.FC<CreativeDirectoryProps> = ({ data }) => {

  const profile = data.profile || (data.profiles && data.profiles[0]);

  const getBadgeInfo = () => {
    if (profile?.org_type === 'industry') {
      return {
        type: 'industry',
        text: 'Industry',
        color: 'bg-codeblue'
      };
    } else if (profile?.org_type === 'university' || profile?.org_type === 'institute') {
      return {
        type: 'university',
        text: 'University',
        color: 'bg-purple-500'
      };
    } else {

      return {
        type: data.type,
        text: data.type.charAt(0).toUpperCase() + data.type.slice(1),
        color: 'bg-gray-500'
      };
    }
  };

  const badgeInfo = getBadgeInfo();

  return (
    <Card className='p-0 relative bg-[#323232] border border-[#323232] h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 overflow-hidden'>
      <CardHeader className='px-3 bg-white'>
        <div className='h-[183px] bg-contain rounded-t-lg bg-center bg-no-repeat' style={{ backgroundImage: `url(${data.banner ?? data.file ?? ''})` }}></div>
      </CardHeader>
      <CardContent className=''>
        <h4 className='mb-2 line-clamp-1 text-white'>{data.name ?? data.display_name}</h4>
      </CardContent>
      <CardFooter className='px-4 pb-6 flex flex-row gap-4 items-center justify-between'>
        <p className='text-white line-clamp-3'>{data.about ?? data.placeholder ?? ''}</p>
        <Button className='bg-[#7FBC42] hover:bg-[#7FBC42] text-black w-24 h-24 flex flex-col items-center justify-center gap-2 py-2 shrink-0'>
          <Link
            to={
              profile?.org_type === 'industry' || data.type === 'industry'
                ? `/collaborate/industries/${profile?.id || data.reference_id}`
                : `/collaborate/infocus/profile/${profile?.id || data.reference_id}`
            }
            className='flex flex-col items-center justify-center gap-2 text-center'
          >
            <MoveRight size={16} />
            View<br />Profile
          </Link>
        </Button>
      </CardFooter>
      <Badge className={`${badgeInfo.color} text-white absolute top-0 right-0 rounded-md rounded-ss-none rounded-ee-none p-1 px-2 capitalize`}>
        {data.type}
      </Badge>
    </Card>
  )
}

export default CreativeDirectory