import Breadcrumb from '@/components/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookOpen, Calendar, ChevronRight, FileText, ListChecks, Tag, Users } from 'lucide-react';
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/ShadcnButton';
import Learners from './learners';
import * as echarts from 'echarts';
import { useAssessmentAttemptsUsers, useAssessmentDetails } from '@/hooks/data/faculty/useProgram';
import LoadingSection from '@/components/LoadingSection';
import { formatDate } from '@/utils/commonDateFormat';

const Details = () => {

  const { id } = useParams();
  const { data: assessment, isLoading } = useAssessmentDetails(id);

  const assessmentDetails = assessment?.details || null;
  const assessmentInstructions = assessment?.statement || null;

  const { data: assessmentLearners = [], isLoading: assessmentLearnerLoading, error: learnerError } = useAssessmentAttemptsUsers(assessmentDetails?.content_id);


  const breadcrumbItems = [
    { label: 'Assessments', path: '/assessments' },
    { label: assessmentDetails?.title || 'Details' },
  ];

  const totalLearners = assessmentLearners?.length || 0;
  const attemptedLearners = assessmentLearners?.filter(learner => learner.attempt_id).length || 0;
  const notAttemptedLearners = totalLearners - attemptedLearners;
  const attemptedPercentage = totalLearners > 0 ? Math.round((attemptedLearners / totalLearners) * 100) : 0;


  useEffect(() => {
    const chartDom = document.getElementById("attempted-chart");
    if (chartDom) {
      // eslint-disable-next-line import/namespace
      const myChart = echarts.init(chartDom);
      const chartData =
        totalLearners === 0
          ? [
            {
              value: 0,
              name: "Not Attempted",
              itemStyle: { color: "#ef4444" },
            },
          ]
          : [
            {
              value: attemptedLearners,
              name: "Attempted",
              itemStyle: { color: "#10b981" },
            },
            {
              value: notAttemptedLearners,
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
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "left",
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
      return () => {
        myChart.dispose();
      };
    }
  }, [totalLearners, attemptedLearners, notAttemptedLearners]);


  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex items-center justify-between">
        <div>
          {assessmentDetails?.program_name && (
            <p className="text-xl font-medium text-blue-600 dark:text-blue-400 mb-1">
              {assessmentDetails.program_name}
            </p>
          )}
          {assessmentDetails?.module_name && (
            <p className="text font-medium text-gray-600 dark:text-gray-300 mb-2">
              {assessmentDetails.module_name}
            </p>
          )}

          <h1 className="text-2xl font-bold dark:text-white">{assessmentDetails?.title || 'Details'}</h1>
          <p className="text-sm text-gray-500 dark:text-white">{assessmentDetails?.description || 'No description available.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="dark:text-white">
            <Link to={`/programs/${assessmentDetails?.program_id}/modules/${assessmentDetails?.module_id}/content/${assessmentDetails?.content_id}/assessment-questions`}>
              Manage Questions
            </Link>
          </Button>
          {/* <Button asChild size="sm" className="text-white">
            <Link to={`/programs/${assessmentDetails?.program_id}/modules/${assessmentDetails?.module_id}/content/${assessmentDetails?.content_id}/assessment-questions/add`}>
              Add Question
            </Link>
          </Button> */}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
        <div className="lg:col-span-2 space-y-4">
          {isLoading && <LoadingSection isLoading={isLoading} title="Assessment details" />}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold dark:text-white">Assessment Details</CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-white">

                Here is detailed information about the assessment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="md:flex items-center justify-start">
                <div className="grid md:grid-cols-2 gap-4">
                  <DetailItem
                    icon={<FileText className="w-4 h-4 text-blue-500" />}
                    label="Assessment Name"
                    value={assessmentDetails?.title}
                  />
                  <DetailItem
                    icon={<Tag className="w-4 h-4 text-pink-500" />}
                    label="Assessment Type"
                    value={assessmentDetails?.type}
                  />
                  <DetailItem
                    icon={<BookOpen className="w-4 h-4 text-green-500" />}
                    label="Subject"
                    value={assessmentDetails?.program_name || "—"}
                  />
                  <DetailItem
                    icon={<Award className="w-4 h-4 text-yellow-500" />}
                    label="Duration"
                    value={`${formatDate(assessmentDetails?.start_date, 'ddd, MMM DD YYYY, h:mm A')} → ${formatDate(assessmentDetails?.end_date, 'ddd, MMM DD YYYY, h:mm A')}`}
                  />
                  <DetailItem
                    icon={<Calendar className="w-4 h-4 text-indigo-500" />}
                    label="Start Date"
                    value={formatDate(assessmentDetails?.start_date, 'ddd, MMM DD YYYY, h:mm A')}
                  />
                  <DetailItem
                    icon={<Calendar className="w-4 h-4 text-red-500" />}
                    label="End Date"
                    value={formatDate(assessmentDetails?.end_date, 'ddd, MMM DD YYYY, h:mm A')}
                  />
                  <DetailItem
                    icon={<Users className="w-4 h-4 text-purple-500" />}
                    label="Participants"
                    value={totalLearners || "0"}
                  />
                  <DetailItem
                    icon={<ListChecks className="w-4 h-4 text-orange-500" />}
                    label="Attempted"
                    value={attemptedLearners || "0"}
                  />
                  <DetailItem
                    icon={<Award className="w-4 h-4 text-teal-500" />}
                    label="Total Marks"
                    value={assessmentDetails?.maximum_marks}
                  />
                  <DetailItem
                    icon={<Award className="w-4 h-4 text-rose-500" />}
                    label="Passing Marks"
                    value={assessmentDetails?.passing_marks}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-0'>
              <CardTitle className="text-lg font-semibold dark:text-white">Assessment Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              {
                assessmentInstructions && assessmentInstructions.length > 0 ? (
                  <div className="space-y-2">
                    {assessmentInstructions.map((instruction, index) => (
                      <div key={index} className="flex items-center gap-2 mt-2">
                        <ChevronRight className="text-gray-500 dark:text-white" size={16} />
                        <p className="text-xs text-gray-500 dark:text-white mb-0 prose-sm"
                          dangerouslySetInnerHTML={{ __html: instruction }}></p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-0">No instructions available.</p>
                )
              }
            </CardContent>
          </Card>
          {/* learners */}
          {assessmentDetails && <Learners learners={assessmentLearners} loading={assessmentLearnerLoading} error={learnerError?.message || null} assessmentDetails={assessmentDetails} />}
        </div>
        <div className="lg:col-span-1">
          <Card className='sticky top-20'>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Attempt Summary</h2>
              <div className="h-[250px]">
                <div id="attempted-chart" className="h-[250px]"></div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col justify-between items-center">
                    <p className="text-lg dark:text-white">{totalLearners}</p>
                    <span className="text-gray-600 dark:text-white">Learners</span>
                  </div>
                  <div className="flex flex-col justify-between items-center">
                    <p className="text-lg text-green-500 font-bold">{attemptedLearners}<span className="text-xs font-normal">({totalLearners > 0 && Math.round((attemptedLearners / totalLearners) * 100) || 0}% )</span></p>
                    <span className="text-gray-600 dark:text-white">Attempted</span>
                  </div>
                  <div className="flex flex-col justify-between items-center">
                    <p className="text-lg text-red-500 font-bold">{notAttemptedLearners}<span className="text-xs font-normal">({totalLearners > 0 && Math.round((notAttemptedLearners / totalLearners) * 100) || 0}%)</span></p>
                    <span className="text-gray-600 dark:text-white">Not Attempted</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-white">Submission Rate:</span>
                    <div className="text-2xl font-bold text-blue-600">
                      {attemptedPercentage}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-gray-100 dark:bg-neutral-800 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-white">{label}</p>
        <p className="text-sm font-bold text-gray-800 dark:text-white capitalize">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default Details