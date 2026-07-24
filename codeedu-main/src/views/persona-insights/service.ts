import type { PersonaQuestionsResponse, PersonaSubmitPayload } from "./types";

const PERSONA_QUESTIONS_PATH =
  "/api/v1/org/feedback-insights/69674cd0703afd5fc7ca44bf/questions";

const PERSONA_QUESTIONS_URL = import.meta.env.DEV
  ? `/persona-api${PERSONA_QUESTIONS_PATH}`
  : `https://personaapi.edulystventures.com${PERSONA_QUESTIONS_PATH}`;

const PERSONA_HEADERS = {
  "x-api-key": "pk_6d11653bc206b9b06fb49f7a2f5845b1aaa3f8f742d3452c",
  "x-api-secret": "sk_bf515eba26b5295500671327117d12b817c21b412a38412b536c33b397d507a0",
  accept: "application/json",
} as const;

let cachedQuestions: PersonaQuestionsResponse["data"] | null = null;

export const fetchPersonaQuestions = async () => {
  if (cachedQuestions) {
    return cachedQuestions;
  }

  const response = await fetch(PERSONA_QUESTIONS_URL, {
    method: "GET",
    headers: PERSONA_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Failed to load persona questions (${response.status})`);
  }

  const result = (await response.json()) as PersonaQuestionsResponse;

  if (!result.status || !result.data?.questions?.length) {
    throw new Error(result.message || "Persona questions are unavailable");
  }

  cachedQuestions = result.data;
  return result.data;
};

export const fetchPersonaResponse = async (
  insightId: string,
  externalUserId: string
) => {
  const responsePath = `/api/v1/org/feedback-insights/${insightId}/response?externalUserId=${encodeURIComponent(
    externalUserId
  )}`;
  const responseUrl = import.meta.env.DEV
    ? `/persona-api${responsePath}`
    : `https://personaapi.edulystventures.com${responsePath}`;

  const response = await fetch(responseUrl, {
    method: "GET",
    headers: PERSONA_HEADERS,
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to load persona response (${response.status})`);
  }

  const result = await response.json();
  return result.data;
};

export const submitPersonaAnswers = async (
  insightId: string,
  payload: PersonaSubmitPayload
) => {
  const submitPath = `/api/v1/org/feedback-insights/${insightId}/submit`;
  const submitUrl = import.meta.env.DEV
    ? `/persona-api${submitPath}`
    : `https://personaapi.edulystventures.com${submitPath}`;

  const response = await fetch(submitUrl, {
    method: "POST",
    headers: {
      ...PERSONA_HEADERS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit persona answers (${response.status})`);
  }

  return response.json();
};

export const fetchPersonaMaxCounts = async (
  insightId: string,
  externalUserId: string
) => {
  const maxCountsPath = `/api/v1/org/feedback-insights/${insightId}/max-counts?externalUserId=${encodeURIComponent(
    externalUserId
  )}`;
  const maxCountsUrl = import.meta.env.DEV
    ? `/persona-api${maxCountsPath}`
    : `https://personaapi.edulystventures.com${maxCountsPath}`;

  const response = await fetch(maxCountsUrl, {
    method: "GET",
    headers: PERSONA_HEADERS,
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to load persona max counts (${response.status})`);
  }

  const result = await response.json();
  return result.data;
};
