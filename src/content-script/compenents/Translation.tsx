import { useState, useCallback, useEffect } from 'preact/hooks'
import classNames from 'classnames'
import { TRANSLATION_LANGUAGES } from '@/config'
import ChatGPTQuery, { QueryStatus } from './ChatGPTQuery'
import { replylanguagePrompt } from '@/utils/prompt'

interface Props {
  answerText: string
  onStatusChange?: (status: QueryStatus) => void
  status?: QueryStatus
  showContent?: boolean
}

function Translation(props: Props) {
  const { answerText, onStatusChange, status, showContent } = props
  const [newQuestion, setNewQuestion] = useState<string>('')
  const [lang, setLang] = useState<string>('')
  const [translationStatus, setTranslationStatus] = useState<QueryStatus>()

  useEffect(() => {
    onStatusChange?.(status)

    setTranslationStatus(status)
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
      <div
        className={classNames(
          'glarity--chatgpt--footer',
          'glarity--nodrag',
          !showContent && 'glarity--chatgpt--footer__noborder',
        )}
      >
        <select
          className="glarity--select glarity--nodrag"
          value={lang}
          onChange={onChange}
          disabled={translationStatus !== 'done'}
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
            setTranslationStatus={setTranslationStatus}
          />
        </div>
      )}
    </>
  )
}

export default Translation
