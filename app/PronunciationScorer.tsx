'use client';

import React, { useState } from 'react';
import { Upload, Mic, Activity, AlertCircle, CheckCircle } from 'lucide-react';

export default function PronunciationScorer() {
  const [referenceText, setReferenceText] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!audioFile || !referenceText) {
      setError('Please provide both text and an audio file.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('reference_text', referenceText);
    formData.append('file', audioFile);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
      
      const response = await fetch(`${backendUrl}/api/score`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'API request failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the scoring server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 px-6 py-8 text-center text-white">
          <Activity className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-3xl font-extrabold">Speech & Pronunciation Scorer</h2>
          <p className="mt-2 text-blue-100">Upload your audio to get instant phonetic feedback.</p>
        </div>

        {/* Input Form */}
        <div className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Reference Text</label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                placeholder="Type the exact text the speaker was supposed to read..."
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Audio Upload (30-45s)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors">
                <div className="space-y-1 text-center">
                  <Mic className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" accept="audio/*" onChange={handleFileChange} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">MP3, M4A, or WAV up to 10MB</p>
                  {audioFile && <p className="text-sm font-bold text-green-600 mt-2">File loaded: {audioFile.name}</p>}
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Processing Audio & Scoring...' : 'Analyze Pronunciation'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              Analysis Complete
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 text-center">
                <dt className="text-sm font-medium text-gray-500 truncate">Pronunciation Score</dt>
                <dd className={`mt-1 text-4xl font-extrabold ${result.pronunciation_score > 80 ? 'text-green-600' : result.pronunciation_score > 50 ? 'text-yellow-500' : 'text-red-600'}`}>
                  {result.pronunciation_score}%
                </dd>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 text-center">
                <dt className="text-sm font-medium text-gray-500 truncate">Audio Duration</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{result.duration_seconds}s</dd>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 text-center">
                <dt className="text-sm font-medium text-gray-500 truncate">Phoneme Errors</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{result.metrics.edit_distance_errors}</dd>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
                <h4 className="text-md font-bold text-gray-800 mb-2">Whisper Transcription</h4>
                <p className="text-gray-600 italic">"{result.alignment.whisper_transcription}"</p>
              </div>
              
              <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
                <h4 className="text-md font-bold text-gray-800 mb-4">Phoneme Breakdown</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700 block mb-1">Expected Phonemes:</span>
                    <div className="flex flex-wrap gap-1">
                      {result.alignment.expected_phonemes.map((phone: string, i: number) => (
                        <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">{phone}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 block mb-1">Spoken Phonemes:</span>
                    <div className="flex flex-wrap gap-1">
                      {result.alignment.spoken_phonemes.map((phone: string, i: number) => (
                        <span key={i} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-mono">{phone}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}