import { CommonModuleContent } from "@/@types/faculty/program"
import Breadcrumb from "@/components/breadcrumb"
import ContentTypeSelector from "@/components/ContentTypeSelector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/ShadcnButton"
import { Input } from "@/components/ui/ShadcnInput"
import { createModuleContent } from "@/services/faculty/ProgramService"
import { useProgramDetailsStore } from "@/store/faculty/ProgramStore"
import { JoEditConfig } from "@/utils/joeditConfig"
import JoditEditor from "jodit-react"
import { Eye, Video, X } from "lucide-react"
import { memo, useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

const CreateVideoContent = () => {

    const navigate = useNavigate();
    const { id, moduleId, contentId } = useParams<{ id: string, moduleId: string, contentId: string }>();
    const { selectedModule, program, moduleContents } = useProgramDetailsStore();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<CommonModuleContent | null>(null);
    const [type, setType] = useState<'video' | 'link' | 'youtube'>('video');
    const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm();
    const editorConfig = useMemo(() => ({
        ...JoEditConfig,
        height: 250
    }), []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {

        if (!id || !moduleId) {
            toast.error("Program or module not found.");
            return;
        }

        const formData = new FormData();

        formData.append("title", data.notesTitle);
        formData.append("points", data.points.toString());
        formData.append("expected_duration", data.duration);
        formData.append("per_completion", data.defaultShortlisted);
        formData.append("description", data.description);
        formData.append("program_id", moduleId);
        formData.append("PID_module", id);
        formData.append('content_type_label', 'Video');
        formData.append('link', 'Video');

        if (contentId) {
            if (!isNaN(Number(contentId))) {
                formData.append("program_content_id", contentId);
            }
        }


        if (type === 'video') {
            formData.append("content_type", "video");
            if (data.uploadContent && data.uploadContent.length > 0) {
                // check if the file is selected
                if (data.uploadContent.length > 1) {
                    toast.error("Please upload only one file.");
                    return;
                }
                // check if the file is of valid type
                const validTypes = ["video/mp4", "video/avi", "video/mkv"];
                if (!validTypes.includes(data.uploadContent[0].type)) {
                    toast.error("Invalid file type. Please upload a video file.");
                    return;
                }
                // append the file to the form data
                formData.append("content", data.uploadContent[0]);
            }
        }

        if (type === 'link') {
            formData.append("content_type", "video");
            formData.append("other_link", data.link);
        }

        if (type === 'youtube') {
            formData.append("content", data.youtubeLink);
            formData.append("content_type", "video_yts");
        }


        setLoading(true);
        createModuleContent(formData).then(() => {
            toast.success("Video content created successfully!");
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
            toast.error(`Something went wrong: ${error}`);
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
        { label: 'Video', path: '' }
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
            {id && moduleId && <ContentTypeSelector type={"video"} programId={id} moduleId={moduleId} />}
            <Card>
                <CardHeader className='border-b'>
                    <div className="flex items-center gap-2">
                        <Video size={35} className="text-red-500" />
                        <div>
                            <CardTitle className='text-lg'>Video</CardTitle>
                            <span className="text-sm text-gray-500">Add video for the module</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='p-6 space-y-6'>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="notesTitle">Enter Title <span className="text-red-500">*</span></Label>
                                <Input id="notesTitle" placeholder="Enter notes title" {...register("notesTitle", {
                                    required: true,
                                    maxLength: 255,
                                })} />
                                {errors.notesTitle && <p className="text-red-500 text-sm">Title is required</p>}
                            </div>
                            <div>
                                <Label htmlFor="duration">Duration</Label>
                                <Input id="duration" placeholder="e.g., 2 hours" {...register("duration", {
                                    pattern: {
                                        value: /^[0-9]+(\s*hours?|minutes?)?$/,
                                        message: "Invalid duration format"
                                    }
                                })} />
                                {errors.duration && <p className="text-red-500 text-sm">Duration is required</p>}
                            </div>
                            <div>
                                <Label htmlFor="points">Points</Label>
                                <Input id="points" type="number" placeholder="e.g., 10" {...register("points", {
                                    valueAsNumber: true,
                                    min: 0
                                })} />
                                {errors.points && <p className="text-red-500 text-sm">Points must be a positive number</p>}
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
                        {/* <div>
                            <Select value={type} onValueChange={(value) => setType(value as 'video' | 'link' | 'youtube')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Content Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="video">Video File</SelectItem>
                                    <SelectItem value="youtube">YouTube Link</SelectItem>
                                    <SelectItem value="link">Other Video Link</SelectItem>
                                </SelectContent>
                            </Select>
                        </div> */}
                        <div>
                            <Label htmlFor="duration">Video Type</Label>
                            <div className="mt-4">
                                <RadioGroup className="flex items-center space-x-4" defaultValue="video" onValueChange={(value) => setType(value as 'video' | 'link' | 'youtube')}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="video" id="video" />
                                        <Label htmlFor="video">Video File</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="youtube" id="youtube" />
                                        <Label htmlFor="youtube">YouTube Link</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="link" id="link" />
                                        <Label htmlFor="link">Video Link</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {
                                type === 'video' && <div className="space-y-2">
                                    <Label htmlFor="uploadContent">Upload Video File <span className="text-red-500">*</span></Label>
                                    <Input id="uploadContent" type="file" {...register("uploadContent", { required: true })} />
                                    <span className="text-sm text-gray-500">Supported formats: mp4, avi, mkv</span>
                                    {errors.uploadContent && <p className="text-red-500 text-sm">Video file is required</p>}
                                </div>
                            }
                            {
                                type === 'link' && <div className="space-y-2">
                                    <Label htmlFor="link">Enter Link</Label>
                                    <Input id="link" placeholder="Enter video link" {...register("link", { required: true })} />
                                    {errors.link && <p className="text-red-500 text-sm">Link is required</p>}
                                    <span className="text-sm text-gray-500">Supported formats of link: mp4, avi, mkv</span>
                                </div>
                            }
                            {
                                type === 'youtube' && <div className="space-y-2">
                                    <Label htmlFor="youtubeLink">Enter YouTube Link</Label>
                                    <Input id="youtubeLink" placeholder="Enter YouTube video link" {...register("youtubeLink", { required: true })} />
                                    {errors.youtubeLink && <p className="text-red-500 text-sm">YouTube link is required</p>}
                                </div>
                            }
                        </div>
                        <div className="space-y-2">
                            {
                                type === "video" && watch("uploadContent") && watch("uploadContent")?.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 border p-2 rounded bg-gray-50">
                                            <svg width="48px" height="48px" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><title></title> <g id="xxx-word"> <path className="cls-1" d="M325,105H250a5,5,0,0,1-5-5V25a5,5,0,1,1,10,0V95h70a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M325,154.83a5,5,0,0,1-5-5V102.07L247.93,30H100A20,20,0,0,0,80,50v98.17a5,5,0,0,1-10,0V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100v49.83A5,5,0,0,1,325,154.83Z"></path> <path className="cls-1" d="M300,380H100a30,30,0,0,1-30-30V275a5,5,0,0,1,10,0v75a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V275a5,5,0,0,1,10,0v75A30,30,0,0,1,300,380Z"></path> <path className="cls-1" d="M275,280H125a5,5,0,1,1,0-10H275a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M200,330H125a5,5,0,1,1,0-10h75a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M325,280H75a30,30,0,0,1-30-30V173.17a30,30,0,0,1,30-30h.2l250,1.66a30.09,30.09,0,0,1,29.81,30V250A30,30,0,0,1,325,280ZM75,153.17a20,20,0,0,0-20,20V250a20,20,0,0,0,20,20H325a20,20,0,0,0,20-20V174.83a20.06,20.06,0,0,0-19.88-20l-250-1.66Z"></path> <path className="cls-1" d="M179.45,236h-9.8V189.32L154.88,236h-5L135,189.32V236h-7.85V182.68h15L153.36,217l11-34.34h15.12Z"></path> <path className="cls-1" d="M210.86,236.82q-10.63,0-16.54-8t-5.92-19.69q0-11.64,6.29-19.47a20.25,20.25,0,0,1,16.6-7.83q10.39,0,16.43,7.83t6,19.59q0,12.34-6.27,19.94A20.47,20.47,0,0,1,210.86,236.82Zm.08-7.73a11.05,11.05,0,0,0,8.79-4.3q3.59-4.3,3.59-15.59,0-9.18-3-14.39a9.88,9.88,0,0,0-9.22-5.21q-12.34,0-12.34,19.88,0,9.65,3.14,14.63A10,10,0,0,0,210.94,229.09Z"></path> <path className="cls-1" d="M261.84,236h-9.77l-16.45-53.32h10.16L258,223.54l12.5-40.86h8Z"></path> </g> </g></svg>
                                            <div>
                                                <p className="text-sm text-gray-500">Video File</p>
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
                                    </div>
                                )
                            }
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Enter Description</Label>
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
                                    content ? loading ? "Updating..." : "Update Video Content" : loading ? "Creating..." : "Create Video Content"
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default memo(CreateVideoContent);