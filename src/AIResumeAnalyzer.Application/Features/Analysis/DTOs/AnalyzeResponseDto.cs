public class AnalyzeResponseDto
{
    public int MatchScore { get; set; }

    public List<string> MissingSkills { get; set; } = new();

    public List<string> Suggestions { get; set; } = new();
}