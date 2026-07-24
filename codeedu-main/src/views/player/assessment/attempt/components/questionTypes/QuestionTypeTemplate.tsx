import React from "react";
import { Option } from "@/@types/learner/assessment";

interface QuestionTypeTemplateProps {
    options?: Option[]; // Optional: Only if your question type needs options
    currentAnswer: any; // Update with your specific answer type
    onAnswerChange: (value: any) => void; // Update with your specific answer type
}

/**
 * Template for creating new question type components
 * 
 * Steps to add a new question type:
 * 1. Copy this template
 * 2. Rename to match your question type (e.g., ImageSelectQuestion.tsx)
 * 3. Update the props interface with correct types
 * 4. Implement your UI logic
 * 5. Add to QuestionRenderer.tsx switch statement
 * 6. Update answer state type in index.tsx if needed
 */
const QuestionTypeTemplate: React.FC<QuestionTypeTemplateProps> = ({
    options,
    currentAnswer,
    onAnswerChange
}) => {

    // Your state management here
    const handleChange = (value: any) => {
        onAnswerChange(value);
    };

    return (
        <div className="space-y-3">
            {/* Your question input UI here */}

            {/* Example for option-based questions */}
            {options?.map((option) => (
                <div
                    key={option.option_id}
                    className="flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 border-gray-200 dark:border-gray-700"
                >
                    {/* Your input component here */}
                    <label className="flex-1 cursor-pointer text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        {option.option_statement}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default QuestionTypeTemplate;


// ============================================
// EXAMPLE 1: File Upload Question
// ============================================

/*
interface FileUploadQuestionProps {
    currentFile: File | null;
    onAnswerChange: (value: File) => void;
}

const FileUploadQuestion: React.FC<FileUploadQuestionProps> = ({
    currentFile,
    onAnswerChange
}) => {
    return (
        <div className="space-y-3">
            <Label htmlFor="file-upload">Upload your answer:</Label>
            <Input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        onAnswerChange(e.target.files[0]);
                    }
                }}
            />
            {currentFile && (
                <p className="text-sm text-gray-600">
                    Selected: {currentFile.name}
                </p>
            )}
        </div>
    );
};
*/

// ============================================
// EXAMPLE 2: Rating Question
// ============================================

/*
interface RatingQuestionProps {
    rating: number;
    maxRating?: number;
    onAnswerChange: (value: number) => void;
}

const RatingQuestion: React.FC<RatingQuestionProps> = ({
    rating,
    maxRating = 5,
    onAnswerChange
}) => {
    return (
        <div className="flex gap-2">
            {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
                <button
                    key={star}
                    className={`text-3xl ${
                        star <= rating
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                    }`}
                    onClick={() => onAnswerChange(star)}
                >
                    ★
                </button>
            ))}
        </div>
    );
};
*/

// ============================================
// EXAMPLE 3: Code Editor Question
// ============================================

/*
interface CodeQuestionProps {
    code: string;
    language: string;
    onAnswerChange: (value: string) => void;
}

const CodeQuestion: React.FC<CodeQuestionProps> = ({
    code,
    language,
    onAnswerChange
}) => {
    return (
        <div className="space-y-3">
            <Label>Write your code:</Label>
            <Textarea
                value={code}
                placeholder={`// Write your ${language} code here...`}
                className="font-mono min-h-[300px]"
                onChange={(e) => onAnswerChange(e.target.value)}
            />
            <div className="flex justify-between text-xs text-gray-500">
                <span>Language: {language}</span>
                <span>{code.length} characters</span>
            </div>
        </div>
    );
};
*/

// ============================================
// EXAMPLE 4: Image Selection Question
// ============================================

/*
interface ImageSelectQuestionProps {
    images: { id: number; url: string; caption: string }[];
    selectedImages: number[];
    multiSelect?: boolean;
    onAnswerChange: (value: number | number[]) => void;
}

const ImageSelectQuestion: React.FC<ImageSelectQuestionProps> = ({
    images,
    selectedImages,
    multiSelect = false,
    onAnswerChange
}) => {
    const handleSelect = (imageId: number) => {
        if (multiSelect) {
            const newSelection = selectedImages.includes(imageId)
                ? selectedImages.filter(id => id !== imageId)
                : [...selectedImages, imageId];
            onAnswerChange(newSelection);
        } else {
            onAnswerChange(imageId);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
                <div
                    key={image.id}
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                        selectedImages.includes(image.id)
                            ? 'border-primary'
                            : 'border-gray-200'
                    }`}
                    onClick={() => handleSelect(image.id)}
                >
                    <img
                        src={image.url}
                        alt={image.caption}
                        className="w-full h-40 object-cover"
                    />
                    <p className="p-2 text-sm text-center">{image.caption}</p>
                </div>
            ))}
        </div>
    );
};
*/

// ============================================
// HOW TO INTEGRATE NEW QUESTION TYPE
// ============================================

/*
// 1. Add to QuestionRenderer.tsx switch statement:

switch (question.question_type) {
    case 'MCQ':
    case 'TRUE/FALSE':
        return <MCQQuestion ... />;
    
    case 'MRQ':
    case 'MSQ':
        return <MRQQuestion ... />;
    
    case 'Text':
        return <TextQuestion ... />;
    
    // ADD YOUR NEW TYPE HERE:
    case 'FileUpload':
        return <FileUploadQuestion ... />;
    
    case 'Rating':
        return <RatingQuestion ... />;
    
    case 'Code':
        return <CodeQuestion ... />;
    
    case 'ImageSelect':
        return <ImageSelectQuestion ... />;
    
    default:
        return <UnsupportedQuestionType />;
}

// 2. Update answer state type in index.tsx if needed:
const [answers, setAnswers] = useState<Record<number, 
    number | 
    number[] | 
    string | 
    File |           // For file uploads
    { code: string, language: string } | // For code questions
    any              // Or use specific union types
>>({});

// 3. Update handleAnswerChange to handle new save format:
if (currentQuestionData.question_type === 'FileUpload') {
    // Upload file first, then save file_id
    const fileId = await uploadFile(value);
    data.file_id = fileId;
} else if (currentQuestionData.question_type === 'Code') {
    data.code_answer = value;
}

// 4. Update API types if needed in AssessmentService
*/
