# ZATO · On the Line

An optional desktop clock for GNOME Shell 50. It sits above the wallpaper and below application windows, and hides in Overview and on the lock screen.

可选的 GNOME Shell 50 桌面时钟，位于壁纸上方、应用窗口下方，在概览与锁屏时隐藏。

## Install / 安装

From the project directory:

~~~sh
python3 tools/build.py --release
gnome-extensions install --force dist/ZATO-On-the-Line-1.0.shell-extension.zip
~~~

Log out and back in, then enable **ZATO · On the Line** in Extension Manager or GNOME Extensions.
重新登录后，在 Extension Manager 或 GNOME Extensions 中启用扩展。

## Settings / 设置

Open the extension's preferences to adjust:

- Horizontal and vertical position / 水平与垂直位置
- Scale and monitor / 缩放与显示器
- Opacity and background veil / 不透明度与暗色底板
- Seconds / 秒数显示

The clock uses local time and the system locale for the date. Screenshot times are fixed only in the preview session.
Optional fonts are listed in the project README. The SVG title uses a system serif font (Liberation Serif when available); no font data is embedded.

时钟使用本地时间，日期随系统语言显示；固定时间只用于截图。
可选字体见项目 README。SVG 标题使用系统衬线字体（优先 Liberation Serif），不嵌入字体数据。

## Remove / 移除

~~~sh
gnome-extensions disable zato-on-the-line@tagbug.github.io
gnome-extensions uninstall zato-on-the-line@tagbug.github.io
~~~
