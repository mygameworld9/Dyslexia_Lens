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
    } catch (err: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setProcessingState({ 
        isLoading: false, 
        error: errorMessage, 
        result: null 
      });
    }
  }, [model]);

  const resetApp = () => {
    window.speechSynthesis.cancel();
    setProcessingState({ isLoading: false, error: null, result: null });
    setCurrentFile(null);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50/50 ${settings.isDyslexiaFont ? 'font-dyslexic' : 'font-sans'}`}>
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
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary-200 rounded-full blur-2xl opacity-50 animate-pulse w-32 h-32 mx-auto"></div>
              <div className="bg-white p-6 rounded-3xl shadow-xl shadow-primary-100 relative z-10 mx-auto w-max">
                <Loader2 size={48} className="text-primary-500 animate-spin" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">Reading Document...</h3>
            <p className="text-lg text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
              We're untangling the text and finding what matters.
              <br/>
              <span className="text-sm opacity-75 mt-2 inline-block">Using {model === ModelType.PRO ? 'Gemini Pro' : 'Gemini Flash'}</span>
            </p>
          </div>
        ) : processingState.error ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="bg-red-50 p-6 rounded-full text-red-500 mb-6 border-4 border-red-100 shadow-sm">
              <AlertCircle size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Something went wrong</h3>
            <p className="text-slate-500 mt-2 max-w-md mb-8 leading-relaxed">{processingState.error}</p>
            <button 
              onClick={resetApp}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-200 active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : processingState.result ? (
          <ResultDisplay 
            data={processingState.result} 
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
      
      {/* Footer */}
      {!processingState.result && (
        <footer className="py-8 text-center text-slate-400 text-sm font-medium">
          <p>Powered by Gemini 2.5 & 3.0 • Built for Accessibility</p>
        </footer>
      )}
    </div>
  );
};

export default App;