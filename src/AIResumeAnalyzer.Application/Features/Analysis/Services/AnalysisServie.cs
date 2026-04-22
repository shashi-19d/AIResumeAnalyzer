using AIResumeAnalyzer.Domain.Entities;

namespace AIResumeAnalyzer.Application.Features.Analysis.Services;

public class AnalysisService : IAnalysisService
{
    private readonly IAnalysisRepository _repository;

    public AnalysisService(IAnalysisRepository repository)
    {
        _repository = repository;
    }

    public async Task<AnalyzeResponseDto> AnalyzeAsync(AnalyzeRequestDto request)
    {
        // Save Resume
        var resume = new Resume
        {
            Content = request.ResumeContent
        };

        await _repository.AddResumeAsync(resume);

        // Save Job Description
        var job = new JobDescription
        {
            Content = request.JobDescriptionContent
        };

        await _repository.AddJobDescriptionAsync(job);

        await _repository.SaveChangesAsync();

        // Dummy response (AI will come later)
        return new AnalyzeResponseDto
        {
            MatchScore = 0,
            MissingSkills = new List<string>(),
            Suggestions = new List<string>()
        };
    }
}