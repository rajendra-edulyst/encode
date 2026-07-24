import React, { useEffect } from 'react'
import { useProgramDetailsStore } from '@/store/faculty/ProgramStore';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Breadcrumb from '@/components/breadcrumb';
import StatusIndicator from '@/components/StatusIndicator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/ShadcnButton';
import { Input } from '@/components/ui/ShadcnInput';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import ContentTypeIcons from '@/views/player/content/icons';

const Modules = () => {

    const { id } = useParams<{ id: string }>();
    const { fetchProgramDetails, setSelectedModule, selectedModule, fetchModuleContents, moduleContents, program, loading, error, modulecontentLoading } = useProgramDetailsStore();


    useEffect(() => {
        if (!id) {
            toast.error('Subject not found, please try again later.');
            return;
        }
        fetchProgramDetails(id);
    }, [id, fetchProgramDetails]);

    useEffect(() => {
        if (selectedModule) {
            fetchModuleContents();
        }
    }, [selectedModule, fetchModuleContents]);

    const breadcrumbItems = [
        { label: 'Subjects', path: '/subjects' },
        { label: program?.name || 'Program', path: `/subjects/${id}` },
        { label: 'Modules' },
    ];

    const onDragEnd = (result: DropResult) => {
        const { source, destination, type } = result;
        if (!destination) return;
    };

    return (
        <>
            <div className='flex items-center justify-between mb-1'>
                <Breadcrumb items={breadcrumbItems} />
                <StatusIndicator error={error} loading={loading} />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='col-span-1'>
                    <Card className='sticky top-20'>
                        <CardHeader className='border-b'>
                            <CardTitle className='text-lg'>{program?.name}</CardTitle>
                            <p className='text-sm text-gray-500 line-clamp-2'>{program?.description}</p>
                        </CardHeader>
                        <CardContent className='pt-4'>
                            <div className='flex items-center gap-2 mb-4'>
                                <h5 className='text-sm font-semibold'>Modules<span className='text-xs text-gray-500'>({program?.modules.length})</span></h5>
                                <Button variant='outline' size='sm' className='ml-auto' onClick={() => setSelectedModule(null)}>
                                    Add Module
                                </Button>
                            </div>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="modules" type="MODULE">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            <div className='border-l ps-4'>
                                                {program?.modules.map((module, index) => (
                                                    <Draggable key={module.id} draggableId={module?.id?.toString()} index={index}>
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <div
                                                                    className={`p-2 mb-2 relative bg-white rounded border shadow cursor-pointer ${selectedModule?.id === module.id ? 'bg-blue-100' : ''}`}
                                                                    onClick={() => setSelectedModule(module)}
                                                                >
                                                                    <span className='absolute top-5 -left-4 text-xs text-gray-500 h-[1px] w-3 bg-gray-500 z-0'></span>
                                                                    <div className="flex items-center gap-3 z-10">
                                                                        <GripVertical size={25} />
                                                                        <span className='font-semibold'>{module.name}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            </div>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </CardContent>
                    </Card>
                </div>
                <div className='col-span-2'>
                    {
                        selectedModule ? (
                            <div className='space-y-4'>
                                <Collapsible>
                                    <Card>
                                        <CardHeader className='border-b'>
                                            <div className='flex items-center justify-between gap-3'>
                                                <div>
                                                    <CardTitle className='text-lg'>{selectedModule.name}</CardTitle>
                                                    <p className='text-sm text-gray-500'>{selectedModule?.description}</p>
                                                </div>
                                                <div>
                                                    <CollapsibleTrigger className='text-gray-500 hover:text-gray-700 border p-1.5 rounded'>
                                                        <Pencil size={16} />
                                                    </CollapsibleTrigger>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CollapsibleContent>
                                            <CardContent className='pt-4'>
                                                <div>
                                                    <Label>Module Name</Label>
                                                    <Input placeholder='Module Name' className='mb-4' value={selectedModule.name} />
                                                </div>
                                                <div>
                                                    <Label>Description</Label>
                                                    <Textarea placeholder='Module Description' className='mb-4' value={selectedModule.description} />
                                                </div>
                                            </CardContent>
                                            <CardFooter className='flex justify-end p-4 border-t'>
                                                <Button variant='outline' size='sm' className='mr-2' onClick={() => setSelectedModule(null)}>
                                                    Cancel
                                                </Button>
                                                <Button size='sm' className='text-white' onClick={() => toast.success('Module updated successfully!')}>
                                                    Save Changes
                                                </Button>
                                            </CardFooter>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>
                                <Card>
                                    <CardHeader className='border-b'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <CardTitle className='text-lg'>Module Contents</CardTitle>
                                                <p className='text-sm text-gray-500'>Drag and drop to reorder contents</p>
                                            </div>
                                            <Button variant='outline' size='sm' className='mt-2' onClick={() => setSelectedModule(null)}>
                                                Add Content
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className='pt-4 space-y-2'>
                                        <DragDropContext onDragEnd={onDragEnd}>
                                            <Droppable droppableId="modules" type="CONTENT">
                                                {(provided) => (
                                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                                        {moduleContents && moduleContents.map((content, index) => (
                                                            <Draggable key={content.program_content_id} draggableId={`${content.program_content_id}`} index={index}>
                                                                {(provided) => (
                                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='mt-2 p-2 bg-gray-100 rounded border !cursor-pointer'>
                                                                        <span className='absolute top-5 -left-4 text-xs text-gray-500 h-[1px] w-3 bg-gray-500 z-0'></span>
                                                                        <div className="flex items-center gap-3 z-10">
                                                                            <div className='flex items-center gap-2 justify-start w-full'>
                                                                                <div className='flex-shrink-0'>
                                                                                    <ContentTypeIcons content_type={content.content_type} />
                                                                                </div>
                                                                                <div>
                                                                                    <h6 className='font-semibold'>{content.title}</h6>
                                                                                    <p className='text-sm text-gray-500 line-clamp-2'>{content.description}</p>
                                                                                </div>
                                                                            </div>
                                                                            <GripVertical size={25} className='cursor-grab' />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className='text-center text-gray-500'>Select a module to view details</div>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Modules


// import React, { useState } from 'react';
// import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { GripVertical } from 'lucide-react';
// import ModuleCreate from './creation/module/create';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcnAvatar';
// import ContentTypeSelector from '@/components/ContentTypeSelector';
// import { useParams } from 'react-router-dom';

// interface Module {
//     id: string;
//     name: string;
//     description?: string;
//     image?: string;
//     contents: Content[];
// }

// interface Content {
//     id: string;
//     type: 'Notes' | 'Assignment' | 'Assessment' | 'YouTube Video' | 'Video' | 'Live Class' | 'Survey';
//     title: string;
// }

// const Modules: React.FC = () => {


//     const { id } = useParams<{ id: string }>();

//     const [modules, setModules] = useState<Module[]>([]);
//     const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
//     const [newContent, setNewContent] = useState<{ title: string; type: Content['type'] }>({ title: '', type: 'Notes' });

//     const onDragEnd = (result: DropResult) => {
//         const { source, destination, type } = result;
//         if (!destination) return;

//         if (type === 'MODULE') {
//             const updatedModules = [...modules];
//             const [movedModule] = updatedModules.splice(source.index, 1);
//             updatedModules.splice(destination.index, 0, movedModule);
//             setModules(updatedModules);
//         } else if (type === 'CONTENT') {
//             const moduleId = result.draggableId.split('-')[0];
//             const module = modules.find(m => m.id === moduleId);
//             if (module) {
//                 const updatedContents = [...module.contents];
//                 const [movedContent] = updatedContents.splice(source.index, 1);
//                 updatedContents.splice(destination.index, 0, movedContent);
//                 setModules(modules.map(m => (m.id === moduleId ? { ...m, contents: updatedContents } : m)));
//             }
//         }
//     };


//     const handleModuleAdd = (data: Module) => {
//         const newModule: Module = {
//             id: crypto.randomUUID(),
//             name: data.name,
//             description: data.description,
//             image: data.image,
//             contents: [],
//         };
//         setModules([...modules, newModule]);
//         setSelectedModuleId(newModule.id);
//     };

//     const selectedModule = modules.find(module => module.id === selectedModuleId);

//     return (
//         <DragDropContext onDragEnd={onDragEnd}>
//             <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//                 {
//                     modules.length > 0 &&
//                     <div className='col-span-1'>
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Modules</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <Droppable droppableId="modules" type="MODULE">
//                                     {(provided) => (
//                                         <div {...provided.droppableProps} ref={provided.innerRef}>
//                                             {modules.map((module, index) => (
//                                                 <Draggable key={module.id} draggableId={module.id} index={index}>
//                                                     {(provided, snapshot) => (
//                                                         <div
//                                                             ref={provided.innerRef}
//                                                             {...provided.draggableProps}
//                                                             {...provided.dragHandleProps}
//                                                             className={`p-2 mb-2 bg-white rounded shadow cursor-pointer ${snapshot.isDragging ? 'opacity-50' : ''
//                                                                 } ${selectedModuleId === module.id ? 'bg-blue-100' : ''}`}
//                                                             onClick={() => setSelectedModuleId(module.id)}
//                                                         >
//                                                             <div className="flex items-center gap-3 justify-start">
//                                                                 <GripVertical size={25} />
//                                                                 <div className='truncate w-60'>
//                                                                     <span>{module.name}</span>
//                                                                     <p className="text-sm text-gray-500"
//                                                                         dangerouslySetInnerHTML={{ __html: module.description || '' }}
//                                                                     />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                 </Draggable>
//                                             ))}
//                                             {provided.placeholder}
//                                         </div>
//                                     )}
//                                 </Droppable>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 }
//                 <div className={`${modules.length > 0 ? 'col-span-2' : 'col-span-3'}`}>
//                     {
//                         selectedModule &&
//                         <>
//                             <Card className='mb-4'>
//                                 <CardHeader>
//                                     <div className="flex items-center gap-3">
//                                         <div>
//                                             <Avatar>
//                                                 <AvatarImage src={selectedModule.image} alt={selectedModule.name} />
//                                                 <AvatarFallback>{selectedModule.name.charAt(0)}</AvatarFallback>
//                                             </Avatar>
//                                         </div>
//                                         <CardTitle>{selectedModule.name}</CardTitle>
//                                     </div>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <p
//                                         className="text-sm text-gray-500"
//                                         dangerouslySetInnerHTML={{ __html: selectedModule.description || '' }}
//                                     />
//                                 </CardContent>
//                             </Card>
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Add Content</CardTitle>
//                                     <p className="text-sm text-gray-500">Select content type and add title</p>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <ContentTypeSelector
//                                         onSelectType={(type) => setNewContent({ ...newContent, type })}
//                                     />
//                                 </CardContent>
//                             </Card>
//                         </>
//                     }
//                     {
//                         !selectedModule && (
//                             <ModuleCreate onAddModule={handleModuleAdd} />
//                         )
//                     }
//                 </div>
//             </div>
//         </DragDropContext>
//     );
// };

// export default Modules;