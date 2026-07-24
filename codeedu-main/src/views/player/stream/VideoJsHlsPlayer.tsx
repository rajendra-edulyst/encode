import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
// eslint-disable-next-line
import videojs from "video.js";
import "@videojs/http-streaming";
// eslint-disable-next-line
import "video.js/dist/video-js.css";

type VideoJsPlayer = ReturnType<typeof videojs>;

export interface VideoJsHlsPlayerHandle {
  getCurrentProgress: () => number | null;
  start: () => void;
  stop: () => void;
  togglePlay: () => void;
  setDefaultStart: (time?: number | null) => void;
  currentPlayState: () => boolean;
  videoLength: () => number;
}

interface VideoJsHlsPlayerProps {
  url: string;
  autoPlay?: boolean;
  disableSeeking?: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

const VideoJsHlsPlayer = forwardRef<
  VideoJsHlsPlayerHandle,
  VideoJsHlsPlayerProps
>(({ url, autoPlay = true, disableSeeking = false, onEnded, onTimeUpdate }, ref) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  const onEndedRef = useRef(onEnded);
  const onTimeUpdateRef = useRef(onTimeUpdate);

  useEffect(() => {
    onEndedRef.current = onEnded;
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onEnded, onTimeUpdate]);

  useImperativeHandle(ref, () => ({
    getCurrentProgress: () =>
      playerRef.current ? (playerRef.current.currentTime() ?? null) : null,
    start: () => {
      if (playerRef.current) playerRef.current.play();
    },

    stop: () => {
      if (playerRef.current) playerRef.current.pause();
    },

    togglePlay: () => {
      if (!playerRef.current) return;
      playerRef.current.paused()
        ? playerRef.current.play()
        : playerRef.current.pause();
    },

    setDefaultStart: (time) => {
      if (playerRef.current && typeof time === "number") {
        playerRef.current.currentTime(time);
      }
    },

    currentPlayState: () =>
      playerRef.current ? !playerRef.current.paused() : false,

    videoLength: () =>
      playerRef.current ? playerRef.current.duration() || 0 : 0,
  }));

  useEffect(() => {
    if (!videoContainerRef.current) return;

    // ✅ EXACT SAME METHOD AS YOUR WORKING COMPONENT
    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered", "vjs-default-skin");

    // The disable-seeking class is now managed by a separate useEffect
    // if (disableSeeking) {
    //   videoElement.classList.add("disable-seeking");
    // }

    videoContainerRef.current.innerHTML = ""; // clean old
    videoContainerRef.current.appendChild(videoElement);

    const player = videojs(videoElement, {
      autoplay: autoPlay,
      controls: true,
      preload: "auto",
      responsive: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      sources: [
        {
          src: url,
          type: "application/x-mpegURL",
        },
      ],
      html5: {
        vhs: {
          overrideNative: true,
        },
      },
    });

    // ✅ Add API key to HLS requests
    // eslint-disable-next-line
    const tech = player.tech({ IWillNotUseThisInPlugins: true }) as any;

    if (tech?.vhs?.xhr) {
      // eslint-disable-next-line
      tech.vhs.xhr.beforeRequest = (options: any) => {
        options.headers = {
          ...options.headers,
          "api-key":
            "6f568c7ebab5eb21f4c66df0c451869e31652b6ade6851b55db83d0ac792dbb3",
        };
        return options;
      };
    }

    player.on("error", () => {
      console.error("VIDEOJS ERROR:", player.error());
    });

    player.on("ended", () => {
      if (onEndedRef.current) onEndedRef.current();
    });

    player.on("timeupdate", () => {
      if (onTimeUpdateRef.current) {
        onTimeUpdateRef.current(player.currentTime() || 0, player.duration() || 0);
      }
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [url, autoPlay]);

  useEffect(() => {
    if (playerRef.current) {
      const el = playerRef.current.el();
      if (el) {
        if (disableSeeking) {
          el.classList.add("disable-seeking");
        } else {
          el.classList.remove("disable-seeking");
        }
      }
    }
  }, [disableSeeking]);

  return (
    <div
      data-vjs-player
    >
      <style>
        {`
          .disable-seeking .vjs-progress-control {
            pointer-events: none;
          }
        `}
      </style>
      <div
        ref={videoContainerRef}
      />
    </div>
  );
});

VideoJsHlsPlayer.displayName = "VideoJsHlsPlayer";

export default VideoJsHlsPlayer;
