export default function GlassCard({ children }) {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
      {children}
    </div>
  );
}