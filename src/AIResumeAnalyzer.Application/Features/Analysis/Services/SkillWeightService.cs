public class SkillWeightService
{
    public (int score, List<string> insights) Calculate(
        List<string> matched,
        List<string> missing)
    {
        int total = matched.Count + missing.Count;
        if (total == 0) return (0, new List<string>());

        double weight = 1.5;

        double rawScore = (matched.Count) /
                          (matched.Count + (missing.Count * weight));

        int score = (int)(rawScore * 100);

        var insights = new List<string>();

        if (missing.Count > matched.Count)
        {
            insights.Add("High number of critical missing skills detected.");
        }

        if (matched.Count > 0)
        {
            insights.Add($"Strong match in {matched.Count} key skills.");
        }

        return (score, insights);
    }
}