using AIResumeAnalyzer.Domain.Entities;
using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;

namespace AIResumeAnalyzer.Application.Features.Analysis.Services;

public class AnalysisService : IAnalysisService
{
    private readonly IAnalysisRepository _repository;
    private readonly IAIService _aiService;
    private readonly IMemoryCache _cache;
    private readonly ScoringService _scoringService;

    public AnalysisService(IAnalysisRepository repository, IAIService aiService, IMemoryCache cache, ScoringService scoringService)
    {
        _repository = repository;
        _aiService = aiService;
        _cache = cache;
        _scoringService = scoringService;
    }

    public async Task<AnalysisResultDto> AnalyzeAsync(AnalyzeRequestDto request)
    {
        var cacheKey = $"analysis_{request.ResumeContent}_{request.JobDescriptionContent}";

        if (_cache.TryGetValue(cacheKey, out AnalysisResultDto cachedResult))
        {
            return cachedResult;
        }

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

        Console.WriteLine("AI RESPONSE:");
        Console.WriteLine(aiResponse);

        AnalysisResultDto result;

        try
        {
            result = JsonSerializer.Deserialize<AnalysisResultDto>(
                aiResponse,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }
            ) ?? new AnalysisResultDto();
        }
        catch
        {
            result = new AnalysisResultDto
            {
                Suggestions = new List<string>
        {
            "AI response parsing failed. Try again with shorter input."
        }
            };
        }

        int matchCount = result.SkillsMatch.Count;
        int missingCount = result.MissingSkills.Count;
        int total = matchCount + missingCount;

        result.Breakdown.SkillsScore =
            total == 0 ? 0 : (int)((double)matchCount / total * 100);

        result.Breakdown.KeywordScore = result.Breakdown.SkillsScore;

        result.Breakdown.ExperienceScore =
            request.ResumeContent.Length > 300 ? 70 : 40;

        result.Breakdown.QualityScore =
            result.Suggestions.Count > 3 ? 60 : 80;

        result.Breakdown.OverallScore =
            (int)(
                result.Breakdown.SkillsScore * 0.4 +
                result.Breakdown.ExperienceScore * 0.2 +
                result.Breakdown.KeywordScore * 0.2 +
                result.Breakdown.QualityScore * 0.2
            );

        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(10));

        return result;
    }
}