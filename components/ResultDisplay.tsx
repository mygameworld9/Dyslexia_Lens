import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AppSettings } from '../types';
import { RefreshCcw, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface ResultDisplayProps {
  content: string;
  originalImage: File | null;
  settings: AppSettings;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, originalImage, settings, onReset }) => {
  const [showOriginal, setShowOriginal] = React.useState(false);
  const imageUrl = React.useMemo(() => originalImage ? URL.createObjectURL(originalImage) : '', [originalImage]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 px-4 pb-20">
      {/* Controls Bar */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft size={18} />
          <span>Back to Camera</span>
        </button>

        {originalImage && (
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              showOriginal 
                ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-200' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ImageIcon size={16} />
            {showOriginal ? 'Hide Original' : 'Show Original'}
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Original Image Panel (Conditional) */}
        {showOriginal && imageUrl && (
          <div className="lg:w-1/3 flex-shrink-0 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="sticky top-24 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
               <img 
                 src={imageUrl} 
                 alt="Original document" 
                 className="w-full h-auto object-contain"
               />
             </div>
          </div>
        )}

        {/* Text Content Panel */}
        <div className={`flex-grow transition-all duration-300 ${showOriginal ? 'lg:w-2/3' : 'w-full'}`}>
          <div 
            className={`
              bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 min-h-[50vh]
              ${settings.isDyslexiaFont ? 'font-dyslexic tracking-wide leading-loose' : 'font-sans leading-relaxed'}
            `}
            style={{ 
              fontSize: `${settings.fontSize}px`,
              lineHeight: settings.isDyslexiaFont ? '2' : '1.6'
            }}
          >
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-700 prose-li:text-slate-700">
               <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
