/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 25 March 2025
@author:: Edulyst Ventures  
@purpose : This component is used to show the video player
@dependency : This page is dependent on the content to and video url to play the video

@@ Use case (if any use case) and solutions 

**/

import React from 'react'
import { CommonModuleContent } from '@/@types/learner/Courses';
import { saveContentCompletion } from '@/services/learner/CourseService';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

interface AssessmentProps {
    content: CommonModuleContent;
}

const YoutubeVideoPlayer = ({ content }: AssessmentProps) => {

    const [youtubeVideoId, setYoutubeVideoId] = React.useState<string | null>(null);

    const trackedContentId = React.useRef<number | string | null>(null);
    const trackedComplete = React.useRef<boolean>(false);
    const trackedNotComplete = React.useRef<boolean>(false);
    const mountTime = React.useRef<number>(Date.now());

    React.useEffect(() => {
        mountTime.current = Date.now();
        const url = new URL(content?.url ?? content?.content ?? '');
        const videoId = url.searchParams.get('v');
        setYoutubeVideoId(videoId);

        const currentContent = content;
        if (currentContent && trackedContentId.current !== currentContent.program_content_id) {
            mixpanelService.track('Youtube Content Viewed', {
                content_type: 'youtube',
                content_name: currentContent.title,
                course_id: currentContent.program_id,
                content_id: currentContent.program_content_id
            });
            trackedContentId.current = currentContent.program_content_id;
            trackedComplete.current = false;
            trackedNotComplete.current = false;
        }

        // set video play to complete
        if (youtubeVideoId) {
            if (Number(currentContent.completion) !== 100) {
                const formData = new FormData();
                formData.append('bookmark', '100');
                formData.append('content_id', currentContent?.program_content_id.toString());
                formData.append('completion', '100');
                saveContentCompletion(formData).then((res) => {
                    console.log("res", res);
                    if (!trackedComplete.current) {
                        mixpanelService.track('Video lecture completed', {
                            content_type: 'youtube',
                            content_name: currentContent.title,
                            course_id: currentContent.program_id,
                            content_id: currentContent.program_content_id
                        });
                        trackedComplete.current = true;
                    }
                });
            } else {
                if (!trackedComplete.current) {
                    mixpanelService.track('Video lecture completed', {
                        content_type: 'youtube',
                        content_name: currentContent.title,
                        course_id: currentContent.program_id,
                        content_id: currentContent.program_content_id
                    });
                    trackedComplete.current = true;
                }
            }
        }

        return () => {
            if (Date.now() - mountTime.current < 200) return;

            if (currentContent && trackedContentId.current === currentContent.program_content_id) {
                if (!trackedComplete.current && !trackedNotComplete.current) {
                    mixpanelService.track('Video not completed', {
                        content_type: 'youtube',
                        content_name: currentContent.title,
                        course_id: currentContent.program_id,
                        content_id: currentContent.program_content_id
                    });
                    trackedNotComplete.current = true;
                }
            }
        };
    }, [content]);


    return (
        <div className="rounded-lg overflow-hidden mb-6 bg-gray-100 border">
            {youtubeVideoId && (
                <iframe
                    width="100%"
                    height="400"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
            )}
        </div>
    )
}

export default YoutubeVideoPlayer