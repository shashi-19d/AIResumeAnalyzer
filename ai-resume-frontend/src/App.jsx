import { useState } from "react";
import axios from "axios";

function App() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!resume || !job) {
      alert("Please enter both fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
          "https://localhost:44330/api/Analysis/analyze", // ⚠️ replace port
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

      <div className="w-full max-w-3xl backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">

        <h1 className="text-4xl font-bold text-white text-center mb-2">
          AI Resume Analyzer 🚀
        </h1>

        <p className="text-gray-300 text-center mb-6">
          Match your resume with job descriptions using AI
        </p>

        {/* Resume */}
        <textarea
          placeholder="Paste your resume..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          className="w-full h-32 p-4 mb-4 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Job */}
        <textarea
          placeholder="Paste job description..."
          value={job}
          onChange={(e) => setJob(e.target.value)}
          className="w-full h-32 p-4 mb-6 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Button */}
        <button
          onClick={analyze}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Now"}
        </button>

        {/* RESULT SECTION */}
        {result && (
          <div className="mt-8 text-white space-y-6">

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