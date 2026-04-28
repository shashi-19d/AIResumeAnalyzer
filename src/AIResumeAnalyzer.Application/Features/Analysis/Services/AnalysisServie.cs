using AIResumeAnalyzer.Domain.Entities;
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;
using static AnalysisResultDto;

namespace AIResumeAnalyzer.Application.Features.Analysis.Services;

public class AnalysisService : IAnalysisService
{
    private readonly IAnalysisRepository _repository;
    private readonly IAIService _aiService;
    private readonly IMemoryCache _cache;
    private readonly SkillWeightService _skillService;
    private readonly KeywordScoreService _keywordService;
    private readonly ExperienceScoreService _experienceService;
    private readonly VerdictService _verdictService;

    public AnalysisService(IAnalysisRepository repository, IAIService aiService, IMemoryCache cache)
    {
        _repository = repository;
        _aiService = aiService;
        _cache = cache;
        _skillService = new SkillWeightService();
        _keywordService = new KeywordScoreService();
        _experienceService = new ExperienceScoreService();
        _verdictService = new VerdictService();
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

        // 🔥 ADVANCED SCORING

        var (skillsScore, skillInsights) =
            _skillService.Calculate(result.SkillsMatch, result.MissingSkills);

        var (keywordScore, keywordInsights) =
            _keywordService.Calculate(request.ResumeContent, result.SkillsMatch.Concat(result.MissingSkills).ToList());

        var (experienceScore, expInsights) =
            _experienceService.Calculate(request.ResumeContent, request.JobDescriptionContent);

        // simple quality heuristic
        int qualityScore = request.ResumeContent.Length > 500 ? 80 : 50;

        // weighted final score
        int overall =
            (int)(skillsScore * 0.4 +
                  keywordScore * 0.2 +
                  experienceScore * 0.2 +
                  qualityScore * 0.2);

        // verdict
        string verdict = _verdictService.GetVerdict(overall);

        // attach
        result.Breakdown = new ScoreBreakdown
        {
            OverallScore = overall,
            SkillsScore = skillsScore,
            KeywordScore = keywordScore,
            ExperienceScore = experienceScore,
            QualityScore = qualityScore,
            Verdict = verdict,
            Insights = skillInsights
                .Concat(keywordInsights)
                .Concat(expInsights)
                .ToList()
        };

        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(10));

        return result;
    }
}