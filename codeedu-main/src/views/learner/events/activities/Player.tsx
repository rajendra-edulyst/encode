import React, { lazy } from 'react';
import { Calendar, Loader } from 'lucide-react';
import { CiStopwatch } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { ContentData } from '@/@types/collaborate/events';
import { Button } from '@/components/ui/ShadcnButton';

const Assignments = lazy(() => import('@/views/player/assignment'));

type PlayerProps = {
  content: ContentData;
};

const getYoutubeEmbedUrl = (url: string) => {
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return videoIdMatch
    ? `https://www.youtube.com/embed/${videoIdMatch[1]}?modestbranding=1&rel=0&showinfo=0&disablekb=1`
    : null;
};

const Player: React.FC<PlayerProps> = ({ content }) => {
  const navigate = useNavigate();
  const youtubeEmbedUrl = content?.content_type === 'video_yts' ? getYoutubeEmbedUrl(content.content ?? '') : null;
  const isPdf = content?.content_type === 'notes';
  const isAssignment = content?.content_type === 'assignment';
  const isAssessment = content?.content_type === 'assessment';
  const isZoomClass = content?.content_type === 'zoomclass';

  const [isJoiningMeeting, setIsJoiningMeeting] = React.useState<boolean>(false);

  const [uploadAssignmentDialog, setUploadAssignmentDialog] = React.useState<boolean>(false);

  // console.log('Content Data:', content);

  const joinMeetingNow = async (sessionId: number) => {
    setIsJoiningMeeting(true);
    navigate(`/zoom/meeting/${sessionId}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className='mb-3 border-b border-gray-200 dark:border-gray-600 pb-3'>
        <h1 className="text-2xl font-bold dark:text-primary text-primary capitalize">{content?.title}</h1>
        <div className='flex items-center gap-2 mt-2'>
          <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-1">
            <Calendar size={16} /> {content?.start_date} - {content?.end_date}
          </span>
          <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600">
            {content?.difficulty_level}
          </span>
          <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-1">
            <CiStopwatch size={16} /> {content?.expected_duration}
          </span>
        </div>
      </div>

      {/* YouTube Video Player */}
      {youtubeEmbedUrl ? (
        <div className="mb-6">
          <iframe
            allowFullScreen
            className="w-full h-64 md:h-[30rem] rounded-lg"
            src={youtubeEmbedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      ) :
        isZoomClass ? (
          <div className="mb-6">
            <Button onClick={() => joinMeetingNow(content?.id ?? 0)} className='text-black'>
              Join Zoom Class {isJoiningMeeting && <Loader className="ml-2 animate-spin" size={16} />}
            </Button>
          </div>
        ) : isPdf ? (
          // PDF Viewer using React-PDF
          <div className="mb-6 border border-gray-300 rounded-lg overflow-hidden">
            <div className="h-96 md:h-[30rem] overflow-auto">
              <iframe
                className="w-full h-full"
                src={`${content?.content}#toolbar=1`}
                title="PDF Viewer"
                frameBorder="0"
                allow="fullscreen"
              ></iframe>
            </div>
          </div>
        ) : isAssignment ? (
          <Assignments content_url={content?.url ?? null} content_id={content?.id} uploadAssignmentDialog={uploadAssignmentDialog} setUploadAssignmentDialog={setUploadAssignmentDialog} />
        ) : isAssessment ? (
          <div className="">
            <div className='flex justify-between items-center mb-3 border-b border-gray-200 dark:border-gray-600 pb-3'>
              <h1 className="text-xl font-semibold text-accent mb-3">Assessment</h1>
              <Link
                className="px-4 py-2 bg-primary hover:bg-primary-mild text-ac-dark rounded-lg transition"
                to={`/assessment/attempt/instructions/${content?.program_id}/${content?.id}`}> Start Assessment </Link>
              {/* http://localhost:5173/assessment/attempt/instructions/5379/6841 */}
              {/* http://localhost:5173/assessment/attempt/instructions/5379/6841 */}
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              This is an assessment activity. You will be evaluated based on your responses, and you will be graded accordingly. Please make sure you are ready before starting the assessment.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Click the button above to start the assessment.
            </p>
          </div>
        ) : (
          content?.content && (
            <a href={content?.content} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-primary hover:bg-primary-mild text-white rounded-lg transition">
              View Content
            </a>
          )
        )}
      <p className="text-gray-700 dark:text-gray-300 mt-4" dangerouslySetInnerHTML={{ __html: content?.description }}></p>
    </div>
  );
};

export default Player;
