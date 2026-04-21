public interface IAIService
{
    Task<string> AnalyzeAsync(string resume, string jobDescription);
}