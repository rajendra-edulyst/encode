import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStatCount } from '@/hooks/data/faculty/useDashboard';
// import { useStatCountStore } from '@/store/faculty/____DashboardStore';
import { Video, NotebookText, Clipboard, BookOpenText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: number | undefined;
  link: string;
  loading: boolean;
  icon: React.ReactNode;
  iconGradient: string;
  extratext?: string;
  totalcount?: string;
}

const StatCard = ({ label, value, link, loading, icon, iconGradient, totalcount, extratext }: StatCardProps) => (
  <Link to={link}>
    <Card className="rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-start">
      <CardContent className='flex px-4 py-2 pb-0 justify-between w-full'>
        {/* Icon with gradient background */}
        <div className={`w-16 h-16 relative bottom-6 rounded-lg flex items-center justify-center text-white ${iconGradient} shadow-md`}>
          {icon}
        </div>
        {/* Text content */}
        <div className="flex flex-col justify-center items-center ">
          <h6 className="text-sm text-gray-500 font-medium dark:text-white">{label}</h6>
          {!value && loading ? (
            <Skeleton className="h-5 w-28 mt-2" />
          ) : (
            <p className="text-2xl font-semibold text-gray-800 mt-1 dark:text-white">{value}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className='border-t border-gray-200 gap-2 rounded-md rounded-t-none w-full mt-1 p-2 flex flex-col items-start min-h-14'>
        <p className='text-xs text-gray-500 dark:text-white'>{totalcount}</p>
        <p className='text-xs text-gray-500 dark:text-white'>{extratext}</p>
      </CardFooter>
    </Card>
  </Link>
);

const StatCount = () => {

  const { data: statCount, isLoading: loading, isError: error } = useDashboardStatCount();
  const lastClassDate = statCount?.liveclass?.lastclassdatetime?.split(' ')[0] || '-';

  if (error) return null;

  const items = [
    {
      label: 'Subjects',
      value: statCount?.program,
      link: '/dashboard/instructor?tab=courses-sessions#courses-section',
      icon: <NotebookText size={24} />,
      iconGradient: 'bg-gradient-to-br from-[#00a8e9] to-[#0077b6]',
      extratext: 'View All',
    },
    {
      label: 'Classes',
      value: Number(statCount?.liveclass?.completed) || 0,
      link: '/dashboard/instructor?tab=courses-sessions#sessions-section',
      icon: <Video size={24} />,
      iconGradient: 'bg-gradient-to-br from-[#e60086] to-[#a8005c]',
      totalcount: `Total: ${statCount?.liveclass.total ?? 0}`,
      extratext: `Last Class : ${lastClassDate}`,
    },
    // {
    //   label: 'Assessments',
    //   value: Number(statCount?.assessment?.completed) || 0,
    //   link: '/calendar/sessions',
    //   icon: <Clipboard size={24} />,
    //   iconGradient: 'bg-gradient-to-br from-[#ffec00] to-[#bfa600]',
    //   totalcount: `Total: ${statCount?.assessment?.total ?? 0}`,
    //   extratext: `Last Assessment : ${statCount?.assessment?.lastassessment || '-'}`,
    // },
    {
      label: 'Assignments',
      value: Number(statCount?.assignment?.total) || 0,
      link: '/dashboard/instructor?tab=assignments#assignments-section',
      icon: <BookOpenText size={24} />,
      iconGradient: 'bg-gradient-to-br from-[#7fbc42] to-[#4e7c24]',
      totalcount: `Completed: ${statCount?.assignment?.completed ?? 0}`,
      extratext: `Last Assignment : ${statCount?.assignment?.lastassignment || '-'}`,

    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {items.map((item, idx) => (
          <StatCard
            key={idx}
            label={item.label}
            value={item.value}
            link={item.link}
            loading={loading}
            icon={item?.icon}
            iconGradient={item?.iconGradient}
            totalcount={item?.totalcount}
            extratext={item?.extratext}
          />
        ))}
      </div>
    </div>
  );
};

export default StatCount;