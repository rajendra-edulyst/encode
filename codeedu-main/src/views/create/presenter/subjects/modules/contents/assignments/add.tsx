import Breadcrumb from "@/components/breadcrumb"
import Heading from "@/components/heading"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/ShadcnButton"
import { Input } from "@/components/ui/ShadcnInput"
import { useModuleContents, useMyAssignedPrograms, useProgramDetails } from "@/hooks/data/faculty/useProgram"
import { createModuleContent } from "@/services/faculty/ProgramService"
import { JoEditConfig } from "@/utils/joeditConfig"
import { QueryClient, useMutation } from "@tanstack/react-query"
import JoditEditor from "jodit-react"
import { ClipboardList, Loader, Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import AddModule from "../../../../../../faculty/subjects/modules/AddModule"


const AddAssignment = () => {

    const navigate = useNavigate();
    const queryClient = new QueryClient();
    const { contentId } = useParams<{ contentId: string }>();
    const [allowMultipleSubmissions, setAllowMultipleSubmissions] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm();
    const [addModuleDialogOpen, setAddModuleDialogOpen] = useState(false);

    const editorConfig = useMemo(() => ({
        ...JoEditConfig,
        height: 250
    }), []);


    const { data: subjects = [], isLoading: isLoadingSubjects, isError: isErrorSubjects } = useMyAssignedPrograms();
    const { data: content } = useModuleContents(contentId);

    const selectedCourseId = watch("course_id");
    const { data: subjectDetails, isLoading: isLoadingSubjectDetails } = useProgramDetails(selectedCourseId);
    const modules = subjectDetails?.modules || [];


    const createContentMutation = useMutation({
        mutationFn: createModuleContent,
        onSuccess: () => {
            toast.success("Content created successfully!");
            reset();
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            navigate('/assignments');
        },
        onError: (error) => {
            toast.error(`Something went wrong: ${error}`);
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {

        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("points", data.points.toString());
        formData.append("expected_duration", data.duration);
        formData.append("description", data.description);
        formData.append("content_type", "assignment");
        formData.append("program_id", data.module_id);
        formData.append("PID_module", data.id);
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

            formData.append("rubric", data.rubrics[0]);
        }

        createContentMutation.mutate(formData);
    };

    const breadcrumbItems = [
        { label: 'Programs', path: '/subjects' },
        { label: 'Assignments', path: '/assignments' },
        { label: 'Create', path: '' },
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="mb-3 flex items-center gap-3">
                <ClipboardList size={35} className="text-primary" />
                <Heading title={`${content ? 'Edit' : 'Create'} Assignment`} description={`${content ? 'Edit the assignment for the module' : 'Create a new assignment for the module'}`} className="mb-0" />
            </div>
            <Card>
                <CardContent className='p-6 space-y-6'>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <h4 className="font-semibold mb-2 text-base">Course Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Course/Subject <span className="text-red-500">*</span></Label>
                                    <Controller
                                        name="course_id"
                                        control={control}
                                        rules={{ required: "Course is required" }}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                disabled={isLoadingSubjects || isErrorSubjects || subjects.length === 0}
                                                onValueChange={(value) => field.onChange(value)}
                                            >
                                                <SelectTrigger className="">
                                                    <SelectValue placeholder="Select Course/Subject" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subjects?.map((subject) => (
                                                        <SelectItem key={subject.id} value={subject.id.toString()}>
                                                            {subject.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <Label>Module <span className="text-red-500">*</span></Label>
                                        {
                                            subjectDetails && <div className="text-blue-500 cursor-pointer flex gap-1 items-center" onClick={() => setAddModuleDialogOpen(true)}>
                                                <Plus size={15} />
                                                <span>Add Module</span>
                                            </div>
                                        }
                                    </div>
                                    <Controller
                                        name="module_id"
                                        control={control}
                                        rules={{ required: "Module is required" }}
                                        render={({ field }) => (
                                            <div className="relative">
                                                <Select value={field.value} disabled={isLoadingSubjects || isErrorSubjects || subjects.length === 0}
                                                    onValueChange={(value) => field.onChange(value)}
                                                >
                                                    <SelectTrigger className="focus:ring-0 focus:outline-0 focus:shadow-none">
                                                        <SelectValue placeholder="Select Module" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {
                                                            modules?.map((module, index) => (
                                                                <SelectItem key={`module-${index}`} value={module?.id?.toString()}>{module?.name}</SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                {
                                                    isLoadingSubjectDetails && <Loader size={15} className="text-gray-500 animate-spin mt-1 absolute right-10 top-2" />
                                                }
                                            </div>
                                        )}
                                    />
                                    {isLoadingSubjectDetails ? <div className="text-sm text-gray-500">please wait...</div> : <div className="text-sm text-gray-500">If module is not listed, please add the module first.</div>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2 text-base">Assignment Details</h4>
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
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" variant="default" className="text-white">
                                {
                                    content ? createContentMutation.isPending ? "Updating..." : "Update Assignment" : createContentMutation.isPending ? "Creating..." : "Create Assignment"
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            {subjectDetails && <AddModule open={addModuleDialogOpen} program={subjectDetails} onOpenChange={setAddModuleDialogOpen} />}
        </>
    )
}

export default AddAssignment;