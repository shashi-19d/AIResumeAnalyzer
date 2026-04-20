namespace AIResumeAnalyzer.Domain.Entities;

public class AnalysisResult
{
    public int Id { get; set; }

    public int ResumeId { get; set; }

    public int JobDescriptionId { get; set; }

    public int MatchScore { get; set; }

    public string MissingSkills { get; set; } = string.Empty;

    public string Suggestions { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}