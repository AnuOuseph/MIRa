import { AudioLines, Dot } from "lucide-react";

const Header = ({setMode, mode}) => {
    return (
        <div className="bg-[#ffffff] w-full sticky top-0 flex h-15 items-center justify-between gap-2 text-center border-gray-300 border-b-[0.5px] px-40">
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
          <div className='text-sm text-gray-500 flex gap-1 items-center font-[monospace]'>
            <p>docs </p><span><Dot size={14}/></span><p> api</p>
          </div>
        </div>
    );
}
export default Header;