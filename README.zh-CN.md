# Glarity - Summary for Google with ChatGPT

一个浏览器扩展实现在 Google 搜索结果旁边展示 ChatGPT 摘要。

## 支持搜索引擎

Google

## 截图

![Screenshot](screenshots/extension-zh-CN.png?raw=true)

## 安装

[Chrome 应用市场](https://chrome.google.com/webstore/detail/summary-for-google-with-c/cmnlolelipjlhfkhpohphpedmkfbobjc)

## 功能

- 支持 Google
- 支持 OpenAI 官方 API
- Markdown 格式渲染
- 代码高亮
- 暗色模式
- 复制结果
- 切换语言

## 常见问题

### 在 Brave 运行

![Screenshot](screenshots/brave.png?raw=true)

Disable "Prevent sites from fingerprinting me based on my language preferences" in `brave://settings/shields`

## 手动安装

1. Clone 代码
2. `npm i`
3. `npm run build`

### Chrome

1. 打开扩展管理窗口，chrome://extensions
2. 激活开发者模式
3. 载入 `build/chromium/`

### Firefox

1. 打开 `about:debugging#/runtime/this-firefox`
2. 临时载入附加组件
3. 载入 `build/firefox/`

## Credit

项目灵感： [wong2/chatgpt-google-extension](https://github.com/wong2/chatgpt-google-extension) & [qunash/chatgpt-advanced](https://github.com/qunash/chatgpt-advanced)

## License

[GPL-3.0 license](LICENSE).
