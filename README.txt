MIDNIGHT RADIO — DIGITAL CASSETTE / Mobile V3

这一版已经使用你提供的 player.png 作为“磁带机本体”。
不再用 CSS 重画播放器。

【网页结构】
player.png
    ↓
透明点击区域覆盖在图片上的真实按键位置
    ↓
上一首 / 播放 / 下一首 / A-B / Playlist

所以：
- 你看到的磁带机就是你提供的图片。
- 磁带机本体不会因为换歌而变化。
- 歌曲切换只改变下面的歌曲信息、封面，以及后方环境背景。
- A/B 会在网页上切换 A 面（01-06）与 B 面（07-12）。
- 播放按钮直接控制 audio。
- Playlist 和 Lyrics 是手机端下方弹出的玻璃面板。
- LRC 支持时间轴同步、自动滚动、点击歌词跳转。

【你的文件夹】
audio/01.mp3 ~ 12.mp3
covers/01.jpg ~ 12.jpg
Lyric/01.lrc ~ 12.lrc

【可选】
如果以后你想让每首歌有“专门的网页背景”，可以新增：
backgrounds/01.jpg
backgrounds/02.jpg
...
backgrounds/12.jpg

网页会优先使用 backgrounds/XX，再没有才使用对应的 covers/XX 作为模糊背景。
因此现在不用额外准备背景，也能实现“换歌 = 环境变化”。

【12首歌曲】
01 月光が少しルートを外れる
02 ネオンの海で揺れた
03 幻の街で
04 Afterglow
05 まだ青いままで
06 Afterglow Hotel
07 ビルのシルエット
08 Analog Veins
09 漂う夜の波
10 夢の花魁
11 夜の隙間に
12 響く鼓動だけ連れて

【注意】
如果直接在手机文件管理器里打开 HTML，某些 Android 浏览器对本地文件的 fetch/LRC 和音频权限可能有限制。
正式发布时放到 GitHub Pages 等静态网站后，audio / covers / Lyric 会按上面的相对路径正常读取。
