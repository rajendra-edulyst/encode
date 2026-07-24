import { useSessionUser } from '@/store/authStore';
import { FACULTY, ADMIN } from '@/constants/roles.constant';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMentorshipStatus } from '@/hooks/data/create/useMentor';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

interface DashboardSwitcherProps {
  activeDashboard: 'learner' | 'instructor' | 'mentor';
  onSwitch?: (type: string) => void;
  className?: string;
}

const DashboardSwitcher: React.FC<DashboardSwitcherProps> = ({
  activeDashboard,
  onSwitch,
  className = ''
}) => {
  const navigate = useNavigate();
  const { profile, user, setProfile } = useSessionUser();
  const { data: mentorStatus } = useMentorshipStatus();

  const roleMapping: Record<string, 'creator' | 'presenter' | 'mentor'> = {
    learner: 'creator',
    instructor: 'presenter',
    mentor: 'mentor'
  };



  const handleDashboardSwitch = (type: string) => {
    mixpanelService.track('Dashboard Role Switched', {
      target_role: type,
      current_role: profile
    });

    const targetRole = roleMapping[type];
    const currentProfileLower = profile?.toLowerCase();

    // Check if we need to switch profile
    const needsSwitch =
      (type === 'learner' && currentProfileLower !== 'creator' && profile !== null) ||
      (type === 'instructor' && currentProfileLower !== 'presenter') ||
      (type === 'mentor' && currentProfileLower !== 'mentor');

    if (needsSwitch) {
      if (type === 'mentor') {
        const isApproved = mentorStatus?.status === 'approved' || (mentorStatus as any)?.approved_by === 1;
        if (!user?.is_mentor && !isApproved) {
          navigate('/become-mentor');
          return;
        }
      }
      setProfile(targetRole);
    }

    if (onSwitch) {
      onSwitch(type);
    } else {
      navigate(`/dashboard/${type}`);
    }
  };

  const canUseInstructor = user?.role === FACULTY || user?.role === ADMIN;
  const canUseLearner = user?.role !== FACULTY;

  const dashboardOptions = [
    {
      id: 'learner',
      label: 'Learner',
      icon: '/img/icons/school.svg',
      alt: 'Learner Dashboard',
      description: 'View your learning progress',
      enabled: canUseLearner
    },
    {
      id: 'instructor',
      label: 'Instructor',
      icon: '/img/icons/co_present.svg',
      alt: 'Instructor Dashboard',
      description: 'Manage your courses and students',
      enabled: canUseInstructor
    },
    {
      id: 'mentor',
      label: 'Mentor',
      icon: '/img/icons/mentor.svg',
      alt: 'Mentor Dashboard',
      description: 'Guide and mentor learners',
      enabled: true
    }
  ];

  return (
    <div className={`flex gap-4 sm:gap-6 ${className}`}>
      {dashboardOptions.map((option) => {
        const isActive = activeDashboard === option.id;
        const isEnabled = option.enabled;

        return (
          <div
            key={option.id}
            className="text-center group relative"
            title={isEnabled ? option.description : `${option.description} (Switch Profile)`}
          >
            <button
              className={`w-[60px] h-[60px] rounded-lg flex items-center justify-center transition-all ${isActive
                ? 'border-2 border-primary shadow-md scale-105 bg-gray-300 dark:bg-gray-700'
                : !isEnabled
                  ? 'border border-gray-200 dark:border-gray-700 bg-gray-800/50 opacity-40 cursor-pointer contrast-50 hover:opacity-60'
                  : 'border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 hover:dark:bg-gray-600'
                }`}
              aria-label={`Switch to ${option.label} dashboard`}
              aria-pressed={isActive}
              onClick={() => option.enabled && handleDashboardSwitch(option.id)}
            >
              <img
                src={option.icon}
                alt={option.alt}
                className={`
    w-6 h-6 transition-transform duration-300
    ${isActive ? 'brightness-0 invert' : ''}
    dark:brightness-0 dark:invert
  `}
              />
            </button>
            <p className={`text-[10px] mt-1 font-medium ${isActive ? 'text-primary' : !isEnabled ? 'text-gray-600' : 'text-gray-400'
              }`}>
              {option.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardSwitcher;