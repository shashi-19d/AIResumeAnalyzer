using AIResumeAnalyzer.Application.Features.Analysis.Services;
using AIResumeAnalyzer.Infrastructure.Parsing;
using iText.Kernel.XMP.Impl;
using iText.StyledXmlParser.Jsoup.Parser;
using Microsoft.AspNetCore.Mvc;

namespace AIResumeAnalyzer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalysisController : ControllerBase
{
    private readonly IAnalysisService _service;
    private readonly ResumeParserService _parser;

    public AnalysisController(IAnalysisService service, ResumeParserService parser)
    {
        _service = service;
        _parser = parser;
    }

    [HttpPost("analyze")]
    public async Task<IActionResult> Analyze([FromBody] AnalyzeRequestDto request)
    {
        var result = await _service.AnalyzeAsync(request);
        return Ok(result);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadResume([FromForm] UploadResumeDto dto)
    {
        if (dto.File == null || dto.File.Length == 0)
            return BadRequest("File is required");

        using var stream = dto.File.OpenReadStream();

        var text = _parser.ExtractText(stream);

        return Ok(new { content = text });
    }
}