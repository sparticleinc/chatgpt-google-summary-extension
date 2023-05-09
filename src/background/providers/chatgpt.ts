import ExpiryMap from 'expiry-map'
import { v4 as uuidv4 } from 'uuid'
import { fetchSSE } from '../fetch-sse'
import { GenerateAnswerParams, Provider } from '../types'
import { BASE_URL, CHAT_DEFAULT_MODEL, getUserConfig } from '@/config'
import { truncateTextByToken } from '@/utils/utils'
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
      const chatModel = (await Browser.storage.local.get('chatModel'))?.chatModel ?? 'gpt-3.5-turbo'
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
    // const userConfig = await getUserConfig()

    const messageId = uuidv4()

    const cleanup = () => {
      if (conversationId) {
        // setConversationProperty(this.token, conversationId, { is_visible: userConfig.continueConversation })
        setConversationProperty(this.token, conversationId, { is_visible: true })
      }
    }

    const modelName = await this.getModelName()

    const truncatePrompt = truncateTextByToken({
      text: prompt,
      modelName: modelName,
    })

    const abortController = new AbortController()

    this.tasks[taskId] = {
      abortController,
    }

    const setTasks = (data) => {
      this.tasks[taskId] = {
        ...data,
        ...this.tasks[taskId],
      }
    }


    let bodyJSON = {
      action: 'next',
      messages: [
        {
          id: messageId,
          author: { role: "user" },
          content: {
            content_type: 'text',
            parts: [truncatePrompt],
          },
        },
      ],
      model: modelName,
      parent_message_id: uuidv4(),
      history_and_training_disabled: false,
      conversation_id: params.conversationId
    }

    if (params.conversationId) {
      bodyJSON = {
        ...bodyJSON, ...{ conversation_id: params.conversationId }
      }
    } else {
      delete bodyJSON.conversation_id
    }


    await fetchSSE(`${BASE_URL}/backend-api/conversation`, {
      method: 'POST',
      signal: abortController.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(bodyJSON),
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
          cleanup()
          return
        }
        const text = data.message?.content?.parts?.[0]
        if (text) {
          conversationId = data.conversation_id
          setTasks({ conversationId })

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
    if (taskInfo.conversationId) {
      setConversationProperty(this.token, taskInfo.conversationId, { is_visible: false })
    }
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
