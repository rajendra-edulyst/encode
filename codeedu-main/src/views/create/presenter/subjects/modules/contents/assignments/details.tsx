import Breadcrumb from '@/components/breadcrumb'
import Heading from '@/components/heading'
import SafeHtml from '@/components/SafeHtml'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useAssignmentDetails, useAssignmentLearners } from '@/hooks/data/faculty/useProgram'
import { FileText, Download, Calendar, User, FileCheck } from 'lucide-react'
import { useParams } from 'react-router-dom'
import type { Assignment } from '@/@types/faculty/assignment'
import LearnerSubmissionRow from './submission-details'

// Extended type for assignment details with additional fields
interface ExtendedAssignment extends Assignment {
    allow_multiple?: number;
    submission_mode?: number;
    learner_name?: string;
}

const Assignment = () => {
    const { id } = useParams() as { id: string };
    const { data: assignmentDetails } = useAssignmentDetails(id);
    const { data: assignmentLearners = [] } = useAssignmentLearners(id);

    const submittedCount = assignmentLearners.filter(user => user.submission && user.submission !== '0').length;
    const notSubmittedCount = assignmentLearners.filter(user => !user.submission || user.submission === '0').length;
    const totalUsers = assignmentLearners.length;

    const breadcrumbItems = [
        { label: 'Assignments', path: '/create/subjects/assignments' },
        { label: assignmentDetails?.title || 'Assignment Details' }
    ]

    return (
        <div>
            <div>
                <Breadcrumb items={breadcrumbItems} />
                <Heading title={assignmentDetails?.title || 'Assignment Details'} description="Detailed information about the assignment." className="mt-4 mb-6" />
            </div>
            <Tabs defaultValue="details">
                <TabsList className='bg-[#5A5A5A] rounded-xl overflow-hidden p-0 h-auto mb-6'>
                    <TabsTrigger className='rounded-none text-white py-3 px-5' value="details">Details</TabsTrigger>
                    <TabsTrigger className='rounded-none text-white py-3 px-5' value="submissions">Submissions ({assignmentLearners.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className='flex flex-col gap-6'>
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="border-b border-border/50 pb-6">
                            <CardTitle className="text-2xl font-bold text-foreground">{assignmentDetails?.title || 'Assignment Title'}</CardTitle>
                            <CardDescription className="mt-3 text-base">
                                <SafeHtml html={assignmentDetails?.description || '<p>No description available.</p>'} />
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Main Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Duration */}
                                <div className="flex items-start gap-3 p-4 rounded-lg dark:bg-[#323232] border border-border/50">
                                    <div className="p-2 rounded-md bg-primary/10">
                                        <Calendar size={20} className="text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-muted-foreground dark:text-white mb-1">Duration</p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {assignmentDetails?.start_date && new Date(assignmentDetails.start_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: '2-digit',
                                                year: 'numeric',
                                            })} - {assignmentDetails?.end_date && new Date(assignmentDetails.end_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Graded Status */}
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 dark:bg-[#323232] border border-border/50">
                                    <div className="p-2 rounded-md bg-primary/10">
                                        <FileCheck size={20} className="text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-muted-foreground dark:text-white mb-1">Grading</p>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                {assignmentDetails?.is_graded ? (
                                                    <Badge className="bg-blue-500/90 hover:bg-blue-500 text-white border-0">Graded</Badge>
                                                ) : (
                                                    <Badge variant="outline">Not Graded</Badge>
                                                )}
                                            </div>
                                            <div>
                                                {/* maximun and passing marks */}
                                                {assignmentDetails?.is_graded === 1 && (
                                                    <span className="text-sm text-muted-foreground">
                                                        (Maximum marks: <span className='text-white font-bold'>{assignmentDetails?.maximum_marks || '0'}</span>, Passing Marks: <span className='text-white font-bold'>{assignmentDetails?.passing_marks || '0'}</span>)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Multiple Submissions */}
                                {(assignmentDetails as ExtendedAssignment)?.allow_multiple !== undefined && (
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 dark:bg-[#323232] border border-border/50">
                                        <div className="p-2 rounded-md bg-primary/10">
                                            <FileText size={20} className="text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-muted-foreground dark:text-white mb-1">Multiple Submissions</p>
                                            <div className="flex items-center gap-2">
                                                {(assignmentDetails as ExtendedAssignment)?.allow_multiple ? (
                                                    <Badge className="bg-green-500/90 hover:bg-green-500 text-white border-0">Allowed</Badge>
                                                ) : (
                                                    <Badge variant="outline">Not Allowed</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Submission Mode */}
                                {(assignmentDetails as ExtendedAssignment)?.submission_mode !== undefined && (
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 dark:bg-[#323232] border border-border/50">
                                        <div className="p-2 rounded-md bg-primary/10">
                                            <User size={20} className="text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-muted-foreground dark:text-white mb-1">Submission Mode</p>
                                            <p className="text-sm font-semibold text-foreground">
                                                {(assignmentDetails as ExtendedAssignment)?.submission_mode === 1 ? 'Online' : 'Offline'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Files Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {assignmentDetails?.file && (
                                    <a
                                        href={assignmentDetails.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 dark:bg-[#323232] border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                    >
                                        <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <FileText size={20} className="text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Assignment File</p>
                                            <p className="text-xs text-muted-foreground">Click to view or download</p>
                                        </div>
                                        <Download size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                    </a>
                                )}

                                {assignmentDetails?.rubrics_url && (
                                    <a
                                        href={assignmentDetails.rubrics_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 dark:bg-[#323232] border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                    >
                                        <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <FileText size={20} className="text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Rubrics Document</p>
                                            <p className="text-xs text-muted-foreground">Click to view grading criteria</p>
                                        </div>
                                        <Download size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                    </a>
                                )}

                                {(assignmentDetails as ExtendedAssignment)?.learner_name && (
                                    <div className={`flex items-center gap-3 p-4 rounded-lg bg-muted/50 dark:bg-[#323232] border border-border/50 ${assignmentDetails?.file && assignmentDetails?.rubrics_url ? 'md:col-span-2' : ''}`}>
                                        <div className="p-2 rounded-md bg-primary/10">
                                            <User size={20} className="text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-muted-foreground dark:text-white mb-1">Created By</p>
                                            <p className="text-sm font-semibold text-foreground">{(assignmentDetails as ExtendedAssignment).learner_name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Summary Statistics */}
                            <div className="border-t border-border/50 pt-6 mt-6">
                                <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                                    <div className="h-1 w-8 bg-primary rounded-full"></div>
                                    Submission Summary
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg dark:bg-[#323232]">
                                        <p className="text-sm text-muted-foreground mb-1">Total Learners</p>
                                        <p className="text-3xl font-bold text-foreground">{totalUsers}</p>
                                    </div>
                                    <div className="p-4 rounded-lg dark:bg-[#323232]">
                                        <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                                        <p className="text-3xl font-bold text-foreground">{submittedCount}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {totalUsers > 0 ? Math.round((submittedCount / totalUsers) * 100) : 0}% completion
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg dark:bg-[#323232]">
                                        <p className="text-sm text-muted-foreground mb-1">Pending</p>
                                        <p className="text-3xl font-bold text-foreground">{notSubmittedCount}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {totalUsers > 0 ? Math.round((notSubmittedCount / totalUsers) * 100) : 0}% remaining
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {assignmentDetails &&
                    <TabsContent value="submissions">
                        <Card className="border-border/50">
                            <CardHeader className="border-b border-border/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                                            <User size={22} className="text-primary" />
                                            Learner Submissions
                                        </CardTitle>
                                        <CardDescription className="mt-2">
                                            Click on any row to view detailed submission information
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <span className="text-muted-foreground">{submittedCount} Submitted</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                            <span className="text-muted-foreground">{notSubmittedCount} Pending</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {assignmentLearners.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                            <User size={32} className="text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground font-medium">No learners assigned to this assignment</p>
                                        <p className="text-sm text-muted-foreground mt-1">Learners will appear here once they are assigned</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-b border-border/50 hover:bg-transparent">
                                                    <TableHead className="font-semibold text-foreground w-[35%]">Learner</TableHead>
                                                    <TableHead className="font-semibold text-foreground w-[15%]">Status</TableHead>
                                                    <TableHead className="font-semibold text-foreground w-[20%]">Submission Date</TableHead>
                                                    <TableHead className="font-semibold text-foreground w-[15%]">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {assignmentLearners.map((learner) => (
                                                    <LearnerSubmissionRow key={learner.user_id} learner={learner} assignment={assignmentDetails} />
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                }
            </Tabs>
        </div>
    )
}

export default Assignment