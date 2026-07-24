import { TableCell, TableRow } from '@/components/ui/table'
import AvatarComponents from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAssignmentSubmissionDetails, useReviewAssignment, useAssignAssignmentCertificate } from '@/hooks/data/faculty/useProgram'
import { FileText, CheckCircle, ChevronDown, Download, Calendar, Clock, Mail, FileCheck, X, Upload, MessageSquare, ThumbsUp, ThumbsDown,  RefreshCw, Eye } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import type { Assignment, AssignmentLearner, AssignmentSubmission } from '@/@types/faculty/assignment'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/ShadcnButton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Input from '@/components/ui/Input/Input'

const { Avatar, AvatarImage, AvatarFallback } = AvatarComponents


type LearnerCertificateInfo = Pick<
  AssignmentLearner,
  "user_id" | "is_certificate_mapped" | "certificate_pdf_url"
>;

// Certificate Assignment Button Component
const AssignCertificateButton = ({ contentId, learner }: { contentId: number; learner: LearnerCertificateInfo }) => {

  const { mutate: assignCertificate, isPending } = useAssignAssignmentCertificate();

  const handleAssignCertificate = () => {
    assignCertificate({ content_id: contentId, user_id: learner.user_id });
  };

  return (
    <Button
      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white"
      disabled={isPending}
      onClick={handleAssignCertificate}
    >

      {
        learner?.is_certificate_mapped == 1 && learner.certificate_pdf_url == null && (
          isPending ? 'Assigning Certificate...' : 'Assign Certificate'
        ) 
      }

      {
        learner?.is_certificate_mapped == 1 && learner.certificate_pdf_url != null && (
          isPending ? <RefreshCw className="animate-spin text-white" /> : <RefreshCw size={18} />
        ) 
      }
    </Button>
  );
}

const LearnerSubmissionRow = ({ learner, assignment }: { learner: AssignmentLearner, assignment: Assignment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: submissionDetails } = useAssignmentSubmissionDetails(assignment?.id?.toString(), isOpen ? learner.user_id : undefined);
  const reviewMutation = useReviewAssignment();

  const hasSubmission = learner.submission && learner.submission !== '0';
  const isOfflineMode = assignment.submission_mode === 0;
  const isGraded = assignment.is_graded === 1;

  const [activeSubmission, setActiveSubmission] = useState<AssignmentSubmission | null>(null);
  const [teacherNotes, setTeacherNotes] = useState('');
  const [teacherFile, setTeacherFile] = useState<File | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'1' | '2'>('1'); // 1 = Accept, 2 = Reject
  const [marksObtained, setMarksObtained] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentProvideGradeSubmission, setCurrentProvideGradeSubmission] = useState<AssignmentLearner | null>(null);
  const [gradeObtained, setGradeObtained] = useState('');

  const maximum_marks = assignment.maximum_marks || 0;

  useEffect(() => {
    if (submissionDetails && submissionDetails.length > 0) {
      // Set the latest submission (last item) as active by default
      setActiveSubmission(submissionDetails[submissionDetails.length - 1]);
    }
  }, [submissionDetails]);

  // Handle offline direct grading
  const handleOfflineGrading = async () => {
    const formData = new FormData();
    formData.append('content_id', assignment.id.toString());
    formData.append('user_id', learner.user_id.toString());
    formData.append('review_status', '1'); // Accept
    formData.append('teacher_notes', teacherNotes);
    if (currentProvideGradeSubmission?.latest_attempt_id != null) {
      formData.append('id', `${currentProvideGradeSubmission.latest_attempt_id}`);
    }

    if (marksObtained) {
      formData.append('marks_obtained', marksObtained);
    }

    if (teacherFile) {
      formData.append('teacher_file', teacherFile);
    }

    try {
      await reviewMutation.mutateAsync(formData);
      setIsReviewOpen(false);
      setTeacherNotes('');
      setTeacherFile(null);
      setMarksObtained('');
    } catch (error) {
      console.error('Offline grading failed:', error);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!activeSubmission) return;

    const formData = new FormData();
    formData.append('content_id', assignment.id.toString());
    formData.append('user_id', learner.user_id.toString());
    formData.append('id', activeSubmission.id.toString());
    formData.append('review_status', reviewStatus);
    formData.append('teacher_notes', teacherNotes);
    formData.append('grade', gradeObtained);

    // Only include marks if Accept is selected and maximum_marks exists
    if (reviewStatus === '1' && maximum_marks && marksObtained) {
      formData.append('marks_obtained', marksObtained);
    }

    if (teacherFile) {
      formData.append('teacher_file', teacherFile);
    }

    try {
      await reviewMutation.mutateAsync(formData);
      setIsReviewOpen(false);
      setTeacherNotes('');
      setTeacherFile(null);
      setReviewStatus('1');
      setMarksObtained('');
      setGradeObtained('');
    } catch (error) {
      console.error('Review submission failed:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTeacherFile(e.target.files[0]);
    }
  };

  return (
    <>
      <TableRow className="border-b border-border/50 hover:bg-muted/50 transition-colors">
        <TableCell className="py-4 w-[35%]">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-border flex-shrink-0">
              <AvatarImage src={learner.profile_image || ''} alt={learner.user_name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {learner.user_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-foreground truncate">{learner.user_name}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                <Mail size={12} className="flex-shrink-0" />
                <span className="truncate">{learner.email}</span>
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell className="py-4 w-[15%]">
          {hasSubmission ? (
            <Badge variant="default" className="bg-green-500/90 hover:bg-green-500 text-white border-0 shadow-sm whitespace-nowrap">
              <CheckCircle size={14} className="mr-1" />
              Submitted
            </Badge>
          ) : (
            <Badge variant="outline" className="border-orange-500/50 text-orange-600 dark:text-orange-400 whitespace-nowrap">
              <Clock size={14} className="mr-1" />
              Pending
            </Badge>
          )}
        </TableCell>
        <TableCell className="py-4 w-[20%]">
          {learner.submission_date ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Calendar size={14} className="text-muted-foreground flex-shrink-0" />
                <span className="truncate">
                  {new Date(learner.submission_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock size={12} className="flex-shrink-0" />
                {new Date(learner.submission_date).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </TableCell>
        <TableCell className="py-4 w-[15%]">
          {isOfflineMode && isGraded ? (
            // Offline mode with grading - Direct grade button
            <button
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
              onClick={() => {
                setCurrentProvideGradeSubmission(learner)
                setIsReviewOpen(true)
              }}
            >
              <span>Provide Grade</span>
            </button>
          ) : (
            // Online mode or non-graded - Regular review button
            <button
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              disabled={!hasSubmission}
              onClick={() => setIsOpen(!isOpen)}
            >
              {hasSubmission ? (
                <>
                  <span>Review Assignment</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </>
              ) : (
                <span className="text-muted-foreground">No submission</span>
              )}
            </button>
          )}
        </TableCell>
      </TableRow>
      {hasSubmission === true && isOpen && (
        <TableRow>
          <TableCell colSpan={5} className="bg-muted/30 p-0 border-b border-border/50">
            <div className="p-6 space-y-4">
              {submissionDetails && submissionDetails.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Side - Submission List */}
                  <div className='flex flex-col gap-4 lg:col-span-4'>
                    <h3 className="font-semibold text-foreground text-lg mb-2">Submissions</h3>
                    {
                      submissionDetails.map((submission, idx) => (
                        <Card
                          key={idx}
                          className={`border-border/50 shadow-sm dark:bg-[#323232] cursor-pointer transition-all hover:shadow-md ${activeSubmission === submission ? 'ring-2 ring-primary shadow-lg' : ''}`}
                          onClick={() => setActiveSubmission(submission)}
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col gap-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                                    <FileCheck size={24} className="text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-foreground flex items-center gap-2 flex-wrap">
                                      Submission #{idx + 1}
                                      {idx === submissionDetails.length - 1 && (
                                        <Badge variant="outline" className="text-xs border-primary/50 text-primary">Latest</Badge>
                                      )}
                                    </h4>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {new Date(submission.created_at).toLocaleString('en-US', {
                                        month: 'short',
                                        day: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>


                              {/* Status Badges Row */}
                              <div className="flex items-center gap-2 flex-wrap">
                                {/* Review Status */}
                                {
                                  submission.review_status === 1 ? (
                                    <Badge className="bg-blue-500 text-white border-0 text-xs">Reviewed</Badge>
                                  ) : submission.review_status === 0 ? (
                                    <Badge variant="outline" className="border-orange-500 text-orange-600 text-xs">Pending</Badge>
                                  ) : (
                                    <Badge variant="destructive" className="text-xs">Rejected</Badge>
                                  )
                                }
                                {/* Pass/Fail Status */}
                                {submission.is_passed ? (
                                  <Badge className="bg-green-500/90 text-white border-0 text-xs">
                                    <CheckCircle size={10} className="mr-1" />
                                    Passed
                                  </Badge>
                                ) : submission.review_status !== 0 && (
                                  <Badge variant="destructive" className="bg-red-500/90 text-xs">
                                    <X size={10} className="mr-1" />
                                    Failed
                                  </Badge>
                                )}
                                {/* Marks Obtained */}
                                {submission.marks_obtained !== null && (
                                  <Badge variant="outline" className="dark:border-gray-500">
                                    <span className="font-medium text-muted-foreground dark:text-white">Marks &nbsp;</span>
                                    <span className="font-bold text-primary">{submission.marks_obtained}/{maximum_marks}</span>
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    }
                  </div>

                  {/* Right Side - PDF Viewer and Details */}
                  {/* Right Side - PDF Viewer and Details */}
                  <div className="space-y-4 lg:col-span-8">
                    {activeSubmission ? (
                      <>
                        {/* Action Buttons Bar */}
                        <div className="flex items-center gap-3 flex-wrap">
                          {/* Student Notes */}
                          {activeSubmission.user_notes && (
                            <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 flex-1 min-w-[200px]">
                              <MessageSquare size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-blue-400 mb-1">Student Notes</p>
                                <p className="text-sm text-foreground break-words">{activeSubmission.user_notes}</p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2 ml-auto">
                            {/* Provide Review Button */}
                            {activeSubmission?.review_status === 0 && (
                              <Button
                                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={() => setIsReviewOpen(true)}
                              >
                                <MessageSquare size={18} />
                                Provide Review
                              </Button>
                            )}

                            {/* Certificate Assignment Button */}
                            {assignment?.certificate_id && activeSubmission?.is_passed === 1 && activeSubmission?.review_status === 1 && (
                              <AssignCertificateButton
                                contentId={assignment.id}
                                learner={learner}
                              />
                            )}

                            {/* Download Button */}
                            {activeSubmission.file && (
                              <a
                                href={activeSubmission.file}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button
                                  variant="outline"
                                  size={'icon'}
                                  className="flex items-center gap-2"
                                >
                                  <Eye size={22} />
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* PDF Viewer */}
                        {activeSubmission.file && activeSubmission.file.toLowerCase().endsWith('.pdf') ? (
                          <Card className="border-border/50 shadow-sm bg-[#323232] pt-0 pb-0">
                            <CardContent className="p-0">
                              <div className="w-full h-[600px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                                <iframe
                                  src={`${activeSubmission.file}#toolbar=1&navpanes=0&scrollbar=1`}
                                  className="w-full h-full border-0"
                                  title="PDF Viewer"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ) : activeSubmission.file && (
                          <Card className="border-border/50 shadow-sm bg-[#323232]">
                            <CardContent className="p-8">
                              <div className="text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                                  <FileText size={40} className="text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">File Preview Not Available</h3>
                                <p className="text-sm text-muted-foreground mb-4">This file type cannot be previewed. Please download to view.</p>
                                <a
                                  href={activeSubmission.file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button className="flex items-center gap-2">
                                    <Download size={18} />
                                    Download File
                                  </Button>
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Submission Info Card */}
                        <Card className="border-border/50 shadow-sm bg-[#323232]">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                              <FileCheck size={18} className="text-primary" />
                              Submission Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-3">
                              {activeSubmission.marks_obtained !== null && (
                                <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-500">
                                  <span className="text-sm font-medium text-muted-foreground dark:text-white">Marks</span>
                                  <span className="text-lg font-bold text-primary">{activeSubmission.marks_obtained} / {maximum_marks}</span>
                                </div>
                              )}

                              <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-500">
                                <span className="text-sm font-medium text-muted-foreground dark:text-white">Status</span>
                                {activeSubmission.is_passed ? (
                                  <Badge className="bg-green-500/90 text-white border-0">Passed</Badge>
                                ) : (
                                  <Badge variant="destructive">Not Passed</Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-500">
                                <span className="text-sm font-medium text-muted-foreground dark:text-white">Review</span>
                                {activeSubmission.review_status === 1 ? (
                                  <Badge className="bg-blue-500 text-white border-0">Reviewed</Badge>
                                ) : activeSubmission.review_status === 2 ? (
                                  <Badge variant="destructive">Rejected</Badge>
                                ) : (
                                  <Badge variant="outline" className="border-orange-500/50 text-orange-600 dark:text-orange-400">Pending</Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-500">
                                <span className="text-sm font-medium text-muted-foreground dark:text-white">Submitted</span>
                                <span className="text-sm font-medium text-foreground">
                                  {new Date(activeSubmission.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: '2-digit',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Teacher Feedback - Only show if already reviewed */}
                        {activeSubmission.review_status !== 0 && (activeSubmission.teacher_notes || activeSubmission.teacher_file) && (
                          <Card className="border-border/50 shadow-sm bg-green-500/5 dark:bg-green-500/10">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                                <MessageSquare size={18} className="text-green-500" />
                                Teacher Feedback
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {activeSubmission.teacher_notes && (
                                <div className="p-3 rounded-lg bg-background/50 border border-green-500/20">
                                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                    {activeSubmission.teacher_notes}
                                  </p>
                                </div>
                              )}
                              {activeSubmission.teacher_file && (
                                <a
                                  href={activeSubmission.teacher_file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 bg-green-500/10 hover:bg-green-500/20 rounded-md transition-colors"
                                >
                                  <FileText size={16} />
                                  Download Feedback File
                                </a>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {/* Review Dialog - For both offline and online modes */}
                        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                <MessageSquare size={24} className="text-primary" />
                                {isOfflineMode && isGraded ? 'Provide Grade' : 'Review Submission'}
                              </DialogTitle>
                              <DialogDescription>
                                {isOfflineMode && isGraded
                                  ? 'Provide grades for offline assignment submission'
                                  : 'Review and provide feedback for this assignment submission'}
                              </DialogDescription>
                            </DialogHeader>
                            {/* Feedback Form */}
                            <div className="space-y-4">
                              {/* Review Decision Select - Only for online mode */}
                              {!isOfflineMode && (
                                <div>
                                  <label className="text-sm font-semibold text-foreground mb-2 block">
                                    Review Decision <span className="text-red-500">*</span>
                                  </label>
                                  <Select value={reviewStatus} onValueChange={(value: '1' | '2') => setReviewStatus(value)}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select review decision" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1" className="text-green-600 dark:text-green-400">
                                        <div className="flex items-center gap-2">
                                          <ThumbsUp size={16} />
                                          Accept Submission
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="2" className="text-red-600 dark:text-red-400">
                                        <div className="flex items-center gap-2">
                                          <ThumbsDown size={16} />
                                          Reject Submission
                                        </div>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}

                              {/* Marks Input - Show if graded and (offline mode OR online mode with Accept) */}
                              {maximum_marks > 0 && (isOfflineMode || reviewStatus === '1') && (

                                <div>
                                  <label className="text-sm font-semibold text-foreground mb-2 block">
                                    Marks Obtained <span className="text-red-500">*</span>
                                    <span className="text-xs text-muted-foreground font-normal ml-2">
                                      (Maximum: {maximum_marks}, Passing: {assignment.passing_marks})
                                    </span>
                                  </label>
                                  <Input
                                    type="number"
                                    placeholder={`Enter marks (0 - ${maximum_marks})`}
                                    value={marksObtained}
                                    min="0"
                                    max={maximum_marks}
                                    className="w-full"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const numValue = parseFloat(value);
                                      if (value === '' || (numValue >= 0 && numValue <= maximum_marks)) {
                                        setMarksObtained(value);
                                      }
                                    }}
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Enter marks between 0 and {maximum_marks}. Passing marks: {assignment.passing_marks}
                                  </p>
                                </div>


                              )}

                              <div>
                                <label className="text-sm font-semibold text-foreground mb-2 block">
                                  Feedback Notes
                                </label>
                                <Textarea
                                  placeholder="Provide detailed feedback for the student about their submission..."
                                  value={teacherNotes}
                                  className="min-h-[150px] resize-none bg-background"
                                  onChange={(e) => setTeacherNotes(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Be constructive and specific in your feedback
                                </p>
                              </div>

                              <div>
                                <label className="text-sm font-semibold text-foreground mb-2 block">
                                  Attach Feedback File (Optional)
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.txt"
                                    onChange={handleFileSelect}
                                  />
                                  <Button
                                    variant="default"
                                    className="flex-1 bg-background text-foreground hover:bg-muted border border-border"
                                    onClick={() => fileInputRef.current?.click()}
                                  >
                                    <Upload size={16} className="mr-2" />
                                    {teacherFile ? teacherFile.name : 'Choose File'}
                                  </Button>
                                  {teacherFile && (
                                    <Button
                                      className="px-3 text-muted-foreground hover:text-foreground"
                                      onClick={() => setTeacherFile(null)}
                                    >
                                      <X size={16} />
                                    </Button>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  PDF, DOC, DOCX, or TXT files accepted (Optional)
                                </p>
                              </div>
                            </div>

                            <Separator />

                            {/* Submit Button */}
                            <div>
                              <Button
                                disabled={
                                  reviewMutation.isPending ||
                                  (reviewStatus === '1' && maximum_marks > 0 && !marksObtained) ||
                                  (!isOfflineMode && reviewStatus === '1' && maximum_marks > 0 && !marksObtained)
                                }
                                className={`w-full ${isOfflineMode || reviewStatus === '1' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white shadow-lg`}
                                onClick={isOfflineMode ? handleOfflineGrading : handleReviewSubmit}
                              >
                                {isOfflineMode ? (
                                  <>
                                    <CheckCircle size={18} className="mr-2" />
                                    {reviewMutation.isPending ? 'Submitting Grade...' : 'Submit Grade'}
                                  </>
                                ) : (
                                  <>
                                    {reviewStatus === '1' ? (
                                      <ThumbsUp size={18} className="mr-2" />
                                    ) : (
                                      <ThumbsDown size={18} className="mr-2" />
                                    )}
                                    {reviewMutation.isPending ? 'Submitting...' : `${reviewStatus === '1' ? 'Accept' : 'Reject'} & Submit Review`}
                                  </>
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                          <FileCheck size={32} className="text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground font-medium">Select a submission to view details</p>
                        <p className="text-sm text-muted-foreground mt-1">Click on a submission from the left to review</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Loading submission details...
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}

      {/* Offline Grading Dialog - Shown outside the expanded row for offline mode */}
      {isOfflineMode && isGraded && (
        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare size={24} className="text-primary" />
                Provide Grade for {learner.user_name}
              </DialogTitle>
              <DialogDescription>
                Provide grades and feedback for offline assignment submission
              </DialogDescription>
            </DialogHeader>
            {/* Feedback Form */}
            <div className="space-y-4">
              {/* Marks Input */}
              {maximum_marks > 0 && (

                <>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">
                      Marks Obtained <span className="text-red-500">*</span>
                      <span className="text-xs text-muted-foreground font-normal ml-2">
                        (Maximum: {maximum_marks}, Passing: {assignment.passing_marks})
                      </span>
                    </label>
                    <Input
                      type="number"
                      placeholder={`Enter marks (0 - ${maximum_marks})`}
                      value={marksObtained}
                      min="0"
                      max={maximum_marks}
                      className="w-full"
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = parseFloat(value);
                        if (value === '' || (numValue >= 0 && numValue <= maximum_marks)) {
                          setMarksObtained(value);
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter marks between 0 and {maximum_marks}. Passing marks: {assignment.passing_marks}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">
                      Grade Obtained <span className="text-red-500">*</span>

                    </label>

                    <Select
                      value={gradeObtained}
                      onValueChange={setGradeObtained}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Feedback Notes
                </label>
                <Textarea
                  placeholder="Provide detailed feedback for the student about their performance..."
                  value={teacherNotes}
                  className="min-h-[150px] resize-none bg-background"
                  onChange={(e) => setTeacherNotes(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Be constructive and specific in your feedback
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Attach Feedback File (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                  />
                  <Button
                    variant="default"
                    className="flex-1 bg-background text-foreground hover:bg-muted border border-border"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={16} className="mr-2" />
                    {teacherFile ? teacherFile.name : 'Choose File'}
                  </Button>
                  {teacherFile && (
                    <Button
                      className="px-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setTeacherFile(null)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, DOCX, or TXT files accepted (Optional)
                </p>
              </div>
            </div>

            <Separator />

            {/* Submit Button */}
            <div>
              <Button
                disabled={
                  !teacherNotes.trim() ||
                  reviewMutation.isPending ||
                  (maximum_marks > 0 && !marksObtained)
                }
                className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
                onClick={handleOfflineGrading}
              >
                <CheckCircle size={18} className="mr-2" />
                {reviewMutation.isPending ? 'Submitting Grade...' : 'Submit Grade'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default LearnerSubmissionRow;