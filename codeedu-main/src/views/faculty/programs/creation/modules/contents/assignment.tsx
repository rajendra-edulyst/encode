import { CommonModuleContent } from "@/@types/faculty/program"
import Breadcrumb from "@/components/breadcrumb"
import ContentTypeSelector from "@/components/ContentTypeSelector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/ShadcnButton"
import { Input } from "@/components/ui/ShadcnInput"
import { createModuleContent } from "@/services/faculty/ProgramService"
import { useProgramDetailsStore } from "@/store/faculty/ProgramStore"
import { JoEditConfig } from "@/utils/joeditConfig"
import JoditEditor from "jodit-react"
import { ClipboardList } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"


const CreateAssignmentContent = () => {

    const navigate = useNavigate();
    const { id, moduleId, contentId } = useParams<{ id: string, moduleId: string, contentId: string }>();
    const { selectedModule, program, moduleContents } = useProgramDetailsStore();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<CommonModuleContent | null>(null);
    const [allowMultipleSubmissions, setAllowMultipleSubmissions] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
    const editorConfig = useMemo(() => ({
        ...JoEditConfig,
        height: 250
    }), []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {

        if (!id || !moduleId) {
            toast.error("Module or Program not found, please try again later.");
            return;
        }

        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("points", data.points.toString());
        formData.append("expected_duration", data.duration);
        formData.append("description", data.description);
        formData.append("content_type", "assignment");
        formData.append("program_id", moduleId);
        formData.append("PID_module", id);
        formData.append('content_type_label', 'Assignment');
        formData.append("submission_mode", data.submissionMode ?? "1");
        formData.append("allow_multiple", allowMultipleSubmissions ? "1" : "0");
        formData.append("due_date", data.dueDate ? new Date(data.dueDate).toISOString() : new Date().toISOString());
        formData.append("start_date", data.startDate ? new Date(data.startDate).toISOString() : new Date().toISOString());
        formData.append("end_date", data.endDate ? new Date(data.endDate).toISOString() : new Date().toISOString());

        if (contentId) {
            if (!isNaN(Number(contentId))) {
                formData.append("program_content_id", contentId);
            }
        }

        if (allowMultipleSubmissions) {
            formData.append("allow_multiple_submissions", data.allowMultipleSubmissions.toString());
        } else {
            formData.append("allow_multiple_submissions", "0");
        }

        if (data.uploadContent && data.uploadContent.length > 0) {

            if (data.uploadContent.length > 1) {
                toast.error("Please upload only one file.");
                return;
            }

            const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            if (!validTypes.includes(data.uploadContent[0].type)) {
                toast.error("Invalid file type. Please upload a PDF or Word document.");
                return;
            }

            formData.append("content", data.uploadContent[0]);
        }


        if (data.rubrics && data.rubrics.length > 0) {

            if (data.rubrics.length > 1) {
                toast.error("Please upload only one rubrics file.");
                return;
            }

            const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            if (!validTypes.includes(data.rubrics[0].type)) {
                toast.error("Invalid file type for rubrics. Please upload a PDF or Word document.");
                return;
            }

            formData.append("rubrics", data.rubrics[0]);
        }

        setLoading(true);
        createModuleContent(formData).then(() => {
            toast.success("Assignmemnt created successfully!");
            reset({
                title: "",
                duration: "",
                points: 0,
                uploadContent: null,
                rubrics: null,
                description: "",
                submissionMode: "1",
                allowMultipleSubmissions: false,
                dueDate: new Date().toISOString().split('T')[0] // Default to today
            });
            navigate(`/programs/${id}/modules`);
        }).catch((error) => {
            toast.error(`Something went wrong: ${error}`);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        if (contentId) {
            const content = moduleContents?.find((item) => item.program_content_id === Number(contentId));
            if (content) {
                setContent(content);
                reset({
                    title: content.title || "",
                    duration: content.duration_in_minutes || "",
                    uploadContent: null,
                    rubrics: null,
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
        { label: 'Assignment', path: '' }
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">{content ? 'Edit' : 'Create'} Content</h1>
                    <p className="text-xs sm:text-sm text-gray-500">{content ? 'Edit the content for the module' : 'Create a new content for the module'}</p>
                </div>
            </div>
            {id && moduleId && <ContentTypeSelector type={"assignment"} programId={id} moduleId={moduleId} />}
            <Card>
                <CardHeader className='border-b'>
                    <div className="flex items-center gap-2">
                        <ClipboardList size={35} className="text-primary" />
                        <div>
                            <CardTitle className='text-lg'>Assignment</CardTitle>
                            <span className="text-sm text-gray-500">Add assignment for the module</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='p-6 space-y-6'>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title">Enter Title <span className="text-red-500">*</span></Label>
                                <Input id="title" placeholder="Enter assignment title" {...register("title", { required: "Title is required", maxLength: { value: 255, message: "Title must be less than 255 characters" } })} />
                                {errors.title && <p className="text-red-500 text-sm">Title is required and must be less than 255 characters</p>}
                            </div>
                            <div>
                                <Label htmlFor="duration">Duration</Label>
                                <Input id="duration" placeholder="e.g., 2 hours" {...register("duration", { pattern: { value: /^[0-9]+(\s*hours?|minutes?)?$/, message: "Invalid duration format" } })} />
                                {errors.duration && <p className="text-red-500 text-sm">Duration is required and must be in a valid format</p>}
                            </div>

                            <div>
                                <Label htmlFor="submissionMode">Submission Mode</Label>
                                <Select defaultValue="1" {...register("submissionMode")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Online</SelectItem>
                                        <SelectItem value="0">Offline</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.submissionMode && <p className="text-red-500 text-sm">Submission mode is required</p>}
                            </div>

                            <div>
                                <Label htmlFor="allowMultipleSubmissions">Allow Multiple Submissions</Label>
                                <Select defaultValue="0" onValueChange={(value) => setAllowMultipleSubmissions(value === "1")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Yes</SelectItem>
                                        <SelectItem value="0">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {allowMultipleSubmissions &&
                                <div>
                                    <Label htmlFor="allowMultipleSubmissions">How Many Submissions Allowed</Label>
                                    <Input id="allowMultipleSubmissions" type="number" min="0" placeholder="e.g., 3" {...register("allowMultipleSubmissions", {
                                        min: 0,
                                        valueAsNumber: true,
                                    })} />
                                </div>
                            }

                            <div>
                                <Label htmlFor="uploadContent">Assignment File <span className="text-red-500">*</span></Label>
                                <Input id="uploadContent" type="file" {...register("uploadContent", { required: "Assignment file is required", })} />
                                <span className="text-sm text-gray-500">Supported formats: pdf, docx</span>
                                {errors.uploadContent && <p className="text-red-500 text-sm">Assignment file is required</p>}
                            </div>
                            <div>
                                <Label htmlFor="rubrics">Upload Rubrics File</Label>
                                <Input id="rubrics" type="file" {...register("rubrics")} />
                                <span className="text-sm text-gray-500">Supported formats: pdf, docx</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <Label htmlFor="points">Points</Label>
                                <Input id="points" type="number" placeholder="e.g., 10" {...register("points", {
                                    min: 0,
                                    valueAsNumber: true,
                                    validate: value => value >= 0 || "Points must be a positive number"
                                })} />
                                {errors.points && <p className="text-red-500 text-sm">Points must be a positive number</p>}
                            </div>
                            <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input type="date" id="startDate" {...register("startDate", { required: "Start date is required" })} />
                                {errors.startDate && <p className="text-red-500 text-sm">Start Date is required</p>}
                            </div>

                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="endDate">End Date</Label>
                                <Input type="date" id="endDate" {...register("endDate", { required: "End date is required" })} />
                                {errors.endDate && <p className="text-red-500 text-sm">End Date is required</p>}
                            </div>

                            <div>
                                <Label htmlFor="dueDate">Due Date(Last date with extended date)</Label>
                                <Input type="date" id="dueDate" {...register("dueDate", { required: "Due date is required" })} />
                                {errors.dueDate && <p className="text-red-500 text-sm">Due Date is required</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Enter Description *</Label>
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
                            {errors.description && <p className="text-red-500 text-sm">Description is required</p>}
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" variant="default" className="text-white">
                                {
                                    content ? loading ? "Updating..." : "Update Assignment" : loading ? "Creating..." : "Create Assignment"
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default CreateAssignmentContent;