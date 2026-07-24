import React, { useMemo } from 'react'
import { CommonModuleContent } from "@/@types/learner/Courses";
import PdfRender from '../pdf';
import { saveContentCompletion } from '@/services/learner/CourseService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from '@tanstack/pacer';
import { useEffect } from 'react';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

interface AssessmentProps {
    content: CommonModuleContent;
}

const Notes = ({ content }: AssessmentProps) => {

    const queryClient = useQueryClient();


    const saveContentCompletionMutation = useMutation({
        mutationFn: saveContentCompletion,
        onSuccess: (data, variables) => {
            console.log('Content completion saved:', data);
            queryClient.invalidateQueries({ queryKey: ['courseModule'] });
            
            const completion = variables.get('completion');
            if (completion === '100') {
                if (!trackedComplete.current) {
                    mixpanelService.track('Notes completed', {
                        content_type: 'notes',
                        content_name: content?.title,
                        course_id: content?.program_id,
                        content_id: content?.program_content_id
                    });
                    trackedComplete.current = true;
                }
            } else {
                if (!trackedNotComplete.current) {
                    mixpanelService.track('Notes not completed', {
                        content_type: 'notes',
                        content_name: content?.title,
                        course_id: content?.program_id,
                        content_id: content?.program_content_id
                    });
                    trackedNotComplete.current = true;
                }
            }
        },
        onError: (error) => {
            console.error('Error saving content completion:', error);
        },
    });

    const trackedContentId = React.useRef<number | string | null>(null);
    const trackedComplete = React.useRef<boolean>(false);
    const trackedNotComplete = React.useRef<boolean>(false);
    const mountTime = React.useRef<number>(Date.now());

    useEffect(() => {
        mountTime.current = Date.now();
        const currentContent = content;
        if (currentContent && trackedContentId.current !== currentContent.program_content_id) {
            mixpanelService.track('Course Content Viewed', {
                content_type: 'notes',
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
            
            if (currentContent && trackedContentId.current === currentContent.program_content_id) {
                if (!trackedComplete.current && !trackedNotComplete.current) {
                    mixpanelService.track('Notes not completed', {
                        content_type: 'notes',
                        content_name: currentContent.title,
                        course_id: currentContent.program_id,
                        content_id: currentContent.program_content_id
                    });
                    trackedNotComplete.current = true;
                }
            }
        };
    }, [content]);

    const debouncedSave = useMemo(
        () =>
            debounce((formData: FormData) => {
                saveContentCompletionMutation.mutate(formData);
            }, { wait: 500 }),
        [saveContentCompletionMutation]
    );

    const onPageChange = (page: number, numPages: number) => {
        console.log("current page ", page);
        console.log("current page num page", numPages);
        const precentage = ((page + 1) / numPages) * 100;
        const isLastPage = page === numPages - 1;

        if (window.location.hostname === 'stage.codeedu.co') {
            console.log("precentage before ", precentage);
            console.log("content?.program_content_id before ", content?.program_content_id);
            console.log("content?.completion?.toString() ", content?.completion?.toString());
        }


        if (!content?.program_content_id) {
            return;
        }

        if (Number(content?.completion) >= 100) {
            return;
        }

        if (window.location.hostname === 'stage.codeedu.co') {
            console.log("precentage ", precentage);
        }

        if (page === 0 && numPages !== 1) {
            return;
        }

        page = page + 1;

        const formData = new FormData();
        formData.append('bookmark', page > 0 ? page?.toString() : '1');
        formData.append('content_id', content?.program_content_id.toString());
        formData.append('completion', isLastPage ? '100' : Math.floor(precentage).toString());
        debouncedSave(formData);
    }


    const onDocumentLoad = (numPages: number) => {
        console.log('numPages', numPages);

        if (!content?.program_content_id) {
            return;
        }

        if (content?.completion?.toString() >= "100") {
            return;
        }

        if (numPages === 1) {
            const formData = new FormData();
            formData.append('bookmark', '100');
            formData.append('content_id', content?.program_content_id.toString());
            formData.append('completion', '100');
            debouncedSave(formData);
        }

    }

    return (
        <div className="overflow-hidden mb-6 h-[650px]">
            <PdfRender fileUrl={content?.url ?? content?.content} onDocumentLoad={onDocumentLoad} onPageChange={onPageChange} />
        </div>
    )
}


export default Notes;