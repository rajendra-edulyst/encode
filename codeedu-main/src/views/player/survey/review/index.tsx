import { AssessmentReview } from "@/@types/create/courses";
import { Portfolio } from '@/@types/portfolio';
import LoadingSection from "@/components/LoadingSection";
import { fetchAssessmentReview } from "@/services/create/AssessmentService";
import { fetchPortfolio } from "@/services/portfolio/PortfolioService";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Review = () => {
  const { contentId, studentId, attemptId } = useParams();
  const [loading, setLoading] = useState(false);
  const [reviewDetails, setReviewDetails] = useState<AssessmentReview | null>(null);
 const [student, setStudent] = useState<Portfolio | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      if (!contentId || !studentId || !attemptId) {
        toast.error("Something went wrong. Please try again later.");
        return;
      }

      setLoading(true);
      const studentProfile = await fetchPortfolio(studentId)
      if(studentProfile){
        setStudent(studentProfile)
      }



      fetchAssessmentReview(contentId, attemptId, studentId)
        .then((response: AssessmentReview) => {
          setReviewDetails(response);
        })
        .catch((error) => {
          toast.error(error?.message || "Failed to fetch review details.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
    fetchData();
  }, [contentId]);





  const navigate = useNavigate()
  return (
    <div className="w-full p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-start items-center gap-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-white flex items-center justify-center gap-2">
          <ArrowLeft />
        </button>
        <h1 className="text-3xl font-semibold">Review</h1>
      </div>
      {
        <LoadingSection
          isLoading={loading}
          title="Loading"
          description="Please wait while we load the review details."
        ></LoadingSection>
      }

     {
      !loading && student && (
        <div className="my-4">
          <p className="text-lg font-semibold">Student: {student?.name}</p>
          <p className="text-lg font-semibold">Overall Score: {reviewDetails?.questions?.reduce((total, question) => total + question?.marks_obtained, 0)} out of {reviewDetails?.questions?.reduce((total, question) => total + question?.marks, 0)}</p>
        </div>
      )
     }

      {!loading && reviewDetails?.questions?.map(item => (
        <div
          key={item.question_id}
          className="border border-gray-200 dark:border-gray-700 
                 rounded-xl p-4 shadow-sm mb-4 
                 bg-white dark:bg-gray-800 
                 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-lg text-gray-900 dark:text-gray-100">Question: {item?.question || ""}</p>
          </div>
          <p className="mt-2 font-semibold text-blue-600 dark:text-blue-400">
            Marks: {item?.marks_obtained || 0} out of {item?.marks || 0}
          </p>
          {item?.answer_statement && <p className="text-gray-600 dark:text-gray-300 mt-1">Answer: {item?.answer_statement || ""}</p>}
        </div>
      ))}
    </div>

  );
};

export default Review;
