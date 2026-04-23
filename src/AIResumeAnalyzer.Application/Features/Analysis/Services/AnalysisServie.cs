using AIResumeAnalyzer.Domain.Entities;
using System.Text.Json;

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

    public async Task<AnalysisResultDto> AnalyzeAsync(AnalyzeRequestDto request)
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

        var aiResponse = await _aiService.AnalyzeAsync(
            request.ResumeContent,
            request.JobDescriptionContent);

        Console.WriteLine("RAW AI RESPONSE:");
        Console.WriteLine(aiResponse);

        AnalysisResultDto result;

        try
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            result = JsonSerializer.Deserialize<AnalysisResultDto>(aiResponse, options);
        }
        catch
        {
            result = new AnalysisResultDto
            {
                SkillsMatch = new List<string>(),
                MissingSkills = new List<string> { "AI parsing failed" },
                Suggestions = new List<string> { aiResponse }
            };
        }

        return result;
    }
}