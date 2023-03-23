import { getExtensionVersion, AppName } from '@/utils/utils'
import logo from '@/assets/img/logo.png'

function Header() {
  return (
    <>
      <nav className="glarity--flex glarity--flex-row glarity--justify-between glarity--items-center glarity--mt-5 glarity--px-2">
        <div className="glarity--flex glarity--flex-row glarity--items-center glarity--gap-2">
          <a href="https://glarity.app/" target="_blank" rel="noreferrer">
            <img
              src={logo}
              className="glarity--w-10 glarity--h-10 glarity--rounded-lg"
              style={{ 'vertical-align': 'middle' }}
            />
            <span className="font-semibold">
              {AppName} (v
              {getExtensionVersion()})
            </span>{' '}
          </a>
        </div>
        <div className="glarity--flex glarity--flex-row glarity--gap-3">
          <a href="https://discord.gg/JEJExVuWVM" target="_blank" rel="noreferrer">
            Discord
          </a>
          <a
            href="https://github.com/sparticleinc/chatgpt-google-summary-extension/issues"
            target="_blank"
            rel="noreferrer"
          >
            Feedback
          </a>
          <a href="https://twitter.com/Glarity_summary" target="_blank" rel="noreferrer">
            Twitter
          </a>
          <a
            href="https://github.com/sparticleinc/chatgpt-google-summary-extension"
            target="_blank"
            rel="noreferrer"
          >
            Source code
          </a>
        </div>
      </nav>
    </>
  )
}

export default Header
