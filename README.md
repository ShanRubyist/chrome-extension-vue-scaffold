## 说明
chrome 插件相关代码只要代码写到src目录

- src/manifest.json 不是直接复制,如果有 .env 中的环境变量 build 时会自动替换掉
- src/public 目录会原样复制到 dist 目录下
- index.html、content_script.js 和 service_worker.js 默认放在 src 目录，编译后在 dist 目录下
- popup.html 和 options.html 在 src/popup 和 src/options 目录下，编译后在 dist/src/popup 和 dist/src/options 目录下