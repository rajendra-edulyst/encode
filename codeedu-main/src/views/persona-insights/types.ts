export interface PersonaCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface PersonaOption {
  _id: string;
  questionId: string;
  optionLabel: string;
  optionValue: string;
  optionDescription: string;
  isCorrect: boolean | null;
  weight: number | null;
  orderIndex: number;
}

export interface PersonaQuestion {
  _id: string;
  feedbackInsightId: string;
  categoryId: string;
  questionType: string;
  questionText: string;
  placeholder: string;
  isRequired: boolean;
  maxSelections: number | null;
  orderIndex: number;
  randomizable: boolean;
  category: PersonaCategory;
  options: PersonaOption[];
}

export interface PersonaFeedbackInsight {
  _id: string;
  type: string;
  name: string;
  slug: string;
  status: string;
  visibility: string;
}

export interface PersonaQuestionsResponse {
  status: boolean;
  message: string;
  data: {
    feedbackInsight: PersonaFeedbackInsight;
    questions: PersonaQuestion[];
  };
}

export interface PersonaSubmitAnswer {
  questionId: string;
  answerValue: {
    value: string;
  };
}

export interface PersonaSubmitPayload {
  isAnonymous: boolean;
  completionTime: number;
  meta: {
    externalUserId: string;
    appVersion: string;
    platform: string;
  };
  answers: PersonaSubmitAnswer[];
}
