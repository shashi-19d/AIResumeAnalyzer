using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using System.Text;

namespace AIResumeAnalyzer.Infrastructure.Parsing;

public class ResumeParserService
{
    public string ExtractText(Stream fileStream)
    {
        var text = new StringBuilder();

        using (var reader = new PdfReader(fileStream))
        using (var pdf = new PdfDocument(reader))
        {
            for (int i = 1; i <= pdf.GetNumberOfPages(); i++)
            {
                var page = pdf.GetPage(i);
                var strategy = new SimpleTextExtractionStrategy();
                text.AppendLine(PdfTextExtractor.GetTextFromPage(page, strategy));
            }
        }

        return text.ToString()
                   .Replace("\n", " ")
                   .Replace("\r", " ")
                   .Replace("  ", " ")
                   .Trim();

    }
}