// /**
// @@@ Disclaimer: This code belongs to Edulust Ventures Private Limited

// @date of Version 1 : 25 March 2025
// @author:: Edulyst Ventures
// @purpose : This component is used to show the video player
// @dependency : This page is dependent on the content and video url to play the video
// **/

import React, { useRef, useEffect } from 'react'
import { CommonModuleContent } from '@/@types/learner/Courses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveContentCompletion } from '@/services/learner/CourseService'

interface AssessmentProps {
  content: CommonModuleContent
}

const VideoPlayer = ({ content }: AssessmentProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedProgressRef = useRef<number>(0)
  const lastSavedTimeRef = useRef<number>(0)
  const queryClient = useQueryClient()

  /* ---------------- API Mutation ---------------- */

  const saveContentCompletionMutation = useMutation({
    mutationFn: saveContentCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseModule'] })
    },
    onError: (error) => {
      console.error('Error saving content completion:', error)
    },
  })

  /* ---------------- Helpers ---------------- */

  const getSaveInterval = (duration: number): number => {
    if (duration <= 60) return 5000
    if (duration <= 300) return 10000
    if (duration <= 600) return 15000
    if (duration <= 1800) return 20000
    return 30000
  }

  /**
   * Converts seconds → minutes
   * Applies special rounding rule
   */
  const getBookmarkInMinutes = (currentTime: number): number => {
    let bookmarkInMinutes = currentTime / 60


    if (bookmarkInMinutes > 0.5 && bookmarkInMinutes < 1) {
      bookmarkInMinutes = 1
    }

    return Number(bookmarkInMinutes.toFixed(2))
  }

  const saveProgress = (
    currentTime: number,
    duration: number,
    force: boolean = false
  ) => {
    const percentage = Math.floor((currentTime / duration) * 100)

    const timeSinceLastSave = currentTime - lastSavedTimeRef.current
    if (!force && timeSinceLastSave < 3) return

    if (!force && Math.abs(percentage - lastSavedProgressRef.current) < 5) {
      return
    }

    const bookmarkInMinutes = getBookmarkInMinutes(currentTime)

    const formData = new FormData()
    formData.append('bookmark', bookmarkInMinutes.toString())
    formData.append(
      'content_id',
      content?.program_content_id.toString()
    )
    formData.append('completion', percentage.toString())

    saveContentCompletionMutation.mutate(formData)

    lastSavedProgressRef.current = percentage
    lastSavedTimeRef.current = currentTime
  }

  /* ---------------- Event Handlers ---------------- */

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration) return

    if (video.currentTime > 0) {
      saveProgress(video.currentTime, video.duration)
    }
  }

  const handleVideoEnd = () => {
    const video = videoRef.current
    if (!video) return

    const bookmarkInMinutes = getBookmarkInMinutes(video.currentTime)

    const formData = new FormData()
    formData.append('bookmark', bookmarkInMinutes.toString())
    formData.append(
      'content_id',
      content?.program_content_id.toString()
    )
    formData.append('completion', '100')

    saveContentCompletionMutation.mutate(formData)

    lastSavedProgressRef.current = 100
    lastSavedTimeRef.current = video.currentTime
  }

  const handlePlay = () => {
    const video = videoRef.current
    if (!video || !video.duration) return

    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current)
    }

    const saveInterval = getSaveInterval(video.duration)

    saveIntervalRef.current = setInterval(() => {
      if (video && !video.paused && !video.ended) {
        saveProgress(video.currentTime, video.duration, true)
      }
    }, saveInterval)
  }

  const handlePause = () => {
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current)
      saveIntervalRef.current = null
    }

    const video = videoRef.current
    if (video && video.duration) {
      saveProgress(video.currentTime, video.duration, true)
    }
  }

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    const contentWithBookmark =
      content as CommonModuleContent & { bookmark?: string | number }

    if (video && contentWithBookmark?.bookmark) {
      const bookmarkInMinutes = parseFloat(
        String(contentWithBookmark.bookmark)
      )
      video.currentTime = bookmarkInMinutes * 60
    }
  }, [content])

  /* ---------------- UI ---------------- */

  return (
    <div className="rounded-lg overflow-hidden mb-6 bg-gray-100 border">
      <video
        ref={videoRef}
        autoPlay
        controls
        controlsList="nodownload noremoteplayback"
        className="w-full md:h-[600px]"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        onPlay={handlePlay}
        onPause={handlePause}
      >
        <source src={content?.url} type="video/mp4" />
      </video>
    </div>
  )
}

export default VideoPlayer
