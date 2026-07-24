import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/ShadcnInput"
import { createModuleContent } from "@/services/faculty/ProgramService"
import ContentTypeIcons from "@/views/player/content/icons"
import { Controller, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import JoditEditor from "jodit-react";
import { JoEditConfig } from "@/utils/joeditConfig"
import { memo, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/ShadcnButton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CommonModuleContent } from "@/@types/faculty/program"
import { useProgramDetailsStore } from "@/store/faculty/ProgramStore"
import Breadcrumb from "@/components/breadcrumb"
import ContentTypeSelector from "@/components/ContentTypeSelector"


const ExternalLink = () => {

    const navigate = useNavigate();
    const { id, moduleId, contentId } = useParams<{ id: string, moduleId: string, contentId: string }>();
    const { selectedModule, program, moduleContents } = useProgramDetailsStore();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<CommonModuleContent | null>(null);
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm();

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
        formData.append("content_type", "external_link");
        formData.append("program_id", moduleId);
        formData.append("PID_module", id);
        formData.append('content_type_label', 'External Link');
        formData.append('link_type', data.linkType);
        formData.append('link', data.link);


        setLoading(true);
        createModuleContent(formData).then(() => {
            toast.success("External link content created successfully!");
            reset({
                notesTitle: "",
                duration: "",
                points: 0,
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
            {id && moduleId && <ContentTypeSelector type={"external_link"} programId={id} moduleId={moduleId} />}
            <Card>
                <CardHeader className='border-b'>
                    <div className="flex items-center gap-2">
                        <ContentTypeIcons content_type='external_link' />
                        <div>
                            <CardTitle className='text-lg'>External Link</CardTitle>
                            <span className="text-sm text-gray-500">Add an external link for the module</span>
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
                        </div>
                        <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="uploadContent">Link Type <span className="text-red-500">*</span></Label>
                                <Select {...register("linkType", { required: true })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select link type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pdf">Internal Link</SelectItem>
                                        <SelectItem value="doc">External Link</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="externalLink">Url/Link <span className="text-red-500">*</span></Label>
                                <Input id="externalLink" placeholder="Enter external link" {...register("externalLink", { required: true })} />
                                {errors.externalLink && <p className="text-red-500 text-sm">External link is required</p>}
                            </div>
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
                            <Button type="submit" variant="default" className="text-white">
                                {
                                    loading ? "Creating..." : "Create Notes"
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default memo(ExternalLink);