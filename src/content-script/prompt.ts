import { ProviderConfigs } from '@/config'
import { truncateTextByToken } from '@/utils/utils'


export function getSummaryPrompt(transcript = '', providerConfigs?: ProviderConfigs, isTruncate = true) {

  const text = transcript
    ? transcript
      .replace(/&#39;/g, "'")
      .replace(/&gt;/g, "'")
      .replace(/(\r\n)+/g, '\r\n')
      .replace(/(\s{2,})/g, ' ')
      .replace(/^(\s)+|(\s)$/g, '')
      .replace(/\.+/g, ".")
      .replace(/\[[^\]\d]*([^\]\d\s]*)[^\]\d]*\]/g, (match, p1) => {
        const numericContent = p1.replace(/\D/g, '')
        return numericContent.length > 0 ? `[${numericContent}]` : ''
      })
      .replace(/\[\]/g, '')
      .replace(/<[^>]+>/g, '')
    : ''

  if (!isTruncate) {
    return text
  }

  return truncateTextByToken({
    text,
    providerConfigs,
  })
}

// Seems like 15,000 bytes is the limit for the prompt
// const textLimit = 15000
// // const limit = 1020
// const limit = 2800
// const apiLimit = 2800

export function textToBinaryString(str) {
  const escstr = decodeURIComponent(encodeURIComponent(escape(str)))
  const binstr = escstr.replace(/%([0-9A-F]{2})/gi, function (match, hex) {
    const i = parseInt(hex, 16)
    return String.fromCharCode(i)
  })
  return binstr
}