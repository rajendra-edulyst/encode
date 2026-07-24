
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from "@/components/ui/ShadcnInput";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { createJobApi, fetchDomain, fetchSkills, fetchCompanyList, fetchActiveJobRoles } from "@industry/services/JobService";
import { AlertTriangle, ArrowLeft, Calendar, Check, ChevronsUpDown, Loader, Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCities, getCounties, getCountryStates } from "@/services/learner/CountryService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/ui/rich-text-editor";

const jobSchema = z.object({
    designation: z.string().min(1, "Job title is required").max(100, "Job title is too long"),
    job_type: z.enum(["fulltime", "parttime", "internship", "placement"]).optional(),
    work_options: z.enum(["Remote", "Onsite", "Hybrid"]).optional(),
    job_level: z.enum(["Intern", "Entry", "Mid", "Senior"]).optional(),
    job_role: z.string().min(1, "Job role is required").max(100, "Job role is too long"),
    description: z.string().max(10000, "Description is too long").optional(),
    domain_id: z.string().min(1, "Functional domain is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    min_experience: z.string().optional(),
    max_experience: z.string().optional(),
    vacancy: z.number().min(1, "At least one vacancy is required").optional(),
    min_ctc: z.string().min(0, "Salary must be non-negative").optional(),
    address: z.string().max(200, "Address is too long").optional(),
    country_id: z.string().max(100, "Country is too long").optional(),
    state_id: z.string().max(100, "State is too long").optional(),
    city_id: z.string().max(100, "City is too long").optional(),
    file: z.any().optional(),
    job_url: z.string().optional(),
    skill_id: z.array(z.string().min(2, "Skill must be at least 2 characters").max(100)).optional(),
    is_published: z.number().min(1, "Publication status is required"),
    company_id: z.string().min(1, "Offered By is required")
});

type JobFormData = z.infer<typeof jobSchema>;

const JOB_TYPES = [
    { value: "fulltime", label: "Full Time" },
    { value: "parttime", label: "Part Time" },
    { value: "internship", label: "Internship" },
    { value: "placement", label: "Placement" },
];

const WORK_OPTIONS = ["Remote", "Onsite", "Hybrid"];
const JOB_LEVELS = ["Intern", "Entry", "Mid", "Senior"];

const AddJob: React.FC = () => {
    const { user } = useAuth();
    const [imagePreview, setImagePreview] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [countryOpen, setCountryOpen] = useState(false);
    const [stateOpen, setStateOpen] = useState(false);
    const [cityOpen, setCityOpen] = useState(false);
    const [skillsOpen, setSkillsOpen] = useState(false);
    const [companiesOpen, setCompaniesOpen] = useState(false);
    const [jobRolesOpen, setJobRolesOpen] = useState(false);

    const navigate = useNavigate();
    const imageFileRef = useRef<File | null>(null);
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);

    const { control, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<JobFormData>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            designation: "",
            job_type: 'fulltime',
            work_options: 'Onsite',
            job_level: 'Entry',
            job_role: "",
            description: "",
            domain_id: "",
            start_date: "",
            end_date: "",
            min_experience: "",
            max_experience: "",
            vacancy: 1,
            min_ctc: '',
            address: "",
            country_id: "",
            state_id: "",
            city_id: "",
            file: null,
            job_url: "",
            skill_id: [],
            is_published: 1,
            company_id: "",
        },
    });

    const selectedCountry = watch('country_id');
    const selectedState = watch('state_id');
    const selectedSkills = watch("skill_id");
    const selectedCompany = watch("company_id");
    const selectedJobRole = watch("job_role");

    const createJobMutation = useMutation({
        mutationFn: createJobApi,
        onSuccess: () => {
            toast('Job Created Successfully.');
            navigate('/industry/jobs');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
            toast("Something went wrong while creating job.");
            console.error('Job creation error:', err);
            setError("Failed to create job. Please try again later.");
        },
    });

    const { data: countries, isLoading: isCountriesLoading } = useQuery({
        queryKey: ['countries'],
        queryFn: () => getCounties(),
    });

    const { data: states, isLoading: isStatesLoading } = useQuery({
        queryKey: ['states', selectedCountry],
        queryFn: () => getCountryStates(selectedCountry),
        enabled: !!selectedCountry,
    });

    const { data: cities, isLoading: isCitiesLoading } = useQuery({
        queryKey: ['cities', selectedState],
        queryFn: () => getCities(selectedState),
        enabled: !!selectedState,
    });

    const { data: domains, isLoading: isDomainsLoading } = useQuery({
        queryKey: ['domains'],
        queryFn: () => fetchDomain()
    });

    const { data: skillSuggestions, isLoading: isSkillSuggestionsLoading } = useQuery({
        queryKey: ['skills'],
        queryFn: fetchSkills
    });

    const { data: companies, isLoading: isCompaniesLoading } = useQuery({
        queryKey: ['companies'],
        queryFn: fetchCompanyList
    });

    const { data: activeJobRoles, isLoading: isActiveJobRolesLoading } = useQuery({
        queryKey: ['activeJobRoles'],
        queryFn: fetchActiveJobRoles
    });

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB");
                return;
            }
            imageFileRef.current = file;
            setValue("file", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSkillSelect = (skillId: string) => {
        const currentSkills = selectedSkills || [];
        if (!currentSkills.includes(skillId)) {
            setValue("skill_id", [...currentSkills, skillId]);
        }
        setSkillsOpen(false);
    };

    const handleSkillRemove = (skillId: string) => {
        setValue("skill_id", selectedSkills?.filter((id: string) => id !== skillId));
    };

    const handleCompanySelect = (companyId: string) => {
        setValue("company_id", companyId);
        setCompaniesOpen(false);
    };

    const getSelectedJobRoleName = () => {
        if (!selectedJobRole) return "Select job role...";
        const role = activeJobRoles?.find(r => r.job_role === selectedJobRole);
        return role ? role.job_role : selectedJobRole;
    };

    const handleJobRoleSelect = (jobRoleValue: string) => {
        setValue("job_role", jobRoleValue);
        setJobRolesOpen(false);
    };

    const onSubmit = async (data: JobFormData) => {
        const formData = new FormData();

        // Build work_address string
        const workAddressParts = [];
        if (data.address) workAddressParts.push(data.address);

        // Get location names from IDs
        const country = countries?.find(c => c.id.toString() === data.country_id);
        const state = states?.find(s => s.id.toString() === data.state_id);
        const city = cities?.find(c => c.id.toString() === data.city_id);

        if (city?.name) workAddressParts.push(city.name);
        if (state?.name) workAddressParts.push(state.name);
        if (country?.name) workAddressParts.push(country.name);

        const work_address = workAddressParts.join(", ");

        // Fields to handle explicitly or skip
        const handledFields = [
            'file',
            'country_id',
            'state_id',
            'city_id',
            'address',
            'skill_id',
            'designation',
            'job_type',
            'description',
            'company_id'
        ];

        // Append other fields from data
        Object.entries(data).forEach(([key, value]) => {
            if (!handledFields.includes(key) && value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        // Explicitly append handled/mapped fields
        if (imageFileRef.current) {
            formData.append("file", imageFileRef.current);
        }

        if (data.skill_id && data.skill_id.length > 0) {
            data.skill_id.forEach(skill => {
                formData.append("skill_id[]", skill);
            });
        }

        formData.append("work_mode", data.job_type || "");
        formData.append("description", data.description || "");
        formData.append("title", data.designation);
        formData.append("name", data.designation);
        formData.append("designation", data.designation);
        formData.append("organized_by", data.company_id || "");
        formData.append("organization", user?.organization_id?.toString() || "3");

        if (work_address) {
            formData.append("work_address", work_address);
        }

        // Additional required API fields
        formData.append("is_mobile", "0");
        formData.append("status", "1");
        formData.append("parent_id", "0");
        formData.append("level", "1");
        formData.append("created_by", "1");
        formData.append("is_job", "1");

        createJobMutation.mutate(formData);
    };

    const handleCancel = () => {
        reset();
        navigate("/industry/jobs");
    };

    const getSelectedCompanyName = () => {
        if (!companies || !selectedCompany) return "Please select company...";
        const company = companies.find(c => c.id.toString() === selectedCompany);
        return company ? company.name : "Please select company...";
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold dark:text-white">Create New Job</h1>
                <p className="text-sm text-gray-500">Complete the form to add a new job opportunity</p>
            </div>
            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                    <AlertTriangle className="mr-2" />
                    {error}
                </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="dark:text-white">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name" className="dark:text-white">Job Title <span className="text-red-600">*</span></Label>
                                <Controller
                                    name="designation"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="Enter job title" className="mt-1" />
                                    )}
                                />
                                {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>}
                            </div>
                            <div>
                                <Label className="dark:text-white">Job Role <span className="text-red-500">*</span></Label>
                                <Controller
                                    control={control}
                                    name="job_role"
                                    render={({ field }) => {
                                        return (
                                            <Popover open={jobRolesOpen} onOpenChange={setJobRolesOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        disabled={isActiveJobRolesLoading}
                                                        aria-expanded={jobRolesOpen}
                                                        className="w-full justify-between focus-visible:ring-0 mt-1"
                                                    >
                                                        {getSelectedJobRoleName()}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search job roles..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>No job roles found.</CommandEmpty>
                                                            {activeJobRoles && activeJobRoles
                                                                .sort((a, b) => a.job_role.localeCompare(b.job_role))
                                                                .map((role) => (
                                                                    <CommandItem
                                                                        key={role.id}
                                                                        value={role.job_role}
                                                                        onSelect={() => handleJobRoleSelect(role.job_role)}
                                                                    >
                                                                        {role.job_role}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto h-4 w-4",
                                                                                field.value === role.job_role ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        );
                                    }}
                                />
                                {errors.job_role && <p className="text-red-500 text-sm mt-1">{errors.job_role.message}</p>}
                            </div>

                            <div>
                                <Label className="dark:text-white">Offered By <span className="text-red-500">*</span></Label>
                                <Controller
                                    control={control}
                                    name="company_id"
                                    render={({ field }) => {
                                        return (
                                            <Popover open={companiesOpen} onOpenChange={setCompaniesOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        disabled={isCompaniesLoading}
                                                        aria-expanded={companiesOpen}
                                                        className="w-full justify-between focus-visible:ring-0 mt-1"
                                                    >
                                                        {getSelectedCompanyName()}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search offers..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>No offers found.</CommandEmpty>
                                                            {companies && companies
                                                                .sort((a, b) => a.name.localeCompare(b.name))
                                                                .map((company) => (
                                                                    <CommandItem
                                                                        key={company.id}
                                                                        value={company.name}
                                                                        onSelect={() => handleCompanySelect(company.id.toString())}
                                                                    >
                                                                        {company.name}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto h-4 w-4",
                                                                                field.value === company.id.toString() ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        );
                                    }}
                                />
                                {errors.company_id && <p className="text-red-500 text-sm mt-1">{errors.company_id.message}</p>}
                            </div>

                            <div>
                                <Label className="dark:text-white">Job Type</Label>
                                <Controller
                                    name="job_type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select job type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {JOB_TYPES.map(type => (
                                                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div>
                                <Label className="dark:text-white">Work Options</Label>
                                <Controller
                                    name="work_options"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select work option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {WORK_OPTIONS.map(option => (
                                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div>
                                <Label className="dark:text-white">Job Level</Label>
                                <Controller
                                    name="job_level"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select job level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {JOB_LEVELS.map(option => (
                                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div>
                                <Label className="dark:text-white">Functional Domain <span className="text-red-600">*</span></Label>
                                <Controller
                                    name="domain_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} disabled={isDomainsLoading} onValueChange={field.onChange}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select domain" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {domains && domains.map(item => (
                                                    <SelectItem key={item.id} value={item.id.toString()}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.domain_id && <p className="text-red-500 text-sm mt-1">{errors.domain_id.message}</p>}
                            </div>
                        </div>
                        <div>
                            <Label className="dark:text-white">Job Description</Label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <RichTextEditor
                                        value={field.value || ""}
                                        maxLength={5000}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                    />
                                )}
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="dark:text-white">Dates and Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label className="dark:text-white">Start Date <span className="text-red-600">*</span></Label>
                                <Controller
                                    name="start_date"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="relative mt-1">
                                            <Input {...field} ref={startDateRef} type="date" className="[&::-webkit-calendar-picker-indicator]:opacity-0" />
                                            <Calendar
                                                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer"
                                                onClick={() => startDateRef.current?.showPicker()}
                                            />
                                        </div>
                                    )}
                                />
                                {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>}
                            </div>
                            <div>
                                <Label className="dark:text-white">End Date <span className="text-red-600">*</span></Label>
                                <Controller
                                    name="end_date"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="relative mt-1">
                                            <Input {...field} ref={endDateRef} type="date" className="[&::-webkit-calendar-picker-indicator]:opacity-0" />
                                            <Calendar
                                                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer"
                                                onClick={() => endDateRef.current?.showPicker()}
                                            />
                                        </div>
                                    )}
                                />
                                {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>}
                            </div>
                            <div>
                                <Label className="dark:text-white">Min Experience (Years)</Label>
                                <Controller
                                    name="min_experience"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="e.g., 3"
                                            className="mt-1"
                                            min="0"
                                            step="0.5"
                                        />
                                    )}
                                />
                                {errors.min_experience && <p className="text-red-500 text-sm mt-1">{errors.min_experience.message}</p>}
                            </div>
                            <div>
                                <Label className="dark:text-white">Max Experience (Years)</Label>
                                <Controller
                                    name="max_experience"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="e.g., 5"
                                            className="mt-1"
                                            min="0"
                                            step="0.5"
                                        />
                                    )}
                                />
                                {errors.max_experience && <p className="text-red-500 text-sm mt-1">{errors.max_experience.message}</p>}
                            </div>
                            <div>
                                <Label className="dark:text-white">Number of Vacancies</Label>
                                <Controller
                                    name="vacancy"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="Enter number"
                                            className="mt-1"
                                            min={1}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    )}
                                />
                                {errors.vacancy && <p className="text-red-500 text-sm mt-1">{errors.vacancy.message}</p>}
                            </div>
                            <div>
                                <Label className="dark:text-white">Salary</Label>
                                <Controller
                                    name="min_ctc"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Enter salary Range Ex. 5-10 LPA"
                                            className="mt-1"
                                            min={0}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    )}
                                />
                                {errors?.min_ctc && <p className="text-red-500 text-sm mt-1">{errors.min_ctc.message}</p>}
                            </div>
                            <div className="md:col-span-3">
                                <Label htmlFor="skills" className="block mb-2 font-medium dark:text-white">Skills</Label>
                                <Controller
                                    control={control}
                                    name="skill_id"
                                    render={({ field }) => (
                                        <div>
                                            <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={skillsOpen}
                                                        className="w-full justify-between focus-visible:ring-0"
                                                        disabled={isSkillSuggestionsLoading}
                                                    >
                                                        Select skills...
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search skills..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>No skills found.</CommandEmpty>
                                                            {skillSuggestions && skillSuggestions
                                                                .sort((a, b) => a.skill_name.localeCompare(b.skill_name))
                                                                .map((skill) => (
                                                                    <CommandItem
                                                                        key={skill.skill_id}
                                                                        value={skill.skill_name}
                                                                        onSelect={() => handleSkillSelect(skill.skill_id.toString())}
                                                                    >
                                                                        {skill.skill_name}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto h-4 w-4",
                                                                                field.value?.includes(skill.skill_id.toString()) ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedSkills && selectedSkills.map((skillId: string) => {
                                                    const skill = skillSuggestions?.find(s => s.skill_id.toString() === skillId);
                                                    return skill ? (
                                                        <div
                                                            key={skillId}
                                                            className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                                                        >
                                                            {skill.skill_name}
                                                            <button
                                                                type="button"
                                                                className="ml-2 focus:outline-none"
                                                                onClick={() => handleSkillRemove(skillId)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                        </div>
                                    )}
                                />
                                {errors?.skill_id && <p className="text-red-500 text-sm mt-1">{errors?.skill_id.message}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="dark:text-white">Location</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="block mb-2 font-medium dark:text-white">Address</Label>
                                <Controller
                                    name="address"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="Enter address" className="mt-1" />
                                    )}
                                />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="country" className="block mb-2 font-medium dark:text-white">
                                    Country
                                </Label>
                                <Controller
                                    control={control}
                                    name="country_id"
                                    render={({ field }) => {
                                        const selected = countries?.find(c => c.id.toString() === field.value?.toString());

                                        return (
                                            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        disabled={isCountriesLoading}
                                                        className="w-full justify-between focus-visible:ring-0"
                                                    >
                                                        {selected?.name || "Select country..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search country..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>No country found.</CommandEmpty>
                                                            {countries
                                                                ?.sort((a, b) => a.name.localeCompare(b.name))
                                                                .map((country) => (
                                                                    <CommandItem
                                                                        key={country.id}
                                                                        value={country.name}
                                                                        onSelect={() => {
                                                                            field.onChange(country.id.toString());
                                                                            setCountryOpen(false);
                                                                        }}
                                                                    >
                                                                        {country.name}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto h-4 w-4",
                                                                                field.value == country.id.toString() ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }}
                                />
                            </div>
                            <div>
                                <Label htmlFor="state" className="block mb-2 font-medium dark:text-white">
                                    State
                                </Label>
                                <Controller
                                    control={control}
                                    name="state_id"
                                    render={({ field }) => {
                                        const selected = states?.find(s => s.id.toString() === field.value?.toString());
                                        return (
                                            <Popover open={stateOpen} onOpenChange={setStateOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        disabled={isStatesLoading || !selectedCountry || !states?.length}
                                                        aria-expanded={stateOpen}
                                                        className="w-full justify-between focus-visible:ring-0"
                                                    >
                                                        {selected?.name || "Select state..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search state..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>No state found.</CommandEmpty>
                                                            {states
                                                                ?.sort((a, b) => a.name.localeCompare(b.name))
                                                                .map((state) => (
                                                                    <CommandItem
                                                                        key={state.id}
                                                                        value={state.name}
                                                                        onSelect={() => {
                                                                            field.onChange(state.id.toString());
                                                                            setStateOpen(false);
                                                                        }}
                                                                    >
                                                                        {state.name}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto h-4 w-4",
                                                                                field.value === state.id.toString() ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        );
                                    }}
                                />
                            </div>
                            <div>
                                <Label htmlFor="city" className="block mb-2 font-medium dark:text-white">
                                    City
                                </Label>
                                <Controller
                                    control={control}
                                    name="city_id"
                                    render={({ field }) => {
                                        const selected = cities?.find(c => c.id.toString() === field.value?.toString());

                                        return (
                                            <Popover open={cityOpen} onOpenChange={setCityOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        disabled={isCitiesLoading || !selectedState || !cities?.length}
                                                        aria-expanded={cityOpen}
                                                        className="w-full justify-between focus-visible:ring-0"
                                                    >
                                                        {selected?.name || "Select city..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search city..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>No city found.</CommandEmpty>
                                                            {cities
                                                                ?.sort((a, b) => a.name.localeCompare(b.name))
                                                                .map((city) => (
                                                                    <CommandItem
                                                                        key={city.id}
                                                                        value={city.name}
                                                                        onSelect={() => {
                                                                            field.onChange(city.id.toString());
                                                                            setCityOpen(false);
                                                                        }}
                                                                    >
                                                                        {city.name}
                                                                        <Check className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            field.value === city.id.toString() ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="dark:text-white">Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="block mb-2 font-medium dark:text-white">Banner Image</Label>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="imageUpload"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="imageUpload">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto" />
                                    ) : (
                                        <div className="text-center flex flex-col justify-center items-center">
                                            <Upload className="text-3xl text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">Click to upload image (max 5MB)</p>
                                        </div>
                                    )}
                                </div>
                            </label>
                        </div>
                        <div>
                            <Label className="block mb-2 font-medium dark:text-white">Reference URL</Label>
                            <Controller
                                name="job_url"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} type="url" placeholder="Enter URL" className="mt-1" />
                                )}
                            />
                            {errors.job_url && <p className="text-red-500 text-sm mt-1">{errors.job_url.message}</p>}
                        </div>
                        <div>
                            <Label className="block mb-2 font-medium dark:text-white">Job Status</Label>
                            <Controller
                                name="is_published"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field?.value?.toString()} onValueChange={(value) => field.onChange(Number(value))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Published Job</SelectItem>
                                            <SelectItem value="0">Draft Job</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.is_published && <p className="text-red-500 text-sm mt-1">{errors.is_published.message}</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex justify-end gap-4">
                        <Button className="text-black bg-gray-500 h-[118px] w-[125px] flex flex-col justify-center items-center" type="button" disabled={createJobMutation.isPending} onClick={handleCancel}>
                            <ArrowLeft /> Cancel
                        </Button>
                        <Button className="text-black h-[118px] w-[125px] flex flex-col justify-center items-center" type="submit" disabled={createJobMutation.isPending}>
                            {createJobMutation.isPending ? <Loader className="animate-spin mr-2" /> : <Plus />}
                            Create Job</Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default AddJob;