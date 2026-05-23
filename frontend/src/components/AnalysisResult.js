'use client';


const AnalysisResults = ({ data }) => {
  const { basic_analysis, ai_analysis } = data;

  return (
    <div className="bg-white rounded-xl p-6">
  
      {/* Basic Analysis */}
      <p className='uppercase text-gray-500 font-light text-[12px] mb-3'>Global features</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-gray-300 p-4">
          <div className="flex items-center mb-2">
            <span className="uppercase text-gray-500 font-light text-[10px]">Tempo</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {basic_analysis.tempo_bpm.toFixed(3)} <span className='text-xs font-light'>bpm</span>
          </p>
        </div>

        <div className="rounded-xl border border-gray-300 p-4">
          <div className="flex items-center mb-2">
            <span className="uppercase text-gray-500 font-light text-[10px]">Key</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {basic_analysis.key}
          </p>
        </div>

        <div className="rounded-xl border border-gray-300 p-4">
          <div className="flex items-center mb-2">
            <span className="uppercase text-gray-500 font-light text-[10px]">Loudness</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {basic_analysis.average_loudness.toFixed(3)} <span className='text-xs font-light'>rms</span>
          </p>
        </div>

        <div className="rounded-xl border border-gray-300 p-4">
          <div className="flex items-center mb-2">
            <span className="uppercase text-gray-500 font-light text-[10px]">Duration</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {basic_analysis.duration_seconds.toFixed(3)} <span className='text-xs font-light'>s</span>
          </p>
        </div>
      </div>

      {/* Instruments */}
      <div className="mb-8">
        <p className="uppercase text-gray-500 font-light text-[12px] mb-3">
          Instruments Detected
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ai_analysis.instruments.slice(0, 6).map((inst, index) => (
            <div key={index} className="rounded-xl border border-gray-300 p-3 flex flex-col gap-1">
              <div className='flex justify-between'>
                <p className="font-semibold text-gray-800 text-[14px]">{inst.instrument}</p>
                <p className="text-[12px] text-gray-600">
                  {(inst.confidence * 100).toFixed(1)}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 my-1">
                <div
                    className="bg-[#515bc3] h-1 rounded-full"
                    style={{ width: `${(inst.confidence * 100).toFixed(1)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Genre & Mood */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="uppercase text-gray-500 font-light text-[12px] mb-3">
            Genre
          </p>
          <div className="space-y-2">
            {ai_analysis.genres.map((genre, index) => (
              <div key={index} className="rounded-xl border border-gray-300 p-3">
                <div className='flex justify-between'>
                  <p className="font-semibold text-gray-800 text-[14px]">{genre.genre}</p>
                  <p className="text-xs text-gray-600">
                  {(genre.confidence * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 my-1">
                <div
                    className="bg-[#515bc3] h-1 rounded-full"
                    style={{ width: `${(genre.confidence * 100).toFixed(1)}%` }}
                ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="uppercase text-gray-500 font-light text-[12px] mb-3">
            Mood
          </p>
          <div className="rounded-xl border border-gray-300 p-4">
            <p className="font-semibold text-gray-800 text-[14px] capitalize mb-3">
              {ai_analysis.mood.primary_mood}
            </p>
            <div className='flex justify-between items-center gap-3'>
              <div>
                <p className="text-sm text-gray-500 [font-family:var(--font-jetbrains-mono)]">
                  energy: <span className='text-gray-700'> {ai_analysis.mood.energy_level} </span>
                </p>
              </div>
              <div className='h-3 w-0 border border-gray-300'></div>
              <div>
                <p className="text-sm text-gray-500 [font-family:var(--font-jetbrains-mono)]">
                  valence: <span className='text-gray-700'>{ai_analysis.mood.emotional_valence}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;