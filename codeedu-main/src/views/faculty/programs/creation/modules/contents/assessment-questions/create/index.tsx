// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from "@/components/ui/ShadcnInput";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/shadcnAlert";
import { useParams } from "react-router-dom";
import Preview from "./preview";
import { createAssessmentQuestion } from "@/services/faculty/AssessmentService";

interface Option {
    id: string;
    text: string;
}
interface Question {
    id: string;
    type: 1 | 2;
    text: string;
    options: Option[];
    correctAnswer: string | boolean;
    marks: number;
}

const App: React.FC = () => {

    // /programs/:id/modules/:moduleId/content/:contentId/assessment-questions/add',
    const { id, moduleId, contentId } = useParams<{ id: string, moduleId: string, contentId: string }>();


    const [activeQuestionType, setActiveQuestionType] = useState<1 | 2>(1);
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState<Option[]>([
        { id: "1", text: "" },
        { id: "2", text: "" },
    ]);
    const [correctAnswer, setCorrectAnswer] = useState<string | boolean>("1");
    const [marks, setMarks] = useState<number>(1);
    const [validationError, setValidationError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Reset form when question type changes
    useEffect(() => {
        setQuestionText("");
        if (activeQuestionType === 1) {
            setCorrectAnswer(true);
            setOptions([]);
        } else {
            setOptions([
                { id: "1", text: "" },
                { id: "2", text: "" },
            ]);
            setCorrectAnswer("1");
        }
        setMarks(1);
        setValidationError("");
        setSuccessMessage("");
    }, [activeQuestionType]);

    const addOption = () => {
        const newId = (options.length + 1).toString();
        setOptions([...options, { id: newId, text: "" }]);
    };

    const removeOption = (id: string) => {
        if (options.length <= 2) {
            setValidationError(
                "Single choice questions must have at least 2 options",
            );
            return;
        }
        const newOptions = options.filter((option) => option.id !== id);
        setOptions(newOptions);
        // If the correct answer was the removed option, set it to the first option
        if (correctAnswer === id) {
            setCorrectAnswer(newOptions[0].id);
        }
    };

    const updateOptionText = (id: string, text: string) => {
        setOptions(
            options.map((option) =>
                option.id === id ? { ...option, text } : option,
            ),
        );
    };

    const validateQuestion = (): boolean => {
        if (!questionText.trim()) {
            setValidationError("Question text is required");
            return false;
        }
        if (activeQuestionType === 2) {
            if (options.length < 2) {
                setValidationError(
                    "Single choice questions must have at least 2 options",
                );
                return false;
            }
            for (const option of options) {
                if (!option.text.trim()) {
                    setValidationError("All options must have text");
                    return false;
                }
            }
            if (!correctAnswer) {
                setValidationError("Please select a correct answer");
                return false;
            }
        }
        if (marks <= 0) {
            setValidationError("Marks must be greater than 0");
            return false;
        }
        return true;
    };
    const saveQuestion = () => {

        if(!id || !moduleId || !contentId) {
            setValidationError("Invalid parameters. Please check the URL.");
            return;
        }

        setValidationError("");
        setSuccessMessage("");
        if (validateQuestion()) {
            const newQuestion: Question = {
                id: Date.now().toString(),
                type: activeQuestionType,
                text: questionText,
                options: activeQuestionType === 2 ? options : [],
                correctAnswer,
                marks,
            };
            // API call would go here - for now just console log
            console.log("Saving question:", newQuestion);

            const formData = new FormData();
            formData.append("assessment_id", id);
            formData.append("program_id", id);
            formData.append("module_id", moduleId);
            formData.append("content_id", contentId);
            formData.append("que_statement", questionText);
            formData.append("que_type", activeQuestionType.toString());
            formData.append("que_number", "1"); // Assuming this is the first question
            formData.append("que_marks", marks.toString());
            if (activeQuestionType === 2) {
                formData.append("options[]", options.map(o => o.text).join(", "));
                formData.append("correct_options[]", options.find(o => o.id === correctAnswer)?.text || "");
            } else {
                formData.append("options[]", "true, false");
                formData.append("correct_options[]", correctAnswer ? "true" : "false");
            }

            formData.append("btn_action", "");
            formData.append("add_extra_marks", "");
            formData.append("applicable_for", "");
            formData.append("correct_text", "");
            formData.append("weightage", "");
            formData.append("question_timer", "");
            formData.append("SkillCategoryHtml", "");
            formData.append("saveSkill", "");
            formData.append("deleteSkill", "");
            formData.append("set", "1");
            formData.append("question_label_id", "");
            formData.append("match_case", "");


            // API call would go here
            createAssessmentQuestion(formData).then(() => {
                console.log("Question saved successfully");
            }).catch((error) => {
                console.error("Error saving question:", error);
                setValidationError("Failed to save question. Please try again.");
            });
        }
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6 col-span-1 md:col-span-2">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        Create{" "} {activeQuestionType === 1 ? "True/False" : "Single Choice"}{" "} Question
                    </h2>
                    <p className="text-gray-500">Fill in the details below to create your question</p>
                </div>
                <div className="space-y-6">
                    <div>
                        <Label className="text-base font-medium">Question Type</Label>
                        <RadioGroup
                            className="mt-2 flex space-x-6"
                            value={activeQuestionType?.toString()}
                            onValueChange={(value) => setActiveQuestionType(Number(value) as 1 | 2)}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="true-false" />
                                <Label htmlFor="true-false" className="cursor-pointer">
                                    True/False
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="2" id="single-choice" />
                                <Label htmlFor="single-choice" className="cursor-pointer">
                                    Single Choice
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div>
                        <Label htmlFor="question-text" className="text-base font-medium">
                            Question Text
                        </Label>
                        <Textarea
                            id="question-text"
                            placeholder="Enter your question here..."
                            className="mt-1 h-24"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                        />
                    </div>
                    {activeQuestionType === 1 ? (
                        <div>
                            <Label className="text-base font-medium">Correct Answer</Label>
                            <RadioGroup
                                className="mt-2 flex space-x-6"
                                value={correctAnswer.toString()}
                                defaultValue="true"
                                onValueChange={(value) => setCorrectAnswer(value === "true")}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="true" />
                                    <Label htmlFor="true" className="cursor-pointer">
                                        True
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="false" />
                                    <Label htmlFor="false" className="cursor-pointer">
                                        False
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label className="text-base font-medium">
                                    Answer Options
                                </Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="!rounded-button whitespace-nowrap"
                                    onClick={addOption}
                                >
                                    <i className="fas fa-plus mr-2"></i> Add Option
                                </Button>
                            </div>
                            <div className="space-y-3 mb-4">
                                {options.map((option) => (
                                    <div key={option.id} className="flex items-center gap-3">
                                        <RadioGroup
                                            value={correctAnswer.toString()}
                                            className="flex items-center space-x-2"
                                            onValueChange={(value) => setCorrectAnswer(value)}
                                        >
                                            <RadioGroupItem
                                                value={option.id}
                                                id={`option-${option.id}`}
                                            />
                                        </RadioGroup>
                                        <Input
                                            placeholder={`Option ${option.id}`}
                                            value={option.text}
                                            className="flex-1"
                                            onChange={(e) =>
                                                updateOptionText(option.id, e.target.value)
                                            }
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-500 hover:text-red-500 !rounded-button cursor-pointer"
                                            onClick={() => removeOption(option.id)}
                                        >
                                            <i className="fas fa-times"></i>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm text-gray-500 mb-4">
                                <i className="fas fa-info-circle mr-2"></i>
                                Select the radio button next to the correct answer
                            </div>
                        </div>
                    )}
                    <div>
                        <Label htmlFor="marks" className="text-base font-medium">
                            Marks
                        </Label>
                        <Input
                            id="marks"
                            type="number"
                            min="1"
                            className="mt-1 w-24"
                            value={marks}
                            onChange={(e) => setMarks(parseInt(e.target.value) || 0)}
                        />
                    </div>
                    {validationError && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertDescription>
                                <i className="fas fa-exclamation-circle mr-2"></i>
                                {validationError}
                            </AlertDescription>
                        </Alert>
                    )}
                    {successMessage && (
                        <Alert className="mt-4 bg-green-50 text-green-700 border-green-200">
                            <AlertDescription>
                                <i className="fas fa-check-circle mr-2"></i>
                                {successMessage}
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="pt-4 flex justify-end">
                        <Button
                            type="button"
                            size="lg"
                            className="!rounded-button whitespace-nowrap text-white"
                            onClick={saveQuestion}
                        >
                            <i className="fas fa-save mr-2"></i> Save Question
                        </Button>
                    </div>
                </div>
            </div>
            <Preview
                questionText={questionText}
                activeQuestionType={activeQuestionType}
                options={options}
                correctAnswer={correctAnswer}
                marks={marks}
            />
        </div>
    );
};
export default App;