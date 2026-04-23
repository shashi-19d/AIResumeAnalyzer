using AIResumeAnalyzer.Application.Features.Analysis.Services;
using Microsoft.AspNetCore.Mvc;

namespace AIResumeAnalyzer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalysisController : ControllerBase
{
    private readonly IAnalysisService _service;

    public AnalysisController(IAnalysisService service)
    {
        _service = service;
    }

    [HttpPost("analyze")]
    public async Task<IActionResult> Analyze([FromBody] AnalyzeRequestDto request)
    {
        var result = await _service.AnalyzeAsync(request);
        return Ok(result);
    }
}