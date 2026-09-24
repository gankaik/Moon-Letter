# 月笺 · Moon Letter

一份可互动的中秋月夜礼物：月升、玉兔接月饼、回忆档案、寄月愿望与月光信件。所有愿望和进度只保存在浏览器本地。

## 安装与运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

若要在有日志功能的生产环境运行：

```bash
npm run build
npm run start
```

愿望会按 JSON Lines 格式写入服务器工作目录的 `data/wishes.log`，每行包括 `content`、`submittedAt` 和 `receivedAt`。请在服务器上确保此目录可写，并将日志目录排除在源码仓库以外。

## 个性化

- 名字、年份与标题：编辑 `src/config/site.ts`
- 入口用户名、密码和提示：编辑 `src/config/access.ts`（这是礼物入口，不是服务端安全验证）
- 最终信件和隐藏愿望：编辑 `src/config/letter.ts`
- 回忆内容与照片清单：编辑 `src/config/memories.ts`
- 将照片放到 `public/images/memories/`，然后把 `image` 改成如 `/images/memories/photo.jpg`。
- 小游戏目标、时长、分数：编辑 `src/config/game.ts`
- 背景音乐：将音频放到 `public/audio/bgm/`，并在 `src/config/music.ts` 修改路径。找不到音频时页面会安静地继续运行。
- 终章音乐：将第二首完整歌曲放到 `public/audio/bgm/moon-letter-finale.mp3`，或在 `src/config/music.ts` 修改 `finale` 路径。终章可选择“欣赏音乐”播放它。

开发时加 `?dev=true` 可显示章节跳转按钮。

## 素材目录

`public/images/` 下预留了 `memories`、`moon`、`rabbit`、`decorations`；音频放在 `public/audio/bgm` 或 `public/audio/sfx`，纹理放在 `public/textures`。

## 部署

### Vercel

将仓库推送至 GitHub，导入 Vercel。框架选择 Vite，构建命令为 `npm run build`，输出目录为 `dist`。注意：Vercel 的本地文件系统不适合持久保存愿望日志；若要使用日志功能，请将 `/api/wishes` 接到持久数据库或部署到可写磁盘的 Node 服务器。

### GitHub Pages

在 `vite.config.ts` 中按仓库名加 `base: '/仓库名/'`，执行 `npm run build`，将 `dist` 发布到 GitHub Pages（可用 Actions 或 `gh-pages`）。若发布在 `username.github.io` 根仓库，不需要设置 `base`。GitHub Pages 为纯静态托管，不能写入愿望日志。

### 带愿望日志的部署

在有持久磁盘的 Node 服务器上运行：

```bash
npm install
npm run build
npm run start
```

服务监听 `4173` 端口（可通过环境变量 `PORT` 修改），愿望会附加保存至 `data/wishes.log`。请限制日志文件的服务器访问权限，因为其中包含私人内容。
