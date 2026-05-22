# AI小账房

移动端优先的 PWA 记账工具，用于记录学习 AI 赚钱过程中的投入、支出、收入和利润。

## 启动

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

生产构建产物输出到 `build/`。

## GitHub Pages 部署

项目已配置 GitHub Actions 自动部署到 GitHub Pages。推送到 `main` 分支后会自动构建并发布：

```text
https://ethant191.github.io/ai-/
```

首次使用时，在 GitHub 仓库的 `Settings` -> `Pages` 中确认构建来源为 `GitHub Actions`。

## 数据

所有记录保存在当前浏览器的 `localStorage` 中，键名为 `ai-xiao-zhangfang-records`。不需要登录、后台或云同步。

## PWA

已配置 `vite-plugin-pwa`、manifest、service worker 和手机桌面图标。生产构建后可通过浏览器的“添加到主屏幕/桌面”安装。
