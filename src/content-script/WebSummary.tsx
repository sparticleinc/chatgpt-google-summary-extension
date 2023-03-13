import { useState } from 'preact/hooks'
import { Note, Description, Button, Divider, Card, Text, Link } from '@geist-ui/core'
import { XCircleFillIcon } from '@primer/octicons-react'
import Browser from 'webextension-polyfill'
import logo from '../logo-white.png'

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
        <div className="glarity--summary__card glarity--shadow-xl">
          <Card shadow width="100%">
            <Card.Content>
              <Text b my={0}>
                <Button
                  type="secondary"
                  className="glarity--chatgpt--tips--close"
                  iconRight={<XCircleFillIcon />}
                  auto
                  inline
                  onClick={onSwitch}
                />
              </Text>
            </Card.Content>
            <Divider my={0} />
            <Text h4 my={0}>
              Geist UI React
            </Text>
            <Text>Modern and minimalist React UI library.</Text>
            <Card.Footer>
              <Link color target="_blank" href="https://github.com/geist-org/geist-ui">
                Visit source code on GitHub.
              </Link>
            </Card.Footer>
          </Card>
        </div>
      ) : (
        <Button className="glarity--summary__btn" type="success" auto inline onClick={onSwitch}>
          <img src={logo} className="glarity--w-5 glarity--h-5 glarity--rounded-sm" />
        </Button>
      )}
    </>
  )
}

export default WebSummary
