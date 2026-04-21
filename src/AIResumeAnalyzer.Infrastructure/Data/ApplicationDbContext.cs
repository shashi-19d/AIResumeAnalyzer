using AIResumeAnalyzer.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AIResumeAnalyzer.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Resume> Resumes { get; set; }

    public DbSet<JobDescription> JobDescriptions { get; set; }

    public DbSet<AnalysisResult> AnalysisResults { get; set; }
}