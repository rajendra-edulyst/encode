import React, { useEffect } from 'react'
import { useProgramDetailsStore } from '@/store/faculty/ProgramStore';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Breadcrumb from '@/components/breadcrumb';
import StatusIndicator from '@/components/StatusIndicator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/ShadcnButton';
import Content from './contents';
import UpdateModule from './edit';
import CreateModule from './create';
import { deleteModule, updateModuleOrder } from '@/services/faculty/ProgramService';
import { CreateProgramData, ProgramDetailModule } from '@/@types/faculty/program';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Modules = () => {

    const { id } = useParams<{ id: string }>();
    const { fetchProgramDetails, setSelectedModule, selectedModule, setProgram, program, loading, error } = useProgramDetailsStore();
    // const [modules, setModules] = React.useState(program?.modules || []);
    const [addModule, setAddModule] = React.useState(false);
    const [deleteModuleId, setDeleteModuleId] = React.useState<number | null>(null);

    useEffect(() => {
        if (!id) {
            toast.error('Subject not found, please try again later.');
            return;
        }
        fetchProgramDetails(id, false);
    }, [id, fetchProgramDetails]);

    const breadcrumbItems = [
        { label: 'Subjects', path: '/subjects' },
        { label: program?.name || 'Program', path: `/subjects/${id}` },
        { label: 'Modules' },
    ];

    const onDragEnd = (result: DropResult) => {
        const { source, destination, type } = result;
        if (!destination) return;
        if (!program) return;

        if (type === 'MODULE') {
            const reorderedModules = Array.from(program?.modules || []);
            const [movedModule] = reorderedModules.splice(source.index, 1);
            reorderedModules.splice(destination.index, 0, movedModule);
            // setSelectedModule(movedModule);
            updateModuleOrder(movedModule?.id?.toString(), destination.index + 1).then(() => {
                setProgram({ ...program, modules: reorderedModules });
                toast.success('Module order updated successfully.');
                if (!id) {
                    return;
                }
                fetchProgramDetails(id, false);
            }).catch((err) => {
                console.error('Error updating module order:', err);
                toast.error('Failed to update module order.');
            });
        }

        return result;
    };

    const handleModuleCreated = (newModule: CreateProgramData) => {

        if (!program) {
            toast.error('Program not found, please try again later.');
            return;
        }

        setAddModule(false);
        // set selected module to the newly created module id
        if (!id) {
            return;
        }

        fetchProgramDetails(id, false);

        const newModuleFineTuned: ProgramDetailModule = {
            id: newModule.id,
            name: newModule.name,
            description: newModule.description || '',
            permission: {
                is_edit_allowed: 1,
                is_delete_allowed: 1,
            }
        };

        // set the selected module to the newly created module
        setSelectedModule(newModuleFineTuned);
        // update the modules state with the new module
        // setModules((prevModules) => [newModuleFineTuned, ...prevModules]);
        const allModulesWithNewModule = [...(program?.modules || []), newModuleFineTuned];
        // update the program state with the new module
        setProgram({
            ...program,
            modules: allModulesWithNewModule,
        });

    }

    const handleDeleteModule = (moduleId: number | null) => {
        if (!moduleId) return;

        if (!program) {
            toast.error('Program not found, please try again later.');
            return;
        }

        deleteModule(moduleId).then(() => {
            toast.success('Module deleted successfully.');

            // new modules list after deletion
            const updatedModules = program.modules.filter((module) => module.id !== moduleId);
            // update the program state with the new modules list
            setProgram({
                ...program,
                modules: updatedModules,
            });

            // check if all modules are deleted, if so, reset selected module
            if (updatedModules.length === 1) {
                setSelectedModule(null);
            }

        }).catch((err) => {
            toast.error(JSON.parse(err.request.response)?.message || 'Failed to delete module.');
        });
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
                        <CardHeader className='border-b gap-0'>
                            <CardDescription className='mb-0 text-xs'>Subject</CardDescription>
                            <CardTitle className='text-lg !mt-0 pt-0'>{program?.name}</CardTitle>
                        </CardHeader>
                        <CardContent className='pt-4'>
                            <div className='flex items-center gap-2 mb-4'>
                                <h5 className='text-sm font-semibold'>Modules<span className='text-xs text-gray-500'>({program?.modules.length})</span></h5>
                                <Button variant='outline' size='sm' className='ml-auto' onClick={() => setAddModule(true)}>
                                    Add Module
                                </Button>
                            </div>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="modules" type="MODULE">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            <div className='border-l ps-4'>
                                                {program && program?.modules?.map((module, index) => (
                                                    <Draggable key={module.id} draggableId={module?.id?.toString()} index={index}>
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <div
                                                                    className={`p-2 mb-2 relative bg-white rounded border shadow cursor-pointer ${selectedModule?.id === module.id ? 'border-primary' : ''}`}
                                                                    onClick={() => { setSelectedModule(module); setAddModule(false); }}
                                                                >
                                                                    <span className={`absolute top-5 -left-4 text-xs h-[1px] w-3 z-0 ${selectedModule?.id === module.id ? 'bg-primary' : 'bg-gray-500'}`}></span>
                                                                    <div className={`flex items-center gap-3 z-10 ${selectedModule?.id === module.id ? 'text-primary' : ''}`}>
                                                                        <GripVertical />
                                                                        <div className='truncate w-full'>
                                                                            <p className='font-semibold'>{module.name}</p>
                                                                        </div>
                                                                        {module.permission.is_delete_allowed === 1 && <Button variant={"ghost"} className='text-red-700' size='sm' title='Delete Module' aria-label='Delete Module' disabled={!module.permission.is_delete_allowed} onClick={() => setDeleteModuleId(module.id)}><Trash2 /></Button>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {
                                                    program && program?.modules?.length === 0 && (
                                                        <div className='text-gray-500 text-sm italic'>No modules available. Click {"Add Module"} to create one.</div>
                                                    )
                                                }
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
                        selectedModule && !addModule ? (
                            <div className='space-y-4'>
                                <UpdateModule />
                                <Card>
                                    <CardHeader className='border-b'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <CardTitle className='text-lg'>Module Contents</CardTitle>
                                                <p className='text-sm text-gray-500'>Drag and drop to reorder the content. Click on the content to expand and view details.</p>
                                            </div>
                                            <Button asChild variant='default' size='sm' className='mt-2 text-white'>
                                                <Link to={`/programs/${program?.id}/modules/${selectedModule?.id}/contents/notes`}>Add Content</Link>
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className='pt-4 space-y-2'>
                                        {program?.id && <Content programId={program?.id} moduleId={selectedModule.id} />}
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            !addModule && (
                                <div>
                                    <Card>
                                        <CardHeader>
                                            <div>
                                                <CardTitle className='text-lg'>{program?.name}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className='text-gray-500' dangerouslySetInnerHTML={{ __html: program?.description || 'No description available.' }}></p>
                                        </CardContent>
                                        <CardContent className='pt-4'>
                                            <p className='text-sm text-gray-500'>Select a module to view or create contents.</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        )
                    }
                    {
                        addModule && program && (
                            <CreateModule program_id={program?.id} skill_id={program?.skill_id} fetchProgramDetails={fetchProgramDetails} handleModuleCreated={handleModuleCreated} setAddModule={setAddModule} />
                        )
                    }
                </div>
            </div>

            <AlertDialog open={!!deleteModuleId} onOpenChange={() => setDeleteModuleId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the module and remove it from the program.
                            <br />
                            Are you sure you want to continue?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='bg-red-500 text-white' onClick={() => handleDeleteModule(deleteModuleId)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default Modules