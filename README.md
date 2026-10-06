# ZATO

[中文](README.zh-CN.md)

Two dark themes for GNOME, inspired by *Z.A.T.O. // I Love the World and Everything In It*.

**Night** pairs cool blue-grey surfaces with paper-white accents. **Dawn** pairs warm charcoal surfaces with amber accents.

| | Night | Dawn |
| --- | --- | --- |
| Desktop | ![Night desktop](previews/Night-Desktop.png) | ![Dawn desktop](previews/Dawn-Desktop.png) |
| Applications | ![Night applications](previews/Night-GTK.png) | ![Dawn applications](previews/Dawn-GTK.png) |

Version **1.0** · Fedora 44 · GNOME Shell 50.5 · Wayland

## Included

- GNOME Shell themes.
- GTK 3 and GTK 4/libadwaita colour companions.
- An optional desktop clock with the ZATO title and a Morse code line.

## Install

Install the [User Themes extension](https://extensions.gnome.org/extension/19/user-themes/), then run from the project directory:

```sh
mkdir -p "$HOME/.local/share/themes"
cp -R themes/ZATO-Night themes/ZATO-Dawn "$HOME/.local/share/themes/"
```

Choose **ZATO-Night** or **ZATO-Dawn** in GNOME Tweaks → Appearance → Shell.

For ZIP packages, extract the theme directory into `~/.local/share/themes/`.

- [GTK setup and restore](docs/GTK.md)
- [Desktop clock installation and settings](docs/WIDGET.md)

## Fonts

Optional fonts: **BoYa-Courier-Mix** and **KingHwaOldSong-GB**. They are not bundled; system fonts are used as a fallback.

## Build

Requires Python 3 and `glib-compile-schemas`.

```sh
python3 tools/build.py
python3 tools/build.py --check
python3 tools/build.py --release
```

Release archives and checksums are written to `dist/`.

## Remove

Select **Default** for the Shell theme, then delete the theme directories from `~/.local/share/themes/`. Restore GTK styling using the [GTK guide](docs/GTK.md), and uninstall the clock extension if installed.

## Credits and licence

- Visual inspiration: *Z.A.T.O. // I Love the World and Everything In It*.
- Screenshot wallpaper: Bilibili creator **@MaidCore_Town**.
- Base styling: [GNOME Shell](https://gitlab.gnome.org/GNOME/gnome-shell), GTK / Adwaita.
- Dock: [Dash to Dock](https://github.com/micheleg/dash-to-dock).

Original code and assets: [GPL-2.0-or-later](LICENSE). Third-party credits and licences: [THIRD_PARTY.md](THIRD_PARTY.md).
