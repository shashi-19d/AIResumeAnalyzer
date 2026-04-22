using AIResumeAnalyzer.Domain.Entities;
using AIResumeAnalyzer.Infrastructure.Data;

namespace AIResumeAnalyzer.Infrastructure.Repositories;

public class AnalysisRepository : IAnalysisRepository
{
    private readonly ApplicationDbContext _context;

    public AnalysisRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddResumeAsync(Resume resume)
    {
        await _context.Resumes.AddAsync(resume);
    }

    public async Task AddJobDescriptionAsync(JobDescription job)
    {
        await _context.JobDescriptions.AddAsync(job);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}