using System.Text.RegularExpressions;

public class ExperienceScoreService
{
    public int ExtractYears(string text)
    {
        var matches = Regex.Matches(text, @"(\d+)\s*(\+)?\s*(years|yrs)");

        if (matches.Count == 0) return 0;

        int max = 0;

        foreach (Match match in matches)
        {
            int val = int.Parse(match.Groups[1].Value);
            if (val > max) max = val;
        }

        return max;
    }

    public (int score, List<string> insights) Calculate(
        string resume,
        string job)
    {
        int resumeExp = ExtractYears(resume);
        int jobExp = ExtractYears(job);

        if (jobExp == 0) jobExp = 2; // fallback

        int score = (int)(((double)resumeExp / jobExp) * 100);
        if (score > 100) score = 100;

        var insights = new List<string>();

        if (resumeExp < jobExp)
        {
            insights.Add($"Experience gap: Required {jobExp} yrs, found {resumeExp} yrs.");
        }

        return (score, insights);
    }
}