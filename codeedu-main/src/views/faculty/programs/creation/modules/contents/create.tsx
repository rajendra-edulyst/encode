import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useProgramDetailsStore } from '@/store/faculty/ProgramStore';
import Breadcrumb from '@/components/breadcrumb';
import StatusIndicator from '@/components/StatusIndicator';
import CreateNotesContent from './notes';
import ContentTypeSelector from '@/components/ContentTypeSelector';
import { ContentType } from "@/@types/faculty/program";
import CreateAudioContent from './audio';
import CreateVideoContent from './video';
import CreateAssignmentContent from './assignment';
import CreateQuizContent from './quiz';
import CreateLiveClassContent from './liveclass';
import CreateScormContent from './scrom';
import CreateSurveyContent from './survey';
import CreateTextContent from './text';
import ExternalLink from './externalLink';

const CreateContent = () => {

    const { id, moduleId } = useParams<{ id: string, moduleId: string }>();
    const { fetchProgramDetails, selectedModule, program, loading, error } = useProgramDetailsStore();

    const [type, setType] = React.useState<ContentType>('notes');


    useEffect(() => {
        if (!id) {
            toast.error('Subject not found, please try again later.');
            return;
        }
        fetchProgramDetails(id);
    }, [id, fetchProgramDetails]);

    const breadcrumbItems = [
        { label: 'Programs', path: '/subjects' },
        { label: program?.name || 'Program Details', path: `/subjects/${id}` },
        { label: selectedModule?.name || 'Module Details', path: `/subjects/${id}/modules/${moduleId}` },
        { label: 'Create Content', path: '' }
    ];

    if (!id || !moduleId) {
        return null;
    }

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Create Content</h1>
                    <p className="text-xs sm:text-sm text-gray-500">Create a new content for the module</p>
                </div>
                <StatusIndicator error={error} loading={loading} />
            </div>
            <ContentTypeSelector type={type} onSelectType={setType} />
            <div className='border-t pt-3'>
                {type === 'notes' && <CreateNotesContent programId={id} moduleId={moduleId} />}
                {type === 'audio' && <CreateAudioContent programId={id} moduleId={moduleId} />}
                {type === 'video' && <CreateVideoContent programId={id} moduleId={moduleId} />}
                {type === 'assignment' && <CreateAssignmentContent programId={id} moduleId={moduleId} />}
                {type === 'quiz' && <CreateQuizContent programId={id} moduleId={moduleId} />}
                {type === 'liveClass' && <CreateLiveClassContent programId={id} moduleId={moduleId} />}
                {type === 'scorm' && <CreateScormContent programId={id} moduleId={moduleId} />}
                {type === 'survey' && <CreateSurveyContent programId={id} moduleId={moduleId} />}
                {type === 'text' && <CreateTextContent programId={id} moduleId={moduleId} />}
                {type === 'external_link' && <ExternalLink programId={id} moduleId={moduleId} />}
            </div>
        </>
    )
}

export default CreateContent