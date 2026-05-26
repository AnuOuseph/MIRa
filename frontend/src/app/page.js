'use client';

import AnalysisResults from '@/components/AnalysisResult';
import AudioUpload from '@/components/AudioUpload';
import Similarity from '@/components/Similarity';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Loading from '@/utils/Loading';
import Error from '@/utils/Error';
import { AudioLines, Dot, Music } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AzimuthCompass } from "@/components/AzimuthCompass";
import { SpatialPlayer }  from "@/components/Spatialize";


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

  // Spatialization States
  const [elevation, setElevation] = useState(0)
  const [azimuth,   setAzimuth]   = useState(0)
  const [stage,     setStage]     = useState("idle"); 
  const [playing,   setPlaying]   = useState(false);
  const [audioUrl,  setAudioUrl]  = useState(null);
  const [file, setFile] = useState(null);
  const [sourceFileName, setSourceFileName] = useState(null);
  const [dataset, setDataset] = useState("mit-kemar");

  // Silently wake the backend on page load to avoid cold start delay on first analysis
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_MIRA_API_URL}/health`).catch(() => {})
  }, [])

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

  // Handler for spatialization
  const handleSpatialize = async () => {
    if (!file) return;               
    setStage("processing");
    setPlaying(false);
  
    try {
      const form = new FormData();
      form.append("audio",     file);
      form.append("azimuth", (360 - azimuth).toFixed(1));
      form.append("elevation", elevation.toString());
      form.append("dataset", dataset);
  
      const res = await fetch(process.env.NEXT_PUBLIC_MIRA_API_URL + '/spatialize', {
        method: "POST",
        body: form,
      });
  
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
  
      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
      setStage("ready");
    } catch (err) {
      console.error("Spatialize failed:", err);
      setStage("idle");
    }
  }

  // Switch Features
  const handleModeChange = (nextMode) => {
    setMode(nextMode === 'analyze' ? 'analyze' : (nextMode === 'similarity' ? 'similarity' : 'spatialize'));
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

              {/* Similarity Results */}
              {similarityData && !similarityLoading && !similarityError && (
              <div className='bg-white shadow-sm border-[0.5px] border-gray-100 flex-8 rounded-xl mt-6 p-6 '>
                <Similarity data={similarityData} similarityRefFileName={similarityRefFileName} similarityCandFileName={similarityCandFileName} />
              </div>
              )}
            </div>
          </div>
        )}

        {/* Spatial Mode */}
        {mode === 'spatialize' && (
          <div className="my-16 ">
            <div className='flex flex-col gap-2'>
              <div className='text-[#515bc3] bg-[#e0e6ff] w-fit px-2 py-1 rounded-full flex items-center gap-1'>
                <p className="text-xs uppercase font-medium">Mode</p>
                <Dot size={14} className="text-[#515bc3]" />
                <p className='text-xs uppercase font-medium'>{mode}</p>
              </div>
              <p className="text-gray-800 text-[30px] leading-[30px] font-[550] tracking-[1px] mb-1">
                Place a sound around your head
              </p>
              <p className="text-gray-600 text-[14px] max-w-2xl tracking-wide">
                Click anywhere on the compass to set the azimuth angle of the source. MIRa convolves the signal with a head-related transfer function (HRTF) and renders binaural output. <span className="font-bold">Use headphones.</span>
              </p>
            </div>
            <div className='flex gap-4'>
              <div className='bg-white shadow-sm border-[0.5px] border-gray-100 flex-4 h-fit rounded-xl mt-10 px-6 py-3'>
                <div>
                  <p className='text-[11px] font-[600] mt-2'><span className='[font-family:var(--font-jetbrains-mono)]'>01</span> SOURCE</p>
                </div>
                <div className='flex justify-between'>
                  <p className='pt-3 pb-[6px] uppercase text-gray-500 font-light text-[12px]'>Audio file</p>
                  { !loading && sourceFileName && (
                  <button onClick={()=>{setSourceFileName(null); setFile(null); setError('');}} className="text-[11px] cursor-pointer text-gray-800 py-2">
                    Reset
                  </button>
                  )}
                </div>
                {/* Upload Section */}
                  { !loading && !sourceFileName && (
                  <div className="bg-white rounded-xl">
                    <AudioUpload
                      onError={handleError}
                      disabled={loading}
                      setData={setFile}
                      setFileName={setSourceFileName}
                    />
                  </div>
                  )}

                  { !loading && sourceFileName && (
                    <div className="bg-white rounded-xl border-dashed border-gray-300 border p-4 text-center flex gap-4 justify-start items-center">
                      <div className='text-[#515bc3] bg-[#e0e6ff] w-8 h-8 rounded-md flex items-center justify-center'>
                        <Music size={16} className="text-[#515bc3]" />
                      </div>
                      <p className='text-sm text-gray-600'>{sourceFileName ? sourceFileName : ''}</p>
                    </div>
                  )}
                  
                  <div className='mb-2'>
                    <p className='pt-3 uppercase text-gray-500 font-light text-[12px]'>HRTF dataset</p>
                    <select 
                      value={dataset}
                      onChange={(e) => setDataset(e.target.value)} 
                      className='mt-2 w-full border-[0.5px] border-gray-300 outline-none hover:border-gray-400 rounded-md px-3 py-2 text-sm text-gray-600' >
                      <option value="mit-kemar">MIT KEMAR (default)</option>
                      <option value="synthetic">Synthetic HRTF</option>
                    </select>
                  </div>

                  <div className='mb-2'>
                    <div className="flex justify-between items-center pt-3">
                      <p className='uppercase text-gray-500 font-light text-[12px]'>Elevation</p>
                      <p className='text-gray-500 font-light text-[12px] [font-family:var(--font-jetbrains-mono)]'>{elevation}°</p>
                    </div>

                    <div className="relative w-full">
                      <input
                        type="range"
                        min={-40}
                        max={60}
                        step={5}
                        value={elevation}
                        onChange={(e) => setElevation(Number(e.target.value))}
                        className="w-full h-[6px] appearance-none rounded-full outline-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, 
                            #515bc3 0%, 
                            #515bc3 ${((elevation + 40) / 100) * 100}%, 
                            #e5e7eb ${((elevation + 40) / 100) * 100}%, 
                            #e5e7eb 100%)`
                        }}
                      />
                    </div>
                  </div>

                  <div className='mb-2'>
                    <p className='pt-3 uppercase text-gray-500 font-light text-[12px]'>Azimuth</p>
                    <div className='grid grid-row-2 grid-cols-2 gap-2 mt-2'>
                      {[
                        { label: "Front",  az: 0   },
                        { label: "Right",  az: 90  },
                        { label: "Back",   az: 180 },
                        { label: "Left",   az: 270 },
                      ].map(({ label, az }) => (
                        <button
                          key={label}
                          onClick={() => setAzimuth(az)}
                          className={`w-full border-[0.5px] rounded-md py-1 text-[12px] capitalize cursor-pointer transition-colors
                            ${azimuth === az
                              ? "border-[#515bc3] bg-[#e0e6ff] text-[#515bc3]"
                              : "border-gray-300 text-gray-500 hover:border-gray-400"
                            }`}
                          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                        >
                          {label} {az}°
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className='mb-2'>
                    <button
                      onClick={handleSpatialize}
                      disabled={!file || stage === "processing"}
                      className="bg-[#515bc3] w-full mt-4 cursor-pointer text-sm text-white px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {stage === "processing" ? "Convolving HRTF…" : "Spatialize"}
                    </button>
                  </div>
              </div>
              <div className='bg-white shadow-sm border-[0.5px] border-gray-100 flex-8 rounded-xl mt-10 px-6 pb-6'>
                <div className='flex justify-between'>
                  <p className='text-[11px] tracking-[0.4px] font-[600] mt-6'><span className='[font-family:var(--font-jetbrains-mono)]'>02</span> AZIMUTH</p>
                  <p className='text-[10px] font-light mt-6 text-gray-500 text-[12px] [font-family:var(--font-jetbrains-mono)]'>click to position · top-down view</p>
                </div>
                <div>
                  {/* compass  */}
                  <div className='bg-white flex-8 rounded-xl'>
                    <div className="flex flex-col items-center gap-2">
                      <AzimuthCompass
                        azimuth={azimuth}
                        onChange={setAzimuth}
                        size={460}
                      />
                    </div>
                  
                    <SpatialPlayer
                      stage={stage}
                      playing={playing}
                      onToggle={() => setPlaying(p => !p)}
                      audioUrl={audioUrl}
                      azimuth={azimuth}
                      elevation={elevation}
                      fileName={file?.name}
                      onEnded={() => setPlaying(false)}
                    />
                  </div>
                </div>
              </div>
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