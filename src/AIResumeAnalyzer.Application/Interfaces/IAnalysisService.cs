public interface IAnalysisService
{
    Task<AnalysisResultDto> AnalyzeAsync(AnalyzeRequestDto request);
}