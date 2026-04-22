'use client';

import AnalysisResults from '@/components/AnalysisResult';
import AudioUpload from '@/components/AudioUpload';
import GeneralAnalysis from '@/components/GeneralAnalysis';
import { Music } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    setLoading(false);
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
    setLoading(false);
  };

  return (
    <main className="min-h-screen w-full flex bg-white py-10">
      <div className="container flex flex-col mx-auto px-4">
        {/* Header */}
        <div className="text-start mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2 flex gap-2">
            MIRa <Music className="w-6 h-6" />
          </h3>
          <p className="text-gray-600">
            Music Information Retrieval Analysis - AI-powered audio insights
          </p>
        </div>

        {/* Upload Section */}
        {!analysisData && !loading && !error && (
        <div className="bg-white rounded-xl p-6 mt-40 mb-8">
          <AudioUpload
            onAnalysisStart={() => setLoading(true)}
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleError}
            disabled={loading}
          />
        </div>
        )}

        {/* Loading State */}
        {!analysisData && loading && (
          <div className="bg-white rounded-xl mt-42 p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your music... This may take a moment</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center w-[30%] h-[50px] flex justify-center items-center">
            <p className="text-red-600 font-medium">Error: {error}</p>
          </div>
        )}

        {/* Results */}
        {analysisData && !loading && (
          <AnalysisResults data={analysisData} />
        )}
      </div>
    </main>
  );
}