import { useState } from "react";
import axios from "axios";

function App() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 NEW STATES
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 🔥 Score Calculation
  const calculateScore = (match = [], missing = []) => {
    const total = match.length + missing.length;
    if (total === 0) return 0;
    return Math.round((match.length / total) * 100);
  };

  const getScoreColor = (score) => {
    if (score > 75) return "text-green-400";
    if (score > 50) return "text-yellow-400";
    return "text-red-400";
  };

  const score = result
    ? calculateScore(result.skillsMatch, result.missingSkills)
    : 0;

  // 🚀 ANALYZE API
  const analyze = async () => {
    if (!resume || !job) {
      alert("Please enter both fields");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        "https://localhost:44330/api/Analysis/analyze",
        {
          resumeContent: resume,
          jobDescriptionContent: job,
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("API Error — check backend");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 UPLOAD + PARSE PDF
  const uploadResume = async (selectedFile) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);

    try {
      const response = await axios.post(
        "https://localhost:44330/api/Analysis/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 🔥 AUTO FILL RESUME
      setResume(response.data.content);
    } catch (error) {
      console.error(error);
      alert("Resume upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-6">

      {/* 🌌 Glass Card */}
      <div className="w-full max-w-3xl backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 relative overflow-hidden">

        {/* 🔥 Glow Effects */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

        <h1 className="text-4xl font-bold text-white text-center mb-2">
          AI Resume Analyzer 🚀
        </h1>

        <p className="text-gray-300 text-center mb-6">
          Upload your resume or paste content and match with job description
        </p>

        {/* 📂 FILE UPLOAD */}
        <div className="mb-4">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              setFile(selectedFile);
              uploadResume(selectedFile);
            }}
            className="text-white"
          />

          {uploading && (
            <p className="text-blue-400 text-sm mt-2 animate-pulse">
              Parsing resume...
            </p>
          )}
        </div>

        {/* Resume Input */}
        <textarea
          placeholder="Or paste your resume..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          className="w-full h-32 p-4 mb-4 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Job Input */}
        <textarea
          placeholder="Paste job description..."
          value={job}
          onChange={(e) => setJob(e.target.value)}
          className="w-full h-32 p-4 mb-6 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* 🔥 Analyze Button */}
        <button
          onClick={analyze}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition-all duration-300
            ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 active:scale-95"
            }`}
        >
          {loading ? "Analyzing..." : "Analyze Now"}
        </button>

        {/* ⏳ AI Loading */}
        {loading && (
          <p className="text-center text-gray-400 mt-4 animate-pulse">
            AI is analyzing your resume...
          </p>
        )}

        {/* 🎯 RESULTS */}
        {result && (
          <div className="mt-8 text-white space-y-6 animate-fadeIn">

            {/* 🔥 SCORE */}
            <div className="flex flex-col items-center mb-6 animate-scaleIn">
              <div className="relative w-32 h-32">

                <svg className="transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" stroke="#374151" strokeWidth="10" fill="transparent" />

                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#grad)"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray="314"
                    strokeDashoffset={314 - (314 * score) / 100}
                    className="transition-all duration-1000 ease-out"
                  />

                  <defs>
                    <linearGradient id="grad">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </div>
              </div>

              <p className="text-gray-400 mt-2">Match Score</p>
            </div>

            {/* Skills Match */}
            <div>
              <h2 className="text-xl font-semibold mb-2">✅ Skills Match</h2>
              <div className="flex flex-wrap gap-2">
                {result.skillsMatch?.map((s, i) => (
                  <span key={i} className="bg-green-500/20 px-3 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <h2 className="text-xl font-semibold mb-2">❌ Missing Skills</h2>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills?.map((s, i) => (
                  <span key={i} className="bg-red-500/20 px-3 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h2 className="text-xl font-semibold mb-2">💡 Suggestions</h2>
              <ul className="list-disc ml-6 text-gray-300">
                {result.suggestions?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;