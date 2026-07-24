import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  value, 
  onValueChange,
  className = ''
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: 'Courses' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'skills', label: 'Skills & Badges' },
  ];

  return (
    <TabsList className={`bg-gray-300 dark:bg-[#5A5A5A] rounded-xl overflow-hidden p-0 h-auto ${className}`}>
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.id}
          value={tab.id}
          
          className={`rounded-none text-black dark:text-white py-3 px-5 transition-all ${
            value === tab.id 
              ? 'bg-primary text-white font-semibold' 
              : 'hover:bg-gray-400 hover:dark:bg-gray-600'
          }`}
          onMouseDown={() => onValueChange(tab.id)}
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default DashboardTabs;