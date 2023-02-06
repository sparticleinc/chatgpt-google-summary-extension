# Google Summary with ChatGPT(AD-Free)

A browser extension to display ChatGPT Summary search results alongside Google results

## Supported Search Engines

Google

## Screenshot

![Screenshot](screenshots/extension.png?raw=true)

## Features

- Supports google search
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

## Credit

This project is inspired by [wong2/chatgpt-google-extension](https://github.com/wong2/chatgpt-google-extension)

## License

[GPL-3.0 license](LICENSE).
