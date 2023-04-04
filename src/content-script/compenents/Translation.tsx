import { useState, useCallback, useEffect } from 'preact/hooks'
import { TRANSLATION_LANGUAGES } from '@/config'
import ChatGPTQuery, { QueryStatus } from './ChatGPTQuery'
import { replylanguagePrompt } from '@/utils/prompt'

interface Props {
  answerText: string
  onStatusChange?: (status: QueryStatus) => void
  status?: QueryStatus
}

function Translation(props: Props) {
  const { answerText, onStatusChange, status } = props
  const [newQuestion, setNewQuestion] = useState<string>('')
  const [lang, setLang] = useState<string>('')

  useEffect(() => {
    onStatusChange?.(status)
  }, [onStatusChange, status])

  const onChange = useCallback(
    (event) => {
      onStatusChange?.(undefined)
      const val = event.target.value || ''
      setLang(val)
      setNewQuestion(answerText + replylanguagePrompt(val))
    },
    [answerText, onStatusChange],
  )

  return (
    <>
      <div className="glarity--chatgpt--footer">
        <select
          className="glarity--select"
          value={lang}
          onChange={onChange}
          disabled={status !== 'done'}
        >
          <option key={'translation'} value={''}>
            Translation
          </option>
          {TRANSLATION_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {lang && newQuestion && (
        <div className="glarity--chatgpt--translation">
          <ChatGPTQuery
            question={newQuestion}
            ignoreTranslation={true}
            onStatusChange={onStatusChange}
          />
        </div>
      )}
    </>
  )
}

export default Translation
