import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/ShadcnInput';
import { Button } from '@/components/ui/ShadcnButton';
import { FormItem, Form } from '@/components/ui/Form';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { QueryRequest } from '@/@types/learner/mailbox';
import { addQuery } from '@/services/learner/QueryService';
import { useMentorStore } from '@/store/learner/MentorListStore';
import { fetchIndustryMentorsList } from '@/services/create/MentorService';
import { Textarea } from '@/components/ui/textarea';

const CreateQuery: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

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
            navigate(`/queries?tab=${type === '1' ? 'sent' : 'drafts'}`);
        }).catch((error) => {
            console.error(error);
            enqueueSnackbar("Failed to send query", { variant: "error" });
        });
    };

    return (
        <>
            <header className="p-4">
                <h1 className="text-3xl font-bold capitalize">Create a Query</h1>
            </header>
            <main className="flex-1 px-4">
                <Form>
                    <div className="grid mt-3">
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
                                    <SelectItem value="mentor">Mentor</SelectItem>
                                    <SelectItem value="mentor">Faculty</SelectItem>
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
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
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

                        <FormItem
                            label="Title"
                            invalid={Boolean(errors.title)}
                            errorMessage={errors.title?.message}
                        >
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Enter Title"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Query"
                            invalid={Boolean(errors.description)}
                            errorMessage={errors.description?.message}
                        >
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        rows={4}
                                        placeholder="Enter your query"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className='flex justify-end gap-4 mt-5'>
                        <Button variant="outline" onClick={handleSubmit((data) => handleSubmission(data, '0'))}>
                            Save Draft
                        </Button>
                        <Button onClick={handleSubmit((data) => handleSubmission(data, '1'))}>
                            Send Query
                        </Button>
                    </div>
                </Form>
            </main>
        </>
    );
};

export default CreateQuery;