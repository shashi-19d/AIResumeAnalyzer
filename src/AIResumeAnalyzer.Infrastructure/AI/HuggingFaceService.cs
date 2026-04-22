using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace AIResumeAnalyzer.Infrastructure.AI;

public class HuggingFaceService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public HuggingFaceService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["HuggingFace:ApiKey"];
    }

    public async Task<string> AnalyzeAsync(string resume, string jobDescription)
    {
        var prompt = $"Compare the resume and job description. Give skills match, missing skills, and suggestions.\n\nResume:\n{resume}\n\nJob:\n{jobDescription}";

        return await CallAI(prompt);
    }

    private async Task<string> CallAI(string prompt)
    {
        var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn");

        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

        var requestBody = new
        {
            inputs = prompt
        };

        request.Content = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json");

        var response = await _httpClient.SendAsync(request);

        var content = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"HuggingFace Error: {content}");
        }

        using var json = JsonDocument.Parse(content);

        if (json.RootElement.ValueKind == JsonValueKind.Array)
        {
            var first = json.RootElement[0];

            if (first.TryGetProperty("generated_text", out var genText))
                return genText.GetString() ?? "No response";

            if (first.TryGetProperty("summary_text", out var sumText))
                return sumText.GetString() ?? "No response";

            if (first.TryGetProperty("text", out var text))
                return text.GetString() ?? "No response";
        }

        return content;
    }
}