import { AssessmentDetails, AssessmentLearner } from '@/@types/faculty/assessment';
import StatusIndicator from '@/components/StatusIndicator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import maskEmail from '@/utils/maskEmail';
import { Award, Eye, RefreshCw } from 'lucide-react';
import { useAssignAssessmentCertificate } from '@/hooks/data/faculty/useProgram';
import { useState } from 'react';
import { Button } from '@/components/ui/ShadcnButton';

interface LearnersProps {
  learners: AssessmentLearner[];
  loading: boolean;
  error: string | null;
  assessmentDetails: AssessmentDetails;
}

const Learners: React.FC<LearnersProps> = ({ learners, loading, error, assessmentDetails }) => {
  const { mutate: assignCertificate, isPending } = useAssignAssessmentCertificate();
  const [assigningUserId, setAssigningUserId] = useState<number | null>(null);

  const handleAssignCertificate = (userId: number) => {
    setAssigningUserId(userId);
    assignCertificate({ content_id: assessmentDetails.content_id, user_id: userId }, {
      onSettled: () => setAssigningUserId(null)
    });
  };

  const hasCertificate = assessmentDetails?.certificate && assessmentDetails.certificate > 0;


  const formatTimeTaken = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} sec`;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
    if (remainingSeconds > 0) parts.push(`${remainingSeconds} sec`);

    return parts.join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold dark:text-white">Assessment Learners</CardTitle>
          <StatusIndicator error={error} loading={loading} loadingMessage="Syncing Learners" />
        </div>
      </CardHeader>
      <CardContent>
        {learners && learners.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='dark:text-white'>Name</TableHead>
                <TableHead className='dark:text-white'>Attempt Id</TableHead>
                <TableHead className='dark:text-white'>Score</TableHead>
                <TableHead className='dark:text-white'>Time Taken (sec)</TableHead>
                <TableHead className='dark:text-white'>Passed</TableHead>
                {Boolean(hasCertificate) && <TableHead className='dark:text-white'>Certificate</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {learners.map((learner) => (
                <TableRow key={learner.user_id}>
                  <TableCell className="font-semibold dark:text-white flex items-center gap-1">
                    <img src={learner.profile_image} alt={learner.name} className="inline-block w-9 h-9 rounded-full mr-2 border" />
                    <div>
                      <p className="inline-block align-middle">{learner.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{maskEmail(learner.email)}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-white">#{learner.attempt_id}</TableCell>
                  <TableCell className="text-gray-500 dark:text-white">{learner.score ?? '-'}</TableCell>
                  <TableCell className="text-gray-500 dark:text-white">{learner.is_completed ? formatTimeTaken(learner.time_taken_in_sec) : '-'}</TableCell>
                  <TableCell className="text-gray-500 dark:text-white">
                    {learner.is_passed ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-600 font-medium">No</span>
                    )}
                  </TableCell>
                  {Boolean(hasCertificate) && (
                    <TableCell>
                      {learner.is_passed ? (
                        learner.certificate_url !== "" ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="gap-2 text-black"
                              disabled={isPending && assigningUserId === learner.user_id}
                              onClick={() => handleAssignCertificate(learner.user_id)}
                            >
                              {isPending && assigningUserId === learner.user_id ? <RefreshCw className="w-4 h-4 text-white animate-spin" /> : <RefreshCw className="w-4 h-4 text-white" />}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => window.open(learner.certificate_url, '_blank')}
                            >
                              <Eye className="w-4 h-4 text-white" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className="gap-2 text-white"
                            disabled={isPending && assigningUserId === learner.user_id}
                            onClick={() => handleAssignCertificate(learner.user_id)}
                          >
                            <Award className="w-4 h-4" />
                            {isPending && assigningUserId === learner.user_id ? 'Assigning...' : 'Assign Certificate'}
                          </Button>
                        )
                      ) : (
                        <span className="text-gray-400 text-sm">Not eligible</span>
                      )
                      }
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500">No learners found for this assessment.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Learners;