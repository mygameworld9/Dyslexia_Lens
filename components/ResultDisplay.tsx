import React, { useEffect, useState } from 'react';
import { AppSettings, SchemaResponse } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { WidgetCard } from './WidgetCard';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Play, 
  Square,
  Info
} from 'lucide-react';

interface ResultDisplayProps {
  data: SchemaResponse;
  originalImage: File | null;
  settings: AppSettings;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, originalImage, settings, onReset }) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const imageUrl = React.useMemo(() => originalImage ? URL.createObjectURL(originalImage) : '', [originalImage]);
  const { speak, cancel, speakingId } = useSpeech();

  // Auto-read summary on mount
  useEffect(() => {
    if (data.metadata.summary) {
      // Small delay to allow UI to settle
      const timer = setTimeout(() => {
        speak(data.metadata.summary, 'summary');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data.metadata.summary, speak]);

  // Style Generators
  const getContainerStyles = () => {
    // When Dyslexia Font is enabled, we also increase line-height and letter-spacing
    // as per accessibility research guidelines.
    const isDyslexic = settings.isDyslexiaFont;
    
    return {
      fontSize: `${settings.fontSize}px`,
      lineHeight: isDyslexic ? '2.0' : '1.6', // Significantly looser line height for dyslexic mode
      letterSpacing: settings.wordSpacing === 'wide' || isDyslexic ? '0.05em' : 'normal',
      wordSpacing: settings.wordSpacing === 'wide' || isDyslexic ? '0.1em' : 'normal',
    };
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'urgent': return 'bg-red-50 border-red-200 text-red-900';
      case 'positive': return 'bg-green-50 border-green-200 text-green-900';
      case 'informative': return 'bg-blue-50 border-blue-200 text-blue-900';
      default: return 'bg-slate-50 border-slate-200 text-slate-900';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 px-4 pb-20">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => { cancel(); onReset(); }}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
        >
          <ArrowLeft size={20} />
          <span>New Scan</span>
        </button>

        {originalImage && (
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary-200 ${
              showOriginal 
                ? 'bg-primary-600 text-white shadow-md' 
                : 'bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ImageIcon size={18} />
            {showOriginal ? 'Hide Original' : 'View Original'}
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Original Image Panel */}
        {showOriginal && imageUrl && (
          <div className="lg:w-1/3 flex-shrink-0 animate-in fade-in slide-in-from-left-4 duration-300 w-full">
             <div className="sticky top-24 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
               <img 
                 src={imageUrl} 
                 alt="Original document" 
                 className="w-full h-auto object-contain"
               />
             </div>
          </div>
        )}

        {/* Dynamic Lens UI */}
        <div 
          className={`flex-grow transition-all duration-300 w-full`}
          style={getContainerStyles()}
        >
          
          {/* Summary Hero */}
          <button 
            onClick={() => speak(data.metadata.summary, 'summary')}
            className={`
              w-full text-left p-6 md:p-8 rounded-3xl border mb-8 cursor-pointer group transition-all
              focus:outline-none focus:ring-4 focus:ring-primary-200
              ${getToneColor(data.metadata.tone)}
              ${speakingId === 'summary' ? 'ring-4 ring-offset-2 ring-primary-200' : ''}
              ${settings.isDyslexiaFont ? 'font-dyslexic' : 'font-sans'}
            `}
            aria-label={`Document summary: ${data.metadata.summary}. Click to listen.`}
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-white/60 rounded-full text-[0.75em] font-bold uppercase tracking-wider backdrop-blur-sm border border-black/5">
                    {data.metadata.type || 'Document'}
                  </span>
                  {data.metadata.tone === 'urgent' && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[0.75em] font-bold uppercase tracking-wider">
                      Urgent
                    </span>
                  )}
                </div>
                <h1 className="text-[1.5em] font-bold leading-tight mb-2">
                  {data.metadata.summary}
                </h1>
                <div className="flex items-center gap-2 text-[0.8em] opacity-60 font-medium mt-4">
                  <Play size={14} fill="currentColor" />
                  <span>Tap to listen</span>
                </div>
              </div>
              
              <div className="bg-white/50 p-3 rounded-full opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex-shrink-0">
                {speakingId === 'summary' ? <Square size={24} fill="currentColor"/> : <Play size={24} fill="currentColor"/>}
              </div>
            </div>
          </button>

          {/* Widgets Grid */}
          <div className="space-y-2">
             {data.widgets.map((widget) => (
               <WidgetCard 
                 key={widget.id} 
                 widget={widget} 
                 isSpeaking={speakingId === widget.id}
                 onSpeak={() => speak(`${widget.label ? widget.label + '. ' : ''} ${widget.content}`, widget.id)}
                 settings={settings}
               />
             ))}
          </div>

          {/* Empty State / Fallback */}
          {data.widgets.length === 0 && (
            <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
              <Info size={48} className="mx-auto mb-4 opacity-50" />
              <p>No specific details were found to extract.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
