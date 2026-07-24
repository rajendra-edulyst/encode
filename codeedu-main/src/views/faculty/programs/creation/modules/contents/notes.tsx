import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/ShadcnInput"
import { createModuleContent } from "@/services/faculty/ProgramService"
import { Controller, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import JoditEditor from "jodit-react";
import { JoEditConfig } from "@/utils/joeditConfig"
import { memo, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/ShadcnButton"
import { Eye, Notebook, X } from "lucide-react"
import Breadcrumb from "@/components/breadcrumb"
import ContentTypeSelector from "@/components/ContentTypeSelector"
import { useProgramDetailsStore } from "@/store/faculty/ProgramStore"
import { CommonModuleContent } from "@/@types/faculty/program"



const CreateNotesContent = () => {

    const navigate = useNavigate();
    const { id, moduleId, contentId } = useParams<{ id: string, moduleId: string, contentId: string }>();
    const { selectedModule, program, moduleContents } = useProgramDetailsStore();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<CommonModuleContent | null>(null);

    const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm();

    const editorConfig = useMemo(() => ({
        ...JoEditConfig,
        height: 250
    }), []);

    // Handle form submission
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {

        if (!id || !moduleId) {
            toast.error("Module or Program ID is missing.");
            return;
        }

        const formData = new FormData();
        formData.append("title", data.notesTitle);
        formData.append("points", data.points.toString());
        formData.append("expected_duration", data.duration);
        formData.append("per_completion", data.defaultShortlisted);
        formData.append("description", data.description);
        formData.append("content_type", "notes");
        formData.append("program_id", moduleId);
        formData.append("PID_module", id);
        formData.append('content_type_label', 'Notes');

        if (contentId) {
            if (!isNaN(Number(contentId))) {
                formData.append("program_content_id", contentId);
            }
        }

        if (data.uploadContent && data.uploadContent.length > 0) {
            // check if the file is selected
            if (data.uploadContent.length > 1) {
                toast.error("Please upload only one file.");
                return;
            }
            // check if the file is of valid type
            const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint", "text/plain"];
            if (!validTypes.includes(data.uploadContent[0].type)) {
                toast.error("Invalid file type. Please upload a PDF, DOCX, PPTX, or TXT file.");
                return;
            }
            // append the file to the form data
            formData.append("content", data.uploadContent[0]);
        }


        setLoading(true);
        createModuleContent(formData).then(() => {
            toast.success("Notes content created successfully!");
            reset({
                notesTitle: "",
                duration: "",
                points: 0,
                defaultShortlisted: "",
                uploadContent: null,
                description: ""
            });
            navigate(`/programs/${id}/modules`);
        }).catch((error) => {
            toast.error(`Sommething went wrong: ${error}`);
        }).finally(() => {
            setLoading(false);
        });


    };


    useEffect(() => {
        if (contentId && !isNaN(Number(contentId))) {
            const content = moduleContents?.find((item) => item.program_content_id === Number(contentId));
            if (content) {
                setContent(content);
                reset({
                    notesTitle: content.title || "",
                    duration: content.duration_in_minutes || "",
                    defaultShortlisted: content.completion || "",
                    uploadContent: null,
                    description: content.description || "",
                    points: content.total_coins || 0
                });
            }
        }
    }, [moduleContents, contentId, reset]);


    const breadcrumbItems = [
        { label: 'Programs', path: '/subjects' },
        { label: program?.name || 'Program Details', path: `/subjects/${id}` },
        { label: selectedModule?.name || 'Module Details', path: `/subjects/${id}/modules/${moduleId}` },
        { label: 'Create', path: '' },
        { label: 'Notes', path: '' }
    ];


    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">{content ? 'Edit Content' : 'Create Content'}</h1>
                    <p className="text-xs sm:text-sm text-gray-500">{content ? 'Edit the content for the module' : 'Create a new content for the module'}</p>
                </div>
            </div>
            {id && moduleId && <ContentTypeSelector type={"notes"} programId={id} moduleId={moduleId} />}
            <Card>
                <CardHeader className='border-b'>
                    <div className="flex items-center gap-2">
                        <Notebook size={35} className="text-primary" />
                        <div>
                            <CardTitle className='text-lg'>Notes</CardTitle>
                            <span className="text-sm text-gray-500">Add notes for the module</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='p-6 space-y-6'>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="notesTitle">Enter Title <span className="text-red-500">*</span></Label>
                                <Input id="notesTitle" placeholder="Enter notes title" {...register("notesTitle", { required: true, maxLength: 255 })} />
                                {errors.notesTitle && <p className="text-red-500 text-sm">Title is required and must be less than 255 characters</p>}
                            </div>
                            <div>
                                <Label htmlFor="duration">Duration(Read Time)</Label>
                                <Input id="duration" placeholder="e.g., 2 min" {...register("duration", {
                                    pattern: {
                                        value: /^\d+$/,
                                        message: "Duration must be a number"
                                    }
                                })} />
                                {errors.duration && <p className="text-red-500 text-sm">Invalid duration format</p>}
                            </div>
                            <div>
                                <Label htmlFor="points">Points</Label>
                                <Input id="points" type="number" placeholder="e.g., 10" {...register("points", {
                                    valueAsNumber: true,
                                    min: 0
                                })} />
                                {errors.points && <p className="text-red-500 text-sm">Points must be a positive number</p>}
                                <p className="text-sm text-gray-500">Points for completion</p>
                            </div>
                            <div>
                                <Label htmlFor="defaultShortlisted">Consideration Completion (%)</Label>
                                <Input type="text" id="defaultShortlisted" placeholder="80%" {...register("defaultShortlisted", {
                                    pattern: {
                                        value: /^(100|[1-9]?[0-9])$/,
                                        message: "Please enter a valid percentage (0-100)"
                                    }
                                })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="uploadContent">Upload Content <span className="text-red-500">*</span></Label>
                            <Input id="uploadContent" type="file" {...register("uploadContent", {
                                required: content ? false : true,
                            })} />
                            <p className="text-xs text-gray-500">Upload notes in PDF, DOCX, Txt and PPTX format</p>
                            {errors.uploadContent && <p className="text-red-500 text-sm">File upload is required</p>}
                            {
                                watch("uploadContent") && watch("uploadContent")?.length > 0 && (
                                    <div>
                                        {
                                            watch("uploadContent")[0].type === "application/pdf" && (
                                                <div className="flex items-center gap-2 border p-2 rounded bg-gray-50">
                                                    <svg width="48px" height="48px" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> </defs> <title></title> <g id="xxx-word"> <path className="cls-1" d="M325,105H250a5,5,0,0,1-5-5V25a5,5,0,0,1,10,0V95h70a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M325,154.83a5,5,0,0,1-5-5V102.07L247.93,30H100A20,20,0,0,0,80,50v98.17a5,5,0,0,1-10,0V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100v49.83A5,5,0,0,1,325,154.83Z"></path> <path className="cls-1" d="M300,380H100a30,30,0,0,1-30-30V275a5,5,0,0,1,10,0v75a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V275a5,5,0,0,1,10,0v75A30,30,0,0,1,300,380Z"></path> <path className="cls-1" d="M275,280H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M200,330H125a5,5,0,0,1,0-10h75a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M325,280H75a30,30,0,0,1-30-30V173.17a30,30,0,0,1,30-30h.2l250,1.66a30.09,30.09,0,0,1,29.81,30V250A30,30,0,0,1,325,280ZM75,153.17a20,20,0,0,0-20,20V250a20,20,0,0,0,20,20H325a20,20,0,0,0,20-20V174.83a20.06,20.06,0,0,0-19.88-20l-250-1.66Z"></path> <path className="cls-1" d="M145,236h-9.61V182.68h21.84q9.34,0,13.85,4.71a16.37,16.37,0,0,1-.37,22.95,17.49,17.49,0,0,1-12.38,4.53H145Zm0-29.37h11.37q4.45,0,6.8-2.19a7.58,7.58,0,0,0,2.34-5.82,8,8,0,0,0-2.17-5.62q-2.17-2.34-7.83-2.34H145Z"></path> <path className="cls-1" d="M183,236V182.68H202.7q10.9,0,17.5,7.71t6.6,19q0,11.33-6.8,18.95T200.55,236Zm9.88-7.85h8a14.36,14.36,0,0,0,10.94-4.84q4.49-4.84,4.49-14.41a21.91,21.91,0,0,0-3.93-13.22,12.22,12.22,0,0,0-10.37-5.41h-9.14Z"></path> <path className="cls-1" d="M245.59,236H235.7V182.68h33.71v8.24H245.59v14.57h18.75v8H245.59Z"></path> </g> </g></svg>
                                                    <div>
                                                        <p className="text-sm text-gray-500">PDF Document</p>
                                                        {/* size */}
                                                        <p className="text-xs text-gray-500">
                                                            {Math.round(watch("uploadContent")[0].size / 1024)} KB
                                                        </p>
                                                    </div>
                                                    <div className="ml-auto flex items-center gap-2">
                                                        {/* preview button */}
                                                        <Button asChild size="icon" className="text-white">
                                                            <a href={URL.createObjectURL(watch("uploadContent")[0])} target="_blank" rel="noopener noreferrer">
                                                                <Eye size={16} />
                                                            </a>
                                                        </Button>
                                                        <Button size="icon" variant="destructive" onClick={() => {
                                                            reset({ uploadContent: null });
                                                        }}>
                                                            <X size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            watch("uploadContent")[0].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                                                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs></defs> <title></title> <g id="xxx-word"> <path className="cls-1" d="M325,105H250a5,5,0,0,1-5-5V25a5,5,0,0,1,10,0V95h70a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M325,154.83a5,5,0,0,1-5-5V102.07L247.93,30H100A20,20,0,0,0,80,50v98.17a5,5,0,0,1-10,0V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100v49.83A5,5,0,0,1,325,154.83Z"></path> <path className="cls-1" d="M300,380H100a30,30,0,0,1-30-30V275a5,5,0,0,1,10,0v75a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V275a5,5,0,0,1,10,0v75A30,30,0,0,1,300,380Z"></path> <path className="cls-1" d="M275,280H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M200,330H125a5,5,0,0,1,0-10h75a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M325,280H75a30,30,0,0,1-30-30V173.17a30,30,0,0,1,30-30h.2l250,1.66a30.09,30.09,0,0,1,29.81,30V250A30,30,0,0,1,325,280ZM75,153.17a20,20,0,0,0-20,20V250a20,20,0,0,0,20,20H325a20,20,0,0,0,20-20V174.83a20.06,20.06,0,0,0-19.88-20l-250-1.66Z"></path> <path className="cls-1" d="M179.67,182.68,165.41,236H155.33l-10.62-39.22L135.06,236h-9.88l-14.57-53.32h10.2l10.31,38.87,9.61-38.87h9.73l10.63,38.87,10.12-38.87Z"></path> <path className="cls-1" d="M199.08,236.82q-8.75,0-13.36-6.29a23.75,23.75,0,0,1-4.61-14.41,21.32,21.32,0,0,1,5.1-14.57,17,17,0,0,1,13.46-5.82,16.75,16.75,0,0,1,13,5.66q5.1,5.66,5.1,14.73,0,9.34-5.29,15A17.54,17.54,0,0,1,199.08,236.82Zm.31-7.34q9,0,9-13.4,0-6.05-2.15-9.55a7.21,7.21,0,0,0-6.6-3.5,7.47,7.47,0,0,0-6.84,3.61q-2.23,3.61-2.23,9.59,0,6.45,2.36,9.84A7.46,7.46,0,0,0,199.39,229.48Z"></path> <path className="cls-1" d="M234.86,236H226V196.55h8V206q1.72-5.51,4.73-8a9.52,9.52,0,0,1,6.17-2.54l1.17,0V205q-6.8,0-9,4.34a18.47,18.47,0,0,0-2.21,8.4Z"></path> <path className="cls-1" d="M284.9,236h-8.32v-8q-3.44,8.79-11.64,8.79a12.43,12.43,0,0,1-11.13-6.05q-3.87-6.05-3.87-15a26.2,26.2,0,0,1,4-14.57,12.86,12.86,0,0,1,11.45-6.21q7.62,0,10.59,7V182.68h8.91ZM276,212.72q0-4.8-2.29-7.48a7.42,7.42,0,0,0-5.92-2.68,7,7,0,0,0-6.17,3.44q-2.23,3.44-2.23,10.27,0,13.2,8.28,13.2a7.58,7.58,0,0,0,5.8-2.83A10.49,10.49,0,0,0,276,219.4Z"></path> </g> </g></svg>
                                            )
                                        }
                                        {
                                            watch("uploadContent")[0].type === "application/vnd.ms-powerpoint" && (
                                                <svg width="64px" height="64px" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs></defs> <title></title> <g id="xxx-word"> <path className="cls-1" d="M325,105H250a5,5,0,0,1-5-5V25a5,5,0,1,1,10,0V95h70a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M325,154.83a5,5,0,0,1-5-5V102.07L247.93,30H100A20,20,0,0,0,80,50v98.17a5,5,0,0,1-10,0V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100v49.83A5,5,0,0,1,325,154.83Z"></path> <path className="cls-1" d="M300,380H100a30,30,0,0,1-30-30V275a5,5,0,0,1,10,0v75a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V275a5,5,0,0,1,10,0v75A30,30,0,0,1,300,380Z"></path> <path className="cls-1" d="M275,280H125a5,5,0,1,1,0-10H275a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M200,330H125a5,5,0,1,1,0-10h75a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M325,280H75a30,30,0,0,1-30-30V173.17a30,30,0,0,1,30-30h.2l250,1.66a30.09,30.09,0,0,1,29.81,30V250A30,30,0,0,1,325,280ZM75,153.17a20,20,0,0,0-20,20V250a20,20,0,0,0,20,20H325a20,20,0,0,0,20-20V174.83a20.06,20.06,0,0,0-19.88-20l-250-1.66Z"></path> <path className="cls-1" d="M145,236h-9.61V182.68h21.84q9.34,0,13.85,4.71a16.37,16.37,0,0,1-.37,22.95,17.49,17.49,0,0,1-12.38,4.53H145Zm0-29.37h11.37q4.45,0,6.8-2.19a7.58,7.58,0,0,0,2.34-5.82,8,8,0,0,0-2.17-5.62q-2.17-2.34-7.83-2.34H145Z"></path> <path className="cls-1" d="M183,236V182.68H202.7q10.9,0,17.5,7.71t6.6,19q0,11.33-6.8,18.95T200.55,236Zm9.88-7.85h8a14.36,14.36,0,0,0,10.94-4.84q4.49-4.84,4.49-14.41a21.91,21.91,0,0,0-3.93-13.22,12.22,12.22,0,0,0-10.37-5.41h-9.14Z"></path> <path className="cls-1" d="M245.59,236H235.7V182.68h33.71v8.24H245.59v14.57h18.75v8H245.59Z"></path> </g> </g></svg>
                                            )
                                        }
                                    </div>
                                )
                            }
                            {
                                content && content.url && (
                                    <div className="flex items-center gap-2 border p-2 rounded bg-gray-50 w-full">
                                        <svg width="48px" height="48px" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> </defs> <title></title> <g id="xxx-word"> <path className="cls-1" d="M325,105H250a5,5,0,0,1-5-5V25a5,5,0,0,1,10,0V95h70a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M325,154.83a5,5,0,0,1-5-5V102.07L247.93,30H100A20,20,0,0,0,80,50v98.17a5,5,0,0,1-10,0V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100v49.83A5,5,0,0,1,325,154.83Z"></path> <path className="cls-1" d="M300,380H100a30,30,0,0,1-30-30V275a5,5,0,0,1,10,0v75a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V275a5,5,0,0,1,10,0v75A30,30,0,0,1,300,380Z"></path> <path className="cls-1" d="M275,280H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M200,330H125a5,5,0,0,1,0-10h75a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M325,280H75a30,30,0,0,1-30-30V173.17a30,30,0,0,1,30-30h.2l250,1.66a30.09,30.09,0,0,1,29.81,30V250A30,30,0,0,1,325,280ZM75,153.17a20,20,0,0,0-20,20V250a20,20,0,0,0,20,20H325a20,20,0,0,0,20-20V174.83a20.06,20.06,0,0,0-19.88-20l-250-1.66Z"></path> <path className="cls-1" d="M145,236h-9.61V182.68h21.84q9.34,0,13.85,4.71a16.37,16.37,0,0,1-.37,22.95,17.49,17.49,0,0,1-12.38,4.53H145Zm0-29.37h11.37q4.45,0,6.8-2.19a7.58,7.58,0,0,0,2.34-5.82,8,8,0,0,0-2.17-5.62q-2.17-2.34-7.83-2.34H145Z"></path> <path className="cls-1" d="M183,236V182.68H202.7q10.9,0,17.5,7.71t6.6,19q0,11.33-6.8,18.95T200.55,236Zm9.88-7.85h8a14.36,14.36,0,0,0,10.94-4.84q4.49-4.84,4.49-14.41a21.91,21.91,0,0,0-3.93-13.22,12.22,12.22,0,0,0-10.37-5.41h-9.14Z"></path> <path className="cls-1" d="M245.59,236H235.7V182.68h33.71v8.24H245.59v14.57h18.75v8H245.59Z"></path> </g> </g></svg>
                                        <div>
                                            <p className="text-sm text-gray-500">PDF Document</p>
                                        </div>
                                        <div className="ml-auto flex items-center gap-2">
                                            {/* preview button */}
                                            <Button asChild size="icon" className="text-white">
                                                <a href={content.url} target="_blank" rel="noopener noreferrer">
                                                    <Eye size={16} />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Enter Description
                            </Label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <JoditEditor
                                        value={field.value || ""}
                                        config={editorConfig}
                                        onBlur={(newValue) => field.onChange(newValue)}
                                        onChange={(newValue) => field.onChange(newValue)}
                                    />
                                )}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">Description is required</p>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" variant="default" className="text-white">{content ? loading ? "Updating..." : "Update Notes" : loading ? "Creating..." : "Create Notes"}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default memo(CreateNotesContent);