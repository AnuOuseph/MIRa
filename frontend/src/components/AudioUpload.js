'use client';

import { useState, useRef } from 'react';
import { Upload, Music, Plus } from 'lucide-react';

const AudioUpload = ({ onAnalysisStart, onAnalysisComplete, onError, disabled, setData }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('audio/')) {
      onError('Please upload an audio file (MP3, WAV, etc.)');
      return;
    }

    onAnalysisStart();
    
    const formData = new FormData();
    formData.append('file', file);
    setData(file.name)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_MIRA_API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      onAnalysisComplete(data);
    } catch (error) {
      onError(error.message || 'Failed to analyze audio. Make sure the backend is running.');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4 flex justify-center items-center">
      <div
        className={`border-dashed border-gray-300 border rounded-[10px] flex flex-col justify-center items-center rounded-xl p-8 w-[100%] gap-2 text-center transition-all ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="bg-gray-100 rounded-full p-2">
          <Plus className="text-gray-600 " size={16}/>
        </div>
        <div>
          <p className="text-gray-600 text-sm font-[600]">
            Drop your audio file
          </p>
          <p className="text-xs text-gray-500">
            or click to browse · WAV, MP3, etc.
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={(e) => handleFile(e.target.files[0])}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default AudioUpload;