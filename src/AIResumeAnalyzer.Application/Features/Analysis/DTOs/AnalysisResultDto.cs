using System.Text.Json.Serialization;

public class AnalysisResultDto
{
    [JsonPropertyName("skillsMatch")]
    public List<string> SkillsMatch { get; set; } = new();

    [JsonPropertyName("missingSkills")]
    public List<string> MissingSkills { get; set; } = new();

    [JsonPropertyName("suggestions")]
    public List<string> Suggestions { get; set; } = new();
}