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
import { Eye, Headphones, X } from "lucide-react"
import { memo, useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"


const CreateAudioContent = () => {

    const navigate = useNavigate();
    const { id, moduleId, contentId } = useParams<{ id: string, moduleId: string, contentId: string }>();
    const { selectedModule, program, moduleContents } = useProgramDetailsStore();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<CommonModuleContent | null>(null);

    const [type, setType] = useState<'audio' | 'link'>('audio');
    const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm();

    const editorConfig = useMemo(() => ({
        ...JoEditConfig,
        height: 250
    }), []);

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
        formData.append("content_type", "audio");
        formData.append("program_id", moduleId);
        formData.append("PID_module", id);
        formData.append('content_type_label', 'Audio');

        if (contentId) {
            if (!isNaN(Number(contentId))) {
                formData.append("program_content_id", contentId);
            }
        }

        if (type === 'link') {
            formData.append("other_link", data.link);
        }

        if (data.uploadContent && data.uploadContent.length > 0) {
            // check if the file is selected
            if (data.uploadContent.length > 1) {
                toast.error("Please upload only one file.");
                return;
            }
            // check if the file is of valid type
            const validTypes = ["audio/mpeg", "audio/wav", "audio/ogg"];
            if (!validTypes.includes(data.uploadContent[0].type)) {
                toast.error("Invalid file type. Please upload an audio file.");
                return;
            }
            // append the file to the form data
            formData.append("content", data.uploadContent[0]);
        }

        setLoading(true);
        createModuleContent(formData).then(() => {
            toast.success("Audio content created successfully!");
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

    const breadcrumbItems = useMemo(() => [
        { label: 'Programs', path: '/programs' },
        { label: program?.name || 'Program Details', path: `/programs/${id}` },
        { label: selectedModule?.name || 'Module Details', path: `/programs/${id}/modules/${moduleId}` },
        { label: 'Create', path: '' },
        { label: 'Audio', path: '' }
    ], [program, selectedModule, id, moduleId]);

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">{content ? 'Edit Content' : 'Create Content'}</h1>
                    <p className="text-xs sm:text-sm text-gray-500">{content ? 'Edit the content for the module' : 'Create a new content for the module'}</p>
                </div>
            </div>
            {id && moduleId && <ContentTypeSelector type={"audio"} programId={id} moduleId={moduleId} />}
            <Card>
                <CardHeader className='border-b'>
                    <div className="flex items-center gap-2">
                        <Headphones size={35} className="text-primary" />
                        <div>
                            <CardTitle className='text-lg'>Audio</CardTitle>
                            <span className="text-sm text-gray-500">Add audio for the module</span>
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
                                <Label htmlFor="duration">Duration(listening time)</Label>
                                <Input id="duration" placeholder="e.g., 2 hours" {...register("duration", { pattern: { value: /^[0-9]+(\s*hours?|minutes?)?$/, message: "Invalid duration format" } })} />
                                {errors.duration && <p className="text-red-500 text-sm">Duration is required and must be in a valid format</p>}
                            </div>
                            <div>
                                <Label htmlFor="points">Points</Label>
                                <Input id="points" type="number" min="0" placeholder="e.g., 10" {...register("points", { min: 0 })} />
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

                        {/* type */}
                        <div>
                            <Label htmlFor="duration">Audio Type</Label>
                            <div className="mt-4">
                                <RadioGroup className="flex items-center space-x-4" defaultValue="audio" onValueChange={(value) => setType(value as 'audio' | 'link')}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="audio" id="audio" />
                                        <Label htmlFor="audio">Audio File</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="link" id="link" />
                                        <Label htmlFor="link">Audio Link</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                        {
                            type === 'link' ? (
                                <div className="space-y-2">
                                    <Label htmlFor="link">Enter Link</Label>
                                    <Input id="link" placeholder="Enter audio link" {...register("link", { required: true })} />
                                    {errors.link && <p className="text-red-500 text-sm">Link is required</p>}
                                </div>
                            ) : null
                        }
                        {
                            type === 'audio' ? (
                                <div>
                                    <div className="space-y-2">
                                        <Label htmlFor="uploadContent">Upload Audio File <span className="text-red-500">*</span></Label>
                                        <Input id="uploadContent" type="file" {...register("uploadContent", { required: true })} />
                                        <span className="text-sm text-gray-500">Supported formats: mp3, wav, ogg</span>
                                        {errors.uploadContent && <p className="text-red-500 text-sm">Audio file is required</p>}
                                    </div>
                                    {/* previe file option */}
                                    {
                                        watch("uploadContent") && watch("uploadContent").length > 0 ? (
                                            <div className="mt-2">
                                                <div className="flex items-center gap-2 border p-2 rounded bg-gray-50">
                                                    <svg width="48px" height="48px" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" fill="#36877d" stroke="#36877d"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.8"></g><g id="SVGRepo_iconCarrier"> <defs> </defs> <title></title> <g id="xxx-word"> <path className="cls-1" d="M325,105H250a5,5,0,0,1-5-5V25a5,5,0,0,1,10,0V95h70a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M325,154.83a5,5,0,0,1-5-5V102.07L247.93,30H100A20,20,0,0,0,80,50v98.17a5,5,0,0,1-10,0V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100v49.83A5,5,0,0,1,325,154.83Z"></path> <path className="cls-1" d="M300,380H100a30,30,0,0,1-30-30V275a5,5,0,0,1,10,0v75a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V275a5,5,0,0,1,10,0v75A30,30,0,0,1,300,380Z"></path> <path className="cls-1" d="M275,280H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M200,330H125a5,5,0,0,1,0-10h75a5,5,0,0,1,0,10Z"></path> <path className="cls-1" d="M325,280H75a30,30,0,0,1-30-30V173.17a30,30,0,0,1,30-30h.2l250,1.66a30.09,30.09,0,0,1,29.81,30V250A30,30,0,0,1,325,280ZM75,153.17a20,20,0,0,0-20,20V250a20,20,0,0,0,20,20H325a20,20,0,0,0,20-20V174.83a20.06,20.06,0,0,0-19.88-20l-250-1.66Z"></path> <path className="cls-1" d="M178.71,236h-9.8V189.32L154.14,236h-5l-14.84-46.68V236h-7.85V182.68h15L152.62,217l11-34.34h15.12Z"></path> <path className="cls-1" d="M200.08,236h-9.61V182.68H212.3q9.34,0,13.85,4.71a16.37,16.37,0,0,1-.37,22.95,17.49,17.49,0,0,1-12.38,4.53H200.08Zm0-29.37h11.37q4.45,0,6.8-2.19a7.58,7.58,0,0,0,2.34-5.82,8,8,0,0,0-2.17-5.62q-2.17-2.34-7.83-2.34H200.08Z"></path> <path className="cls-1" d="M249.37,212.45v-7.58h4.88a12.88,12.88,0,0,0,7.3-2,6.53,6.53,0,0,0,2.93-5.82,6.76,6.76,0,0,0-2.48-5.7,10.16,10.16,0,0,0-6.39-1.91q-7.89,0-10.74,7.73l-8.79-1.52a16.93,16.93,0,0,1,6.86-10,21.57,21.57,0,0,1,12.95-3.87,21.26,21.26,0,0,1,12.87,3.89,12.24,12.24,0,0,1,5.33,10.41,12.49,12.49,0,0,1-2.87,8.28,9.9,9.9,0,0,1-7.09,3.75,13.59,13.59,0,0,1,8.42,4.34,12.38,12.38,0,0,1,3.18,8.55,13.87,13.87,0,0,1-5.53,11.31q-5.53,4.43-14.71,4.43-8.48,0-14-4.32a18.47,18.47,0,0,1-7-9.9l9.1-2.23q2.73,8.91,11.8,8.91a11.39,11.39,0,0,0,7.56-2.4,7.32,7.32,0,0,0,2.87-5.8,8.47,8.47,0,0,0-2.48-6q-2.48-2.6-7.48-2.6Z"></path> </g> </g></svg>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Audio File</p>
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
                                        ) : null
                                    }
                                </div>
                            ) : null
                        }

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
                                {content ? loading ? "Updating..." : "Update Content" : loading ? "Creating..." : "Create Content"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default memo(CreateAudioContent);