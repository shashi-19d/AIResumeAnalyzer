using AIResumeAnalyzer.Domain.Entities;

namespace AIResumeAnalyzer.Application.Features.Analysis.Services;

public class AnalysisService : IAnalysisService
{
    private readonly IAnalysisRepository _repository;

    private readonly IAIService _aiService;

    public AnalysisService(IAnalysisRepository repository, IAIService aiService)
    {
        _repository = repository;
        _aiService = aiService;
    }

    public async Task<AnalyzeResponseDto> AnalyzeAsync(AnalyzeRequestDto request)
    {
        var resume = new Resume
        {
            Content = request.ResumeContent
        };

        await _repository.AddResumeAsync(resume);

        var job = new JobDescription
        {
            Content = request.JobDescriptionContent
        };

        await _repository.AddJobDescriptionAsync(job);

        await _repository.SaveChangesAsync();

        var aiResponse = await _aiService.AnalyzeAsync(request.ResumeContent, request.JobDescriptionContent);

        return new AnalyzeResponseDto
        {
            MatchScore = 0,
            MissingSkills = new List<string> { aiResponse },
            Suggestions = new List<string>()
        };
    }
}