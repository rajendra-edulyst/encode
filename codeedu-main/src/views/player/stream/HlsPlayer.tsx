import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
} from 'react';
import Hls from 'hls.js';

export interface HlsPlayerHandle {
  getCurrentProgress: () => number | null;
  start: () => void;
  stop: () => void;
  togglePlay: () => void;
  setDefaultStart: (time?: number | null) => void;
  currentPlayState: () => boolean;
  videoLength: () => number;
}

interface HlsPlayerProps {
  url: string;
  autoPlay?: boolean;
}

const HlsPlayer = forwardRef<HlsPlayerHandle, HlsPlayerProps>(
  ({ url, autoPlay = true }, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);

    useImperativeHandle(ref, () => ({
      getCurrentProgress: () => videoRef.current?.currentTime ?? null,

      start: () => {
        if (videoRef.current) {
          void videoRef.current.play();
        }
      },

      stop: () => {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      },

      togglePlay: () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
          void videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      },

      setDefaultStart: (time) => {
        if (videoRef.current && typeof time === 'number' && !Number.isNaN(time)) {
          videoRef.current.currentTime = time;
        }
      },

      currentPlayState: () => {
        if (!videoRef.current) return false;
        return !videoRef.current.paused;
      },

      videoLength: () => {
        if (!videoRef.current) return 0;
        return videoRef.current.duration || 0;
      },
    }));

    useEffect(() => {
      const video = videoRef.current;
      if (!video || !url) return;

      // cleanup old
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (Hls.isSupported()) {
        const hls = new Hls({
          xhrSetup: (xhr) => {
            // add header if backend requires it
            xhr.setRequestHeader(
              'api-key',
              '6f568c7ebab5eb21f4c66df0c451869e31652b6ade6851b55db83d0ac792dbb3'
            );
          },
          maxBufferLength: 60,
          maxMaxBufferLength: 120,
          maxBufferSize: 120 * 1000 * 1000,
          backBufferLength: 90,
          enableWorker: true,
        });

        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            void video.play();
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
        });

        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        const onLoaded = () => {
          if (autoPlay) {
            void video.play();
          }
        };
        video.addEventListener('loadedmetadata', onLoaded);

        return () => {
          video.removeEventListener('loadedmetadata', onLoaded);
        };
      }

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    }, [url, autoPlay]);

    return (
      <video
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        className="w-full h-96 object-contain"
      />
    );
  }
);

HlsPlayer.displayName = 'HlsPlayer';
export default HlsPlayer;
