import { useState } from "react";
import axios from "axios";

function App() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // 🚀 API Call
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
          Match your resume with job descriptions using AI
        </p>

        {/* Resume Input */}
        <textarea
          placeholder="Paste your resume..."
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

        {/* 🔥 Button with UX states */}
        <button
          onClick={analyze}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition-all duration-300
            ${loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 active:scale-95"
            }`}
        >
          {loading ? "Analyzing..." : "Analyze Now"}
        </button>

        {/* ⏳ Loading Feedback */}
        {loading && (
          <p className="text-center text-gray-400 mt-4 animate-pulse">
            AI is analyzing your resume...
          </p>
        )}

        {/* 🎯 RESULTS */}
        {result && (
          <div className="mt-8 text-white space-y-6 animate-fadeIn">

            {/* 🔥 SCORE (Animated + Glow) */}
            <div className="flex flex-col items-center mb-6 animate-scaleIn">
              <div className="relative w-32 h-32">

                <svg className="transform -rotate-90" viewBox="0 0 120 120">

                  {/* Background Circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#374151"
                    strokeWidth="10"
                    fill="transparent"
                  />

                  {/* Progress Circle */}
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
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(168,85,247,0.6))"
                    }}
                  />

                  <defs>
                    <linearGradient id="grad">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Score Text */}
                <div className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </div>
              </div>

              <p className="text-gray-400 mt-2">Match Score</p>
            </div>

            {/* ✅ Skills Match */}
            <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-xl font-semibold mb-2">✅ Skills Match</h2>
              <div className="flex flex-wrap gap-2">
                {result.skillsMatch?.map((s, i) => (
                  <span
                    key={i}
                    className="bg-green-500/20 border border-green-400/30 text-green-300 px-4 py-1 rounded-full backdrop-blur-md hover:scale-110 hover:shadow-lg transition-all duration-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* ❌ Missing Skills */}
            <div className="animate-fadeIn" style={{ animationDelay: "0.4s" }}>
              <h2 className="text-xl font-semibold mb-2">❌ Missing Skills</h2>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills?.map((s, i) => (
                  <span
                    key={i}
                    className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-1 rounded-full backdrop-blur-md hover:scale-110 hover:shadow-lg transition-all duration-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* 💡 Suggestions */}
            <div className="animate-fadeIn" style={{ animationDelay: "0.6s" }}>
              <h2 className="text-xl font-semibold mb-2">💡 Suggestions</h2>
              <ul className="list-disc ml-6 text-gray-300 space-y-2">
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