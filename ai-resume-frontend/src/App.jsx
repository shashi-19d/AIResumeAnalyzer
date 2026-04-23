import { useState } from "react";

function App() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-6">

      {/* Glass Card */}
      <div className="w-full max-w-3xl backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">

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

        {/* Job Description */}
        <textarea
          placeholder="Paste job description..."
          value={job}
          onChange={(e) => setJob(e.target.value)}
          className="w-full h-32 p-4 mb-6 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Button */}
        <button
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg hover:scale-105 transition-transform duration-300"
        >
          Analyze Now
        </button>

      </div>
    </div>
  );
}

export default App;