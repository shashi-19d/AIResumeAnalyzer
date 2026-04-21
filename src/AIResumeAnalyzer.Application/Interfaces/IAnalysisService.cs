public interface IAnalysisService
{
    Task<AnalyzeResponseDto> AnalyzeAsync(AnalyzeRequestDto request);
}