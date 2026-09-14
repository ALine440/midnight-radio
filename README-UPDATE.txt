MIDNIGHT RADIO — Digital Cassette Mobile Update

这是一版针对你当前 GitHub Pages 项目的更新文件。

本版修改：
1. 电子版彻底取消 A/B 面逻辑：播放列表不再显示 A SIDE / B SIDE；播放器不再有 A/B 功能或动态 SIDE 标记。
2. 播放界面增加一行“当前歌词”：播放时跟随 LRC 实时变化；点击这一行打开完整歌词并继续实时跳动。
3. 背景直接使用当前歌曲 cover 的 PNG，放大铺满播放器后方，并降低透明度；不再额外请求 backgrounds 文件。
4. ENTER 后不再提前加载 MP3；用户真正点击 PLAY 时才请求音频。
5. 歌词只加载当前歌曲的 LRC，不提前下载整张专辑音频。
6. 播放器 PNG 转成 WebP，player.webp 约 174 KB，用于明显降低手机首屏加载量。
7. 使用你提供的磁带盘制作左右两个透明 WebP 图层：播放时左右盘反向旋转，暂停时停在当前角度。
8. 封面固定使用 covers/01.png … covers/12.png，减少手机端无效的多格式请求。

上传到 GitHub 时：
- 用本包的 index.html 覆盖仓库根目录的 index.html
- 用本包的 script.js 覆盖仓库根目录的 script.js
- 用本包的 style.css 覆盖仓库根目录的 style.css
- 将 player.webp、reel-left.webp、reel-right.webp 上传到仓库根目录
- 原来的 player.png 可以保留，不会再被网页调用；如果想节省仓库空间，可以之后删除。
- audio、covers、Lyric 文件夹保持你现在的结构不变。

注意：你原始 player.png 图片本身已经印有 “SIDE A” 和 “A/B” 字样。此版本已经完全取消网页层面的 A/B 功能与动态 SIDE 标记，但没有破坏原始播放器图像。如果你还希望把原始图片里印刷的 “SIDE A” 和 “A/B” 视觉上也去掉，需要单独做一次图片修复。
