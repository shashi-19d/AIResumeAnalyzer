using System.Text.Json.Serialization;

public class AnalysisResultDto
{
    [JsonPropertyName("skillsMatch")]
    public List<string> SkillsMatch { get; set; } = new();

    [JsonPropertyName("missingSkills")]
    public List<string> MissingSkills { get; set; } = new();

    [JsonPropertyName("suggestions")]
    public List<string> Suggestions { get; set; } = new();

    public ScoreBreakdown Breakdown { get; set; } = new();

    public class ScoreBreakdown
    {
        public int OverallScore { get; set; }
        public int SkillsScore { get; set; }
        public int ExperienceScore { get; set; }
        public int KeywordScore { get; set; }
        public int QualityScore { get; set; }

        public string Verdict { get; set; } = string.Empty;

        public List<string> Insights { get; set; } = new();
    }
}