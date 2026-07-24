import Breadcrumb from '@/components/breadcrumb'
import StatusIndicator from '@/components/StatusIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcnAvatar';
import { Button } from '@/components/ui/ShadcnButton';
import { useAssignmentDetailsStore, useAssignmentSubmissionUsersStore } from '@/store/faculty/AssignmentStore';
import { Calendar, Check, ChevronDown, ChevronRight, ChevronUp, Download, X } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import * as echarts from 'echarts';
import Submissions from './submissions';
import { AssignmentLearner } from '@/@types/faculty/assignment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import maskEmail from '@/utils/maskEmail';
import PdfRender from '@/views/player/pdf';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { formatDate } from '@/utils/commonDateFormat'
import dayjs from 'dayjs';

const Details = () => {
    const { id } = useParams();
    const { assignment, fetchAssignment, loading: assignmentDetailsLoading, error: assignmentDetailsError } = useAssignmentDetailsStore();
    const { assignmentSubmissionUsers, fetchAssignmentSubmissionUsers, loading: assignmentUsersLoading, error: assignmentUsersError } = useAssignmentSubmissionUsersStore();
    const [selectedUserAssignment, setSelectedUserAssignment] = useState<AssignmentLearner | null>(null);
    const [selectedPdf, setSelectedPdf] = useState<'question' | 'rubrics' | null>(null);
    const breadcrumbItems = [
        { label: 'Assignments' },
    ]

    useEffect(() => {
        if (!id) {
            toast.error('Assignment ID is missing');
            return;
        }
        fetchAssignment(id);
        fetchAssignmentSubmissionUsers(id);
    }, [fetchAssignment, fetchAssignmentSubmissionUsers, id]);

    const submittedCount = assignmentSubmissionUsers.filter(user => user.submission).length;
    const notSubmittedCount = assignmentSubmissionUsers.filter(user => !user.submission).length;
    const totalUsers = assignmentSubmissionUsers.length;
    // const submissionPercentage = totalUsers > 0 ? Math.round((submittedCount / totalUsers) * 100) : 0;


    useEffect(() => {
        const chartDom = document.getElementById("submission-chart");
        if (chartDom) {
            // eslint-disable-next-line import/namespace
            const myChart = echarts.init(chartDom);
            const chartData =
                totalUsers === 0
                    ? [
                        {
                            value: 0,
                            name: "Not Attempted",
                            itemStyle: { color: "#ef4444" },
                        },
                    ]
                    : [
                        {
                            value: submittedCount,
                            name: "Attempted",
                            itemStyle: { color: "#10b981" },
                        },
                        {
                            value: notSubmittedCount,
                            name: "Not Attempted",
                            itemStyle: { color: "#ef4444" },
                        },
                    ];
            const option = {
                animation: true,
                tooltip: {
                    trigger: "item",
                },
                legend: {
                    top: "5%",
                    left: "left",
                },
                series: [
                    {
                        name: "Submission Status",
                        type: "pie",
                        radius: ["40%", "70%"],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: "#fff",
                            borderWidth: 1,
                        },
                        label: {
                            show: false,
                            position: "center",
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 16,
                                fontWeight: "bold",
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: chartData,
                    },
                ],
            };
            option && myChart.setOption(option);

            // Add resize event listener
            const handleResize = () => {
                myChart.resize();
            };
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                myChart.dispose();
            };
        }
    }, [assignmentSubmissionUsers, submittedCount, notSubmittedCount, totalUsers]);

    const showUserSubmission = (user: AssignmentLearner) => {
        if (selectedUserAssignment && selectedUserAssignment.user_id === user.user_id) {
            setSelectedUserAssignment(null);
            return;
        }
        setSelectedUserAssignment(user);
    };

    const handlePdfView = (type: 'question' | 'rubrics') => {
        setSelectedPdf(type);
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Assignments</h1>
                    <p className="text-sm text-gray-500">Manage your Assignments</p>
                </div>
                <div className="flex items-center gap-3">
                    <StatusIndicator error={assignmentDetailsError} loading={assignmentDetailsLoading} loadingMessage={"Syncing Scheduled Sessions"} />
                </div>
            </div>
            <Tabs defaultValue="details" className='mt-6'>
                <TabsList>
                    <TabsTrigger value="details" className="border-b-2 border-transparent text-base data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-gray-500">Assignment Details</TabsTrigger>
                    <TabsTrigger value="assignment" className="border-b-2 border-transparent text-base data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-gray-500">Assignment PDF</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-4 space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="md:flex items-center justify-between">
                                        <div>
                                            <CardTitle className='mb-2'>{assignment?.title}</CardTitle>
                                            <p className="text-sm text-gray-500">{stripHtmlTags(assignment?.description ?? '')}</p>
                                            <div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <ChevronRight className="text-gray-500" size={16} />
                                                    <p className="text-sm text-gray-500 mb-0">Duration - {new Date(`${assignment?.start_date}`).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: '2-digit',
                                                        year: 'numeric',
                                                    })} to {new Date(`${assignment?.end_date}`).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: '2-digit',
                                                        year: 'numeric',
                                                    })}</p>
                                                </div>
                                            </div>
                                            <div>
                                                {/* summery */}
                                                <div className="flex items-center gap-2 mt-1">
                                                    <ChevronRight className="text-gray-500" size={16} />
                                                    <p className="text-sm text-gray-500 mb-0">
                                                        Total Learners Assigned - <span className="font-bold">{totalUsers}</span>
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <ChevronRight className="text-gray-500" size={16} />
                                                    <p className="text-sm text-gray-500 mb-0">
                                                        Total Submitted - <span className="font-bold">{submittedCount} ({totalUsers > 0 && Math.round((submittedCount / totalUsers) * 100) || 0}%)</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-2xl font-bold">Submissions</h1>
                                            <p className="text-sm text-gray-500">View all the submissions for this assignment. You can also download and review.</p>
                                        </div>
                                        <div>
                                            <StatusIndicator error={assignmentUsersError} loading={assignmentUsersLoading} loadingMessage={"Syncing Submissions"} />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead className="text-center">Submitted Date</TableHead>
                                                <TableHead className="text-center">Enrollment Number</TableHead>
                                                <TableHead className="text-center">Submitted</TableHead>
                                                <TableHead className="text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {assignmentSubmissionUsers.map((user) => (
                                                <>
                                                    <TableRow key={user.user_id} className={selectedUserAssignment?.user_id === user.user_id ? 'border rounded-lg' : ''}>
                                                        <TableCell className="flex items-center gap-2">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={user?.profile_image} alt="User Image" />
                                                                <AvatarFallback>
                                                                    {user?.user_name.charAt(0).toUpperCase() + user?.user_name.charAt(1).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-semibold">{user?.user_name}</p>
                                                                <p className="text-xs text-gray-500">{maskEmail(user?.email)}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex items-center gap-2 justify-center">
                                                                <Calendar className="text-gray-500" size={16} />
                                                                <span className="text-sm">
                                                                    {user?.submission_date
                                                                        ? dayjs(user.submission_date).format("ddd, MMM DD YYYY, h:mm A")
                                                                        : "N/A"}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center text-gray-500">
                                                            {user?.enrollment_number ?? 'N/A'}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {
                                                                user?.submission ? (
                                                                    <Check className="text-green-500 mx-auto" size={16} />
                                                                ) : (
                                                                    <X className="text-red-500 mx-auto" size={16} />
                                                                )
                                                            }
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="text-gray-500 hover:text-blue-500 mx-auto"
                                                                onClick={() => showUserSubmission(user)}
                                                            >
                                                                {selectedUserAssignment?.user_id === user?.user_id ? (
                                                                    <ChevronUp size={16} />
                                                                ) : (
                                                                    <ChevronDown size={16} />
                                                                )}
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                    {assignment && selectedUserAssignment?.user_id === user.user_id && (
                                                        <TableRow>
                                                            <TableCell colSpan={5} className="border-t pt-2">
                                                                <Submissions learner={user} assignment={assignment} />
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                        {/* <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Submission Summary</h2>
                                <div className="h-[250px]">
                                    <div id="submission-chart" className="h-[250px]"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col justify-between items-center">
                                            <p className="text-lg">{totalUsers}</p>
                                            <span className="text-gray-600">Learners</span>
                                        </div>
                                        <div className="flex flex-col justify-between items-center">
                                            <p className="text-lg text-green-500 font-bold">{submittedCount}<span className="text-xs font-normal">({totalUsers > 0 && Math.round((submittedCount / totalUsers) * 100) || 0}%)</span></p>
                                            <span className="text-gray-600">Submitted</span>
                                        </div>
                                        <div className="flex flex-col justify-between items-center">
                                            <p className="text-lg text-red-500 font-bold">{notSubmittedCount}<span className="text-xs font-normal">({totalUsers > 0 && Math.round((notSubmittedCount / totalUsers) * 100) || 0}%)</span></p>
                                            <span className="text-gray-600">Not Submitted</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Submission Rate:</span>
                                            <div className="text-2xl font-bold text-blue-600">
                                                {submissionPercentage}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div> */}
                    </div>
                </TabsContent>
                <TabsContent value="assignment">
                    <div className="mt-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>
                                        Assignment PDF Viewer
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            className={`flex items-center gap-2 ${selectedPdf === 'question' ? 'bg-primary text-white' : 'bg-gray-500 text-white hover:bg-gray-600'}`}
                                            onClick={() => handlePdfView('question')}
                                        >
                                            <Download size={16} />
                                            Question PDF
                                        </Button>
                                        {assignment?.rubrics_url &&
                                            <Button
                                                className={`flex items-center gap-2 ${selectedPdf === 'rubrics' ? 'bg-primary text-white' : 'bg-gray-500 text-white hover:bg-gray-600'}`}
                                                onClick={() => handlePdfView('rubrics')}
                                            >
                                                <Download size={16} />
                                                Rubrics PDF
                                            </Button>
                                        }
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {selectedPdf ? (
                                    selectedPdf === 'question' && assignment?.file ? (
                                        <PdfRender fileUrl={assignment?.file} />
                                    ) : selectedPdf === 'rubrics' && assignment?.rubrics_url ? (
                                        <PdfRender fileUrl={assignment?.rubrics_url} />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <X size={48} className="text-gray-400 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Not Available</h3>
                                            <p className="text-gray-500">The selected PDF is not available for this assignment.</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Download size={48} className="text-gray-400 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No PDF Selected</h3>
                                        <p className="text-gray-500 mb-4">Please select a PDF to view using the buttons above</p>
                                        <div className="flex gap-2">
                                            <Button
                                                className="flex items-center gap-2 bg-primary text-white hover:bg-primary-dark"
                                                onClick={() => handlePdfView('question')}
                                            >
                                                View Question PDF
                                            </Button>
                                            {assignment?.rubrics_url && <Button
                                                variant="outline"
                                                className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white"
                                                onClick={() => handlePdfView('rubrics')}
                                            >
                                                View Rubrics PDF
                                            </Button>
                                            }
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card >
                    </div >
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Details;