#if UMB_16_OR_GREATER
using Jumoo.Processing.Core.Communication;
#else
using Jumoo.TranslationManager.Core.Hubs;
using Microsoft.AspNetCore.SignalR;
#endif

using System.Threading.Tasks;

namespace Jumoo.TranslationManager.OpenAi.Services;
public class OpenAIMessageService
{
#if UMB_16_OR_GREATER
    private readonly IClientMessageService _messageService;

    public OpenAIMessageService(IClientMessageService messageService)
    {
        _messageService = messageService;
    }

    public async Task SendUpdateAsync(string title, string message, decimal progress, string clientId)
    {
        await _messageService.SendUpdateAsync(new ClientMessage
        {
            Title = title,
            Message = message,
            Progress = progress
        }, clientId);
    }

#else
    private readonly TranslationHubClient _client;

    public OpenAIMessageService(IHubContext<TranslationHub> hubContext)
    {
        _client = new TranslationHubClient(hubContext, null);
    }

    public Task SendUpdateAsync(string title, string message, decimal progress, string clientId)
    {
        _client.SendMessage(message);
        return Task.CompletedTask;
    }
#endif
}
