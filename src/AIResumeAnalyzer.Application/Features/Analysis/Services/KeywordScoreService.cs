public class KeywordScoreService
{
    public (int score, List<string> insights) Calculate(
        string resume,
        List<string> jobKeywords)
    {
        if (string.IsNullOrEmpty(resume) || jobKeywords.Count == 0)
            return (0, new List<string>());

        int hits = 0;

        foreach (var keyword in jobKeywords)
        {
            if (resume.ToLower().Contains(keyword.ToLower()))
            {
                hits++;
            }
        }

        int score = (int)(((double)hits / jobKeywords.Count) * 100);

        var insights = new List<string>();

        if (score < 50)
            insights.Add("Low keyword match — ATS may reject this resume.");

        return (score, insights);
    }
}