export enum ModelType {
  FLASH = 'gemini-2.5-flash',
  PRO = 'gemini-3-pro-preview'
}

export interface ProcessingState {
  isLoading: boolean;
  error: string | null;
  result: string | null;
}

export interface AppSettings {
  fontSize: number; // in pixels or rem scale
  isDyslexiaFont: boolean;
  wordSpacing: 'normal' | 'wide';
}

export interface DocumentAnalysisResponse {
  originalText: string;
  simplifiedText: string;
  summary: string;
  keyPoints: string[];
}
