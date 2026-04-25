'use client';
import CircularProgress from '@/utils/CircularProgress';

const Similarity = () => {
    return (
        <div className="bg-white rounded-xl flex flex-col gap-6">
            <div className='flex gap-8 items-center mb-4'>
                <div className="relative w-fit flex flex-col items-center justify-start">
                    <CircularProgress value={30} />
                </div>
                <div className='flex flex-col gap-[14px]'>
                    <div className='flex flex-col gap-[8px]'>
                        <p className="font-[monospace] uppercase tracking-[1px] text-gray-500 flex gap-2 items-center">Overall similarity <span className='text-[10px] text-[#515bc3] bg-[#e0e6ff] tracking-[1.5px] font-[550] w-fit px-[8px] py-[2px] rounded-full flex items-center'>Very similar</span></p>
                        <p className='text-gray-800 text-[26px] leading-[26px] font-[550] tracking-[1.5px]'> 92.93 %</p>
                    </div>
                    <div>
                        <p className="font-[monospace] text-[12px] tracking-[1px] text-gray-500 flex gap-2 items-center">vector_similarity: <span className="font-[550] text-gray-800">98.55%</span></p>
                    </div>
                </div>
            </div>

            <div className="border-[0.5px] border-gray-300 bg-[#fdfeff] rounded-lg px-6 py-4 flex-1 flex flex-col gap-3">
                <div className='flex gap-3 items-center'>
                    <p className='text-[11px] text-[#515bc3] bg-[#e0e6ff] font-[550] w-6 h-6 px-[2px] py-[1px] rounded-md flex items-center justify-center'>A</p>
                    <p className="text-[12px] text-gray-500 font-[monospace] ">backwards-morphing-tesseract-30sec-challenge-7430.mp3</p>
                </div>
                <img src="/blue-audio.png" alt="" />
            </div>

            <div className="border-[0.5px] border-gray-300 bg-[#fdfeff] rounded-lg px-6 py-4 flex-1 flex flex-col gap-3 mb-3">
                <div className='flex gap-3 items-center'>
                    <p className='text-[11px] text-[#515bc3] bg-[#e0e6ff] font-[550] w-6 h-6 px-[2px] py-[1px] rounded-md flex items-center justify-center'>B</p>
                    <p className="text-[12px] text-gray-500 font-[monospace] ">magical-dramedy-orchestral-sneaky-spell-30-sec-375796.mp3</p>
                </div>
                <img src="/gray-audio.png" alt="" />
            </div>

            <div>
                <div>
                    <p className="font-[monospace] uppercase tracking-[1px] text-gray-500 mb-2">Feature similarities</p>
                </div>
                <div className="gap-2 border-[0.5px] border-gray-300 bg-[#fdfeff] rounded-lg">
                    <div className="border-b-[0.5px] border-gray-300 p-4 flex Justyfy-between items-center">
                        <div className="flex-2">
                            <p className="font-semibold text-gray-800 text-[14px]">Timbre</p>
                            <p className="text-[10px] text-gray-500 font-[monospace] uppercase tracking-[1px]">MFCC</p>
                        </div>
                        <div className="flex-10 flex gap-8 w-full items-center">
                            <div className="w-full bg-[#eff2f5] rounded-full h-[6px] my-1">
                                <div
                                    className="bg-[#515bc3] h-[6px] rounded-full"
                                    style={{ width: `${(30 ).toFixed(1)}%` }}
                                ></div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-800">
                                    {(30).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b-[0.5px] border-gray-300 p-4 flex Justyfy-between items-center">
                        <div className="flex-2">
                            <p className="font-semibold text-gray-800 text-[14px]">Harmony</p>
                            <p className="text-[10px] text-gray-500 font-[monospace] uppercase tracking-[1px]">Chroma</p>
                        </div>
                        <div className="flex-10 flex gap-8 w-full items-center">
                            <div className="w-full bg-[#eff2f5] rounded-full h-[6px] my-1">
                                <div
                                    className="bg-[#515bc3] h-[6px] rounded-full"
                                    style={{ width: `${(30 ).toFixed(1)}%` }}
                                ></div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-800">
                                    {(30).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b-[0.5px] border-gray-300 p-4 flex Justyfy-between items-center">
                        <div className="flex-2">
                            <p className="font-semibold text-gray-800 text-[14px]">Brightness</p>
                            <p className="text-[10px] text-gray-500 font-[monospace] uppercase tracking-[1px]">Spectral centroid</p>
                        </div>
                        <div className="flex-10 flex gap-8 w-full items-center">
                            <div className="w-full bg-[#eff2f5] rounded-full h-[6px] my-1">
                                <div
                                    className="bg-[#515bc3] h-[6px] rounded-full"
                                    style={{ width: `${(30 ).toFixed(1)}%` }}
                                ></div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-800">
                                    {(30).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 flex Justyfy-between items-center">
                        <div className="flex-2">
                            <p className="font-semibold text-gray-800 text-[14px]">Tempo</p>
                            <p className="text-[10px] text-gray-500 font-[monospace] uppercase tracking-[1px]">BPM</p>
                        </div>
                        <div className="flex-10 flex gap-8 w-full items-center">
                            <div className="w-full bg-[#eff2f5] rounded-full h-[6px] my-1">
                                <div
                                    className="bg-[#515bc3] h-[6px] rounded-full"
                                    style={{ width: `${(30 ).toFixed(1)}%` }}
                                ></div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-800">
                                    {(30).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="border-[0.5px] border-gray-300 bg-[#fdfeff] rounded-lg px-6 py-4 flex-1 flex flex-col gap-2">
                    <p className="font-[monospace] text-[10px] tracking-[1px] uppercase text-gray-500">Method</p>
                    <p className="text-[13px] text-gray-800 ">Cosine similarity over MFCC, chroma, spectral centroid, and tempo feature vectors</p>
                </div>
                <div className="border-[1px] border-dashed border-gray-300 bg-[#fdfeff] rounded-lg px-6 py-4 flex-1 flex flex-col gap-2">
                    <p className="font-[monospace] text-[10px] tracking-[1px] uppercase text-gray-500">Note</p>
                    <p className="text-[13px] text-gray-800">This is a lightweight feature-based MIR similarity baseline. It does not yet model temporal structure or learned semantic embeddings.</p>
                </div>
            </div>
        </div>
    );
}

export default Similarity;