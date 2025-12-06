import React from 'react';
import { SchemaWidget, AppSettings } from '../types';
import { 
  Play, 
  Square, 
  CheckCircle2, 
  AlertTriangle, 
  List, 
  Navigation, 
  ChevronRight,
  Calendar,
  Phone,
  CreditCard,
  MapPin,
  ArrowRightCircle,
  Info
} from 'lucide-react';

interface WidgetCardProps {
  widget: SchemaWidget;
  isSpeaking: boolean;
  onSpeak: () => void;
  settings: AppSettings;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({ widget, isSpeaking, onSpeak, settings }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSpeak();
    }
  };

  const baseClasses = `
    relative group cursor-pointer transition-all duration-200 ease-out transform
    hover:scale-[1.005] hover:shadow-md border-2 rounded-2xl p-5 mb-4 text-left w-full
    focus:outline-none focus:ring-4 focus:ring-primary-200
    ${settings.isDyslexiaFont ? 'font-dyslexic' : 'font-sans'}
    ${isSpeaking ? 'ring-2 ring-primary-400 scale-[1.005] shadow-md bg-primary-50' : 'bg-white'}
  `;

  // ACTION WIDGET
  if (widget.type === 'action') {
    return (
      <button 
        onClick={onSpeak}
        onKeyDown={handleKeyDown}
        className={`${baseClasses} border-primary-200 bg-primary-50/30 hover:bg-primary-50 flex items-center justify-between gap-4`}
        aria-label={`Action required: ${widget.content}. Click to listen.`}
      >
        <div className="flex items-start gap-4 text-left">
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
        <div className="bg-white p-2 rounded-full shadow-sm text-primary-500 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex-shrink-0">
          {isSpeaking ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </div>
      </button>
    );
  }

  // ALERT WIDGET
  if (widget.type === 'alert') {
    return (
      <button 
        onClick={onSpeak}
        onKeyDown={handleKeyDown}
        className={`${baseClasses} border-amber-200 bg-amber-50/30 hover:bg-amber-50`}
        aria-label={`Alert: ${widget.label || ''} ${widget.content}. Click to listen.`}
      >
        <div className="flex items-start gap-4 text-left">
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
           <div className="text-amber-400 opacity-50 group-hover:opacity-100 group-focus:opacity-100 flex-shrink-0">
              {isSpeaking ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
           </div>
        </div>
      </button>
    );
  }

  // LIST WIDGET
  if (widget.type === 'list') {
    const items = widget.content.split(/\n|•|- /).filter(item => item.trim().length > 0);
    return (
      <button 
        onClick={onSpeak}
        onKeyDown={handleKeyDown}
        className={`${baseClasses} border-slate-200 hover:border-slate-300`}
        aria-label={`List: ${widget.label || ''}. ${items.length} items. Click to listen.`}
      >
         <div className="flex items-start gap-4 text-left">
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
                     <span className="leading-snug text-left">{item.trim()}</span>
                   </li>
                 ))}
               </ul>
           </div>
           <div className="text-primary-400 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex-shrink-0">
              {isSpeaking ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
           </div>
         </div>
      </button>
    )
  }

  // NAV WIDGET
  if (widget.type === 'nav') {
    return (
      <button 
        onClick={onSpeak}
        onKeyDown={handleKeyDown}
        className={`${baseClasses} border-slate-200 bg-slate-50 hover:bg-white`}
        aria-label={`Navigation: ${widget.label || ''} ${widget.content}. Click to listen.`}
      >
        <div className="flex items-center justify-between text-left">
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
           <div className="text-slate-300 group-hover:text-primary-500 group-focus:text-primary-500 transition-colors">
              <ChevronRight size={24} />
           </div>
        </div>
      </button>
    )
  }

  // INFO (STANDARD) WIDGET
  const Icon = getIconForLabel(widget.label || '');
  return (
    <button 
      onClick={onSpeak}
      onKeyDown={handleKeyDown}
      className={`${baseClasses} border-slate-100 hover:border-primary-200`}
      aria-label={`Info: ${widget.label || ''} ${widget.content}. Click to listen.`}
    >
      <div className="flex items-center gap-4 text-left">
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

         <div className="text-primary-400 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex-shrink-0">
            {isSpeaking ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
         </div>
      </div>
    </button>
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
