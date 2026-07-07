// 'use client';

// import React, { useState } from 'react';

// export default function PronunciationScorer() {
//   const [referenceText, setReferenceText] = useState('');
//   const [audioFile, setAudioFile] = useState<File | null>(null);
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const [error, setError] = useState('');

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setAudioFile(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setResult(null);

//     if (!audioFile || !referenceText) {
//       setError('Please provide both text and an audio file.');
//       return;
//     }

//     setIsLoading(true);

//     const formData = new FormData();
//     formData.append('reference_text', referenceText);
//     formData.append('file', audioFile);

//     try {
//       const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
      
//       const response = await fetch(`${backendUrl}/api/score`, {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.detail || 'API request failed');
//       }

//       setResult(data);
//     } catch (err: any) {
//       setError(err.message || 'Failed to connect to the scoring server.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getScoreColor = (score: number) => {
//     if (score >= 80) return 'text-emerald-400';
//     if (score >= 50) return 'text-amber-400';
//     return 'text-rose-400';
//   };

//   return (
//     <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 sm:p-12 font-sans antialiased">
//       <div className="max-w-2xl mx-auto space-y-8">
        
//         <h1 className="text-2xl font-bold tracking-tight text-white">
//           Free Pronunciation Evaluator
//         </h1>

//         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
//           <p className="text-sm text-zinc-400 leading-relaxed">
//             <strong className="text-zinc-200 font-semibold">Privacy Notice (DPDP Act 2023):</strong> By uploading, you consent to your voice data being processed dynamically to generate an evaluation. Your audio is held temporarily in RAM and is <span className="text-emerald-400/90 font-medium">permanently destroyed immediately after response compilation</span>. No persistent databases or file logs are used.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-zinc-300">
//               Reference Prompt Text
//             </label>
//             <textarea
//               rows={4}
//               required
//               className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
//               placeholder="Type out the exact script text statement spoken inside the file..."
//               value={referenceText}
//               onChange={(e) => setReferenceText(e.target.value)}
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-zinc-300">
//               Upload Audio File <span className="text-zinc-500 font-normal">(Strictly 30 to 45 seconds)</span>
//             </label>
//             <div className="relative">
//               <input
//                 type="file"
//                 accept="audio/*"
//                 required
//                 onChange={handleFileChange}
//                 className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-400 
//                   file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold 
//                   file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 hover:border-zinc-700 transition-all cursor-pointer"
//               />
//             </div>
//           </div>

//           {error && (
//             <div className="bg-rose-900/20 border border-rose-900/50 rounded-lg p-4">
//               <p className="text-sm font-medium text-rose-400">{error}</p>
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full flex justify-center items-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//           >
//             {isLoading ? (
//               <span className="flex items-center gap-2">
//                 <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Analyzing Engine Running...
//               </span>
//             ) : (
//               'Analyze Speech'
//             )}
//           </button>
//         </form>

//         {/* RESULTS DASHBOARD */}
//         {result && (
//           <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <h2 className="text-xl font-bold border-b border-zinc-800 pb-2">Analysis Results</h2>
            
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center flex flex-col justify-center">
//                 <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Total Score</span>
//                 <span className={`text-5xl font-black ${getScoreColor(result.pronunciation_score)}`}>
//                   {result.pronunciation_score}%
//                 </span>
//               </div>
//               <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center flex flex-col justify-center">
//                 <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Track Length</span>
//                 <span className="text-3xl font-bold text-zinc-200">{result?.duration_seconds || 0}s</span>
//               </div>
//               <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center flex flex-col justify-center">
//                 <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Phonetic Errors</span>
//                 <span className="text-3xl font-bold text-zinc-200">{result?.metrics?.edit_distance_errors || 0}</span>
//               </div>
//             </div>

//             <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
              
//               <div>
//                 <h3 className="text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wide">Whisper AI Transcript</h3>
//                 <p className="text-zinc-300 bg-zinc-950 p-4 rounded-lg italic border border-zinc-800/50">
//                   "{result?.alignment?.whisper_transcription || "No transcription available."}"
//                 </p>
//               </div>

//               <div className="space-y-4 pt-4 border-t border-zinc-800/50">
//                 <div>
//                   <h3 className="text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wide">Expected Sounds (Target)</h3>
//                   <div className="flex flex-wrap gap-1.5">
//                     {/* SAFE MAP: We check if expected_phonemes exists, otherwise map empty array */}
//                     {(result?.alignment?.expected_phonemes || []).map((phone: string, i: number) => (
//                       <span key={i} className="bg-zinc-800 text-emerald-400 border border-emerald-900/30 px-2 py-1 rounded text-xs font-mono font-bold">
//                         {phone}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wide">Actually Spoken (Detected)</h3>
//                   <div className="flex flex-wrap gap-1.5">
//                     {/* SAFE MAP: We check if spoken_phonemes exists, otherwise map empty array */}
//                     {(result?.alignment?.spoken_phonemes || []).map((phone: string, i: number) => (
//                       <span key={i} className="bg-zinc-800 text-zinc-400 border border-zinc-700 px-2 py-1 rounded text-xs font-mono">
//                         {phone}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }


// 'use client';

// import React, { useState } from 'react';

// export default function PronunciationScorer() {
//   const [referenceText, setReferenceText] = useState('');
//   const [audioFile, setAudioFile] = useState<File | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const [error, setError] = useState('');

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setAudioFile(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setResult(null);

//     if (!audioFile || !referenceText) {
//       setError('Please provide both text and an audio file.');
//       return;
//     }

//     setIsLoading(true);

//     const formData = new FormData();
//     formData.append('reference_text', referenceText);
//     formData.append('file', audioFile);

//     try {
//       const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
//       const response = await fetch(`${backendUrl}/api/score`, {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.detail || 'API request failed');
//       }

//       setResult(data);
//     } catch (err: any) {
//       setError(err.message || 'Failed to connect to the scoring server.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 sm:p-12 font-sans antialiased">
//       <div className="max-w-2xl mx-auto space-y-8">
//         <h1 className="text-2xl font-bold tracking-tight text-white">LIVO Pronunciation Evaluator</h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <textarea
//             rows={4}
//             required
//             className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
//             placeholder="Type your script here..."
//             value={referenceText}
//             onChange={(e) => setReferenceText(e.target.value)}
//           />
//           <input type="file" accept="audio/*" required onChange={handleFileChange} className="w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:bg-zinc-800 file:text-zinc-200 cursor-pointer" />
//           <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-lg transition-all">
//             {isLoading ? 'Analyzing...' : 'Analyze Speech'}
//           </button>
//         </form>

//         {/* RESULTS DASHBOARD WITH GRANULAR FEEDBACK */}
//         {result && (
//           <div className="mt-12 space-y-6 animate-in fade-in duration-500">
//             <h2 className="text-xl font-bold border-b border-zinc-800 pb-2">Granular Feedback</h2>
            
//             <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
//               <h4 className="text-sm font-bold text-zinc-400 uppercase mb-4">Phoneme Alignment Matrix</h4>
//               <div className="flex flex-wrap gap-2">
//                 {(result?.alignment_details || []).map((item: any, i: number) => {
//                   const styles: any = {
//                     correct: "bg-zinc-800 text-emerald-400 border-emerald-900/30",
//                     mispronunciation: "bg-rose-900/30 text-rose-400 border-rose-800",
//                     skipped: "bg-amber-900/30 text-amber-400 border-amber-800 line-through",
//                     extra: "bg-blue-900/30 text-blue-400 border-blue-800"
//                   };

//                   return (
//                     <div key={i} className={`flex flex-col items-center px-2 py-1 rounded border ${styles[item.type as keyof typeof styles] || "bg-zinc-800"}`}>
//                       <span className="text-xs font-mono font-bold">
//                         {item.type === 'mispronunciation' ? item.actual : (item.phone || item.expected)}
//                       </span>
//                       {item.type === 'mispronunciation' && (
//                         <span className="text-[9px] text-zinc-500 uppercase italic">exp: {item.expected}</span>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
//               <h3 className="text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wide">Whisper AI Transcript</h3>
//               <p className="text-zinc-300 italic">"{result?.meta?.whisper_transcription || "..."}"</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import React, { useState } from 'react';

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
      if (!response.ok) throw new Error(data.detail || 'API request failed');

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the scoring server.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 sm:p-12 font-sans antialiased">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">LIVO Pronunciation Evaluator</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            rows={4}
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            placeholder="Type your script here..."
            value={referenceText}
            onChange={(e) => setReferenceText(e.target.value)}
          />
          <input type="file" accept="audio/*" required onChange={handleFileChange} className="w-full text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:bg-zinc-800 file:text-zinc-200 cursor-pointer" />
          <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-lg transition-all">
            {isLoading ? 'Analyzing...' : 'Analyze Speech'}
          </button>
        </form>

        {result && (
          <div className="mt-12 space-y-6 animate-in fade-in duration-500">
            <h2 className="text-xl font-bold border-b border-zinc-800 pb-2">Analysis Results</h2>
            
            {/* 1. Summary Metrics (Old Metrics) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                <span className="text-xs text-zinc-500 uppercase font-bold">Score</span>
                <span className={`block text-4xl font-black ${getScoreColor(result.pronunciation_score)}`}>{result.pronunciation_score}%</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                <span className="text-xs text-zinc-500 uppercase font-bold">Length</span>
                <span className="block text-3xl font-bold text-zinc-200">{result.duration_seconds}s</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
                <span className="text-xs text-zinc-500 uppercase font-bold">Errors</span>
                <span className="block text-3xl font-bold text-zinc-200">{result.metrics.edit_distance_errors}</span>
              </div>
            </div>

            {/* 2. Granular Phonetic Matrix (New Logic) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h4 className="text-sm font-bold text-zinc-400 uppercase mb-4">Phoneme Alignment Matrix</h4>
              <div className="flex flex-wrap gap-2">
                {(result?.alignment_details || []).map((item: any, i: number) => {
                  const styles: any = {
                    correct: "bg-zinc-800 text-emerald-400 border-emerald-900/30",
                    mispronunciation: "bg-rose-900/30 text-rose-400 border-rose-800",
                    skipped: "bg-amber-900/30 text-amber-400 border-amber-800 line-through",
                    extra: "bg-blue-900/30 text-blue-400 border-blue-800"
                  };
                  return (
                    <div key={i} className={`flex flex-col items-center px-2 py-1 rounded border ${styles[item.type] || "bg-zinc-800"}`}>
                      <span className="text-xs font-mono font-bold">
                        {item.type === 'mispronunciation' ? item.actual : (item.phone || item.expected)}
                      </span>
                      {item.type === 'mispronunciation' && (
                        <span className="text-[9px] text-zinc-500 uppercase italic">exp: {item.expected}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wide">Transcript</h3>
              <p className="text-zinc-300 italic">"{result?.meta?.whisper_transcription}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}