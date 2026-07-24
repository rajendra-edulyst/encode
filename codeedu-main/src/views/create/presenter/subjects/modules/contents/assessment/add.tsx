import Breadcrumb from "@/components/breadcrumb"
import Heading from "@/components/heading"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMyAssignedPrograms, useProgramDetails } from "@/hooks/data/faculty/useProgram"
import { HelpCircle, Loader, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import AddModule from "../../../../../../faculty/subjects/modules/AddModule"
import CreateQuizContent from "../../../../../../faculty/programs/creation/modules/contents/quiz"

const AddAssessment = () => {
    const navigate = useNavigate();
    const { control, watch } = useForm();
    const [addModuleDialogOpen, setAddModuleDialogOpen] = useState(false);

    const { data: subjects = [], isLoading: isLoadingSubjects, isError: isErrorSubjects } = useMyAssignedPrograms();

    const selectedCourseId = watch("course_id");
    const { data: subjectDetails, isLoading: isLoadingSubjectDetails } = useProgramDetails(selectedCourseId);
    const modules = subjectDetails?.modules || [];

    const selectedModuleId = watch("module_id");

    const breadcrumbItems = [
        { label: 'Assessments', path: '/assessments' },
        { label: 'Create', path: '' },
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="mb-3 flex items-center gap-3">
                <HelpCircle size={35} className="text-primary" />
                <Heading title="Create Assessment" description="Create a new assessment for the module" className="mb-0" />
            </div>

            <Card className="mb-6">
                <CardContent className='p-6 space-y-6'>
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
                                        <SelectTrigger>
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
                                    subjectDetails && (
                                        <div className="text-blue-500 cursor-pointer flex gap-1 items-center" onClick={() => setAddModuleDialogOpen(true)}>
                                            <Plus size={15} />
                                            <span>Add Module</span>
                                        </div>
                                    )
                                }
                            </div>
                            <Controller
                                name="module_id"
                                control={control}
                                rules={{ required: "Module is required" }}
                                render={({ field }) => (
                                    <div className="relative">
                                        <Select
                                            value={field.value}
                                            disabled={!selectedCourseId || isLoadingSubjectDetails}
                                            onValueChange={(value) => field.onChange(value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Module" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {modules?.map((module, index) => (
                                                    <SelectItem key={`module-${index}`} value={module?.id?.toString()}>
                                                        {module?.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {isLoadingSubjectDetails && (
                                            <Loader size={15} className="text-gray-500 animate-spin mt-1 absolute right-10 top-2" />
                                        )}
                                    </div>
                                )}
                            />
                            {!selectedCourseId && <div className="text-sm text-gray-400">Please select a course first</div>}
                            {selectedCourseId && (isLoadingSubjectDetails ? <div className="text-sm text-gray-500">please wait...</div> : <div className="text-sm text-gray-500">If module is not listed, please add the module first.</div>)}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selectedCourseId && selectedModuleId && (
                <div className="mt-6">
                    <CreateQuizContent
                        programId={selectedCourseId}
                        moduleId={selectedModuleId}
                        hideHeader={true}
                        onSuccess={() => navigate("/assessments")}
                    />
                </div>
            )}

            {subjectDetails && <AddModule open={addModuleDialogOpen} program={subjectDetails} onOpenChange={setAddModuleDialogOpen} />}
        </>
    )
}

export default AddAssessment;
