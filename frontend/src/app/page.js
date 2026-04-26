'use client';

import AnalysisResults from '@/components/AnalysisResult';
import AudioUpload from '@/components/AudioUpload';
import Similarity from '@/components/Similarity';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Loading from '@/utils/Loading';
import Error from '@/utils/Error';
import GeneralAnalysis from '@/components/GeneralAnalysis';
import { AudioLines, Dot, HeartPulse, Music } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [mode, setMode] = useState('analyze');

  // Analysis States
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [fileName, setFileName] = useState(null);

  // Similarity States
  const [similarityData, setSimilarityData] = useState(null);
  const [similarityLoading, setSimilarityLoading] = useState(false);
  const [similarityError, setSimilarityError] = useState('');
  const [similarityRef, setSimilarityRef] = useState(null);
  const [similarityCand, setSimilarityCand] = useState(null);
  const [similarityRefFileName, setSimilarityRefFileName] = useState(null);
  const [similarityCandFileName, setSimilarityCandFileName] = useState(null);

  // Analysis data handler
  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    setLoading(false);
  };

  // Analysis error handler
  const handleError = (errorMsg) => {
    setError(errorMsg);
    setLoading(false);
  };

  // Similarity error handler
  const handleSimilarityError = (errorMsg) => {
    setSimilarityError(errorMsg);
    setSimilarityLoading(false);
  }

  // Fetch data handler for analysis
  const handleFetchData = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', data);

      const response = await fetch(process.env.NEXT_PUBLIC_MIRA_API_URL + '/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
        setLoading(false);
      }

      const res_data = await response.json();
      handleAnalysisComplete(res_data);
      setLoading(false);
    } catch (error) {
      handleError(error.message || 'Failed to analyze audio. Make sure the backend is running.');
      setLoading(false);
    }
  };

  // Fetch data handler for similarity
  const handleFetchSimilarity = async () => {
    setSimilarityLoading(true);
    try {
      const formData = new FormData();
      formData.append('file1', similarityRef);
      formData.append('file2', similarityCand);

      const response = await fetch(process.env.NEXT_PUBLIC_MIRA_API_URL + '/compare-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Similarity computation failed: ${response.statusText}`);
        setSimilarityLoading(false);
      }

      const res_data = await response.json();
      setSimilarityData(res_data);
      setSimilarityLoading(false);
    }
      catch (error) {
        handleSimilarityError(error.message || 'Failed to compute similarity. Make sure the backend is running.');
        setSimilarityLoading(false);
      }
  };

  // Switch Features
  const handleModeChange = (nextMode) => {
    setMode(nextMode === 'analyze' ? 'analyze' : 'similarity');
  };

  return (
    <main className="min-h-screen w-full flex bg-[#f9fafc]">
      <div className="w-full min-h-screen flex flex-col mx-auto">
        {/* Header */}
        <Header setMode={handleModeChange} mode={mode} />

        {/* Main Content */}
        <div className='px-40 flex-1'>

        {/* Analysis Mode */}
        {mode === 'analyze' && (
          <div className="my-16">
            <div className='flex flex-col gap-2'>
              <div className='text-[#515bc3] bg-[#e0e6ff] w-fit px-2 py-1 rounded-full flex items-center gap-1'>
                <p className="text-xs uppercase font-medium">Mode</p>
                <Dot size={14} className="text-[#515bc3]" />
                <p className='text-xs uppercase font-medium'>{mode}</p>
              </div>
              <p className="text-gray-800 text-[30px] leading-[30px] font-[550] tracking-[1px] mb-1">
                Extract features from a track
              </p>
              <p className="text-gray-600 text-[14px] max-w-2xl tracking-wide">
                Upload one audio file. MIRa computes tempo, key, spectral descriptors, rhythm patterns and timbral fingerprints used in music information retrieval.
              </p>
            </div>
            <div className='flex gap-4'>
              <div className='bg-white shadow-sm border-[0.5px] border-gray-100 flex-4 h-fit rounded-xl mt-10 px-6 py-3'>
                <div>
                  <p className='text-[11px] font-[600] mt-2'>01 INPUT</p>
                </div>
                <div className='flex justify-between'>
                  <p className='pt-3 pb-[6px] uppercase text-gray-500 font-light text-[12px]'>Audio file</p>
                  { !loading && fileName && (
                  <button onClick={()=>{setFileName(null); setAnalysisData(null); setError('');}} className="text-[11px] cursor-pointer text-gray-800 py-2">
                    Reset
                  </button>
                  )}
                </div>
                {/* Upload Section */}
                  { !loading && !fileName && (
                  <div className="bg-white rounded-xl">
                    <AudioUpload
                      onError={handleError}
                      disabled={loading}
                      setData={setData}
                      setFileName={setFileName}
                    />
                  </div>
                  )}

                  { !loading && fileName && (
                    <div className="bg-white rounded-xl border-dashed border-gray-300 border p-8 text-center flex flex-col gap-4 justify-center items-center">
                      <div className='text-[#515bc3] bg-[#e0e6ff] w-8 h-8 rounded-full flex items-center justify-center mx-auto'>
                        <Music size={16} className="text-[#515bc3]" />
                      </div>
                      <p className='text-sm text-gray-500'>{fileName ? fileName : ''}</p>
                      <button onClick={()=>handleFetchData()} className="bg-[#515bc3] w-full cursor-pointer text-sm text-white px-4 py-2 rounded-md hover:opacity-90">
                        Run Analysis
                      </button>
                    </div>
                  )}
                  {/* Loading State */}
                  {!analysisData && loading && (
                    <Loading />
                  )}

                  {/* Error State */}
                  {error && (
                    <Error message={error} />
                  )}
              </div>
              <div className='bg-white shadow-sm border-[0.5px] border-gray-100 flex-8 rounded-xl mt-10 px-6 pb-6'>
                <div>
                  <p className='text-[11px] font-[600] mt-6'>02 RESULTS</p>
                </div>
                {!analysisData && (
                  <div className="bg-white rounded-xl border-dashed border-gray-300 border mt-7 p-8 text-center">
                    <div className="flex flex-col gap-3 justify-center items-center">
                      <div className="bg-gray-100 rounded-full p-2 w-fit">
                        <AudioLines size={16}/>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <p className='text-sm'>No analysis yet</p>
                        <p className='text-xs text-gray-500'>Upload an audio file and run the analysis to see extracted features here.</p>
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
              <div className='text-[#515bc3] bg-[#e0e6ff] w-fit px-2 py-1 rounded-full flex items-center gap-1'>
                <p className="text-xs uppercase font-medium">Mode</p>
                <Dot size={14} className="text-[#515bc3]" />
                <p className='text-xs uppercase font-medium'>{mode}</p>
              </div>
              <p className="text-gray-800 text-[30px] leading-[30px] font-[550] tracking-[1px] mb-1">
                Compare two tracks
              </p>
              <p className="text-gray-600 text-[14px] max-w-2xl tracking-wide">
                Upload two audio files. MIRa computes a similarity score across multiple feature dimensions and highlights where the tracks converge and differ.
              </p>
            </div>
            <div>
              <div className='flex gap-4'>

                {/* track a */}
                <div className='bg-white shadow-sm border-[0.5px] border-gray-100 flex-4 h-fit rounded-xl mt-10 px-6 py-3'>
                  <div>
                    <p className='text-[10px] font-[600] uppercase mt-2'>01 Track A</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='pt-3 pb-[6px] tracking-[1px] uppercase text-gray-500 font-light text-[12px]'>Reference</p>
                    { !similarityLoading && similarityRefFileName && (
                    <button onClick={()=>{setSimilarityData(null); setSimilarityRef(null); setSimilarityRefFileName(null);}} className="text-[11px] cursor-pointer text-gray-600 py-2">
                      Reset
                    </button>
                    )}
                  </div>
                  {/* Upload Section */}
                    {!similarityRef && !similarityLoading && (
                    <div className="bg-white rounded-xl">
                      <AudioUpload
                        onError={handleSimilarityError}
                        disabled={similarityLoading}
                        setData={setSimilarityRef}
                        setFileName={setSimilarityRefFileName}
                      />
                    </div>
                    )}

                    {similarityRef && !similarityLoading && (
                      <div className="bg-white rounded-xl border-dashed border-gray-300 border p-8 my-2 text-center flex flex-col gap-4 justify-center items-center">
                        <div className='text-[#515bc3] bg-[#e0e6ff] w-8 h-8 rounded-full flex items-center justify-center mx-auto'>
                          <Music size={16} className="text-[#515bc3]" />
                        </div>
                        <p className='text-sm text-gray-500'>{similarityRefFileName ? similarityRefFileName : ''}</p>
                      </div>
                    )}
                    
                </div>

                {/* track b */}
                <div className='bg-white shadow-sm border-[0.5px] border-gray-100 flex-4 h-fit rounded-xl mt-10 px-6 py-3'>
                  <div>
                    <p className='text-[10px] font-[600] uppercase mt-2'>02 Track B</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='pt-3 pb-[6px] tracking-[1px] uppercase text-gray-500 font-light text-[13px]'>Candidate</p>
                    { !similarityLoading && similarityCandFileName && (
                    <button onClick={()=>{setSimilarityData(null); setSimilarityRef(null); setSimilarityRefFileName(null);}} className="text-[11px] cursor-pointer text-gray-600 py-2">
                      Reset
                    </button>
                    )}
                  </div>
                  {/* Upload Section */}
                    {!similarityCand && !similarityLoading && !similarityCandFileName && (
                    <div className="bg-white rounded-xl">
                      <AudioUpload
                        
                        onError={handleSimilarityError}
                        disabled={similarityLoading}
                        setData={setSimilarityCand}
                        setFileName={setSimilarityCandFileName}
                      />
                    </div>
                    )}

                    { !similarityLoading && similarityCandFileName && (
                      <div className="bg-white rounded-xl border-dashed border-gray-300 border p-8 my-2 text-center flex flex-col gap-4 justify-center items-center">
                        <div className='text-[#515bc3] bg-[#e0e6ff] w-8 h-8 rounded-full flex items-center justify-center mx-auto'>
                          <Music size={16} className="text-[#515bc3]" />
                        </div>
                        <p className='text-sm text-gray-500'>{similarityCandFileName ? similarityCandFileName : ''}</p>
                      </div>
                    )}
                </div>
              </div>

              <div className='bg-white shadow-sm border-[0.5px] border-gray-100 flex-8 rounded-xl mt-6 px-6 py-3 flex justify-between items-center '>
                <p className='flex items-center gap-3 text-gray-500 text-[13px] font-[monospace] font-medium'>distance: cosine <span className='text-xs text-gray-300'>|</span> features: mfcc <span>·</span> chroma <span>·</span> centroid <span>·</span> tempo</p>
                <button onClick={() => handleFetchSimilarity()} className='bg-[#515bc3] text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-[14px] font-semibold'>Compute Similarity</button>
              </div>

              {/* Placeholder for similarity results */}
              {!similarityData && !similarityLoading && (
              <div className='bg-white shadow-sm border-[0.5px] border-gray-100 rounded-xl mt-6 px-6 py-6'>
                <div className="bg-white rounded-xl border-dashed border-gray-300 border p-8 text-center">
                  <div className="flex flex-col gap-3 justify-center items-center">
                    <div className="bg-gray-100 rounded-full p-2 w-fit">
                      <AudioLines size={16}/>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p className='text-sm'>No comparison yet</p>
                      <p className='text-xs text-gray-500'>Upload two tracks and run the similarity computation.</p>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Loading State */}
              {!similarityData && similarityLoading && (
                <div className='bg-white shadow-sm border-[0.5px] border-gray-100 flex-4 h-fit rounded-xl mt-6 px-6 py-3'>
                  <Loading />
                </div>
              )}

              {/* Error State */}
              {similarityError && (
                <div className='bg-white shadow-sm border-[0.5px] border-gray-100 flex-4 h-fit rounded-xl mt-6 px-6 py-3'>
                  <Error message={similarityError} />
                </div>
              )}

              {/* similarity results */}
              {similarityData && !similarityLoading && !similarityError && (
              <div className='bg-white shadow-sm border-[0.5px] border-gray-100 flex-8 rounded-xl mt-6 p-6 '>
                <Similarity data={similarityData} similarityRefFileName={similarityRefFileName} similarityCandFileName={similarityCandFileName} />
              </div>
              )}
            </div>
          </div>
        )}
        </div>

        {/* footer */}
        <div><Footer /></div>
      </div>
    </main>
  );
}