import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadArea } from './components/UploadArea';
import { ResultDisplay } from './components/ResultDisplay';
import { ModelType, ProcessingState, AppSettings } from './types';
import { analyzeDocument } from './services/geminiService';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [model, setModel] = useState<ModelType>(ModelType.FLASH);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isLoading: false,
    error: null,
    result: null,
  });
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  
  const [settings, setSettings] = useState<AppSettings>({
    fontSize: 18,
    isDyslexiaFont: false,
    wordSpacing: 'normal'
  });

  const handleFileSelect = useCallback(async (file: File) => {
    setCurrentFile(file);
    setProcessingState({ isLoading: true, error: null, result: null });

    try {
      const result = await analyzeDocument(file, model);
      setProcessingState({ isLoading: false, error: null, result });
    } catch (err: any) {
      setProcessingState({ 
        isLoading: false, 
        error: err.message || "An unexpected error occurred.", 
        result: null 
      });
    }
  }, [model]);

  const resetApp = () => {
    setProcessingState({ isLoading: false, error: null, result: null });
    setCurrentFile(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header 
        model={model} 
        setModel={setModel} 
        settings={settings} 
        setSettings={setSettings}
        reset={resetApp}
      />

      <main className="flex-grow flex flex-col">
        {processingState.isLoading ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="bg-white p-4 rounded-full shadow-lg relative z-10">
                <Loader2 size={48} className="text-primary-500 animate-spin" />
              </div>
            </div>
            <h3 className="mt-8 text-2xl font-bold text-slate-800">Untangling the text...</h3>
            <p className="text-slate-500 mt-2 max-w-md">
              Using {model === ModelType.PRO ? 'Gemini Pro' : 'Gemini Flash'} to analyze and simplify your document.
            </p>
          </div>
        ) : processingState.error ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="bg-red-50 p-4 rounded-full text-red-500 mb-6 border border-red-100">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Something went wrong</h3>
            <p className="text-slate-500 mt-2 max-w-md mb-8">{processingState.error}</p>
            <button 
              onClick={resetApp}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
            >
              Try Again
            </button>
          </div>
        ) : processingState.result ? (
          <ResultDisplay 
            content={processingState.result} 
            originalImage={currentFile}
            settings={settings}
            onReset={resetApp}
          />
        ) : (
          <UploadArea 
            onFileSelect={handleFileSelect} 
            isProcessing={processingState.isLoading} 
          />
        )}
      </main>
      
      {/* Footer / Attribution */}
      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>Powered by Gemini 2.5 & 3.0 • Built for Accessibility</p>
      </footer>
    </div>
  );
};

export default App;
