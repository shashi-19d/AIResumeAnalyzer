import Navbar from "../components/Navbar";
import GlassCard from "../components/GlassCard";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex justify-center items-center mt-20 px-6">
        <div className="w-full max-w-4xl space-y-6">

          <h2 className="text-4xl font-bold text-center">
            AI Resume Analyzer 🚀
          </h2>

          <p className="text-center text-gray-400">
            Match your resume with job descriptions and get AI insights
          </p>

          <GlassCard>
            <textarea
              placeholder="Paste your resume..."
              className="w-full h-32 bg-transparent outline-none text-white"
            />
          </GlassCard>

          <GlassCard>
            <textarea
              placeholder="Paste job description..."
              className="w-full h-32 bg-transparent outline-none text-white"
            />
          </GlassCard>

          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition">
            Analyze Now
          </button>

        </div>
      </div>
    </div>
  );
}