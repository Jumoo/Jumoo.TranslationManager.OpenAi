using System.Collections.Generic;
using System.Threading.Tasks;

using Jumoo.TranslationManager.OpenAi.Models;

namespace Jumoo.TranslationManager.OpenAi.Services;
public interface IOpenAiTranslationService
{
    bool Enabled();
    Task<IEnumerable<string>> Models();
    Task<IEnumerable<string>> Translate(List<string> text, OpenAITranslationOptions translationOptions);
}