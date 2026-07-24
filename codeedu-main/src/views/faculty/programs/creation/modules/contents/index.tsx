import { CommonModuleContent } from '@/@types/faculty/program';
import Loading from '@/components/shared/Loading';
import { Button } from '@/components/ui/ShadcnButton';
import { deleteModuleContent, saveContentOrder } from '@/services/faculty/ProgramService';
import { useProgramDetailsStore } from '@/store/faculty/ProgramStore';
import ContentTypeIcons from '@/views/player/content/icons';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface ContentProps {
    moduleId: number;
    programId: number;
}

const Content = ({ moduleId, programId }: ContentProps) => {
    const { fetchModuleContents, moduleContents, modulecontentLoading, setModuleContents } = useProgramDetailsStore();
    const [order, setOrder] = useState<{ id: number; position: number; }[]>([]);
    const [deleteContentId, setDeleteContentId] = useState<number | null>(null);

    React.useEffect(() => {
        if (moduleId) {
            fetchModuleContents(moduleId?.toString());
        }
    }, [moduleId, fetchModuleContents]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;
        // Clone the original contents
        const reordered = Array.from(moduleContents || []);
        // Remove the dragged item
        const [movedItem] = reordered.splice(source.index, 1);
        // Insert it into the new position
        reordered.splice(destination.index, 0, movedItem);
        // Create the contentOrder payload
        const contentOrder = reordered.map((item, index) => ({
            id: item.program_content_id,
            position: index + 1,
        }));
        setModuleContents(reordered);

        setOrder(contentOrder);
        return contentOrder;
    };


    if (modulecontentLoading) {
        return <div className='flex justify-center items-center h-48'><Loading loading={modulecontentLoading} /></div>;
    }

    const saveOrderContent = () => {
        // Here you would typically send the order to your API
        console.log('Content Order:', order);
        saveContentOrder({ contentOrder: order }).then(() => {
            toast.success('Content order saved successfully!');
            setOrder([]);
            fetchModuleContents(moduleId?.toString()); // Refresh the content list after saving
        }).catch((error) => {
            console.error('Error saving content order:', error);
            toast.error('Failed to save content order. Please try again.');
        });
    }

    const handleDeleteContent = (contentId: number | null) => {
        if (!contentId) return;
        // Call the delete function
        deleteModuleContent(contentId).then(() => {
            toast.success('Content deleted successfully!');
            const afterDeleteContents = moduleContents?.filter(item => item.program_content_id !== contentId);
            setModuleContents(afterDeleteContents as CommonModuleContent[] || []);
            // fetchModuleContents(moduleId?.toString());
        }).catch((error) => {
            console.error('Error deleting content:', error);
            toast.error('Failed to delete content. Please try again.');
        });
    }

    return (
        <>
            {
                order && order.length > 0 && (
                    <div className='mb-4 flex items-center justify-between'>
                        <div>
                            <h4 className='text-lg font-semibold'>Save Content Order</h4>
                            <p className='text-sm text-gray-500'>Reorder the content as needed and click {"Save Order"} to apply changes.</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Button variant="outline" size="sm" onClick={() => setOrder([])}>Cancel</Button>
                            <Button variant="outline" size="sm" className='bg-primary text-white' onClick={saveOrderContent}>Save Order</Button>
                        </div>
                    </div>
                )
            }
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="modules" type="CONTENT">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {moduleContents && moduleContents.map((content, index) => (
                                <Draggable key={content.program_content_id} draggableId={`${content.program_content_id}`} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='mt-2 p-2 bg-gray-100 rounded border !cursor-pointer'>
                                            <span className='absolute top-8 -left-4 text-xs text-gray-500 h-[1px] w-3 bg-gray-500 z-0'></span>
                                            <div className="flex items-center gap-3 z-10">
                                                <div className='flex items-center gap-2 justify-start w-full'>
                                                    <div className='flex-shrink-0'>
                                                        <ContentTypeIcons content_type={content.content_type} />
                                                    </div>
                                                    <div>
                                                        <h6 className='font-semibold'>{content.title}</h6>
                                                        <p className="text-sm text-gray-500 line-clamp-1">
                                                            {stripHtmlTags(content.description)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-2 text-sm text-gray-500'>
                                                    {content.content_type === 'assignment' && <>
                                                        <Badge variant="outline" className='text-nowrap'>
                                                            {content.allow_multiple ? 'Multiple' : 'Single'} Submission
                                                        </Badge>
                                                    </>}
                                                    <Badge variant="outline">
                                                        {content.content_type === 'video' && 'Video'}
                                                        {content.content_type === 'assignment' && 'Assignment'}
                                                        {content.content_type === 'assessment' && 'Assessment'}
                                                        {content.content_type === 'video_yts' && 'YouTube'}
                                                        {content.content_type === 'zoomclass' && 'Zoom Class'}
                                                        {content.content_type === 'audio' && 'Audio'}
                                                        {content.content_type === 'notes' && 'Notes'}
                                                    </Badge>
                                                </div>
                                                <div className='flex items-center ml-auto'>
                                                    {
                                                        content?.permission?.is_edit_allowed === 1 && <Button asChild variant="ghost" size={"icon"}>
                                                            <Link to={`/programs/${programId}/modules/${moduleId}/contents/${content.program_content_id}/${content.content_type === 'video' || content.content_type === 'video_yts' ? 'video' : content.content_type === 'zoomclass' ? 'zoom' : content.content_type === 'assessment' ? 'quiz' : content.content_type === 'assignment' ? 'assignment' : ''}`}>
                                                                <span className='sr-only'>Edit Content</span>
                                                                <Pencil size={20} />
                                                            </Link>
                                                        </Button>
                                                    }
                                                    {
                                                        content?.permission?.is_delete_allowed === 1 && <Button variant="ghost" className='text-red-500' size={"icon"} disabled={content?.permission?.is_delete_allowed === 1 ? false : true} onClick={() => setDeleteContentId(content.program_content_id)}>
                                                            <Trash2 />
                                                        </Button>
                                                    }
                                                    <div>
                                                        <GripVertical size={20} className='cursor-grab' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {
                                !moduleContents || moduleContents.length === 0 && (
                                    <div className='text-center text-gray-500 mt-4'>
                                        No content available for this module.
                                    </div>
                                )
                            }
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <AlertDialog open={!!deleteContentId} onOpenChange={() => setDeleteContentId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the content and remove it from the module.
                            <br />
                            Are you sure you want to continue?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='bg-red-500 text-white' onClick={() => handleDeleteContent(deleteContentId)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default Content