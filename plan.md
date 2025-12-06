# Implementation Plan - Dyslexia Lens

This document outlines the detailed step-by-step implementation of Dyslexia Lens, an accessibility tool powered by Gemini that decodes complex documents into simple, actionable, and audible interfaces.

## Step 1: Foundation & Type Definitions
**Goal:** Define the data structures that act as the contract between the AI and the UI.
- [x] **Clean Index**: Reset `index.tsx` to a clean React entry point.
- [x] **Define AI Schema Types**:
    - `SchemaMetadata`: `{ type: string, tone: 'urgent'|'informative'|'calm', summary: string }`
    - `SchemaWidget`: `{ id: string, type: 'action'|'info'|'alert'|'nav', content: string, label?: string, highlight: boolean }`
    - `SchemaResponse`: `{ metadata: SchemaMetadata, widgets: SchemaWidget[] }`
- [x] **Define App State**:
    - `view`: 'upload' | 'processing' | 'results' | 'error'
    - `image`: string (base64)
    - `data`: SchemaResponse | null
    - `settings`: `{ dyslexicFont: boolean, textSize: number }`

## Step 2: AI Integration Layer
**Goal:** Configure Gemini to act as an "Accessibility Expert".
- [x] **Setup SDK**: Initialize `GoogleGenAI` with `process.env.API_KEY`.
- [x] **Configure Model**: Use `gemini-3-pro-preview` for advanced multimodal reasoning.
- [x] **Develop Prompt & Schema**:
    - Create a system instruction that enforces: "Simplify text, prioritize actions, strip decorative elements."
    - Define the `responseSchema` to strictly match `SchemaResponse`.
- [x] **Create Analysis Function**: Implement `analyzeDocument(base64Image)` which calls `generateContent` and returns the parsed JSON.

## Step 3: Input Experience
**Goal:** A stress-free entry point for users.
- [x] **Upload Component**:
    - Large, high-contrast click target for file selection.
    - Support for Camera capture (mobile friendly).
    - File reading logic (FileReader to Base64).
- [x] **Processing UI**:
    - A "Calm" loading state (pulsing placeholders) instead of a frantic spinner.
    - Reassuring text messages (e.g., "Reading document...", "Simplifying layout...").

## Step 4: Universal Renderer (The "Lens")
**Goal:** Dynamic UI generation based on AI output.
- [x] **Component: SummaryHero**: A prominent header displaying the document's core purpose (`metadata.summary`).
- [x] **Component: ActionCard**: High-priority interactive buttons for `type: action` widgets (e.g., "Pay Now", "Call Support").
- [x] **Component: AlertBox**: distinct styling for `tone: urgent` or `type: alert` widgets.
- [x] **Component: InfoRow**: Clean, large-text rows for `type: info` data.
- [x] **Main Renderer**: A component that iterates through `data.widgets` and selects the correct component above.

## Step 5: Accessibility & Interaction
**Goal:** Make the content perceivable via multiple senses.
- [x] **Text-to-Speech Engine**:
    - Helper function `speak(text)` using `window.speechSynthesis`.
    - **Auto-read**: Trigger summary reading when results load.
    - **Touch-to-read**: Add `onClick` handlers to all widgets to read their specific content.
- [x] **Visual Toggles**:
    - **Dyslexic Font**: A toggle that applies a font-family override (simulated OpenDyslexic or Comic Sans style) to the root container.
    - **Text Scaling**: A slider or toggle to increase root font size (rem based).

## Step 6: Final Polish
- [x] **Error Recovery**: specific UI for "Could not read image" with a "Try Again" button.
- [x] **Review**: Ensure no generic alert() calls; use proper UI feedback.