using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace AIResumeAnalyzer.Infrastructure.AI;

public class GroqService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public GroqService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["Groq:ApiKey"];
    }

    public async Task<string> AnalyzeAsync(string resume, string jobDescription)
    {
        var prompt = $@"Act as an expert Technical Recruiter and ATS Optimization Engine.                
                        Task: Conduct a high-fidelity gap analysis between the provided Resume and Job Description (JD).               
                        Constraints:                           
                                    1. Extraction: Identify 'skillsMatch' based on exact and semantic overlaps.                        
                                    2. Gap Discovery: List 'missingSkills' that are high-priority requirements in the JD but absent in the resume.    
                                    3. Strategic Insight: Provide 'suggestions' that go beyond keywords, focusing on quantifying achievements (e.g., Google's X-Y-Z formula) and formatting for ATS parsers.        
                        Output: Return ONLY a valid JSON object. Do not include markdown headers or conversational filler.              
                        Format:                       
                              {{ ""skillsMatch"": [""list"", ""matched"", ""skills""],                   
                                 ""missingSkills"": [""list"", ""missing"", ""critical"", ""skills""],            
                                 ""suggestions"": [""actionable"", ""strategic"", ""advice""]                    
                              }}               
                        Resume Content: {resume}
                        Job Description:{jobDescription}";

        return await CallAI(prompt);
    }

    private async Task<string> CallAI(string prompt)
    {
        var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://api.groq.com/openai/v1/chat/completions");

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", _apiKey);

        var requestBody = new
        {
            model = "llama-3.1-8b-instant",
            messages = new[]
            {
               new { role = "system", content = "You are a strict JSON generator." },
               new { role = "user", content = prompt }
            },
            temperature = 0.2,
            max_tokens = 500
        };

        request.Content = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json");

        var response = await _httpClient.SendAsync(request);

        var content = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception($"Groq Error: {content}");

        using var json = JsonDocument.Parse(content);

        var result = json.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return ExtractJson(result);
    }

    private string ExtractJson(string text)
    {
        try
        {
            var start = text.IndexOf('{');
            var end = text.LastIndexOf('}');

            if (start >= 0 && end > start)
            {
                var json = text.Substring(start, end - start + 1);

                // Validate JSON
                JsonDocument.Parse(json);

                return json;
            }
        }
        catch
        {
            Console.WriteLine("Invalid JSON from AI:");
            Console.WriteLine(text);
        }

        return "{}";
    }
}