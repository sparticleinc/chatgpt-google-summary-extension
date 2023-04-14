import ExpiryMap from 'expiry-map'
import { v4 as uuidv4 } from 'uuid'
import { fetchSSE } from '../fetch-sse'
import { GenerateAnswerParams, Provider } from '../types'
import { BASE_URL, CHAT_DEFAULT_MODEL, DEFAULT_MODEL } from '@/config'
import Browser from 'webextension-polyfill'

async function request(token: string, method: string, path: string, data?: unknown) {
  return fetch(`${BASE_URL}/backend-api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: data === undefined ? undefined : JSON.stringify(data),
  })
}

export async function sendMessageFeedback(token: string, data: unknown) {
  await request(token, 'POST', '/conversation/message_feedback', data)
}

export async function setConversationProperty(
  token: string,
  conversationId: string,
  propertyObject: object,
) {
  await request(token, 'PATCH', `/conversation/${conversationId}`, propertyObject)
}

const KEY_ACCESS_TOKEN = 'accessToken'

const cache = new ExpiryMap(10 * 1000)

export async function getChatGPTAccessToken(): Promise<string> {
  if (cache.get(KEY_ACCESS_TOKEN)) {
    return cache.get(KEY_ACCESS_TOKEN)
  }
  const resp = await fetch(`${BASE_URL}/api/auth/session`)
  if (resp.status === 403) {
    throw new Error('CLOUDFLARE')
  }
  const data = await resp.json().catch(() => ({}))
  if (!data.accessToken) {
    throw new Error('UNAUTHORIZED')
  }
  cache.set(KEY_ACCESS_TOKEN, data.accessToken)
  return data.accessToken
}

export class ChatGPTProvider implements Provider {
  constructor(private token: string) {
    this.token = token
  }

  tasks = {}

  private async fetchModels(): Promise<
    { slug: string; title: string; description: string; max_tokens: number }[]
  > {
    const resp = await request(this.token, 'GET', '/models').then((r) => r.json())
    return resp.models
  }

  private async getModelName(): Promise<string> {
    try {
      const chatModel = (await Browser.storage.local.get('chatModel'))?.chatModel ?? 'GPT-3.5 Turbo'
      const models = await this.fetchModels()

      if (chatModel === 'auto') {
        const gpt4Model = models.find((model) => model.slug === 'gpt-4')
        return gpt4Model?.slug || models[0].slug
      }

      return models[0].slug
    } catch (err) {
      console.error(err)
      return CHAT_DEFAULT_MODEL
    }
  }

  async generateAnswer(params: GenerateAnswerParams) {
    let conversationId: string | undefined
    const { taskId, prompt } = params

    const messageId = uuidv4()

    const cleanup = () => {
      if (conversationId) {
        setConversationProperty(this.token, conversationId, { is_visible: false })
      }
    }

    const modelName = await this.getModelName()

    const abortController = new AbortController()

    this.tasks[taskId] = {
      abortController,
    }

    await fetchSSE(`${BASE_URL}/backend-api/conversation`, {
      method: 'POST',
      signal: abortController.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        action: 'next',
        messages: [
          {
            id: messageId,
            role: 'user',
            content: {
              content_type: 'text',
              parts: [prompt],
            },
          },
        ],
        model: modelName,
        parent_message_id: uuidv4(),
      }),
      onMessage(message: string) {
        console.debug('sse message', message)
        if (message === '[DONE]') {
          params.onEvent({ type: 'done' })
          cleanup()
          return
        }
        let data
        try {
          data = JSON.parse(message)
        } catch (err) {
          console.error(err)
          return
        }
        const text = data.message?.content?.parts?.[0]
        if (text) {
          conversationId = data.conversation_id
          params.onEvent({
            type: 'answer',
            data: {
              text,
              messageId: data.message.id,
              conversationId: data.conversation_id,
            },
          })
        }
      },
    })
    return { cleanup }
  }

  cancelTask(taskId: string) {
    const taskInfo = this.tasks[taskId]
    if (!taskInfo) {
      return
    }
    taskInfo.abortController.abort()
  }

  async updateTitle(params) {
    const { conversationId, messageId } = params
    const modelName = await this.getModelName()

    return await request(this.token, 'POST', `/conversation/gen_title/${conversationId}`, {
      message_id: messageId,
      model: modelName,
    })
  }
}
