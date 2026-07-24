import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/ShadcnButton'
import React, { useState } from 'react'
import AddVideoResume from './add'
import { type VideoResumes as VideoResumeType } from '@/@types/learner/portfolio'
import { PlayCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { DialogHeader } from '@/components/ui/Dialog/index'

interface VideoResumesProps {
    videoResumes: VideoResumeType[] | null
}

const VideoResumes: React.FC<VideoResumesProps> = ({ videoResumes = [] }) => {
    const [showAddVideoResumeDialog, setShowAddVideoResumeDialog] = useState(false)
    const [selectedVideoResume, setSelectedVideoResume] = useState<VideoResumeType | null>(null)
    const [showResumeDialog, setShowResumeDialog] = useState(false)


    if (!Array.isArray(videoResumes)) {
        return null
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className='md:flex items-center justify-between space-y-4 md:space-y-0'>
                        <div>
                            <CardTitle className='mb-2'>Video Resumes</CardTitle>
                            <CardDescription>
                                Video resumes are a great way to showcase your personality and communication skills to potential employers. They allow you to present yourself in a more dynamic and engaging way than a traditional written resume. In this section, you can create and upload your video resume.
                            </CardDescription>
                        </div>
                        <Button className="text-white" variant='default' onClick={() => setShowAddVideoResumeDialog(true)}>Add Video Resume</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {
                        videoResumes && videoResumes?.length === 0 ? (
                            <div className='flex flex-col items-center justify-center w-full h-full '>
                                <div className='flex items-center justify-center w-full h-full'>
                                    <p className='text-sm text-muted-foreground'>No video resumes available.</p>
                                </div>
                                <p className='text-sm text-muted-foreground'>Click the button above to add a video resume.</p>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                {Array.isArray(videoResumes) && videoResumes.length > 0 && Object.keys(videoResumes[0])?.map((key) => {
                                    if (key === 'id' || key === 'created_at' || key === 'updated_at') {
                                        return null
                                    }
                                    return (
                                        <div key={videoResumes[0][`${key}`]?.video_title} className='flex items-center justify-between border rounded-md'>
                                            <div className='flex flex-col gap-4'>
                                                <div className='w-full h-48 overflow-hidden rounded-t-md relative cursor-pointer' onClick={() => {
                                                    setSelectedVideoResume(videoResumes[0][`${key}`])
                                                    setShowResumeDialog(true)
                                                }}>
                                                    <img src={videoResumes[0][`${key}`]?.video_thumbnail} alt={videoResumes[0][`${key}`]?.video_title} className='rounded-t-md object-cover' />
                                                    <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50'>
                                                        <PlayCircle size={80} className='text-white' />
                                                    </div>
                                                </div>
                                                <div className='flex flex-col px-2 pb-4'>
                                                    <h3 className='text-lg font-semibold'>{videoResumes[0][`${key}`].video_title}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    }
                </CardContent>
            </Card>
            <AddVideoResume show={showAddVideoResumeDialog} onClose={setShowAddVideoResumeDialog} />
            <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Video Resume</DialogTitle>
                        <DialogDescription>
                            {selectedVideoResume?.video_title}
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex items-center justify-center w-full h-full'>
                        <video controls className='w-full h-96 rounded-md'>
                            <source src={selectedVideoResume?.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default VideoResumes