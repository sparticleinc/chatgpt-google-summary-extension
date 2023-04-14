import { Answer } from '../messaging'

export type Event =
  | {
      type: 'answer'
      data: Answer
    }
  | {
      type: 'done'
    }

export interface GenerateAnswerParams {
  prompt: string
  onEvent: (event: Event) => void
  signal?: AbortSignal
  taskId: string
}

export interface Provider {
  generateAnswer(params: GenerateAnswerParams): Promise<{ cleanup?: () => void }>
  cancelTask: (messageId: string) => void
}
