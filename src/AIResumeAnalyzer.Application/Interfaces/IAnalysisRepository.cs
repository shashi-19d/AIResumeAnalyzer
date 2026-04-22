using AIResumeAnalyzer.Domain.Entities;

public interface IAnalysisRepository
{
    Task AddResumeAsync(Resume resume);

    Task AddJobDescriptionAsync(JobDescription job);

    Task SaveChangesAsync();
}