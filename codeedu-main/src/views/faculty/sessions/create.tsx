import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/ShadcnInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/ShadcnButton';
import { toast } from 'sonner';
import Breadcrumb from '@/components/breadcrumb';
import { fetchAssignedProgramsforFilter, fetchProgramBatchAndModule } from '@/services/faculty/ProgramService';
import { AssignedProgramForFilter, ProgramBatchAndModule } from '@/@types/faculty/program';
import { createSession } from '@/services/faculty/SessionsService';
import { useNavigate } from 'react-router-dom';

interface FormData {
    title: string;
    start_date: string;
    content_type: string;
    description: string;
    expected_duration: string;
    zoom_url: string;
    zoom_passkey: string;
    meeting_link: string;
    program_id: number;
    batch_id: number;
    module_id: number;
    venue: string;
    other_url: string;
}

const getCurrentDateTimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
};


const CreateLiveClass: React.FC = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        title: '',
        start_date: getCurrentDateTimeLocal(),
        content_type: '',
        description: '',
        expected_duration: '',
        zoom_url: '',
        zoom_passkey: '',
        meeting_link: '',
        program_id: 0,
        batch_id: 0,
        module_id: 0,
        venue: '',
        other_url: '',
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [programs, setPrograms] = useState<AssignedProgramForFilter[]>([]);
    const [batchAndModules, setBatchAndModules] = useState<ProgramBatchAndModule | null>(null);

    const validateForm = () => {
        const newErrors: Partial<FormData> = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.start_date) newErrors.start_date = 'Start date is required';
        if (!formData.content_type) newErrors.content_type = 'Content type is required';
        if (!formData.expected_duration) newErrors.expected_duration = 'Expected duration is required';
        if (formData.content_type === 'zoomclass' && !formData.zoom_url) {
            newErrors.zoom_url = 'Zoom URL is required';
        }
        if (formData.content_type === 'zoomclass' && !formData.zoom_passkey) {
            newErrors.zoom_passkey = 'Zoom passkey is required';
        }
        if (formData.content_type === 'team' && !formData.meeting_link) {
            newErrors.meeting_link = 'Meeting link is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const fetchFacultyAssignedPrograms = async () => {
        fetchAssignedProgramsforFilter().then((res) => {
            setPrograms(res);
        }).catch((err) => {
            console.error("Failed to fetch programs", err);
        });
    }

    useEffect(() => {
        fetchFacultyAssignedPrograms();
    }, []);

    useEffect(() => {
        if (!formData.program_id) return;
        fetchProgramBatchAndModule(formData.program_id).then((res) => {
            setBatchAndModules(res);
        }).catch((err) => {
            console.error("Failed to fetch batch and modules", err);
        });
    }, [formData.program_id]);


    // Breadcrumb items
    const breadcrumbItems = [
        { label: 'Sessions', path: '/sessions' },
        { label: 'Create Live Class' },
    ];


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('start_date', formData.start_date);
        data.append('content_type', formData.content_type);
        data.append('description', formData.description);
        data.append('expected_duration', formData.expected_duration);
        data.append('parent_program_id', String(formData.program_id));
        data.append('batch_id', String(formData.batch_id));
        data.append('program_id', String(formData.module_id));
        data.append('content_type', formData.content_type);
        data.append('venue', formData.venue);
        data.append('content_type_label', formData.title);
        data.append('other_url', formData.other_url);
        data.append('difficulty_level', 'easy');
        data.append('order', '2');
        data.append('privacy', '1');
        data.append('language', '1');
        data.append('g_score', '15');
        data.append('per_completion', '80');

        try {
            await createSession(data);
            toast.success('Live class created successfully');
            navigate('/sessions');
        } catch (error) {
            toast.error('Failed to create live class');
            console.error('Error creating live class:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    // set mock data for testing
    useEffect(() => {
        setFormData({
            title: '',
            start_date: getCurrentDateTimeLocal(),
            content_type: '',
            description: '',
            expected_duration: '60',
            zoom_url: '',
            zoom_passkey: '',
            meeting_link: '',
            program_id: 0,
            batch_id: 0,
            module_id: 0,
            venue: '',
            other_url: '',
        });
    }, []);

    return (
        <div className="">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">Create Live Class</h1>
                <p className="text-xs sm:text-sm text-gray-500">Schedule a new live class session</p>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-card p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
                <div className="col-span-1 md:col-span-1">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="title"
                        type="text"
                        placeholder="Enter class title"
                        value={formData.title}
                        className={`mt-1 w-full text-sm ${errors.title ? 'border-red-500' : ''}`}
                        aria-invalid={!!errors.title}
                        aria-describedby="title-error"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    {errors.title && (
                        <p id="title-error" className="text-red-500 text-xs mt-1">
                            {errors.title}
                        </p>
                    )}
                </div>

                <div className="col-span-1 md:col-span-1">
                    <label htmlFor="program_id" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Program <span className="text-red-500">*</span>
                    </label>
                    <Select
                        aria-invalid={!!errors.program_id}
                        aria-describedby="program_id-error"
                        onValueChange={(value) => setFormData({ ...formData, program_id: Number(value) })}
                    >
                        <SelectTrigger id="program_id" className={`mt-1 w-full text-sm ${errors.program_id ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                            {programs.map((program) => (
                                <SelectItem key={program.id} value={String(program.id)}>
                                    {program.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.program_id && (
                        <p id="program_id-error" className="text-red-500 text-xs mt-1">
                            {errors.program_id}
                        </p>
                    )}
                </div>
                {/* select batch */}
                <div className="col-span-1 md:col-span-1">
                    <label htmlFor="batch_id" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Batch <span className="text-red-500">*</span> (<span className="text-xs text-gray-500">Select program first to see batches</span>)
                    </label>
                    <Select
                        aria-invalid={!!errors.batch_id}
                        aria-describedby="batch_id-error"
                        disabled={!batchAndModules?.batch.length}
                        onValueChange={(value) => setFormData({ ...formData, batch_id: Number(value) })}
                    >
                        <SelectTrigger id="batch_id" className={`mt-1 w-full text-sm ${errors.batch_id ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Select batch" />
                        </SelectTrigger>
                        <SelectContent>
                            {batchAndModules?.batch.map((batch) => (
                                <SelectItem key={batch.id} value={String(batch.id)}>
                                    {batch.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.batch_id && (
                        <p id="batch_id-error" className="text-red-500 text-xs mt-1">
                            {errors.batch_id}
                        </p>
                    )}
                </div>
                {/* select module */}
                <div className="col-span-1 md:col-span-1">
                    <label htmlFor="module_id" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Module <span className="text-red-500">*</span> (<span className="text-xs text-gray-500">Select program first to see batches</span>)
                    </label>
                    <Select
                        aria-invalid={!!errors.module_id}
                        aria-describedby="module_id-error"
                        disabled={!batchAndModules?.module.length}
                        onValueChange={(value) => setFormData({ ...formData, module_id: Number(value) })}
                    >
                        <SelectTrigger id="module_id" className={`mt-1 w-full text-sm ${errors.module_id ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Select module" />
                        </SelectTrigger>
                        <SelectContent>
                            {batchAndModules?.module.map((module) => (
                                <SelectItem key={module.id} value={String(module.id)}>
                                    {module.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.module_id && (
                        <p id="module_id-error" className="text-red-500 text-xs mt-1">
                            {errors.module_id}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="content_type" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Content Type <span className="text-red-500">*</span>
                    </label>
                    <Select
                        aria-invalid={!!errors.content_type}
                        aria-describedby="content_type-error"
                        onValueChange={(value) => setFormData({ ...formData, content_type: value })}
                    >
                        <SelectTrigger id="content_type" className={`mt-1 w-full text-sm ${errors.content_type ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="zoomclass">Zoom</SelectItem>
                            <SelectItem value="teamsclass">Microsoft Teams</SelectItem>
                            <SelectItem value="offlineclass">Offline Class</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.content_type && (
                        <p id="content_type-error" className="text-red-500 text-xs mt-1">
                            {errors.content_type}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Start Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                        <Input
                            type="datetime-local"
                            id="start_date"
                            value={formData.start_date}
                            className={`w-full text-sm ${errors.start_date ? 'border-red-500' : ''}`}
                            aria-invalid={!!errors.start_date}
                            aria-describedby="start_date-error"
                            min={new Date().toISOString().slice(0, 16)}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        />
                    </div>
                    {errors.start_date && (
                        <p id="start_date-error" className="text-red-500 text-xs mt-1">
                            {errors.start_date}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="expected_duration" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Expected Duration (minutes) <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="expected_duration"
                        type="number"
                        placeholder="Enter duration in minutes"
                        value={formData.expected_duration}
                        className={`mt-1 w-full text-sm ${errors.expected_duration ? 'border-red-500' : ''}`}
                        aria-invalid={!!errors.expected_duration}
                        aria-describedby="expected_duration-error"
                        onChange={(e) => setFormData({ ...formData, expected_duration: e.target.value })}
                    />
                    {errors.expected_duration && (
                        <p id="expected_duration-error" className="text-red-500 text-xs mt-1">
                            {errors.expected_duration}
                        </p>
                    )}
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-white">
                        Description
                    </label>
                    <Textarea
                        id="description"
                        placeholder="Enter class description"
                        value={formData.description}
                        className="mt-1 w-full text-sm"
                        rows={4}
                        aria-describedby="description-help"
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <p id="description-help" className="text-xs text-gray-500 mt-1">
                        Optional: Provide details about the class
                    </p>
                </div>

                {formData.content_type === 'zoomclass' && (
                    <>
                        <div>
                            <label htmlFor="zoom_url" className="block text-sm font-medium text-gray-700 dark:text-white">
                                Zoom URL <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="zoom_url"
                                type="url"
                                placeholder="Enter Zoom URL"
                                value={formData.zoom_url}
                                className={`mt-1 w-full text-sm ${errors.zoom_url ? 'border-red-500' : ''}`}
                                aria-invalid={!!errors.zoom_url}
                                aria-describedby="zoom_url-error"
                                onChange={(e) => setFormData({ ...formData, zoom_url: e.target.value })}
                            />
                            {errors.zoom_url && (
                                <p id="zoom_url-error" className="text-red-500 text-xs mt-1">
                                    {errors.zoom_url}
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="zoom_passkey" className="block text-sm font-medium text-gray-700 dark:text-white">
                                Zoom Passkey <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="zoom_passkey"
                                type="text"
                                placeholder="Enter Zoom passkey"
                                value={formData.zoom_passkey}
                                className={`mt-1 w-full text-sm ${errors.zoom_passkey ? 'border-red-500' : ''}`}
                                aria-invalid={!!errors.zoom_passkey}
                                aria-describedby="zoom_passkey-error"
                                onChange={(e) => setFormData({ ...formData, zoom_passkey: e.target.value })}
                            />
                            {errors.zoom_passkey && (
                                <p id="zoom_passkey-error" className="text-red-500 text-xs mt-1">
                                    {errors.zoom_passkey}
                                </p>
                            )}
                        </div>
                    </>
                )}

                {formData.content_type === 'team' && (
                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="meeting_link" className="block text-sm font-medium text-gray-700 dark:text-white">
                            Meeting Link <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="meeting_link"
                            type="url"
                            placeholder="Enter Microsoft Teams meeting link"
                            value={formData.meeting_link}
                            className={`mt-1 w-full text-sm ${errors.meeting_link ? 'border-red-500' : ''}`}
                            aria-invalid={!!errors.meeting_link}
                            aria-describedby="meeting_link-error"
                            onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                        />
                        {errors.meeting_link && (
                            <p id="meeting_link-error" className="text-red-500 text-xs mt-1">
                                {errors.meeting_link}
                            </p>
                        )}
                    </div>
                )}

                {
                    formData.content_type === 'offlineclass' && (
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 dark:text-white">
                                Venue <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="venue"
                                type="text"
                                placeholder="Enter venue details"
                                value={formData.venue}
                                className={`mt-1 w-full text-sm ${errors.venue ? 'border-red-500' : ''}`}
                                aria-invalid={!!errors.venue}
                                aria-describedby="venue-error"
                                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                            />
                            {errors.venue && (
                                <p id="venue-error" className="text-red-500 text-xs mt-1">
                                    {errors.venue}
                                </p>
                            )}
                        </div>
                    )
                }

                {
                    formData.content_type === 'other' && (
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="other_url" className="block text-sm font-medium text-gray-700 dark:text-white">
                                Other url <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="other_url"
                                type="text"
                                placeholder="Enter url"
                                value={formData.other_url}
                                className={`mt-1 w-full text-sm ${errors.other_url ? 'border-red-500' : ''}`}
                                aria-invalid={!!errors.other_url}
                                aria-describedby="other-error"
                                onChange={(e) => setFormData({ ...formData, other_url: e.target.value })}
                            />
                            {errors.other_url && (
                                <p id="other-error" className="text-red-500 text-xs mt-1">
                                    {errors.other_url}
                                </p>
                            )}
                        </div>
                    )
                }


                <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                    <Button
                        type="submit"
                        className="text-sm h-9 text-black"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Creating...
                            </span>
                        ) : (
                            'Create Live Class'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateLiveClass;