import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/ShadcnInput"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ContentTypeIcons from "@/views/player/content/icons"
import { Controller, useForm } from "react-hook-form"
import { memo, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useProgramDetailsStore } from "@/store/faculty/ProgramStore"
import { CommonModuleContent } from "@/@types/faculty/program"
import { createModuleContent } from "@/services/faculty/ProgramService"
import { toast } from "sonner"
import Breadcrumb from "@/components/breadcrumb"
import ContentTypeSelector from "@/components/ContentTypeSelector"
import { Button } from "@/components/ui/ShadcnButton"
import JoditEditor from "jodit-react"
import { JoEditConfig } from "@/utils/joeditConfig"

const CreateLiveClassContent = () => {

    const [selectedType, setSelectedType] = useState<string>("ilt");
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
        formData.append("content_type", "liveclass");
        formData.append("program_id", moduleId);
        formData.append("PID_module", id);
        formData.append('content_type_label', 'Live Class');

        if (selectedType === "ilt") {
            formData.append("venue", data.venue);
        } else if (selectedType === "zoom") {
            formData.append("zoom_url", data.zoomUrl);
            formData.append("zoom_passkey", data.zoomPasskey);
        } else if (selectedType === "teams") {
            formData.append("passcode", data.passcode);
        } else if (selectedType === "other") {
            formData.append("other_link", data.otherLink);
        } else {
            toast.error("Please select a valid session type.");
            return;
        }

        if (contentId) {
            if (!isNaN(Number(contentId))) {
                formData.append("program_content_id", contentId);
            }
        }

        setLoading(true);
        createModuleContent(formData).then(() => {
            toast.success("Live Class content created successfully!");
            reset({
                title: "",
                duration: "",
                points: 0,
                defaultShortlisted: "",
                uploadContent: null,
                description: "",
                sessionType: "ilt",
                venue: "",
                zoomUrl: "",
                zoomPasskey: "",
                teamsUrl: "",
                otherLink: ""
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
            {id && moduleId && <ContentTypeSelector type={"liveClass"} programId={id} moduleId={moduleId} />}
            <Card>
                <CardHeader className='border-b'>
                    <div className="flex items-center gap-2">
                        <ContentTypeIcons content_type='liveclass' />
                        <div>
                            <CardTitle className='text-lg'>Live Class</CardTitle>
                            <span className="text-sm text-gray-500">Add live class for the module</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='p-6 space-y-6'>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="liveClassTitle">Enter Title *</Label>
                                <Input id="liveClassTitle" placeholder="Enter live class title" {...register("title", { required: true })} />
                                {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
                            </div>
                            <div>
                                <Label htmlFor="duration">Duration</Label>
                                <Input id="duration" placeholder="e.g., 2 hours" {...register("duration")} />
                                <p className="text-sm text-gray-500">Duration of the live class</p>
                            </div>
                            <div>
                                <Label htmlFor="points">Points</Label>
                                <Input id="points" type="number" placeholder="e.g., 10" {...register("points")} />
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
                            <div>
                                <Label htmlFor="sessionType">Select Type *</Label>
                                <Select onValueChange={(value) => setSelectedType(value)}>
                                    <SelectTrigger id="sessionType">
                                        <SelectValue placeholder="Select session type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ilt">ILT Session</SelectItem>
                                        <SelectItem value="zoom">Zoom</SelectItem>
                                        <SelectItem value="teams">MS Teams</SelectItem>
                                        <SelectItem value="other">Other Link</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {selectedType === "ilt" && (
                                <div>
                                    <Label htmlFor="venue">Enter Venue *</Label>
                                    <Input id="venue" placeholder="Enter venue details"  {...register("venue", { required: true })} />
                                    {errors.venue && <p className="text-red-500 text-sm">Venue is required</p>}
                                </div>
                            )}
                            {selectedType === "zoom" && (
                                <>
                                    <div>
                                        <Label htmlFor="zoomUrl">Enter Zoom URL *</Label>
                                        <Input id="zoomUrl" placeholder="Enter Zoom meeting URL" {...register("zoomUrl", { required: true })} />
                                        {errors.zoomUrl && <p className="text-red-500 text-sm">Zoom URL is required</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="zoomPasskey">Enter Zoom Passkey</Label>
                                        <Input id="zoomPasskey" placeholder="Enter Zoom passkey" {...register("zoomPasskey")} />
                                    </div>
                                </>
                            )}
                            {selectedType === "teams" && (
                                <div>
                                    <Label htmlFor="passcode">Enter Teams Passcode *</Label>
                                    <Input id="passcode" placeholder="Teams meeting passcode" {...register("passcode", { required: true })} />
                                    {errors.passcode && <p className="text-red-500 text-sm">Teams Passcode is required</p>}
                                </div>
                            )}
                            {selectedType === "other" && (
                                <div>
                                    <Label htmlFor="otherLink">Enter Link *</Label>
                                    <Input id="otherLink" placeholder="Enter other meeting link" {...register("otherLink", { required: true })} />
                                    {errors.otherLink && <p className="text-red-500 text-sm">Other Link is required</p>}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
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
                            )}                        </div>
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

export default memo(CreateLiveClassContent);