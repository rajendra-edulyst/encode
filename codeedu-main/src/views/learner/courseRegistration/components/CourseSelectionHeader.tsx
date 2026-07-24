import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { fetchNepCourseTimer } from '@/services/learner/NepCourseService';

type Props = {
  selected: number;
  total: number;
  onExpire?: () => void;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const CourseSelectionHeader: React.FC<Props> = ({ selected, total, onExpire }) => {
  const progress = (selected / total) * 100;
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const initTimer = async () => {
      try {
        const seconds = await fetchNepCourseTimer();
        if (!seconds || seconds <= 0) {
          setExpired(true);
          setTimeLeft(0);
          onExpire?.();
        } else {
          setTimeLeft(seconds);
        }
      } catch (error) {
        console.error('Failed to load timer', error);
        setExpired(true);
        setTimeLeft(0);
        onExpire?.();
      }
    };

    initTimer();
  }, []);
  

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setExpired(true);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onExpire]);

  return (
    <div
        className={`w-full p-4 rounded-xl transition-colors duration-300 ${
            expired ? 'bg-red-50 border border-red-500' : 'bg-white'
        }`}
        >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Courses Selection Wizard
        </h2>

        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center text-sm font-bold ${
              expired ? 'text-red-600' : 'text-green-600'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {timeLeft === null
              ? 'Loading...'
              : expired
              ? 'Time Expired'
              : `Time Left: ${formatTime(timeLeft)}`}
          </div>

          <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-700 rounded-full">
            {selected}/{total} Selected
          </span>
        </div>
      </div>

      <div className="w-full bg-orange-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-orange-500 h-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {expired && (
        <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md flex items-center gap-2 text-sm">
          <AlertTriangle className="w-5 h-5" />
          <span>
            {timeLeft === 0
              ? 'Timer is unavailable or expired. Please contact the registrar.'
              : 'Time has expired! Please contact the registrar for assistance.'}
          </span>
        </div>
      )}
    </div>
  );
};

export default CourseSelectionHeader;
