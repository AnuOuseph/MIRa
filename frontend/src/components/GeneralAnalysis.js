import { useState } from "react";

export default function GeneralAnalysis() {

  return (
    <div className="w-full bg-white rounded-xl">
      {/* <h2 className="text-xl font-semibold mb-1 flex gap-2"> Analysis Complete</h2> */}
      {/* <p className="text-sm text-gray-500 mb-4">
        Results for <span className="text-indigo-600">"{data.fileName}"</span>
      </p> */}

      {/* Top Buttons */}
      <div className="flex justify-end gap-2 mb-6">
        {/* <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
          Share
        </button>
        <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
          Export
        </button> */}
        <button onClick={() => window.location.reload()} className="px-3 py-1 text-sm bg-black text-white rounded-md hover:bg-gray-800 cursor-pointer">
          Analyze Another
        </button>
      </div>
    </div>
  );
}

