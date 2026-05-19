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

## 部署

把项目推送到 GitHub 后，可在 Netlify 选择从 GitHub 导入仓库，构建设置使用：

```text
Build command: npm run build
Publish directory: dist
```

之后每次修改代码并推送到 GitHub，Netlify 会自动重新构建并更新线上站点。

## 数据

所有记录保存在当前浏览器的 `localStorage` 中，键名为 `ai-xiao-zhangfang-records`。不需要登录、后台或云同步。

## PWA

已配置 `vite-plugin-pwa`、manifest、service worker 和手机桌面图标。生产构建后可通过浏览器的“添加到主屏幕/桌面”安装。
