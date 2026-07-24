// pages/learner/CreateQuery.tsx
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/ShadcnInput';
import { Button } from '@/components/ui/ShadcnButton';
import { FormItem, Form } from '@/components/ui/Form';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from "notistack";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QueryRequest } from '@/@types/learner/mailbox';
import { addQuery } from '@/services/learner/QueryService';
import { useMentorStore } from '@/store/learner/MentorListStore';
// import { fetchMentorList } from '@/services/learner/MentorListService';
import { Textarea } from '@/components/ui/textarea';
import { useMailboxStore } from './mailboxStore'
import { fetchIndustryMentorsList } from '@/services/create/MentorService';

interface CreateQueryPopupProps {
    resetQueryopen: () => void
}

const CreateQueryPopup: React.FC<CreateQueryPopupProps> = ({ resetQueryopen }) => {
    const { enqueueSnackbar } = useSnackbar();
    const { setActiveTab } = useMailboxStore();

    const { mentors, setMentors, error, setError, loading, setLoading } = useMentorStore();

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
        setValue,
    } = useForm<QueryRequest>({
        defaultValues: {
            title: '',
            description: '',
            for: '',
        },
    });

    const [queryType, setQueryType] = useState<'administrator' | 'mentor' | 'Faculty'>('administrator');

    useEffect(() => {
        setError('');
        setLoading(true);
        fetchIndustryMentorsList()
            .then((data: any) => {
                setMentors(Array.isArray(data) ? data : (data?.data || []));
            })
            .catch((err) => {
                setError('Failed to fetch mentors');
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [setMentors, setError, setLoading]);

    const validateForm = (data: QueryRequest) => {
        const errors: {
            title?: string;
            description?: string;
            for?: string;
        } = {};
        if (!data.title) errors.title = 'Title is required';
        if (!data.description) errors.description = 'Query is required';
        if (queryType === 'mentor' && !data.for) errors.for = 'Please select a mentor';
        return errors;
    };

    const handleSubmission = (data: QueryRequest, type: '0' | '1') => {
        const validationErrors = validateForm(data);
        if (Object.keys(validationErrors).length > 0) {
            Object.entries(validationErrors).forEach(([message]) => {
                enqueueSnackbar(message as string, { variant: "error" });
            });
            return;
        }

        const newQuery = {
            ...data,
            is_api: "1",
            type,
            to: queryType === 'administrator' ? 'administrator' : 'mentor',
            mentor: queryType === 'mentor' ? data.for : undefined,
        };

        addQuery(newQuery).then(() => {
            enqueueSnackbar("Query Sent Successfully", { variant: "success" });
            reset();
            setActiveTab('Sent');
            resetQueryopen();
        }).catch((error) => {
            console.error(error);
            enqueueSnackbar("Failed to send query", { variant: "error" });
        });
    };

    return (
        <div className='p-5 '>
            <Form>
                <div className="grid gap-4">
                    <FormItem label="Send To">
                        <Select
                            value={queryType}
                            onValueChange={(value: 'administrator' | 'mentor' | 'Faculty') => {
                                setQueryType(value);
                                if (value === 'administrator') {
                                    setValue('for', '');
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select recipient" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="administrator">Administrator</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>

                    {queryType === 'mentor' && (
                        <FormItem
                            label="Select Mentor"
                            invalid={Boolean(errors.for)}
                            errorMessage={errors.for?.message}
                        >
                            <Controller
                                name="for"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose mentor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loading ? (
                                                <SelectItem disabled value="">Loading...</SelectItem>
                                            ) : error ? (
                                                <SelectItem disabled value="">{error}</SelectItem>
                                            ) : (
                                                (Array.isArray(mentors) ? mentors : ((mentors as any)?.data || []))?.map((mentor: any) => (
                                                    <SelectItem key={mentor.id} value={mentor.id.toString()}>
                                                        {mentor.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </FormItem>
                    )}

                    <FormItem label="Title" invalid={Boolean(errors.title)} errorMessage={errors.title?.message}>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <Input placeholder="Enter Title" {...field} />
                            )}
                        />
                    </FormItem>

                    <FormItem label="Query" invalid={Boolean(errors.description)} errorMessage={errors.description?.message}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Textarea rows={4} placeholder="Enter your query" {...field} />
                            )}
                        />
                    </FormItem>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={handleSubmit((data) => handleSubmission(data, '0'))}>
                            Save Draft
                        </Button>
                        <Button onClick={handleSubmit((data) => handleSubmission(data, '1'))}>
                            Send Query
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default CreateQueryPopup;
