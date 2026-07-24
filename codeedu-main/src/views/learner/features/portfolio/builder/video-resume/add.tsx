import React, { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/ShadcnButton'
import { Input } from '@/components/ui/ShadcnInput'
import { Label } from '@/components/ui/label'
import { uploadVideoResume } from '@/services/learner/PortfolioService'

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
}

interface Props {
    show: boolean
    onClose: (val: boolean) => void
}

function AddVideoResume({ show, onClose }: Props) {
    const webcamRef = useRef<Webcam>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)

    const [mode, setMode] = useState<'upload' | 'record' | 'url'>('upload')
    const [capturing, setCapturing] = useState(false)
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [videoTitle, setVideoTitle] = useState('')
    const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null)
    const [videoUrl, setVideoUrl] = useState('')

    const handleStartCaptureClick = useCallback(() => {
        setCapturing(true)
        const stream = webcamRef.current?.stream
        if (!stream) return

        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' })
        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                setRecordedChunks((prev) => [...prev, event.data])
            }
        }
        mediaRecorderRef.current.start()
    }, [])

    const handleStopCaptureClick = useCallback(() => {
        mediaRecorderRef.current?.stop()
        setCapturing(false)
    }, [])

    const handleSaveRecording = useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, { type: 'video/webm' })
            const file = new File([blob], 'resume.webm', { type: 'video/webm' })
            setVideoFile(file)
        }
    }, [recordedChunks])

    const handleUpload = async () => {
        if (!videoFile) return alert('No video selected')

        const formData = new FormData()
        formData.append('video', videoFile)
        formData.append('video_title', videoTitle)
        if (videoThumbnail) {
            formData.append('thumbnail', videoThumbnail)
        }
        uploadVideoResume(formData).then((response) => {
            console.log(response);
        });
    }

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Add Video Resume</DialogTitle>
                </DialogHeader>

                <div className="flex space-x-2 mb-4">
                    <Button className={mode === 'upload' ? 'bg-primary text-white' : ''}  variant={mode === 'upload' ? 'default' : 'outline'} onClick={() => setMode('upload')}>
                        Upload Video
                    </Button>
                    <Button className={mode === 'record' ? 'bg-primary text-white' : ''} variant={mode === 'record' ? 'default' : 'outline'} onClick={() => setMode('record')}>
                        Record Video
                    </Button>
                    <Button className={mode === 'url' ? 'bg-primary text-white' : ''} variant={mode === 'url' ? 'default' : 'outline'} onClick={() => setMode('url')}>
                        Video URL
                    </Button>
                </div>

                {mode === 'upload' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select a video file to upload:</label>
                            <input
                                type="file"
                                accept="video/*"
                                className="block w-full rounded border border-gray-300 shadow-sm p-2"
                                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                            />
                        </div>
                    </div>
                )}

                {mode === 'record' && (
                    <div className="space-y-4">
                        <Webcam ref={webcamRef} audio={true} videoConstraints={videoConstraints} className="rounded shadow" />
                        <div className="flex gap-2">
                            {!capturing ? (
                                <Button className='bg-primary text-white' onClick={handleStartCaptureClick}>Start Recording</Button>
                            ) : (
                                <Button className='bg-primary text-white' onClick={handleStopCaptureClick}>Stop Recording</Button>
                            )}
                            <Button className='bg-primary text-white' disabled={recordedChunks.length === 0} onClick={handleSaveRecording}>
                                Save Recording
                            </Button>
                        </div>
                    </div>
                )}

                {mode === 'url' && (
                    <div className="space-y-4">
                        <Input
                            value={videoUrl}
                            type="text"
                            placeholder="Enter video URL"
                            className="block w-full rounded border border-gray-300 shadow-sm p-2"
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />
                    </div>
                )}

                {/* video title */}

                <div>
                    <Label>Video Title</Label>
                    <Input
                        type="text"
                        placeholder="Enter video title"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                    />
                </div>
                {/* upload video thumbnail */}
                <div>
                    <Label>Video Thumbnail</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        placeholder="Select a thumbnail image"
                        onChange={(e) => setVideoThumbnail(e.target.files?.[0] || null)}
                    />
                </div>

                <Button className="mt-6 bg-primary text-white" disabled={!videoFile} onClick={handleUpload}>
                    Upload Video Resume
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default AddVideoResume