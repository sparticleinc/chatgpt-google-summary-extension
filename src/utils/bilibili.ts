import { setParams } from 'gb-url'

export const getBiliVideoId = (url: string) => {
  const matches = url.match(/bilibili.com\/video\/(\w+)\//)
  const id = matches ? matches[1] : null
  // id = id ? id.replace(/^av/, '') : null

  return id
}

/**
 * Get trinscript
 */
export async function getBiliTranscript(url) {
  const id = getBiliVideoId(url)

  if (!id) {
    return null
  }

  let params = {
    aid: '',
    bvid: '',
  }
  params = id.startsWith('av')
    ? Object.assign(params, { aid: id.replace(/^av/, '') })
    : Object.assign(params, {
        bvid: id,
      })

  const videoUrl = setParams(params, 'https://api.bilibili.com/x/web-interface/view')
  const detail = await fetch(videoUrl)
  const detailJson = await detail.json()
  const trinscriptUrl = detailJson.data.subtitle.list[0].subtitle_url

  if (!trinscriptUrl) {
    return null
  }

  const trinscript = await fetch(trinscriptUrl.replace(/^http/g, 'https'))
  const trinscriptJson = await trinscript.json()
  console.log(trinscriptJson)
  return trinscriptJson?.body
}
