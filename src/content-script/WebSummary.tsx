import { useState } from 'preact/hooks'
import { Note, Description, Button, Divider, Card, Text, Link } from '@geist-ui/core'
import { XCircleFillIcon, CopyIcon, ShareIcon } from '@primer/octicons-react'
import Browser from 'webextension-polyfill'
import logoWhite from '../logo-white.png'
import logo from '../logo.png'

function WebSummary(props) {
  const [showCard, setShowCard] = useState(false)

  const onBack = () => {
    Browser.runtime.sendMessage({
      type: 'GO_BACK',
    })
  }

  const onSwitch = () => {
    setShowCard((state) => {
      return !state
    })
  }

  return (
    <>
      {showCard ? (
        <div className="glarity--summary__card">
          <Card shadow width="100%">
            <Card.Content className="glarity--flex glarity--justify-between">
              <div className="glarity--summary__card--title">
                <img src={logo} /> Glarity Summary
              </div>

              <Button
                type="secondary"
                className="glarity--summary__card--close"
                iconRight={<XCircleFillIcon />}
                auto
                inline
                onClick={onSwitch}
              />
            </Card.Content>

            <Divider my={0} />

            <Card.Content className="glarity--summary__card--content">
              Glarity - Google / YouTube 摘要扩展 Glarity 是一个谷歌 / YouTube 摘要扩展，它使用
              ChatGPT 提供了搜索结果和视频的摘要，并支持
              Yahoo!ニュース、PubMed、PMC、NewsPicks、Github、Nikkei、Bing 和
              Google专利搜索。此外，它还支持官方的 OpenAI API 和 ChatGPT Plus。扩展还提供了 Markdown
              渲染、代码高亮、暗模式、复制到剪贴板和切换语言等功能。您可以从 Chrome 网上应用店或
              Mozilla 应用商店安装该扩展。如果您遇到问题，请参阅故障排除指南。此项目是
              wong2/chatgpt-google-extension 的分支，借鉴了 qunash/chatgpt-advanced 和 YouTube
              Summary with ChatGPT 的代码。此项目使用 GPL-3.0 许可证。
            </Card.Content>

            <Card.Footer className="glarity--justify-end">
              <Button scale={0.25} type="success" ghost icon={<CopyIcon />} auto>
                Copy
              </Button>
              {/* <Button scale={0.25} type="secondary" ghost icon={<ShareIcon />} auto>
                Share
              </Button> */}
            </Card.Footer>
          </Card>
        </div>
      ) : (
        <Button
          className={(styles('styles'), 'glarity--summary__btn')}
          type="success"
          auto
          inline
          onClick={onSwitch}
        >
          <img src={logoWhite} className="glarity--w-5 glarity--h-5 glarity--rounded-sm" />
        </Button>
      )}
    </>
  )
}

export default WebSummary
