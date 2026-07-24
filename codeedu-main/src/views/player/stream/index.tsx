import React, { useEffect, useRef, useState, useCallback } from 'react';
// import HlsPlayer, { HlsPlayerHandle } from './HlsPlayer';
import VideoJsHlsPlayer, { VideoJsHlsPlayerHandle } from "./VideoJsHlsPlayer";
import Loading from '@/components/shared/Loading';
import { CommonModuleContent } from '@/@types/learner/Courses';
import { saveContentCompletion } from '@/services/learner/CourseService';
import VideoPlayer from '../video';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

interface StreamingProps {
  videoId: string;
  content: CommonModuleContent;
}

const Streaming: React.FC<StreamingProps> = ({ videoId, content }) => {
  const [playerType, setPlayerType] = useState<'hls' | 'mp4'>('hls');
  const [loading, setLoading] = useState(true);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const playerRef = useRef<VideoJsHlsPlayerHandle | null>(null);
  const [completion, setCompletion] = useState<number>(
    Number(content?.completion ?? 0)
  );
  
  const trackedContentId = useRef<number | string | null>(null);
  const trackedComplete = useRef<boolean>(false);
  const trackedNotComplete = useRef<boolean>(false);
  const mountTime = useRef<number>(Date.now());

  // If completion is 100, they can seek. If not, they can't (first time view).
  const disableSeeking = completion < 100;

  // fetch stream URL
  useEffect(() => {
    mountTime.current = Date.now();
    setLoading(true);
    fetch(`https://mediaflux.edulystventures.com/videos/${videoId}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.videostate === true) {
          setPlayerType('hls');
        } else {
          setPlayerType('mp4');
        }
        setStreamUrl(data.videoURL);
      })
      .catch((error) => {
        console.error('Error fetching video URL:', error);
      })
      .finally(() => {
        setLoading(false);
      });
      
    const currentContent = content;
    if (trackedContentId.current !== currentContent.program_content_id) {
      mixpanelService.track('Course Content Viewed', {
        content_type: 'stream',
        content_name: currentContent.title,
        course_id: currentContent.program_id,
        content_id: currentContent.program_content_id
      });
      trackedContentId.current = currentContent.program_content_id;
      trackedComplete.current = false;
      trackedNotComplete.current = false;
    }

    return () => {
      if (Date.now() - mountTime.current < 200) return;

      if (trackedContentId.current === currentContent.program_content_id) {
        if (!trackedComplete.current && !trackedNotComplete.current) {
            mixpanelService.track('Video not completed', {
                content_type: 'stream',
                content_name: currentContent.title,
                course_id: currentContent.program_id,
                content_id: currentContent.program_content_id
            });
            trackedNotComplete.current = true;
        }
      }
    };
  }, [videoId, content]);

  const getDuration = () => {
    if (!playerRef.current) return 0;
    try {
      return playerRef.current.videoLength();
    } catch (e) {
      console.error('Error getting duration:', e);
      return 0;
    }
  };

  const getCurrentTime = () => {
    if (!playerRef.current) return 0;
    try {
      return playerRef.current.getCurrentProgress() ?? 0;
    } catch (e) {
      console.error('Error getting current time:', e);
      return 0;
    }
  };

  const isPlaying = () => {
    if (!playerRef.current) return false;
    try {
      return playerRef.current.currentPlayState();
    } catch (e) {
      console.error('Error getting play state:', e);
      return false;
    }
  };

  const isSaving = useRef(false);

  const saveProgress = useCallback((forcePercentage?: number) => {
    if (!content?.program_content_id) return;
    if (isSaving.current) return;
    if (completion >= 100 && typeof forcePercentage !== 'number') return;

    let percentage = 0;
    if (typeof forcePercentage === 'number') {
      percentage = forcePercentage;
    } else {
      if (!playerRef.current) return;
      const currentTime = getCurrentTime();
      const duration = getDuration();
      const playing = isPlaying();

      if (!playing && !forcePercentage) return;
      if (!currentTime || !duration || duration === 0) return;

      percentage = Math.floor((currentTime / duration) * 100);

      // If we are very close to the end (e.g. within 2 seconds), mark as 100%
      if (duration - currentTime < 2) {
        percentage = 100;
      }
    }

    // prevent redundant saves
    if (percentage < 100) {
      if (percentage <= completion || percentage - completion < 2) {
        return;
      }
    } else if (completion >= 100) {
      // already saved 100
      return;
    }

    isSaving.current = true;
    const formData = new FormData();
    formData.append('bookmark', percentage.toString());
    formData.append('content_id', content.program_content_id.toString());
    formData.append('completion', percentage.toString());

    saveContentCompletion(formData)
      .then((res) => {
        console.log('completion saved', res);
        setCompletion(percentage);

        if (percentage === 100) {
            if (!trackedComplete.current) {
                mixpanelService.track('Video lecture completed', {
                    content_type: 'stream',
                    content_name: content.title,
                    course_id: content.program_id,
                    content_id: content.program_content_id
                });
                trackedComplete.current = true;
            }
        } else {
            if (!trackedNotComplete.current) {
                mixpanelService.track('Video not completed', {
                    content_type: 'stream',
                    content_name: content.title,
                    course_id: content.program_id,
                    content_id: content.program_content_id
                });
                trackedNotComplete.current = true;
            }
        }
      })
      .catch((err) => {
        console.error('Error saving completion', err);
      })
      .finally(() => {
        isSaving.current = false;
      });
  }, [completion, content?.program_content_id]);

  // interval – run every 10s
  useEffect(() => {
    if (!streamUrl || playerType !== 'hls' || completion >= 100) return;

    const interval = setInterval(() => {
      saveProgress();
    }, 10000);

    return () => clearInterval(interval);
  }, [streamUrl, playerType, saveProgress, completion]);

  if (loading || !streamUrl) {
    return (
      <div className="h-48">
        <Loading loading={true} />
      </div>
    );
  }

  return (
    <div>
      {playerType === 'hls' ? (
        <VideoJsHlsPlayer
          ref={playerRef}
          url={`https://mediaflux.edulystventures.com/${streamUrl}`}
          autoPlay={true}
          disableSeeking={disableSeeking}
          onEnded={() => saveProgress(100)}
        />

      ) : (
        <VideoPlayer content={content} />
      )}
    </div>
  );
};

export default Streaming;


// This code comment for regarding to chnage some content completion issue : 
// if user do assign video content and its completion 25 but video length is 20 min then 
// user can't able to complete the content 
// so we need to change the completion of content to 100%




// import React, { useEffect, useRef, useState, useCallback } from 'react';
// // import HlsPlayer, { HlsPlayerHandle } from './HlsPlayer';
// import VideoJsHlsPlayer, { VideoJsHlsPlayerHandle } from "./VideoJsHlsPlayer";
// import Loading from '@/components/shared/Loading';
// import { CommonModuleContent } from '@/@types/learner/Courses';
// import { saveContentCompletion } from '@/services/learner/CourseService';
// import VideoPlayer from '../video';

// interface StreamingProps {
//   videoId: string;
//   content: CommonModuleContent;
// }

// const Streaming: React.FC<StreamingProps> = ({ videoId, content }) => {
//   const [playerType, setPlayerType] = useState<'hls' | 'mp4'>('hls');
//   const [loading, setLoading] = useState(true);
//   const [streamUrl, setStreamUrl] = useState<string | null>(null);
//   const playerRef = useRef<VideoJsHlsPlayerHandle | null>(null);
//   const [completion, setCompletion] = useState<number>(
//     Number(content?.completion ?? 0)
//   );

//   // fetch stream URL
//   useEffect(() => {
//     setLoading(true);
//     fetch(`https://mediaflux.edulystventures.com/videos/${videoId}`, {
//       method: 'GET',
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.videostate === true) {
//           setPlayerType('hls');
//         } else {
//           setPlayerType('mp4');
//         }
//         setStreamUrl(data.videoURL);
//       })
//       .catch((error) => {
//         console.error('Error fetching video URL:', error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [videoId]);

//   const getDuration = () => {
//     if (!playerRef.current) return 0;
//     try {
//       return playerRef.current.videoLength();
//     } catch (e) {
//       console.error('Error getting duration:', e);
//       return 0;
//     }
//   };

//   const getCurrentTime = () => {
//     if (!playerRef.current) return 0;
//     try {
//       return playerRef.current.getCurrentProgress() ?? 0;
//     } catch (e) {
//       console.error('Error getting current time:', e);
//       return 0;
//     }
//   };

//   const isPlaying = () => {
//     if (!playerRef.current) return false;
//     try {
//       return playerRef.current.currentPlayState();
//     } catch (e) {
//       console.error('Error getting play state:', e);
//       return false;
//     }
//   };

//   const saveProgress = useCallback(() => {
//     if (!content?.program_content_id) return;
//     if (!playerRef.current) return;

//     const currentTime = getCurrentTime();
//     const duration = getDuration();
//     const playing = isPlaying();

//     if (!playing) return;
//     if (!currentTime || !duration || duration === 0) return;
//     if (currentTime >= duration) return;

//     const percentage = Math.floor((currentTime / duration) * 100);

//     // log to debug "stuck at 1 min"
//     console.log(
//       '[PROGRESS]',
//       { currentTime, duration, percentage, completion }
//     );

//     // prevent spamming + compare percentage with percentage
//     if (percentage <= completion || percentage - completion < 2) {
//       return;
//     }

//     const formData = new FormData();
//     formData.append('bookmark', percentage.toString());
//     formData.append('content_id', content.program_content_id.toString());
//     formData.append('completion', percentage.toString());

//     saveContentCompletion(formData)
//       .then((res) => {
//         console.log('completion saved', res);
//         setCompletion(percentage);
//       })
//       .catch((err) => {
//         console.error('Error saving completion', err);
//       });
//   }, [completion, content?.program_content_id]);

//   // interval – run every 10s
//   useEffect(() => {
//     if (!streamUrl || playerType !== 'hls') return;

//     const interval = setInterval(() => {
//       saveProgress();
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [streamUrl, playerType, saveProgress]);

//   if (loading || !streamUrl) {
//     return (
//       <div className="h-48">
//         <Loading loading={true} />
//       </div>
//     );
//   }

//   return (
//     <div>
//       {playerType === 'hls' ? (
//         // <HlsPlayer
//         //   ref={playerRef}
//         //   url={`https://mediaflux.edulystventures.com/${streamUrl}`}
//         //   // autoPlay={true}
//         // />
//         <VideoJsHlsPlayer
//   ref={playerRef}
//   url={`https://mediaflux.edulystventures.com/${streamUrl}`}
//   autoPlay={true}
// />

//       ) : (
//         <VideoPlayer content={content} />
//       )}
//     </div>
//   );
// };

// export default Streaming;
