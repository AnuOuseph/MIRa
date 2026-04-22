'use client';

import { Music, Clock, Key, Volume, Brain, Heart, Star, Clock1, Music4, User, Bot } from 'lucide-react';
import GeneralAnalysis from './GeneralAnalysis';

const AnalysisResults = ({ data }) => {
  const { basic_analysis, ai_analysis, generation_analysis } = data;

  return (
    <div className="bg-white rounded-xl p-6">
      <div>
        <GeneralAnalysis />
      </div>

      {/* Basic Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <span className="font-semibold text-blue-700">Tempo</span>
          </div>
          <p className="text-2xl font-bold text-blue-800">
            {basic_analysis.tempo_bpm.toFixed(3)} BPM
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Key className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-semibold text-green-700">Key</span>
          </div>
          <p className="text-2xl font-bold text-green-800">
            {basic_analysis.key}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Volume className="w-5 h-5 text-purple-600 mr-2" />
            <span className="font-semibold text-purple-700">Loudness</span>
          </div>
          <p className="text-2xl font-bold text-purple-800">
            {basic_analysis.average_loudness.toFixed(3)}
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Clock1 className="w-5 h-5 text-orange-600 mr-2" />
            <span className="font-semibold text-orange-700">Duration</span>
          </div>
          <p className="text-2xl font-bold text-orange-800">
            {basic_analysis.duration_seconds.toFixed(3)}
          </p>
        </div>
      </div>

      {/* Instruments */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-indigo-600" />
          Instruments Detected
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {ai_analysis.instruments.slice(0, 6).map((inst, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <p className="font-semibold text-gray-800">{inst.instrument}</p>
              <p className="text-sm text-gray-600">
                Confidence: {(inst.confidence * 100).toFixed(1)}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1 my-1">
                <div
                    className="bg-black h-1 rounded-full"
                    style={{ width: `${(inst.confidence * 100).toFixed(1)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Genre & Mood */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <Music4 className="w-5 h-5 mr-2 text-yellow-600"/>
            Genre
          </h3>
          <div className="space-y-2">
            {ai_analysis.genres.map((genre, index) => (
              <div key={index} className="bg-yellow-50 rounded-lg p-3">
                <p className="font-semibold text-yellow-800">{genre.genre}</p>
                <p className="text-sm text-yellow-600">
                  Confidence: {(genre.confidence * 100).toFixed(1)}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1 my-1">
                <div
                    className="bg-yellow-800 h-1 rounded-full"
                    style={{ width: `${(genre.confidence * 100).toFixed(1)}%` }}
                ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-600" />
            Mood
          </h3>
          <div className="bg-pink-50 rounded-lg p-4">
            <p className="text-lg font-semibold text-pink-800 capitalize">
              {ai_analysis.mood.primary_mood}
            </p>
            <p className="text-sm text-pink-600">
              Energy: {ai_analysis.mood.energy_level} • Valence: {ai_analysis.mood.emotional_valence}
            </p>
          </div>
        </div>
      </div>

      {/* AI Generation Analysis */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <Star className="w-5 h-5 mr-2 text-blue-600" />
          Generation Analysis
        </h3>
        <div className="flex flex-col sm:flex-row justify-between gap-6 px-6 py-2">
            <div className="flex-1">
            <h3 className="font-medium mb-3">AI vs Human</h3>

            <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 flex justify-between mb-1">
                <span className='flex gap-2 items-center'><User size={'15px'}/> Human</span>
                <span>{(generation_analysis.human_generation_probability * 100).toFixed(0)}%</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-black h-2 rounded-full"
                    style={{ width: `${(generation_analysis.human_generation_probability * 100).toFixed(0)}%` }}
                ></div>
                </div>
            </div>

            <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 flex justify-between mb-1">
                <span className='flex gap-2 items-center'><Bot size={'16px'}/> AI</span>
                <span>{(generation_analysis.ai_generation_probability * 100).toFixed(0)}%</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-black h-2 rounded-full"
                    style={{ width: `${(generation_analysis.ai_generation_probability * 100).toFixed(0)}%` }}
                ></div>
                </div>
            </div>
            {/* <div className="mt-4 p-3 bg-green-50 rounded-md text-sm text-gray-700">
                <span className="font-semibold">Features Analysed:</span> {generation_analysis.features_analyzed}
            </div> */}
            </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          {generation_analysis.disclaimer}
        </p>
      </div>
    </div>
  );
};

export default AnalysisResults;