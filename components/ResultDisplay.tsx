import React, { useEffect, useState } from 'react';
import { AppSettings, SchemaResponse, SchemaWidget } from '../types';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Play, 
  Square, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Calendar, 
  Phone, 
  CreditCard,
  MapPin,
  ArrowRightCircle,
  List,
  Navigation,
  ChevronRight
} from 'lucide-react';

interface ResultDisplayProps {
  data: SchemaResponse;
  originalImage: File | null;
  settings: AppSettings;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, originalImage, settings, onReset }) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const imageUrl = React.useMemo(() => originalImage ? URL.createObjectURL(originalImage) : '', [originalImage]);

  // TTS Helper
  const speak = (text: string, id: string) => {
    window.speechSynthesis.cancel(); // Stop any current speech
    
    if (speakingId === id) {
      setSpeakingId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Auto-read summary on mount
  useEffect(() => {
    if (data.metadata.summary) {
      // Small delay to allow UI to settle
      const timer = setTimeout(() => {
        speak(data.metadata.summary, 'summary');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data.metadata.summary]);

  // Cleanup on unmount
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  // Style Generators
  const getContainerStyles = () => {
    return {
      fontSize: `${settings.fontSize}px`,
      lineHeight: '1.6',
      letterSpacing: settings.wordSpacing === 'wide' ? '0.05em' : 'normal',
      wordSpacing: settings.wordSpacing === 'wide' ? '0.1em' : 'normal',
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

  const WidgetRenderer = ({ widget }: { widget: SchemaWidget }) => {
    const isSpeaking = speakingId === widget.id;
    
    const baseClasses = `
      relative group cursor-pointer transition-all duration-200 ease-out transform
      hover:scale-[1.005] hover:shadow-md border-2 rounded-2xl p-5 mb-4
      ${settings.isDyslexiaFont ? 'font-dyslexic' : 'font-sans'}
      ${isSpeaking ? 'ring-2 ring-primary-400 scale-[1.005] shadow-md bg-primary-50' : 'bg-white'}
    `;

    const handleClick = () => speak(`${widget.label ? widget.label + '. ' : ''} ${widget.content}`, widget.id);

    // ACTION WIDGET
    if (widget.type === 'action') {
      return (
        <div 
          onClick={handleClick}
          className={`${baseClasses} border-primary-200 bg-primary-50/30 hover:bg-primary-50 flex items-center justify-between gap-4`}
          role="button"
          aria-label={`Action required: ${widget.content}`}
        >
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 p-3 rounded-xl text-primary-600 flex-shrink-0">
              <CheckCircle2 size={28} />
            </div>
            <div>
              {widget.label && (
                <div className="text-[0.8em] font-bold text-primary-600 uppercase tracking-wider mb-1">
                  Action Required
                </div>
              )}
              <div className="font-bold text-slate-800 leading-tight whitespace-pre-line">
                {widget.content}
              </div>
            </div>
          </div>
          <div className="bg-white p-2 rounded-full shadow-sm text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {isSpeaking ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </div>
        </div>
      );
    }

    // ALERT WIDGET
    if (widget.type === 'alert') {
      return (
        <div 
          onClick={handleClick}
          className={`${baseClasses} border-amber-200 bg-amber-50/30 hover:bg-amber-50`}
          role="alert"
        >
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-xl text-amber-600 mt-1 flex-shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div className="flex-grow">
              {widget.label && (
                <div className="text-[0.75em] font-bold text-amber-700 uppercase tracking-widest mb-1">
                  {widget.label}
                </div>
              )}
              <div className="font-bold text-slate-800 whitespace-pre-line">
                {widget.content}
              </div>
            </div>
             <div className="text-amber-400 opacity-50 group-hover:opacity-100 flex-shrink-0">
                {isSpeaking ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
             </div>
          </div>
        </div>
      );
    }

    // LIST WIDGET
    if (widget.type === 'list') {
      const items = widget.content.split(/\n|•|- /).filter(item => item.trim().length > 0);
      return (
        <div 
          onClick={handleClick}
          className={`${baseClasses} border-slate-200 hover:border-slate-300`}
        >
           <div className="flex items-start gap-4">
             <div className="bg-slate-100 p-2 rounded-xl text-slate-600 mt-1 flex-shrink-0">
               <List size={24} />
             </div>
             <div className="flex-grow">
                {widget.label && (
                   <div className="text-[0.75em] font-bold text-slate-500 uppercase tracking-widest mb-2">
                     {widget.label}
                   </div>
                 )}
                 <ul className="space-y-2">
                   {items.map((item, idx) => (
                     <li key={idx} className="flex items-start gap-2 font-medium text-slate-700">
                       <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-400 mt-[0.6em] flex-shrink-0" />
                       <span className="leading-snug">{item.trim()}</span>
                     </li>
                   ))}
                 </ul>
             </div>
             <div className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                {isSpeaking ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
             </div>
           </div>
        </div>
      )
    }

    // NAV WIDGET
    if (widget.type === 'nav') {
      return (
        <div 
          onClick={handleClick}
          className={`${baseClasses} border-slate-200 bg-slate-50 hover:bg-white`}
        >
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 flex-shrink-0">
                  <Navigation size={22} />
                </div>
                <div>
                   {widget.label && (
                     <div className="text-[0.75em] font-bold text-slate-400 uppercase tracking-wide">
                       {widget.label}
                     </div>
                   )}
                   <div className="font-bold text-slate-800 text-[1.1em]">
                     {widget.content}
                   </div>
                </div>
             </div>
             <div className="text-slate-300 group-hover:text-primary-500 transition-colors">
                <ChevronRight size={24} />
             </div>
          </div>
        </div>
      )
    }

    // INFO (STANDARD) WIDGET
    const Icon = getIconForLabel(widget.label || '');
    return (
      <div 
        onClick={handleClick}
        className={`${baseClasses} border-slate-100 hover:border-primary-200`}
      >
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
             <Icon size={20} />
           </div>
           
           <div className="flex-grow">
             {widget.label && (
               <div className="text-[0.75em] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                 {widget.label}
               </div>
             )}
             <div className="font-medium text-slate-700 leading-snug whitespace-pre-line">
               {widget.content}
             </div>
           </div>

           <div className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              {isSpeaking ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 px-4 pb-20">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-white hover:shadow-sm"
        >
          <ArrowLeft size={20} />
          <span>New Scan</span>
        </button>

        {originalImage && (
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
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
          <div 
            onClick={() => speak(data.metadata.summary, 'summary')}
            className={`
              p-6 md:p-8 rounded-3xl border mb-8 cursor-pointer group transition-all
              ${getToneColor(data.metadata.tone)}
              ${speakingId === 'summary' ? 'ring-4 ring-offset-2 ring-primary-200' : ''}
              ${settings.isDyslexiaFont ? 'font-dyslexic' : 'font-sans'}
            `}
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
              
              <div className="bg-white/50 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                {speakingId === 'summary' ? <Square size={24} fill="currentColor"/> : <Play size={24} fill="currentColor"/>}
              </div>
            </div>
          </div>

          {/* Widgets Grid */}
          <div className="space-y-2">
             {data.widgets.map((widget) => (
               <WidgetRenderer key={widget.id} widget={widget} />
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

// Helper to guess icon based on label text
const getIconForLabel = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('date') || l.includes('time') || l.includes('when')) return Calendar;
  if (l.includes('phone') || l.includes('call') || l.includes('contact')) return Phone;
  if (l.includes('pay') || l.includes('total') || l.includes('cost') || l.includes('amount')) return CreditCard;
  if (l.includes('address') || l.includes('where') || l.includes('location')) return MapPin;
  if (l.includes('next') || l.includes('go')) return ArrowRightCircle;
  return Info;
};