import React from 'react';
import { ModelType, AppSettings } from '../types';
import { Eye, Type as TypeIcon, Plus, MoveHorizontal, RotateCw } from 'lucide-react';

interface HeaderProps {
  model: ModelType;
  setModel: (model: ModelType) => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  reset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ model, setModel, settings, setSettings, reset }) => {
  
  const toggleFont = () => {
    setSettings(prev => ({
      ...prev,
      isDyslexiaFont: !prev.isDyslexiaFont
    }));
  };

  const toggleSpacing = () => {
    setSettings(prev => ({
      ...prev,
      wordSpacing: prev.wordSpacing === 'normal' ? 'wide' : 'normal'
    }));
  };

  const cycleFontSize = () => {
    setSettings(prev => {
      // Cycle: 16 -> 20 -> 24 -> 28 -> 16
      const nextSize = prev.fontSize + 4;
      return {
        ...prev,
        fontSize: nextSize > 28 ? 16 : nextSize
      };
    });
  };

  const handleHomeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      reset();
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1 -ml-1" 
        onClick={reset}
        onKeyDown={handleHomeKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Go home and reset"
      >
        <div className="bg-primary-500 text-white p-1.5 rounded-lg shadow-sm">
          <Eye size={20} strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dyslexia Lens</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Model Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 hidden md:flex">
          <button
            onClick={() => setModel(ModelType.FLASH)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-200 ${
              model === ModelType.FLASH
                ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            aria-pressed={model === ModelType.FLASH}
          >
            Flash
          </button>
          <button
            onClick={() => setModel(ModelType.PRO)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-200 ${
              model === ModelType.PRO
                ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            aria-pressed={model === ModelType.PRO}
          >
            Pro
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>

        {/* Accessibility Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleFont}
            className={`p-2 rounded-lg transition-colors border focus:outline-none focus:ring-2 focus:ring-primary-200 ${
              settings.isDyslexiaFont 
                ? 'bg-primary-50 border-primary-200 text-primary-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle Dyslexia Friendly Font"
            aria-label={`Toggle Dyslexia Friendly Font ${settings.isDyslexiaFont ? 'On' : 'Off'}`}
            aria-pressed={settings.isDyslexiaFont}
          >
            <TypeIcon size={18} />
          </button>

          <button 
            onClick={toggleSpacing}
            className={`p-2 rounded-lg transition-colors border focus:outline-none focus:ring-2 focus:ring-primary-200 ${
              settings.wordSpacing === 'wide'
                ? 'bg-primary-50 border-primary-200 text-primary-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle Word Spacing"
            aria-label={`Toggle Word Spacing ${settings.wordSpacing === 'wide' ? 'Wide' : 'Normal'}`}
            aria-pressed={settings.wordSpacing === 'wide'}
          >
            <MoveHorizontal size={18} />
          </button>

          <button 
            onClick={cycleFontSize}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 min-w-[3rem] justify-center focus:outline-none focus:ring-2 focus:ring-primary-200"
            title="Change Text Size"
            aria-label={`Change Text Size. Current size: ${settings.fontSize} pixels`}
          >
            <span className="text-xs font-bold text-slate-400">{settings.fontSize}px</span>
            {settings.fontSize >= 28 ? (
              <RotateCw size={14} />
            ) : (
               <Plus size={14} strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
