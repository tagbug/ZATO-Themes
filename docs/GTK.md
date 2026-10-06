# GTK setup / GTK 设置

Install the theme directories first. Choose the same variant for Shell and GTK.
先安装主题目录，Shell 与 GTK 使用同一个版本。

## GTK 3

Select a variant and save the current settings:

```sh
theme=ZATO-Night # or ZATO-Dawn
backup="$HOME/.local/state/zato/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup"
gsettings get org.gnome.desktop.interface gtk-theme > "$backup/gtk-theme"
gsettings get org.gnome.desktop.interface color-scheme > "$backup/color-scheme"
gsettings set org.gnome.desktop.interface gtk-theme "$theme"
gsettings set org.gnome.desktop.interface color-scheme prefer-dark
```

Keep the backup path for restoration. Reopen applications after changing the theme.
记录备份目录，便于还原。修改后重新打开应用。

## GTK 4 / libadwaita

Many libadwaita applications do not use `gtk-theme`. The colour companion can be loaded through the user GTK 4 CSS.
It changes colours and selected title/button fonts, while retaining native widget geometry.
This file affects GTK 4 applications for your user account.

不少 libadwaita 应用不会使用 `gtk-theme`，需要从用户 GTK 4 CSS 加载配色。
它调整颜色和部分标题、按钮字体，沿用原生控件尺寸。该文件会影响当前用户的 GTK 4 应用。

Continue in the same shell, with `theme` and `backup` set above:

```sh
mkdir -p "$HOME/.config/gtk-4.0"
if [ -e "$HOME/.config/gtk-4.0/gtk.css" ]; then
    cp -p "$HOME/.config/gtk-4.0/gtk.css" "$backup/gtk4.css"
else
    touch "$backup/gtk4-absent"
fi
printf '@import url("file://%s/.local/share/themes/%s/gtk-4.0/palette.css");\n' \
    "$HOME" "$theme" > "$HOME/.config/gtk-4.0/gtk.css"
```

This replaces `gtk.css` after backing it up. If you already use custom GTK CSS, edit that file instead and add the import at the top.
Keep only one ZATO palette import active.

上述命令会备份后替换 `gtk.css`。已有其他自定义样式时，建议手动编辑，将 import 放在文件开头，并只启用一份 ZATO 配色。

Applications with their own styles can override these colours. Qt applications and browser content are outside this companion's scope.
Flatpak applications may not be able to access the theme file from their sandbox.

应用自身的样式可能覆盖配色。该文件不处理 Qt 应用或浏览器网页内容。
Flatpak 沙箱中的应用可能无法读取主题文件。

## Restore / 还原

Set `backup` to the saved backup directory, then run:

```sh
gsettings set org.gnome.desktop.interface gtk-theme "$(cat "$backup/gtk-theme")"
gsettings set org.gnome.desktop.interface color-scheme "$(cat "$backup/color-scheme")"
if [ -f "$backup/gtk4.css" ]; then
    cp -p "$backup/gtk4.css" "$HOME/.config/gtk-4.0/gtk.css"
elif [ -f "$backup/gtk4-absent" ]; then
    rm -f "$HOME/.config/gtk-4.0/gtk.css"
fi
```

If you have edited GTK CSS since the backup, merge your changes before restoring the saved file.
如果备份后又修改过 GTK CSS，先合并需要保留的样式，再还原。
