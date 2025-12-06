export enum ModelType {
  FLASH = 'gemini-2.5-flash',
  PRO = 'gemini-3-pro-preview'
}

export interface SchemaMetadata {
  type: string; // e.g., "Invoice", "Letter", "Form"
  tone: 'urgent' | 'informative' | 'calm' | 'positive';
  summary: string;
}

export interface SchemaWidget {
  id: string;
  type: 'action' | 'info' | 'alert' | 'nav' | 'list';
  content: string; // The main text or value
  label?: string; // The label or key (e.g., "Total Due")
  highlight?: boolean;
}

export interface SchemaResponse {
  metadata: SchemaMetadata;
  widgets: SchemaWidget[];
}

export interface ProcessingState {
  isLoading: boolean;
  error: string | null;
  result: SchemaResponse | null;
}

export interface AppSettings {
  fontSize: number; // in pixels
  isDyslexiaFont: boolean;
  wordSpacing: 'normal' | 'wide';
}
