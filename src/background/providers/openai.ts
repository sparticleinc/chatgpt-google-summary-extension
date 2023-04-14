import { fetchSSE } from '../fetch-sse'
import { GenerateAnswerParams, Provider } from '../types'
import { getProviderConfigs, ProviderType, DEFAULT_MODEL, DEFAULT_API_HOST } from '@/config'

export class OpenAIProvider implements Provider {
  constructor(private token: string, private model: string) {
    this.token = token
    this.model = model
  }

  tasks = {}

  private buildPrompt(prompt: string): string {
    if (this.model.startsWith('text-chat-davinci')) {
      return `Respond conversationally.<|im_end|>\n\nUser: ${prompt}<|im_sep|>\nChatGPT:`
    }
    return prompt
  }

  private buildMessages(prompt: string) {
    return [{ role: 'user', content: prompt }]
  }

  async generateAnswer(params: GenerateAnswerParams) {
    const [config] = await Promise.all([getProviderConfigs()])

    const gptModel = config.configs[ProviderType.GPT3]?.model ?? DEFAULT_MODEL
    const apiHost = config.configs[ProviderType.GPT3]?.apiHost || DEFAULT_API_HOST

    const { taskId, prompt } = params

    let url = ''
    let reqParams = {
      model: this.model,
      // prompt: this.buildPrompt(params.prompt),
      // messages: this.buildMessages(params.prompt),
      stream: true,
      max_tokens: 800,
      // temperature: 0.5,
    }
    if (gptModel === 'text-davinci-003') {
      url = `https://${apiHost}/v1/completions`
      reqParams = { ...reqParams, ...{ prompt: this.buildPrompt(prompt) } }
    } else {
      url = `https://${apiHost}/v1/chat/completions`
      reqParams = { ...reqParams, ...{ messages: this.buildMessages(prompt) } }
    }

    let result = ''

    const abortController = new AbortController()

    this.tasks[taskId] = {
      abortController,
    }

    await fetchSSE(url, {
      method: 'POST',
      signal: abortController.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(reqParams),
      onMessage(message) {
        console.debug('sse message', message)
        if (message === '[DONE]') {
          params.onEvent({ type: 'done' })
          return
        }
        let data
        try {
          data = JSON.parse(message)
          const text =
            gptModel === 'text-davinci-003' ? data.choices[0].text : data.choices[0].delta.content

          if (text === undefined || text === '<|im_end|>' || text === '<|im_sep|>') {
            return
          }
          result += text
          params.onEvent({
            type: 'answer',
            data: {
              text: result,
              messageId: data.id,
              conversationId: data.id,
            },
          })
        } catch (err) {
          // console.error(err)
          return
        }
      },
    })
    return {}
  }

  cancelTask(taskId: string) {
    const taskInfo = this.tasks[taskId]
    console.log('cancel task', taskId, taskInfo)
    if (!taskInfo) {
      return
    }
    taskInfo.abortController.abort()
  }
}
