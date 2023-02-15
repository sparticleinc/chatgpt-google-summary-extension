# Glarity - Summary for Google with ChatGPT

Chrome extension to display ChatGPT summaries alongside Google search results and Youtube videos.

## Supported Websites

Google
Youtube

## Screenshot

![Screenshot](screenshots/extension.png?raw=true)

## Installation

[Install from Chrome Web Store](https://chrome.google.com/webstore/detail/summary-for-google-with-c/cmnlolelipjlhfkhpohphpedmkfbobjc)

[Install from Mozilla Add-on Store](https://addons.mozilla.org/zh-CN/firefox/addon/glarity/)

## Features

- Supports google search
- Supports youtube
- Supports the official OpenAI API
- Markdown rendering
- Code highlights
- Dark mode
- Copy to clipboard
- Switch languages

## Troubleshooting

### How to make it work in Brave

![Screenshot](screenshots/brave.png?raw=true)

Disable "Prevent sites from fingerprinting me based on my language preferences" in `brave://settings/shields`

## Build from source

1. Clone the repo
2. Install dependencies with `npm`
3. `npm run build`
4. Load `build/chromium/` or `build/firefox/` directory to your browser

### Packages

- [Chromium](packages/Summary%20for%20Google%20with%20ChatGPT-chromium.zip)
- [Firefox](packages/Summary%20for%20Google%20with%20ChatGPT-firefox.zip)

## Credit

This project is inspired by [wong2/chatgpt-google-extension](https://github.com/wong2/chatgpt-google-extension) & [qunash/chatgpt-advanced](https://github.com/qunash/chatgpt-advanced) & [YouTube Summary with ChatGPT](https://github.com/kazuki-sf/YouTube_Summary_with_ChatGPT)

## License

[GPL-3.0 license](LICENSE).
