export default function Navbar() {
  return (
    <div className="w-full px-10 py-4 flex justify-between items-center backdrop-blur-md bg-white/5 border-b border-white/10">
      <h1 className="text-xl font-semibold tracking-wide">
        AI Resume Analyzer
      </h1>

      <div className="space-x-6 text-sm text-gray-300">
        <span className="hover:text-white cursor-pointer">Home</span>
        <span className="hover:text-white cursor-pointer">Analyze</span>
      </div>
    </div>
  );
}