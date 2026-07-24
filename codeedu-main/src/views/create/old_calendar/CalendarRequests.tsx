import { useState, useEffect, useRef } from 'react';
import Breadcrumb from '@/components/breadcrumb'
import { mixpanelService } from '@/services/mixpanel/MixpanelService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/ShadcnButton"
import { Check, Ban, Video } from "lucide-react"
import { AcceptInvite, RejectInvite } from './services/CalendarService'
import { useQueryClient } from '@tanstack/react-query';
import { useMentoringSessions } from '@/hooks/data/faculty/useMentor'
import { useSessionUser } from '@/store/authStore'
import VideoPlayer from '@/views/player/video'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CommonModuleContent } from '@/@types/learner/Courses'

const CalendarRequests = () => {
  const queryClient = useQueryClient();
  const [processingInvites, setProcessingInvites] = useState<Set<number>>(new Set());
  const [activeContent, setActiveContent] = useState<CommonModuleContent | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const { profile: profileData } = useSessionUser();
  const userIsMentor = profileData === "mentor";
  const breadcrumbItems = [
    { label: 'Calendar', path: '/calendar' },
    { label: 'Mentoring Sessions' }
  ];

  const trackedPageView = useRef(false);
  useEffect(() => {
    if (!trackedPageView.current) {
      mixpanelService.track('Calendar Requests Page Viewed');
      trackedPageView.current = true;
    }
  }, []);

  const { data: mentoringSessions, refetch: loadEvents, isLoading } = useMentoringSessions();
  const events = mentoringSessions?.data || [];

  const handleAcceptInvite = async (inviteId: number) => {
    setProcessingInvites(prev => new Set(prev).add(inviteId));
    mixpanelService.track('Calendar Invite Accepted', { invite_id: inviteId });
    try {
      await AcceptInvite(inviteId);
      queryClient.invalidateQueries({ queryKey: ['pending-invites'] });
      await loadEvents();
    } catch (error) {
      console.error('Error accepting invite:', error);
    } finally {
      setProcessingInvites(prev => {
        const next = new Set(prev);
        next.delete(inviteId);
        return next;
      });
    }
  };

  const handelRejectInvite = async (inviteId: number) => {
    setProcessingInvites(prev => new Set(prev).add(inviteId));
    mixpanelService.track('Calendar Invite Rejected', { invite_id: inviteId });
    try {
      await RejectInvite(inviteId);
      queryClient.invalidateQueries({ queryKey: ['pending-invites'] });
      await loadEvents();
    } catch (error) {
      console.error('Error rejecting invite:', error);
    } finally {
      setProcessingInvites(prev => {
        const next = new Set(prev);
        next.delete(inviteId);
        return next;
      });
    }
  };

  const handlePlayRecording = (req: any) => {
    if (req.recording_url) {
      mixpanelService.track('Mentoring Session Recording Played', { 
        session_id: req.id, 
        title: req.title 
      });
      setActiveContent({
        url: req.recording_url,
        title: req.title,
        program_content_id: req.id,
      } as any);
      setIsPlayerOpen(true);
    }
  };


  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex items-center mb-3 justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Mentoring Sessions</h1>
          <p className="text-sm text-gray-500 dark:text-white">manage mentoring session</p>
        </div>
      </div>
      <Table className='bg-white dark:bg-card rounded-lg'>
        <TableHeader>
          <TableRow>
            <TableHead className='dark:text-white'>Request Id</TableHead>
            <TableHead className='dark:text-white'>Purpose</TableHead>
            <TableHead className='dark:text-white'>Start Date & Time</TableHead>
            <TableHead className='dark:text-white'>End Date & Time</TableHead>
            <TableHead className='dark:text-white text-center'>Invited By</TableHead>
            <TableHead className='dark:text-white text-center'>Session Status</TableHead>
            <TableHead className="dark:text-white text-center">Your Status</TableHead>
            <TableHead className="dark:text-white text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6">
                Loading requests...
              </TableCell>
            </TableRow>
          ) : events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6">
                No calendar requests found.
              </TableCell>
            </TableRow>
          ) : (
            [...events]
              .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())

              .map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.id}</TableCell>
                  <TableCell className='max-w-[200px]'><div
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                    }}
                  >
                    {req?.title}
                  </div></TableCell>


                  <TableCell>
                    {new Date(req.start).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(req.end).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell className='text-center'>{req.invited_by_name ? req.invited_by_name : "You"}</TableCell>
                  <TableCell className="text-center">
                    {new Date(req.end) < new Date() ? (
                      <span className="ml-2 px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs">Concluded</span>
                    ) : (
                      <span className="ml-2 px-2 py-1 rounded bg-blue-200 text-blue-700 text-xs">Upcoming</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {req.approval_status === 1 ? (
                      <span className="ml-2 px-2 py-1 rounded bg-green-200 text-green-700 text-xs">
                        Accepted
                      </span>
                    ) : req.approval_status === 0 ? (
                      <span className="ml-2 px-2 py-1 rounded bg-yellow-200 text-yellow-700 text-xs">
                        Pending
                      </span>
                    ) : req.approval_status === 2 ? (
                      <span className="ml-2 px-2 py-1 rounded bg-red-200 text-red-700 text-xs">
                        Rejected
                      </span>
                    ) : (
                      <span className="ml-2 px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs">
                        Unknown
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center flex justify-end gap-2">
                    {userIsMentor && (
                      <>
                        {new Date(req.end) > new Date() ? (
                          <>
                            {req.approval_status === 0 && (
                              <Button
                                disabled={processingInvites.has(req.id || 0)}
                                className='bg-transparent border border-success text-success hover:bg-success hover:text-white'
                                variant="default"
                                size="sm"
                                onClick={handleAcceptInvite.bind(null, req.id || 0)}
                              >
                                <Check />
                              </Button>
                            )}
                            {req.approval_status === 0 && (
                              <Button
                                disabled={processingInvites.has(req.id || 0)}
                                className='bg-transparent border border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                                variant="destructive"
                                size="sm"
                                onClick={handelRejectInvite.bind(null, req.id || 0)}
                              >
                                <Ban />
                              </Button>
                            )}
                          </>
                        ) : null}
                      </>

                    )}

                    <Button
                      disabled={!req.recording_url}
                      className={`bg-white text-gray-700 border hover:bg-gray-100 ${!req.recording_url ? 'opacity-50 cursor-not-allowed' : ''}`}
                      variant="default"
                      size="sm"
                      onClick={() => handlePlayRecording(req)}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-black border-none">
          <DialogHeader className="p-4 bg-card border-b">
            <DialogTitle className="text-white">{activeContent?.title}</DialogTitle>
          </DialogHeader>
          <div className="w-full flex items-center justify-center bg-black">
            {activeContent && <VideoPlayer content={activeContent} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarRequests;
