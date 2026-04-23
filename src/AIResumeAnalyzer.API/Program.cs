using AIResumeAnalyzer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using AIResumeAnalyzer.Application.Features.Analysis.Services;
using AIResumeAnalyzer.Infrastructure.Repositories;
using AIResumeAnalyzer.Infrastructure.AI;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAnalysisRepository, AnalysisRepository>();
builder.Services.AddScoped<IAIService, GroqService>();
builder.Services.AddScoped<IAnalysisService, AnalysisService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();