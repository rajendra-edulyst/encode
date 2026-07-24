import { CommonModuleContent } from "@/@types/faculty/program"
import Breadcrumb from "@/components/breadcrumb"
import ContentTypeSelector from "@/components/ContentTypeSelector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/ShadcnButton"
import { Input } from "@/components/ui/ShadcnInput"
import { Switch } from "@/components/ui/switch"
import { createModuleContent } from "@/services/faculty/ProgramService"
import { useProgramDetailsStore } from "@/store/faculty/ProgramStore"
import { JoEditConfig } from "@/utils/joeditConfig"
import JoditEditor from "jodit-react"
import { HelpCircle } from "lucide-react"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

const CreateQuizContent: React.FC<any> = (props: any) => {
    const { programId, moduleId: propModuleId, contentId: propContentId, hideHeader = false, onSuccess } = props;

    const params = useParams<{ id: string, moduleId: string, contentId: string }>();
    const id = programId || params.id;
    const moduleId = propModuleId || params.moduleId;
    const contentId = propContentId || params.contentId;

    const { selectedModule, program, moduleContents } = useProgramDetailsStore();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<CommonModuleContent | null>(null);

    const editorConfig = useMemo(() => ({
        ...JoEditConfig,
        height: 50
    }), []);

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm({
        defaultValues: {
            title: "",
            duration: "",
            points: 0,
            image: null,
            description: "",
            question_count: 1,
            marks: 1,
            passing_marks: 1,
            negative_marking_option: "0",
            negative_marking_value: 0,
            attempt_allowed: 1,
            number_of_set: 1,
            // switch
            allow_attempt_after_passing: true,
            review_allowed: true,
            is_featured: true,
            // dates
            startDate: "",
            endDate: "",
            instructions: "",
            startTime: "",
            endTime: ""
        }
    });

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
        formData.append("description", data.description);
        formData.append("content_type", "assessment");
        formData.append("program_id", moduleId);
        formData.append("PID_module", id);
        formData.append('content_type_label', 'Assessment');
        formData.append("expected_duration", data.duration);
        formData.append("question_count", data.question_count.toString());
        formData.append("marks", data.marks.toString());
        formData.append("passing_marks", data.passing_marks.toString());
        formData.append("negative_marking_criteria", data.negative_marking_option);
        formData.append("negative_marks", data.negative_marking_value.toString());
        formData.append("attempt_allowed", data.attempt_allowed.toString());
        formData.append("allow_after_passing", data.allow_attempt_after_passing ? "true" : "false");
        formData.append("display_review", data.review_allowed ? "true" : "false");
        formData.append("is_featured", data.is_featured ? "true" : "false");
        formData.append("number_of_set", data.number_of_set.toString());
        formData.append("instructions", data.instructions || "");
        if (data.startDate) {
            formData.append("start_date", data.startDate);
        }
        if (data.endDate) {
            formData.append("end_date", data.endDate);
        }
        if (data.dueDate) {
            formData.append("due_date", data.dueDate);
        }

        // Append time if they are provided
        if (data.startTime) {
            const startDateTime = `${data.startDate}T${data.startTime}`;
            formData.append("start_date", startDateTime);
        }
        if (data.endTime) {
            // concat the date and time
            const endDateTime = `${data.endDate}T${data.endTime}`;
            formData.append("end_date", endDateTime);
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
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(data.uploadContent[0].type)) {
                toast.error("Invalid file type. Please upload a JPG, PNG, or GIF file.");
                return;
            }
            // append the file to the form data
            formData.append("assessment_featured_image", data.uploadContent[0]);
        }

        setLoading(true);
        createModuleContent(formData).then(() => {
            toast.success("Quiz content created successfully!");
            reset({
                title: "",
                duration: "",
                points: 0,
                image: null,
                description: "",
                question_count: 1,
                marks: 1,
                passing_marks: 1,
                negative_marking_option: "0",
                negative_marking_value: 0,
                attempt_allowed: 1,
                allow_attempt_after_passing: true,
                review_allowed: true,
                is_featured: true,
            });
            if (onSuccess) onSuccess();
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
                    description: content.description || "",
                    points: content.total_coins || 0,
                    duration: content.duration_in_minutes ? `${content.duration_in_minutes} minutes` : "",
                    negative_marking_option: content.negative_marks ? "1" : "0",
                    negative_marking_value: content.negative_marks || 0,
                    attempt_allowed: content.attempts_remaining || 1,
                    number_of_set: content.allow_multiple || 1,
                    allow_attempt_after_passing: content.allow_multiple ? true : false,
                });
            }
        }
    }, [moduleContents, contentId, reset]);

    const breadcrumbItems = [
        { label: 'Programs', path: '/subjects' },
        { label: program?.name || 'Program Details', path: `/subjects/${id}` },
        { label: selectedModule?.name || 'Module Details', path: `/subjects/${id}/modules/${moduleId}` },
        { label: 'Create', path: '' },
        { label: 'Assessment', path: '' }
    ];

    return (
        <>
            {!hideHeader && (
                <>
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold">{content ? 'Edit' : 'Create'} Content</h1>
                            <p className="text-xs sm:text-sm text-gray-500">{content ? 'Edit the content for the module' : 'Create a new content for the module'}</p>
                        </div>
                    </div>
                </>
            )}
            {!hideHeader && id && moduleId && <ContentTypeSelector type={"quiz"} programId={id} moduleId={moduleId} />}
            <Card>
                <CardHeader className='border-b'>
                    <div className="flex items-center gap-2">
                        <HelpCircle size={35} className="text-primary" />
                        <div>
                            <CardTitle className='text-lg'>Assessment</CardTitle>
                            <span className="text-sm text-gray-500">Add assessment for the module</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='p-6 space-y-6'>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title">Enter Title *</Label>
                                <Input id="title" placeholder="Enter assessment title" {...register("title", { required: "Title is required" })} />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="duration">Duration(in Minutes)</Label>
                                <Input id="duration" placeholder="e.g., 2" {...register("duration", { required: "Duration is required" })} />
                                {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="description">Enter Description *</Label>
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
                                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="points">Points</Label>
                                <Input id="points" type="number" placeholder="e.g., 10" {...register("points", { required: "Points are required" })} />
                                {errors.points && <p className="text-red-500 text-sm">{errors.points.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="question_count">Question Count</Label>
                                <Input id="question_count" type="number" placeholder="e.g., 10" {...register("question_count", { required: "Question count is required" })} />
                                {errors.question_count && <p className="text-red-500 text-sm">{errors.question_count.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* start date */}
                            <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input type="date" id="startDate" {...register("startDate", { required: "Start date is required" })} />
                                {errors.startDate && <p className="text-red-500 text-sm">Start Date is required</p>}
                            </div>
                            {/* start time */}
                            <div>
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input type="time" id="startTime" {...register("startTime", { required: "Start time is required" })} />
                                {errors.startTime && <p className="text-red-500 text-sm">Start Time is required</p>}
                            </div>
                            <div>
                                <Label htmlFor="endDate">End Date</Label>
                                <Input type="date" id="endDate" {...register("endDate", { required: "End date is required" })} />
                                {errors.endDate && <p className="text-red-500 text-sm">End Date is required</p>}
                            </div>
                            {/* end time */}
                            <div>
                                <Label htmlFor="endTime">End Time</Label>
                                <Input type="time" id="endTime" {...register("endTime", { required: "End time is required" })} />
                                {errors.endTime && <p className="text-red-500 text-sm">End Time is required</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="marks">Marks</Label>
                                <Input id="marks" type="number" placeholder="e.g., 1" {...register("marks", { required: "Marks are required" })} />
                                {errors.marks && <p className="text-red-500 text-sm">{errors.marks.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="passing_marks">Passing Marks</Label>
                                <Input id="passing_marks" type="number" placeholder="e.g., 1" {...register("passing_marks", { required: "Passing marks are required" })} />
                                {errors.passing_marks && <p className="text-red-500 text-sm">{errors.passing_marks.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="negative_marking_option">Negative Marking Option</Label>
                                <Input id="negative_marking_option" placeholder="e.g., 0" {...register("negative_marking_option", { required: "Negative marking option is required" })} />
                                {errors.negative_marking_option && <p className="text-red-500 text-sm">{errors.negative_marking_option.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="negative_marking_value">Negative Marking Value</Label>
                                <Input id="negative_marking_value" type="number" placeholder="e.g., 0" {...register("negative_marking_value", { required: "Negative marking value is required" })} />
                                {errors.negative_marking_value && <p className="text-red-500 text-sm">{errors.negative_marking_value.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="attempt_allowed">Attempt Allowed</Label>
                                <Input id="attempt_allowed" type="number" placeholder="e.g., 1" {...register("attempt_allowed", { required: "Attempt allowed is required" })} />
                                {errors.attempt_allowed && <p className="text-red-500 text-sm">{errors.attempt_allowed.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="number_of_set">Number of Set</Label>
                                <Input id="number_of_set" type="number" placeholder="e.g., 1" {...register("number_of_set", { required: "Number of set is required" })} />
                                {errors.number_of_set && <p className="text-red-500 text-sm">{errors.number_of_set.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="uploadContent">Upload Feature Image</Label>
                            <Input id="uploadContent" type="file" {...register("image", { required: "Feature image is required" })} />
                            <span className="text-sm text-gray-500">Supported formats: JPG, PNG, GIF</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <Switch id="allow_attempt_after_passing" {...register("allow_attempt_after_passing")} />
                                <Label htmlFor="allow_attempt_after_passing">Allow Attempt After Passing</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="review_allowed" {...register("review_allowed")} />
                                <Label htmlFor="review_allowed">Review Allowed</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="is_featured" {...register("is_featured")} />
                                <Label htmlFor="is_featured">Is Featured</Label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="instructions">Instructions</Label>
                            <Controller
                                name="instructions"
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
                            {errors.instructions && (
                                <p className="text-red-500 text-sm">Instructions is required</p>
                            )}
                            {errors.instructions && <p className="text-red-500 text-sm">{errors.instructions.message}</p>}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" variant="default" className="text-white">
                                {
                                    content ? loading ? "Updating..." : "Update Assessment" : loading ? "Creating..." : "Create Assessment"
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default CreateQuizContent;