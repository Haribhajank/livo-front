'use client';

import React, { useState, useRef } from 'react';

interface WordMetric {
  word: string;
  error_type: string;
  accuracy_score: number;
}

interface AssessmentResponse {
  overall_score: number;
  transcript_detected: string;
  words: WordMetric[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [referenceText, setReferenceText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResult(null);
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await selectedFile.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const duration = audioBuffer.duration;

      if (duration < 30 || duration > 45) {
        setError(`Audio must be between 30 and 45 seconds. Your file is ${duration.toFixed(1)}s.`);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setFile(selectedFile);
    } catch (err) {
      setError("Failed to read audio file. Please ensure it is a valid MP3 or WAV.");
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !referenceText.trim()) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("reference_text", referenceText.trim());

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${backendUrl}/api/score`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Server failed to process analysis.");
      }

      const data: AssessmentResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "A network communication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Free Pronunciation Evaluator</h1>
      
      {/* Strict DPDP Compliance Notice */}
      <div style={{ background: '#f8f9fa', borderLeft: '4px solid #198754', padding: '15px', marginBottom: '30px' }}>
        <strong>Privacy Notice (DPDP Act 2023):</strong> By uploading, you consent to your voice data being processed dynamically to generate an evaluation. 
        Your audio is held temporarily in RAM and is <strong>permanently destroyed immediately after response compilation</strong>. No persistent databases or file logs are used.
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Reference Prompt Text</label>
          <textarea
            rows={4}
            required
            value={referenceText}
            onChange={(e) => setReferenceText(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            placeholder="Type out the exact script text statement spoken inside the file..."
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Upload Audio File (Strictly 30 to 45 seconds)</label>
          <input 
            type="file" 
            accept="audio/mp3, audio/wav, audio/mpeg" 
            ref={fileInputRef}
            onChange={handleFileChange}
            required 
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !file}
          style={{ padding: '12px', background: loading ? '#6c757d' : '#198754', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? "Transcribing & Evaluating... (May take a few moments)" : "Analyze Speech"}
        </button>
      </form>

      {error && <div style={{ marginTop: '20px', padding: '15px', background: '#f8d7da', color: '#842029', borderRadius: '5px' }}>{error}</div>}

      {result && (
        <div style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '30px' }}>
          <h2>Pronunciation Score: {result.overall_score}/100</h2>

          <h3 style={{ marginTop: '20px' }}>Error Feedback Alignment Map:</h3>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
            <span style={{ color: '#dc3545', fontWeight: 'bold', backgroundColor: '#f8d7da', padding: '2px 6px', borderRadius: '4px' }}>Red Highlight</span> = Mispronounced / Unclear | 
            <span style={{ textDecoration: 'line-through', color: '#6c757d', margin: '0 10px' }}>Strikethrough</span> = Omitted Word | 
            <span style={{ textDecoration: 'underline', color: '#fd7e14', marginLeft: '10px' }}>Underline</span> = Insertion (Extra Spoken Word)
          </p>

          <div style={{ fontSize: '18px', lineHeight: '2', padding: '20px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#fff' }}>
            {result.words.map((w, index) => {
              let style: React.CSSProperties = { marginRight: '8px', padding: '2px 4px', borderRadius: '4px', display: 'inline-block' };
              
              if (w.error_type === "Mispronunciation") {
                style.color = '#dc3545';
                style.backgroundColor = '#f8d7da';
              } else if (w.error_type === "Omission") {
                style.textDecoration = 'line-through';
                style.color = '#6c757d';
              } else if (w.error_type === "Insertion") {
                style.textDecoration = 'underline';
                style.color = '#fd7e14';
              } else {
                style.color = '#198754';
              }

              return (
                <span key={index} style={style}>
                  {w.word}
                </span>
              );
            })}
          </div>

          <div style={{ marginTop: '25px', padding: '15px', background: '#f1f3f5', borderRadius: '6px' }}>
            <strong>Raw Transcript Heard By AI Engine:</strong>
            <p style={{ fontStyle: 'italic', marginTop: '5px', color: '#495057' }}>"{result.transcript_detected}"</p>
          </div>
        </div>
      )}
    </main>
  );
}