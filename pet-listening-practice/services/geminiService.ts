import { GoogleGenAI, Type } from "@google/genai";
import { UserAnswers, GradingResult } from "../types";
import { RAW_TEXT } from "../constants";

const apiKey = process.env.API_KEY || '';

// Initialize client
const getAiClient = () => {
  if (!apiKey) {
    console.warn("API Key is missing. Grading will default to mock logic or fail.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const gradeAnswersWithGemini = async (answers: UserAnswers): Promise<GradingResult> => {
  const ai = getAiClient();
  
  if (!ai) {
    throw new Error("Google Gemini API Key is missing.");
  }

  // Ensure we send all 50 blanks to Gemini, using empty strings for missing answers.
  // This ensures the model grades "missing" answers as incorrect rather than ignoring them.
  const allAnswers: Record<number, string> = {};
  for (let i = 1; i <= 50; i++) {
    allAnswers[i] = answers[i] || "";
  }

  // Construct a prompt that includes the context text and the user's answers
  const prompt = `
    You are an English teacher grading a PET (B1 Preliminary) listening test.
    
    Here is the full text of the exercise with numbered blanks:
    """
    ${RAW_TEXT}
    """

    The user has provided the following answers for the blanks. 
    Your task is to determine if each answer is semantically and grammatically correct for the specific blank context.
    Ignore minor spelling mistakes if the word is clearly recognizable (phonetic spelling errors are acceptable for PET listening).
    
    User Answers:
    ${JSON.stringify(allAnswers)}

    Return a JSON object where the keys are the question IDs (1 to 50) and the values are booleans (true if correct, false if incorrect).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
             results: {
               type: Type.ARRAY,
               items: {
                 type: Type.OBJECT,
                 properties: {
                   id: { type: Type.INTEGER },
                   isCorrect: { type: Type.BOOLEAN }
                 },
                 required: ["id", "isCorrect"]
               }
             }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");

    const parsedData = JSON.parse(resultText) as { results: { id: number, isCorrect: boolean }[] };
    
    // Convert array back to map
    const gradingMap: GradingResult = {};
    parsedData.results.forEach(item => {
      gradingMap[item.id] = item.isCorrect;
    });

    return gradingMap;

  } catch (error) {
    console.error("Gemini Grading Error:", error);
    throw error;
  }
};