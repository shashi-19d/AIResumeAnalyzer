public class VerdictService
{
    public string GetVerdict(int score)
    {
        if (score >= 80) return "🔥 Strong Match";
        if (score >= 60) return "✅ Good Match";
        if (score >= 40) return "⚠️ Average Match";
        return "❌ Weak Match";
    }
}