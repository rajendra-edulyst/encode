/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-unresolved */
import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { fetchAssessmentReview } from "@/services/learner/AssesmentService"
import { useAssessmentReviewStore } from "@/store/learner/assesmentStore"
import Button from "@/components/ui/Button"
import Scoreboard from "./Scoreboard"
import { IoIosCloseCircleOutline, IoMdHelpCircleOutline } from "react-icons/io";
import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa6";
import { FaRegCheckCircle, FaRegQuestionCircle } from "react-icons/fa"
import { HiRefresh } from "react-icons/hi"
import { IoArrowBack } from "react-icons/io5"
const CheckIcon = () => (
  <FaRegCheckCircle />
)

const XIcon = () => (
  <IoIosCloseCircleOutline />
)
const ChevronDownIcon = () => (
  <FaAngleDown />
)
const ChevronUpIcon = () => (
  <FaAngleUp />
)
const QuestionIcon = () => (
  <FaRegQuestionCircle />
)
const RefreshIcon = () => (
  <HiRefresh />

)


export const ATTEMPT_STATES = {
  ANSWERED: 1,
  SKIPPED: 2,
  NOT_VISITED: 3
} as const

interface AssessmentReviewPageProps {
  contentId?: string;
  attemptId?: string;
  onBack?: () => void;
}

export default function AssessmentReviewPage({ contentId, attemptId: propAttemptId, onBack }: AssessmentReviewPageProps = {}) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [showScoreboard, setShowScoreboard] = useState(false);
  const {
    setAssessmentReview,
    assessmentReview,
    setError: setDetailsError,
    setIsLoading: setDetailsLoading,
  } = useAssessmentReviewStore()
  const location = useLocation()
  const assessmentDetails = location.state?.id
  const { id: paramId } = useParams()
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actualId = contentId || paramId;
  const actualAttemptId = propAttemptId || searchParams.get('attempt_id') || localStorage.getItem('attempt_id');

  useEffect(() => {
    const fetchAssessmentReviewData = async () => {
      setDetailsLoading(true)
      setDetailsError("question load error")
      try {
        // const reviewData = await fetchAssessmentReview(id ?? "")
        const reviewData = await fetchAssessmentReview(actualId ?? "", Number(actualAttemptId));
        setAssessmentReview(reviewData)
        console.log("fetch assessment question", reviewData)
      } catch (error) {
        setDetailsError(`${error}`)
      } finally {
        setDetailsLoading(false)
      }
    }

    fetchAssessmentReviewData()
  }, [actualId, actualAttemptId, setAssessmentReview, setDetailsLoading, setDetailsError])

  // Calculate stats
  const stats = {
    percentage: Math.round(((assessmentReview?.score ?? 0) / (assessmentReview?.maximum_marks || 100)) * 100),
    correct: assessmentReview?.questions?.filter((q) => q?.is_correct === 1).length ?? 0,
    total: assessmentReview?.questions?.length ?? 0,
    wrong: assessmentReview?.questions?.filter((q) => q?.is_correct === 2).length ?? 0,
    skipped: assessmentReview?.questions?.filter((q) => q?.attempt_state === 2).length ?? 0,
    notAnswered: assessmentReview?.questions?.filter((q) => q?.is_correct === 0).length ?? 0,
  }

  // Filter questions based on selected filter
  const filteredQuestions = assessmentReview?.questions?.filter((question) => {
    const isCorrect = question?.is_correct === 1
    const isWrong = question?.is_correct === 2
    const isSkipped = question?.attempt_state === 2

    if (filterType === "all") return true
    if (filterType === "correct") return isCorrect
    if (filterType === "incorrect") return isWrong
    if (filterType === "skipped") return isSkipped

    return true
  })

  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  if (showScoreboard) {
    return (
      <Scoreboard
        assessmentData={{
          score: assessmentReview?.score || 0,
          total_questions: assessmentReview?.questions?.length || 0,
          correct_answers: stats.correct,
          wrong_answers: stats.wrong,
          attempt_count: assessmentReview?.attempt_count || 1,
          // questions: assessmentReview?.questions || [],

          batch_average: {
            score: 75, // Replace with actual batch average from API if available
            correct_answers: Math.round((assessmentReview?.questions?.length || 0) * 0.75), // Example
            time_per_question: 30, // Example
            accuracy: 75 // Example
          }
        }}
      />
    );
  }

  return (
    <div className="px-4 pb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Assessment Review</h1>
        <Button onClick={() => setShowScoreboard(true)}>Scoreboard</Button>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Completed on {completionDate}</p>
      </div>

      {/* Score Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center mb-2">
            <span className="text-3xl font-bold text-blue-500">{stats.percentage}%</span>
          </div>
          <p className="text-gray-800 dark:text-gray-300 font-semibold">Overall Score</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <div className="mb-2 text-blue-500">
            <QuestionIcon />
          </div>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
          <p className="text-gray-600 dark:text-gray-300">Total Questions</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <div className="mb-2 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckIcon />
          </div>
          <span className="text-3xl font-bold text-green-600">{stats.correct}</span>
          <p className="text-gray-600 dark:text-gray-300">Correct Answers</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <div className="mb-2 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <XIcon />
          </div>
          <span className="text-3xl font-bold text-red-600">{stats.wrong}</span>
          <p className="text-gray-600 dark:text-gray-300">Wrong Answers</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <div className="mb-2 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <IoMdHelpCircleOutline className="text-yellow-600" />
          </div>
          <span className="text-3xl font-bold text-yellow-600">{stats.skipped}</span>
          <p className="text-gray-600 dark:text-gray-300">Skipped</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <div className="mb-2 text-purple-600">
            <RefreshIcon />
          </div>
          <span className="text-3xl font-bold text-purple-600">{assessmentReview?.attempt_count ?? 1}</span>
          <p className="text-gray-600 dark:text-gray-300">Attempts</p>
        </div>
      </div>


      {/* Questions Review */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold dark:text-white">Questions Review</h2>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${filterType === "all" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              onClick={() => setFilterType("all")}
            >
              All Questions
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${filterType === "correct" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              onClick={() => setFilterType("correct")}
            >
              Correct
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${filterType === "incorrect" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              onClick={() => setFilterType("incorrect")}
            >
              Incorrect
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${filterType === "skipped" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              onClick={() => setFilterType("skipped")}
            >
              Skipped
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions &&
            filteredQuestions.map((question, index) => {
              const isCorrect = question.is_correct === 1
              const isWrong = question.is_correct === 2
              const isSkipped = question.is_correct === 0
              const isExpanded = expandedQuestion === question?.question_id

              const bgColor = isSkipped
                ? "bg-yellow-50 dark:bg-yellow-900/10"
                : isCorrect
                  ? "bg-green-50 dark:bg-green-900/10"
                  : "bg-red-50 dark:bg-red-900/10"
              const borderColor = isSkipped
                ? "border-yellow-200 dark:border-yellow-900/30"
                : isCorrect
                  ? "border-green-200 dark:border-green-900/30"
                  : "border-red-200 dark:border-red-900/30"

              return (
                <div
                  key={question.question_id}
                  className={`border rounded-lg overflow-hidden ${isExpanded ? borderColor : "border-gray-200 dark:border-gray-700"}`}
                >
                  <div
                    className={`p-4 flex items-start justify-between cursor-pointer ${isExpanded ? bgColor : ""}`}
                    onClick={() => setExpandedQuestion(isExpanded ? null : question.question_id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Question {index + 1}:</span>
                        {isSkipped ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            Skipped
                          </span>
                        ) : isCorrect ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckIcon />
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <XIcon />
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{question?.question}</p>
                    </div>
                    <button
                      className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      aria-label={isExpanded ? "Collapse question details" : "Expand question details"}
                    >
                      {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t">
                      <div className="pt-4 space-y-3">
                        {question?.question_type === "Text" && question.answer_statement ? (
                          <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#5A5A5A] border border-gray-200 dark:border-gray-600">
                            <p className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">Answer Statement:</p>
                            <div
                              className="text-gray-800 dark:text-white"
                              dangerouslySetInnerHTML={{ __html: question.answer_statement }}
                            />
                          </div>
                        ) : (
                          question?.question_options &&
                          question?.question_options.map((option, optIndex) => {
                            const isSelected = option.user_answer === 1;
                            const isCorrectOption = question.correct_options.includes((option.option_id).toString())

                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg transition-colors ${isCorrectOption
                                  ? "bg-green-50 border border-green-200 dark:bg-green-900 dark:border-green-800/50"
                                  : isSelected
                                    ? "bg-red-50 border border-red-200 dark:bg-red-900 dark:border-red-800/50"
                                    : "bg-white border border-gray-200 dark:bg-[#5A5A5A] dark:border-gray-600"
                                  }`}
                              >
                                <div className="flex items-center">
                                  <span className="flex-1 text-gray-900 dark:text-white">{option.option_statement}</span>
                                  {isCorrectOption && (
                                    <span className="text-green-600">
                                      <CheckIcon />
                                    </span>
                                  )}
                                  {isSelected && !isCorrectOption && (
                                    <span className="text-red-600">
                                      <XIcon />
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })
                        )}

                      </div>
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </div>
    </div >
  )
}

