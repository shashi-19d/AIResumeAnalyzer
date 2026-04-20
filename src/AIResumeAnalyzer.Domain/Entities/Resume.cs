namespace AIResumeAnalyzer.Domain.Entities;

public class Resume
{
    public int Id { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}