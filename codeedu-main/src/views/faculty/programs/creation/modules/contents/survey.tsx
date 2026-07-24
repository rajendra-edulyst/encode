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
import { FileText } from "lucide-react"
import Breadcrumb from "@/components/breadcrumb"
import ContentTypeSelector from "@/components/ContentTypeSelector"
import { useProgramDetailsStore } from "@/store/faculty/ProgramStore"
import { CommonModuleContent } from "@/@types/faculty/program"



const CreateSurveyContent = () => {

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
        formData.append("title", data.title);
        formData.append("points", data.points.toString());
        formData.append("expected_duration", data.duration);
        formData.append("description", data.description);
        formData.append("content_type", "survey");
        formData.append("program_id", moduleId);
        formData.append("PID_module", id);
        formData.append('content_type_label', 'Survey');
        formData.append("start_date", data.startDate);
        formData.append("end_date", data.endDate);

        if (contentId) {
            if (!isNaN(Number(contentId))) {
                formData.append("program_content_id", contentId);
            }
        }

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
            const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint"];
            if (!validTypes.includes(data.uploadContent[0].type)) {
                toast.error("Invalid file type. Please upload a PDF, DOCX, or PPTX file.");
                return;
            }
            // append the file to the form data
            formData.append("content", data.uploadContent[0]);
        }


        setLoading(true);
        createModuleContent(formData).then(() => {
            toast.success("Survey content created successfully!");
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
        { label: 'Surveys', path: '' }
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
            {id && moduleId && <ContentTypeSelector type={"survey"} programId={id} moduleId={moduleId} />}
            <Card>
                <CardHeader className='border-b'>
                    <div className="flex items-center gap-2">
                        <FileText size={35} className="text-primary" />
                        <div>
                            <CardTitle className='text-lg'>Surveys</CardTitle>
                            <span className="text-sm text-gray-500">Add surveys for the module</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='p-6 space-y-6'>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title">Enter Title <span className="text-red-500">*</span></Label>
                                <Input id="title" placeholder="Enter survey title" {...register("title", { required: true, maxLength: 255 })} />
                                {errors.title && <p className="text-red-500 text-sm">Title is required and must be less than 255 characters</p>}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* start and end date */}
                            <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input id="startDate" type="date" {...register("startDate", { required: true })} />
                                {errors.startDate && <p className="text-red-500 text-sm">Start date is required</p>}
                            </div>
                            <div>
                                <Label htmlFor="endDate">End Date</Label>
                                <Input id="endDate" type="date" {...register("endDate", { required: true })} />
                                {errors.endDate && <p className="text-red-500 text-sm">End date is required</p>}
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
                            <Button type="submit" variant="default" className="text-white">{content ? loading ? "Updating..." : "Update Survey" : loading ? "Creating..." : "Create Survey"}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default memo(CreateSurveyContent);