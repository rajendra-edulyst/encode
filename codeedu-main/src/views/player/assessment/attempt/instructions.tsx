import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/ShadcnButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AssessmentInstruction } from "@/@types/learner/assessment";
import {
  Globe,
  Wifi,
  Monitor,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Calendar,
  Award,
  FileText,
  TrendingUp,
  AlertCircle,
  PlayCircle
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchAssessmentInsruction } from "@/services/learner/AssesmentService";
import SystemCheckDialog from "./components/SystemCheck";
import { toast } from "sonner";
import Loading from "@/components/shared/Loading";

interface Requirement {
  browser: boolean;
  screen: boolean;
  internet: boolean;
}


const Instructions: React.FC = () => {
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [showSystemCheck, setShowSystemCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id, courseId } = useParams<{ id: string, courseId: string }>();

  const [requirements, setRequirements] = useState<Requirement>({
    browser: false,
    screen: false,
    internet: navigator.onLine,
  });

  const [assessmentInstruction, setAssessmentInstruction] = useState<AssessmentInstruction | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    fetchAssessmentInsruction(id)
      .then((data) => {
        setAssessmentInstruction(data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load assessment instructions");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const systemRequirements = {
    browser: "Chrome 90+ / Firefox 88+ / Safari 14+",
    internet: "Minimum 1 Mbps stable connection",
    screen: "For better experience use above 1100x700 resolution",
  };

  const startExam = () => {
    if (!id || !courseId) {
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const cci = searchParams.get('cci');
    const cciParam = cci ? `?cci=${cci}` : '';

    const url = `/assessment/${courseId}/${id}${cciParam}`;
    const elem = document.documentElement as any;
    
    // if screen size is for mobile 
    navigate(url);
  };

  const formatDate = (dateString: string | number) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading loading={isLoading} />
      </div>
    );
  }

  const details = assessmentInstruction?.details;
  const statements = assessmentInstruction?.statement || [];

  return (
    <div className="min-h-screen  pb-24">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <Button
            variant="outline"
            className="rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => window.history.back()}
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Assessment Instructions
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assessment Details Card */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                      {details?.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {details?.description}
                    </p>
                  </div>
                  {details &&
                    (Number(details.is_attempted) >= 0) && (
                      <Link to={`/assessment/attempt/assessmentReview/${details.content_id}?attempt_id=${details.latest_attempt_id}`}>
                        <Button className="bg-primary mt-3 w-full text-black hover:bg-primary/30">
                          <FileText size={16} className="mr-2" />
                          Review Assessment
                        </Button>
                      </Link>
                    )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {details?.start_date && formatDate(details.start_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {details?.end_date && formatDate(details.end_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {details?.duration_in_minutes} minutes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Questions</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {details?.question_count} Questions
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Difficulty Level</p>
                        <Badge
                          variant="outline"
                          className="mt-1 border-orange-500 text-orange-600 dark:text-orange-400 capitalize"
                        >
                          {details?.difficulty_level}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Maximum Marks</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {details?.maximum_marks} Marks
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Passing Marks</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {details?.passing_marks} Marks
                        </p>
                      </div>
                    </div>

                    {(details?.attempt_allowed ?? 0) > 0 && (
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Attempts Allowed</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                            {details?.attempt_allowed} {details?.attempt_allowed === 1 ? 'Attempt' : 'Attempts'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions Section */}
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Exam Instructions
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Please read all instructions carefully before starting the exam
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {statements.map((instruction, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 rounded-lg dark:bg-[#323232] transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div
                          className="flex-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-1"
                          dangerouslySetInnerHTML={{ __html: instruction }}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Requirements Card */}
            <Card className="sticky top-24">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  System Requirements
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Recommended specifications for optimal performance
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Object.entries(systemRequirements).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start gap-3 p-3 rounded-lg dark:bg-[#323232]"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {key === "browser" && (
                          requirements.browser ? (
                            <CheckCircle className="text-green-500 w-6 h-6" />
                          ) : (
                            <Globe className="text-gray-400 dark:text-gray-500 w-6 h-6" />
                          )
                        )}
                        {key === "internet" && (
                          requirements.internet ? (
                            <CheckCircle className="text-green-500 w-6 h-6" />
                          ) : (
                            <Wifi className="text-gray-400 dark:text-gray-500 w-6 h-6" />
                          )
                        )}
                        {key === "screen" && (
                          requirements.screen ? (
                            <CheckCircle className="text-green-500 w-6 h-6" />
                          ) : (
                            <Monitor className="text-gray-400 dark:text-gray-500 w-6 h-6" />
                          )
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium capitalize text-gray-900 dark:text-white text-sm">
                          {key}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  className="bg-primary mt-3 w-full text-black hover:bg-primary/30"
                  onClick={() => setShowSystemCheck(true)}
                >
                  Run System Check
                </Button>
              </CardContent>
            </Card>

            {/* Certificate Information */}
            {details?.is_certificate === 1 && (
              <Card className="border border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Certificate Available
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Complete this assessment successfully to earn a verified
                        certificate of completion.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="accept-rules"
                checked={acceptedRules}
                className="mt-1"
                onCheckedChange={(checked) =>
                  setAcceptedRules(checked as boolean)
                }
              />
              <Label
                htmlFor="accept-rules"
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed"
              >
                I have read and agree to all exam instructions and rules
              </Label>
            </div>

            <Button
              disabled={!acceptedRules}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={startExam}
            >
              <PlayCircle className="mr-2" size={18} />
              Start Exam
              <ChevronRight className="ml-2" size={18} />
            </Button>
          </div>
        </div>
      </div>
      {/* System Check Dialog */}
      <SystemCheckDialog
        show={showSystemCheck}
        requirements={requirements}
        setRequirements={setRequirements}
        onClose={setShowSystemCheck}
      />
    </div >
  );
};

export default Instructions;
