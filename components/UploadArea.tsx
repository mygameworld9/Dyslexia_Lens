import React, { useRef, useState } from 'react';
import { Camera, Upload, FileImage } from 'lucide-react';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTrigger = () => {
    if (isProcessing) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          Dyslexia Lens
        </h2>
        <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
          Upload a document to untangle the text. <br className="hidden md:block"/>
          We'll find what matters and make it readable for you.
        </p>
      </div>

      <div
        onClick={handleTrigger}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group cursor-pointer 
          aspect-video md:aspect-[2/1] 
          rounded-3xl border-2 border-dashed 
          flex flex-col items-center justify-center 
          transition-all duration-300 ease-out
          ${isProcessing ? 'opacity-50 pointer-events-none cursor-wait' : ''}
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 scale-[1.01]' 
            : 'border-primary-300 bg-primary-50/50 hover:bg-primary-50 hover:border-primary-400'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center gap-6 p-8 transition-transform group-hover:scale-105 duration-300">
          <div className="bg-primary-500 text-white p-5 rounded-2xl shadow-lg shadow-primary-200">
            <Camera size={48} strokeWidth={1.5} />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
              Tap to Take Photo
            </h3>
            <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
              <Upload size={16} />
              <span>or upload a file</span>
            </div>
          </div>
        </div>

        {/* Decorative elements simulating the UI in the prompt image */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-primary-100/20 to-transparent rounded-b-3xl pointer-events-none" />
      </div>
    </div>
  );
};
