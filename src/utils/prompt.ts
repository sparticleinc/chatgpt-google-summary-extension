import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";

export const articlePromptHighlight = `Please use the above to summarize the highlights.`
export const pagePromptHighlight = `Summarize the highlights of the content and output a useful summary in a few sentences.`
export const googlePatentsPromptHighlight = `Please summarize the highlights of the above article in easy-to-understand terms`
export const pageSummaryPromptHighlight = `Summarize the highlights of the content and output a useful summary in a few sentences.`
export const videoSummaryPromptHightligt = `Your output should use the following template:
### Summary
### Highlights
- [Emoji] Bulletpoint

Use up to 3 brief bullet points to summarize the content below, Choose an appropriate emoji for each bullet point. and summarize a short highlight: {{Title}} {{Transcript}}.`
export const searchPromptHighlight_bak = `Using the provided web search results, write a comprehensive reply to the given query. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject. and at last please provide your own insights.`
export const searchPromptHighlight = `Using the provided web search results, write a comprehensive reply to the given query.Make sure to cite results using [[number](URL)] notation after the reference.If the query is a company name, write the answer using only the contents of [1]. Otherwise if the provided search results refer to multiple subjects with the same name, write separate answers for each subject. and at last please provide your own insights.`

export const commentSummaryPromptHightligt_bak = (rate: boolean) => {
  return rate
    ? `Give a summary of the reviews of this item according to the above, and add a rating.Your output should use the following template:
#### Rating
#### Review Summary`
    : `Summarize based on the comments above.Your output should use the following template:
#### Comment Summary`
}

export const commentSummaryPromptHightligt = `Give a concise summary of the review content (perhaps a video, topic, or product), including both positive and negative points. If the review is about an item, give the pros, cons, ratings, and recommendations for buying the item.`

export const githubPromptHighlight = `Summarize the highlights of the content and output a useful summary in a few sentences,usage and download address not included.`

export const customizePrompt = `Title: "{{Title}}"
Transcript: "{{Transcript}}"`

export const customizePromptSearch = `Web search results: {{Search Results}}`

export const customizePromptPage = `Content: {{content}}`

export const customizePromptComment = `Comments: {{comments}}`

export const customizePrompt1 = `Your output should use the following template:
#### Summary
#### Highlights
- [Emoji] Bulletpoint

Your task is to summarise the text I have given you in up to seven concise bullet points, starting with a short highlight. Choose an appropriate emoji for each bullet point. Use the text above: {{Title}} {{Transcript}}.
`

export const customizePromptClickbait = `What is the clickbait likelihood of the title and transcript for this video? Please provide a score and a brief explanation for your score, the clickbait score is up to 10, if the clickbait score is less than 5 then answer: 👍 Clickbait Score : Low, otherwise answer: 👎 Clickbait Score : High.

Example response:
> The lower the Clickbait score, the better.
#### Clickbait Score:
👍 Clickbait Score : Low or 👎 Clickbait Score : High
#### Explanation:
The title is a bit exaggerated.
`
export const customizePromptCommentAmazon = `Give a summary of the reviews of this item according to the below, and pros, cons, ratings.Your output should use the following template:
#### Rating
#### Review Summary
#### Pros
#### Cons
`

export const customizePromptCommentYoutube = `Give a summary of the comments for this video, including the different points of view.`

export const customizePromptQA = `List the highlights of the content in the form of Q&As, no less than 3 Q&As. Here is an example of the template output you should use:
##### Who are you?
I am AI.

Be sure not to write out the template examples.`

export const customizePromptBulletPoints = `Summarize the below content in 3 bullet points.`
export const customizePromptTweet = `Use the below content to summarise a catchy tweet bring #topics and add it if you have the URL.The word count must not exceed 140 characters.`

export const customizePromptSummarizeHighlights = `Summarize the below content highlights.`

export const customizePromptKeyTakeaways = `What's key takeaways from the below?`

export const customizePromptExtractGist = `Extract the gist of the below.`

export const replylanguagePrompt = (language: string) => {
  return `
Please write in ${language} language.`
}

export const translatePrompt = (language: string) => {
  return `Please translate the below into ${language} language.`
}

export const explainPrompt = `Explain the below using easy to understand syntax.`

export const importantListPrompt = `Summarize this content into a bulleted list of the most important information.`

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
  return `Instructions: ${prompt ? prompt : articlePromptHighlight}
${replylanguagePrompt(language)}
Title: ${title}
Content:  ${content}`
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
  return `Instructions: ${prompt}
${replylanguagePrompt(language)}
Title: ${title}
Transcript: ${transcript}`
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

  return `Instructions: ${prompt}
${replylanguagePrompt(language)}
Query: ${query}
Current date: ${year}/${month}/${day}
Web search results: ${results}`
}

export const pageSummaryPrompt = ({
  content,
  language,
  prompt,
  url,
  isTranslation,
}: {
  content: string
  language: string
  prompt?: string
  url?: string | null
  isTranslation?: boolean
}) => {
  return `Instructions: ${prompt ? prompt : pageSummaryPromptHighlight}
${isTranslation ? '' : replylanguagePrompt(language)}
Content: ${content}
${url ? `URL: ${url}` : ''}`
}

export const commentSummaryPrompt = ({
  content,
  language,
  prompt,
  rate,
  url,
}: {
  content: string
  language: string
  prompt?: string
  rate?: string | null
  url?: string | null
}) => {
  const isRate = !!(rate && rate !== '-1')
  return `Instructions: ${prompt ? prompt : commentSummaryPromptHightligt}
${replylanguagePrompt(language)}
Comments: ${content}
${url ? `URL: ${url}` : ''}
${isRate ? 'Customer Ratings:' + rate : ''}`
}

export const selectionSummaryPrompt = ({
  content,
  language,
  prompt,
  url,
  isTranslation,
}: {
  content: string
  language: string
  prompt?: string
  url?: string | null
  isTranslation?: boolean
}) => {
  return `${prompt ? prompt : pageSummaryPromptHighlight}
${isTranslation ? '' : replylanguagePrompt(language)}
Content: ${content}
${url ? `URL: ${url}` : ''}`
}

export const qaPrompt = (lang: string) => {
  return ChatPromptTemplate.fromPromptMessages([
    HumanMessagePromptTemplate.fromTemplate(
      `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.

{context}

Question: {question}
Write in "${lang}" language.
Helpful Answer:`
    )])
}

export const qaSummaryPrompt = ({ question, answerList, language }: { question: string, answerList: string, language: string }) => {
  return `Answer list:  ${answerList}
Query: ${question}
Instructions: Use the {Answer list} content to first remove useless information. If there is an answer in {answer list} that closely matches {Query} return this answer directly, otherwise summarise the answer in as much detail as possible according to {query}.
Remove the words "Answer:" or similar from the answers.
${replylanguagePrompt(language)}
`
}

export const qaSummaryPrompt_bak = ({ question, answerList, language }: { question: string, answerList: string, language: string }) => {
  return `Answer list:  ${answerList}
Query: ${question}
Instructions: Use the following portion of a long document to see if any of the text is relevant to answer the question. Return any relevant text verbatim.
If there is relevant content, the relevant content should include the content before and after it.If no relevant text is found.
${replylanguagePrompt(language)}
`
}