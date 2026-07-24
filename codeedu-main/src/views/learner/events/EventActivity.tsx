import Loading from '@/components/shared/Loading';
import { fetchEventById } from '@/services/collaborate/EventService';
import { useEventDetailsStore as usePublicEventStore } from '@/store/public/EventStore';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from 'react-router-dom';
import Content from './activities/Content';
import { Alert } from '@/components/ui';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { ContentData } from '@/@types/collaborate/events';
import { Calendar, Loader } from 'lucide-react';
import { formatDate } from '@/utils/commonDateFormat';
import { Button } from '@/components/ui/ShadcnButton';
import { FaChevronRight } from 'react-icons/fa6';


const EventActivity: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setEventDetails: setPublicEventDetail, eventdetails, error, setError, loading, setLoading } = usePublicEventStore();
  const [showBannerModel, setShowBannerModel] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>('');
  const shareUrl = `${`https://https://encode.codeedu.co/event-activity/${id}`}`;
  QRCode.toCanvas(canvasRef?.current, shareUrl, { width: 160 });

  const loadEventDetails = useCallback(async () => {
    if (!id || isNaN(Number(id))) {
      toast.error('Event ID is not available');
      navigate('/events-list');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetchEventById(id);
      setPublicEventDetail(response);
    } catch (err) {
      setError('Failed to load event details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, setLoading, setPublicEventDetail, setError, navigate]);

  useEffect(() => {
    loadEventDetails();
  }, [loadEventDetails]);


  const showContentDetails = (content: ContentData) => {
    if (eventdetails?.competitions_details?.program?.com_status?.program_status == "Scheduled") {
      toast.error('Competition not started yet');
      return;
    }

    // check compitition start or not
    if (content?.start_date && new Date(content.start_date) > new Date()) {
      toast.error('Activity not started yet');
      return;
    }

    // is not joined
    // if (!eventdetails?.is_assigned) {
    //   toast.error('You have not joined this activity');
    //   return;
    // }

    navigate(`/event-activity/${id}/content/${content.id}`);
  };

  const [isJoiningMeeting, setIsJoiningMeeting] = React.useState(false);

  const joinMeetingNow = async (sessionId: number) => {
    setIsJoiningMeeting(true);
    navigate(`/zoom/meeting/${sessionId}`);
  };


  if (loading) return <Loading loading={loading} />;
  if (error) return <Alert title={error} type="danger" />;



  return (
    <>
      {/* <div className='flex gap-3 justify-start items-center'>
        <div className="text-primary cursor-pointer dark:text-white" onClick={() => navigate(-1)}>
          <ArrowLeft size={28} />
        </div>
        <h1 className="text-3xl font-bold text-start dark:text-primary text-primary">Event Details</h1>
      </div> */}

      {/* Event Banner */}
      {/* <div className="bg-white dark:bg-gray-800 mt-4 rounded-lg shadow-md overflow-hidden cursor-pointer mb-10">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full cursor-pointer" onClick={() => setShowBannerModel(true)}>
            <img src={eventdetails?.competitions_details?.program?.image || ""} alt="event" className="h-full md:h-96 w-full object-contain md:object-cover" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4 border-l border-gray-200 dark:border-gray-700 dark:bg-gray-900 bg-white opacity-90">
          <h6 className="font-bold text-3xl text-gray-800 dark:text-white">{eventdetails?.competitions_details?.program?.name}</h6>


          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600">{eventdetails?.competitions_details?.program?.com_status?.program_status}</span>
            <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600">{eventdetails?.competitions_details?.program?.competition_level}</span>
            <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-2"><Calendar size={16} /> {formatedApiDate(eventdetails?.competitions_details?.program?.start_date)} - {formatedApiDate(eventdetails?.competitions_details?.program?.end_date)}</span>
          </div>

          {eventdetails?.competitions_details?.program?.event_details?.domain_name && <h5 className="font-bold text-gray-800 dark:text-white mb-0">Domain: <span className="px-2 py-1 text-md font-semibold ">{eventdetails?.competitions_details?.program?.event_details?.domain_name}</span></h5>}
          {eventdetails?.competitions_details?.program?.event_details?.functional_domain && <h5 className="font-bold text-gray-800 dark:text-white mb-0">Functional Domain: <span className="px-2 py-1 text-md font-semibold ">{eventdetails?.competitions_details?.program?.event_details?.functional_domain}</span></h5>}

          <div className='flex flex-col md:flex-row gap-4 items-start relative'>
            <SafeHtml html={eventdetails?.competitions_details?.program?.description} />
            <div className="flex-shrink-0 position-absolute right-0">
              <canvas ref={canvasRef} />
            </div>
          </div>
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="mt-4 text-white"
                  variant="default"
                  disabled={!!eventdetails?.is_assigned || isCompleted}
                >
                  {isCompleted ? "Event Completed" : eventdetails?.is_assigned ? "Already Joined" : "Join Event"}
                </Button>
              </AlertDialogTrigger>
              {!eventdetails?.is_assigned && !isCompleted && (
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Do you really want to join this event? You won’t be able to undo this action.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className=" text-white" onClick={JoinThisEventHandler}>
                      Yes, Join
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              )}
            </AlertDialog>
          </div>
        </div>
      </div> */}

      <h1 className="text-3xl font-bold mb-3 text-start dark:text-primary text-primary">Content Library</h1>
      <div className="space-y-4">
        {eventdetails?.competitions_details?.program?.contents?.length ? (
          eventdetails.competitions_details.program.contents.map((content, index) => (
            <div key={index}>
              <div className="relative border-l-2 border-primary p-6 bg-white py-3 dark:bg-gray-800 dark:border-primary cursor-pointer flex justify-between items-center">
                <div onClick={() => showContentDetails(content)}>
                  <div className='flex justify-between items-center mb-2'>
                    <h3 className='dark:text-primary text-primary'>{content.title}</h3>
                  </div>
                  <p className='text-justify mb-3 line-clamp-3'>{content.description}</p>
                  <div className="flex items-center mt-3 gap-2">
                    <span className="px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600 flex items-center gap-1">
                      <Calendar size={16} /> {
                        formatDate(content?.start_date, 'DD MMM YYYY, h:mm A')
                      }
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-lg border border-gray-600`}>
                      {content?.difficulty_level}
                    </span>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  {
                    content?.content_type === 'zoomclass' && <Button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark" onClick={() => joinMeetingNow(content.id)}>
                      Join Meeting {isJoiningMeeting && <Loader className="ml-2 animate-spin" size={16} />}
                    </Button>
                  }
                  <FaChevronRight size={24} className='text-primary' />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">No Activities found</p>
        )}
      </div>

      {/* Popup Banner Model */}
      {showBannerModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setShowBannerModel(false)}>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg relative md:w-1/2 w-11/12">
            <img src={eventdetails?.competitions_details?.program?.image || ''} alt="event" className="h-96 w-full object-cover" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-primary text-lightPrimary mt-3">{eventdetails?.competitions_details?.program?.name}</h2>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: eventdetails?.competitions_details?.program?.description }}
            >
            </div>
            <button className="absolute top-2 right-5 border-2 cursor-pointer border-primary mt-3 px-2 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600" onClick={() => setShowBannerModel(false)}>
              <RxCross2 />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EventActivity;