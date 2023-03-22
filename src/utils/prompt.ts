export const articlePromptHighlight = `Please use the above to summarize the highlights.`
export const pagePromptHighlight = `Summarize the highlights of the content and output a useful summary in a few sentences.`
export const googlePatentsPromptHighlight = `Please summarize the highlights of the above article in easy-to-understand terms`
export const replylanguagePrompt = (language: string) => {
  return `Please write in ${language} language.`
}

export const articlePrompt = ({
  title,
  url,
  content,
  language,
  prompt,
}: {
  title: string
  url?: string
  content: string
  language: string
  prompt?: string
}) => {
  return `Title: ${title}
Content:  ${content}
Instructions: ${prompt ? prompt : articlePromptHighlight}
${replylanguagePrompt(language)}`
}

export const videoPrompt = ({
  title,
  transcript,
  language,
  prompt,
}: {
  title: string
  transcript: string
  language: string
  prompt: string
}) => {
  return `Title: ${title}
Transcript: ${transcript}
Instructions: ${prompt}
${replylanguagePrompt(language)}`
}

export const searchPrompt = ({
  query,
  results,
  language,
  prompt,
}: {
  query: string
  results: string
  language: string
  prompt: string
}) => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `Web search results: ${results}
Current date: ${year}/${month}/${day}
Instructions: ${prompt}
Query: ${query}
${replylanguagePrompt(language)}`
}
