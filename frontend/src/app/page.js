'use client';

import AnalysisResults from '@/components/AnalysisResult';
import AudioUpload from '@/components/AudioUpload';
import GeneralAnalysis from '@/components/GeneralAnalysis';
import { AudioLines, Dot, HeartPulse, Music } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('analyze');
  const [data, setData] = useState(null);
  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    setLoading(false);
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
    setLoading(false);
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode === 'analyze' ? 'analyze' : 'similarity');
  };

  return (
    <main className="min-h-screen w-full flex bg-[#f9fafc]">
      <div className="w-full flex flex-col mx-auto">
        {/* Header */}
        <div className="bg-white w-full sticky top-0 flex h-15 items-center justify-between gap-2 text-center border-gray-300 border-b-[0.5px] px-40">
          <div className='flex gap-2 items-center'>
            <div className="bg-[#edeef8] border-[0.5px] border-gray-300 rounded-md h-8 w-8 flex items-center justify-center" >
              <AudioLines className="mx-auto text-[#515bc3]" size={18} />
            </div>
            <h3 className="text-md font-[600] text-gray-800 flex gap-2">
              MIRa 
            </h3>
          </div>
          <div className='border-[0.5px] border-gray-300 bg-[#f9fafc] p-1 flex rounded-lg'>
            <button onClick={() => setMode('analyze')} className={` hover:text-gray-800 text-[15px] font-[500] py-1 px-4 cursor-pointer rounded-lg ${mode === 'analyze' ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-600 shadow-none'}`}>
              Analyze
            </button>
            <button onClick={() => setMode('similarity')} className={`hover:text-gray-800 text-[15px] font-[500] py-1 px-4 cursor-pointer rounded-lg ${mode === 'similarity' ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-600 shadow-none'}`}>
              Similarity
            </button>
          </div>
          <div className='text-sm text-gray-500 flex gap-1 items-center'>
            <p>docs </p><span><Dot size={14}/></span><p> api</p>
          </div>
        </div>

        <div className='px-40 '>

        {/* Analysis Mode */}
        {mode === 'analyze' && (
          <div className="my-16">
            <div className='flex flex-col gap-2'>
              <div className='text-[#515bc3] bg-[#e0e6ff] w-fit px-2 py-1 rounded-full flex items-center gap-2'>
                <p className="text-xs uppercase font-medium">Mode</p>
                <Dot size={14} className="text-[#515bc3]" />
                <p className='text-xs uppercase font-medium'>{mode}</p>
              </div>
              <p className="text-gray-800 text-3xl font-semibold">
                Extract features from a track
              </p>
              <p className="text-gray-600 text-sm max-w-2xl">
                Upload one audio file. MIRa computes tempo, key, spectral descriptors, rhythm patterns and timbral fingerprints used in music information retrieval.
              </p>
            </div>
            <div className='flex gap-4'>
              <div className='bg-white shadow-sm border-[0.5px] border-gray-100 flex-4 h-fit rounded-xl mt-10 p-6'>
                <div>
                  <p className='text-xs font-[600]'>01 INPUT</p>
                </div>
                <p className='py-3 mb-2 uppercase text-gray-500 font-light text-xs'>Audio file</p>
                {/* Upload Section */}
                  {!analysisData && !loading && !error && (
                  <div className="bg-white rounded-xl">
                    <AudioUpload
                      onAnalysisStart={() => setLoading(true)}
                      onAnalysisComplete={handleAnalysisComplete}
                      onError={handleError}
                      disabled={loading}
                      setData={setData}
                    />
                  </div>
                  )}

                  {analysisData && !loading && (
                    <div className="bg-white rounded-xl border-dashed border-gray-300 border p-8 text-center flex flex-col gap-4 justify-center items-center">
                      <div className='text-[#515bc3] bg-[#e0e6ff] w-8 h-8 rounded-full flex items-center justify-center mx-auto'>
                        <Music size={16} className="text-[#515bc3]" />
                      </div>
                      <p className='text-sm text-gray-500'>{data ? data : ''}</p>
                      <button onClick={()=>setAnalysisData(null)} className="bg-[#515bc3] w-full text-sm text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        Reset
                      </button>
                    </div>
                  )}
                  {/* Loading State */}
                  {!analysisData && loading && (
                    <div className="bg-white rounded-xl border-dashed border-gray-300 border p-8 text-center flex flex-col gap-4 justify-center items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                      <p className="text-gray-600 text-sm">Analyzing your music... This may take a moment</p>
                    </div>
                  )}

                  {/* Error State */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center w-full  flex justify-center items-center">
                      <p className="text-red-600 font-medium text-xs">Error: {error}</p>
                    </div>
                  )}
              </div>
              <div className='bg-white shadow-sm border-[0.5px] border-gray-100 flex-8 rounded-xl mt-10 p-6'>
                <div>
                  <p className='text-xs font-[600]'>02 RESULTS</p>
                </div>
                {!analysisData && (
                  <div className="bg-white rounded-xl border-dashed border-gray-300 border mt-10 p-8 text-center">
                    <div className="flex flex-col gap-3 justify-center items-center">
                      <div className="bg-gray-100 rounded-full p-2 w-fit">
                        <AudioLines size={16}/>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <p className='text-sm'>No analysis yet</p>
                        <p className='text-xs'>Upload an audio file and run the analysis to see extracted features here.</p>
                      </div>
                    </div>
                  </div>
                  )}
                {/* Results */}
                {analysisData && !loading && !error && (
                  <AnalysisResults data={analysisData} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Similarity Mode */}
        {mode === 'similarity' && (
          <div className="my-16">
            <div className='flex flex-col gap-2'>
              <div className='text-[#515bc3] bg-[#e0e6ff] w-fit px-2 py-1 rounded-md flex items-center gap-2'>
                <p className="text-xs uppercase font-medium">Mode</p>
                <Dot size={14} className="text-[#515bc3]" />
                <p className='text-xs uppercase font-medium'>{mode}</p>
              </div>
              <p className="text-gray-800 text-3xl font-semibold">
                Compare two tracks
              </p>
              <p className="text-gray-600 text-sm max-w-2xl">
                Upload two audio files. MIRa computes a similarity score across multiple feature dimensions and highlights where the tracks converge and differ.
              </p>
            </div>
            <div className='mt-10'>
              <p className='text-sm'>Feature in progress…</p>
            </div>
          </div>
        )}
        </div>

      </div>
    </main>
  );
}