import { Alert } from '@/components/ui';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventActivityContentStore } from '@/store/learner/EventStore';

// all activities
import { fetchEventDetails } from '@/services/learner/EventDetailsService';
import { fetchEvent } from '@/services/learner/EventService';
import { useEventDetailsStore } from '@/store/learner/EventDetailsStore';

import Loading from '@/components/shared/Loading';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Player from './Player';
import { ContentData } from '@/@types/collaborate/events';
import Breadcrumb from '@/components/breadcrumb';

const Activity: React.FC = () => {

  const { event_id, content_id } = useParams<{ event_id: string, content_id: string }>();
  const navigate = useNavigate();

  if (!event_id || !content_id) {
    return <Alert title='Event Activity Not Found.' type='danger' />
  }

  const [nextActivity, setNextActivity] = useState<ContentData | null>(null);
  const [prevActivity, setPrevActivity] = useState<ContentData | null>(null);
  const [cureentActivityIndex, setCurrentActivityIndex] = useState<number>(0);

  const { content, setContent } = useEventActivityContentStore();
  const { eventDetails, setEventDetails, setError, loading, setLoading } = useEventDetailsStore();

  const loadContent = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const events = await fetchEvent(null);
      const currentEvent = events.find((event) => event.id.toString() === event_id);
      const eventType = currentEvent?.event_category_name ?? currentEvent?.event_details?.event_category_name ?? null;
      const response = await fetchEventDetails(event_id, eventType);
      const contents = response.competitions_details?.program?.contents || [];
      if (contents.length > 0) {
        let found = false;
        contents.forEach((item: ContentData, index: number) => {
          if (item.id.toString() === content_id?.toString()) {
            setContent(item);
            setCurrentActivityIndex(index);
            setPrevActivity(index > 0 ? contents[index - 1] : null);
            setNextActivity(index < contents.length - 1 ? contents[index + 1] : null);
            found = true;
          }
        });

        // Default to first content if not found or no contentId
        if (!found && !content_id) {
          navigate(`/event-activity/${event_id}/content/${contents[0].id}`, { replace: true });
        }
      }
      setEventDetails(response);
    } catch (err) {
      console.log(err);
      setError('Failed to load event activity content. Please try again.');
    } finally {
      setLoading(false);
    }

  }, [event_id, content_id, setLoading, setError, setEventDetails, setContent, setPrevActivity, setNextActivity, setCurrentActivityIndex]);

  useEffect(() => {
    loadContent();
  }, [content_id, loadContent]);

  const nextActivityHandler = () => {
    if (nextActivity) {
      navigate(`/event-activity/${event_id}/content/${nextActivity.id}`);
    }
  };

  const prevActivityHandler = () => {
    if (prevActivity) {
      navigate(`/event-activity/${event_id}/content/${prevActivity.id}`);
    }
  };

  if (loading || !content || !eventDetails) {
    return <Loading loading={loading} />
  }

  const program = eventDetails?.competitions_details?.program;
  const category = program?.event_details?.event_category_name;
  const isMustAttend = category === 'Career Drive' || category === 'Immersion Programs' || program?.event_details?.event_category_id === '3';

  const parentLabel = isMustAttend ? 'Must Attend' : 'On the Agenda';
  const parentPath = isMustAttend ? '/collaborate/must-attend' : `/collaborate/agenda${category ? `?category=${category}` : ''}`;
  const detailsPath = isMustAttend ? `/must-attend/details/${event_id}` : `/agenda/details/${event_id}`;

  const breadcrumbItems = [
    { label: parentLabel, path: parentPath },
    { label: category || 'Details', path: `${detailsPath}${category ? `?category=${category}` : ''}` },
    { label: program?.name || 'Activity' }
  ];

  return (
    <div className="container mx-auto">
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
        <div className='md:col-span-12'>
          {/* <h1 className="text-2xl font-bold dark:text-primary text-primary">Event Activity</h1> */}
        </div>
        <div className='md:col-span-9'>
          <Player content={content} />
          <div className='mt-4'>
            <h1 className="text-2xl font-bold mb-2 text-start dark:text-primary text-primary">
              Instructions
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                {`What's`} In
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {eventDetails?.competition_instructions?.whats_in}
              </p>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                Instructions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line mb-4">
                {eventDetails?.competition_instructions?.instructions}
              </p>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                FAQ
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {eventDetails?.competition_instructions?.faq}
              </p>
            </div>
          </div>
        </div>
        <div className='md:col-span-3'>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sticky top-20">
            {/* listing */}
            {
              <div>
                <div className='flex justify-between items-center'>
                  {/* next and back button */}
                  {prevActivity && (
                    <div className='flex justify-start w-full cursor-pointer'>
                      <a className="px-2 py-2 text-primary rounded-lg transition hover:transform hover:scale-110"
                        onClick={prevActivityHandler}>
                        <FaChevronLeft size={24} />
                      </a>
                    </div>
                  )}
                  <h2 className="text-2xl font-bold dark:text-primary text-primary">Activities</h2>
                  {nextActivity && (
                    <div className='flex justify-end w-full cursor-pointer'>
                      <a className="px-2 py-2 text-primary rounded-lg transition hover:transform hover:scale-110" onClick={nextActivityHandler}>
                        <FaChevronRight size={24} />
                      </a>
                    </div>
                  )}
                </div>
                {(eventDetails?.competitions_details?.program?.contents || []).map((activity: ContentData, index: number) => {
                  return (
                    <a key={index} className='cursor-pointer' onClick={() => {
                      navigate(`/event-activity/${event_id}/content/${activity.id}`);
                    }}>
                      <div key={index} className={`border border-primary rounded-lg shadow-md p-3 mt-3 flex justify-between items-center ${content.id.toString() === activity.id.toString() ? 'bg-primary' : ''}`}>
                        <h3 className={`text-lg font-semibold line-clamp-1 ${content?.id.toString() === activity.id.toString() ? 'dark:text-dark text-white' : 'dark:text-primary text-primary'}`}>{index + 1}. {activity.title}</h3>
                        <FaChevronRight size={24} className='text-primary' />
                      </div>
                    </a>
                  )
                })}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Activity