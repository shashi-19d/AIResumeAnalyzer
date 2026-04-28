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

  const cleanJobDescription = (text) => {
    return text
      .replace(/About the job/gi, "")
      .replace(/Apply now/gi, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // 🔥 Score Calculation
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const score = result?.breakdown?.overallScore || 0;

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
        <div className="mb-6">

          {/* Hidden input */}
          <input
            id="fileUpload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (selectedFile) {
                setFile(selectedFile);
                uploadResume(selectedFile);
              }
            }}
          />

          {/* Custom Button */}
          <label
            htmlFor="fileUpload"
            className="cursor-pointer flex items-center justify-center gap-3 px-4 py-3 rounded-lg 
               bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20 
               transition-all duration-300"
          >
            📂 Upload Resume (PDF)
          </label>

          {/* Selected File Name */}
          {file && (
            <p className="text-sm text-green-400 mt-2">
              ✅ {file.name}
            </p>
          )}

          {/* Uploading State */}
          {uploading && (
            <p className="text-blue-400 mt-2 animate-pulse">
              Parsing resume...
            </p>
          )}

        </div>

        {/* Job Input */}
        <textarea
          placeholder="Paste job description..."
          value={job}
          onChange={(e) => setJob(cleanJobDescription(e.target.value))}
          className="w-full h-32 p-4 mb-6 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <p className="text-xs text-gray-400 mt-1 mb-12">
          💡 Paste job description from LinkedIn or company site — we clean it automatically
        </p>

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

                <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${getScoreColor(score)} animate-pulse`}>
                  {score}%
                </div>
              </div>

              <p className="text-gray-400 mt-2"> Relevancy 🎯 </p>
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
            <div className="grid grid-cols-2 gap-4 mt-6">

              <div className="bg-white/10 p-4 rounded-xl text-center">
                <p className="text-gray-400 text-sm">Skills</p>
                <p className="text-lg font-bold">{result?.breakdown?.skillsScore}%</p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl text-center">
                <p className="text-gray-400 text-sm">Experience</p>
                <p className="text-lg font-bold">{result?.breakdown.experienceScore}%</p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl text-center">
                <p className="text-gray-400 text-sm">Keyword</p>
                <p className="text-lg font-bold">{result?.breakdown.keywordScore}%</p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl text-center">
                <p className="text-gray-400 text-sm">Quality</p>
                <p className="text-lg font-bold">{result?.breakdown.qualityScore}%</p>
              </div>

            </div>

            <h2 className="text-xl text-center mt-4">
              {result?.breakdown?.verdict}
            </h2>

            <div className="mt-6">
              <h3 className="text-lg font-semibold">📊 Insights</h3>
              <ul className="list-disc ml-6 text-gray-300">
                {result?.breakdown?.insights?.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
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