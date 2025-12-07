export interface QuestionPart {
  id?: number;
  text: string;
  isBlank: boolean;
}

export interface QuestionSegment {
  parts: QuestionPart[];
}

export type GradingResult = Record<number, boolean>;
export type UserAnswers = Record<number, string>;

export enum GradingStatus {
  IDLE = 'IDLE',
  GRADING = 'GRADING',
  DONE = 'DONE',
  ERROR = 'ERROR'
}