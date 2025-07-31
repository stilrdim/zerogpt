export interface ZerogptResponse {
  success: boolean;
  code: number;
  message: string; // "detection result passed to proxy"
  data: ZerogptData;
}

export interface ZerogptData {
  sentences: string[];
  isHuman: number;
  additional_feedback: string;
  h: string[];
  hi: string[];
  textWords: number;
  aiWords: number;
  fakePercentage: number;
  specialIndexes: number[];
  originalParagraph: string;
  feedback: string;
  input_text: string;
  detected_language: string;
}

export interface OurResponse {
  feedback: string;
  fakePercentage?: number;
  textWords?: number;
  aiWords?: number;
  specialIndexes?: [];
  specialSentences?: string[];
  input_text?: string;
}
