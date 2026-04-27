using AIResumeAnalyzer.Application.Features.Analysis;
using System;
using static AnalysisResultDto;

public class ScoringService
{
    public (int overall, ScoreBreakdown breakdown) CalculateScore(
        List<string> match,
        List<string> missing,
        List<string> suggestions,
        string resumeText,
        string jobText)
    {
        match ??= new List<string>();
        missing ??= new List<string>();
        suggestions ??= new List<string>();

        int totalSkills = match.Count + missing.Count;
        int skillsScore = totalSkills == 0
            ? 0
            : (int)((double)match.Count / totalSkills * 100);


        int experienceScore = Math.Max(0, 100 - (missing.Count * 10));


        int keywordScore = CalculateKeywordScore(match, resumeText);


        int qualityScore = suggestions.Count >= 3 ? 80 : 60;


        int overall =
            (int)(skillsScore * 0.5 +
                  experienceScore * 0.2 +
                  keywordScore * 0.15 +
                  qualityScore * 0.15);

        return (overall, new ScoreBreakdown
        {
            SkillsScore = skillsScore,
            ExperienceScore = experienceScore,
            KeywordScore = keywordScore,
            QualityScore = qualityScore
        });
    }

    private int CalculateKeywordScore(List<string> match, string resume)
    {
        if (match == null || match.Count == 0 || string.IsNullOrEmpty(resume))
            return 0;

        int hits = 0;

        foreach (var skill in match)
        {
            if (resume.Contains(skill, StringComparison.OrdinalIgnoreCase))
                hits++;
        }

        return (int)((double)hits / match.Count * 100);
    }
}