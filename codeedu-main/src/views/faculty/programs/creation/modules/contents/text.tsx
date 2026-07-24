import { CommonModuleContent } from "@/@types/faculty/program"
import Breadcrumb from "@/components/breadcrumb"
import ContentTypeSelector from "@/components/ContentTypeSelector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/ShadcnButton"
import { Input } from "@/components/ui/ShadcnInput"
import { createModuleContent } from "@/services/faculty/ProgramService"
import { useProgramDetailsStore } from "@/store/faculty/ProgramStore"
import { JoEditConfig } from "@/utils/joeditConfig"
import ContentTypeIcons from "@/views/player/content/icons"
import JoditEditor from "jodit-react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"


const CreateTextContent = () => {

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
    const { id, moduleId, contentId } = useParams<{ id: string, moduleId: string, contentId: string }>();
    const { selectedModule, program, moduleContents } = useProgramDetailsStore();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<CommonModuleContent | null>(null);

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

        formData.append("title", data.title);
        formData.append("points", data.points.toString());
        formData.append("expected_duration", data.duration);
        formData.append("per_completion", data.defaultShortlisted);
        formData.append("description", data.description);
        formData.append("content_type", "text");
        formData.append("program_id", moduleId);
        formData.append("PID_module", id);
        formData.append('content_type_label', 'Text');

        if (contentId) {
            if (!isNaN(Number(contentId))) {
                formData.append("program_content_id", contentId);
            }
        }

        setLoading(true);
        createModuleContent(formData).then(() => {
            toast.success("Content created successfully!");
            reset({
                title: "",
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
                    title: content.title || "",
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
        { label: 'Text', path: '' }
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
            {id && moduleId && <ContentTypeSelector type={"text"} programId={id} moduleId={moduleId} />}
            <Card>
                <CardHeader className='border-b'>
                    <div className="flex items-center gap-2">
                        <ContentTypeIcons content_type='notes' />
                        <div>
                            <CardTitle className='text-lg'>Text Content</CardTitle>
                            <span className="text-sm text-gray-500">Add text content for the module</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='p-6 space-y-6'>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title">Enter Title <span className="text-red-500">*</span></Label>
                                <Input id="title" placeholder="Enter title" {...register("title", { required: true })} />
                                {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
                            </div>
                            <div>
                                <Label htmlFor="duration">Duration(Read Time)</Label>
                                <Input id="duration" placeholder="e.g., 2 hours" {...register("duration")} />
                            </div>
                            <div>
                                <Label htmlFor="points">Points</Label>
                                <Input id="points" type="number" placeholder="e.g., 10" {...register("points")} />
                                <p className="text-sm text-gray-500">Points for completion</p>
                            </div>
                            <div>
                                <Label htmlFor="defaultShortlisted">Default Shortlisted On</Label>
                                <Input type="text" id="defaultShortlisted" placeholder="Completion % age" {...register("defaultShortlisted")} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Enter Description <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: true }}
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
                            <Button type="submit" variant="default" className="text-white">
                                {
                                    loading ? "Creating..." : "Create Text Content"
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default CreateTextContent;