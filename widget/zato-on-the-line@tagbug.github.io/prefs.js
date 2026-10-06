/* SPDX-License-Identifier: GPL-2.0-or-later */
import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ZatoPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        window._settings = settings;
        const page = new Adw.PreferencesPage({
            title: 'ZATO · On the Line',
            icon_name: 'preferences-system-time-symbolic',
        });
        window.add(page);
        const layout = new Adw.PreferencesGroup({
            title: '布局',
            description: '小组件位于应用窗口下方，在概览和锁屏中隐藏。',
        });
        page.add(layout);
        const spin = (title, subtitle, key, lower, upper, step, digits) => {
            const row = new Adw.SpinRow({
                title, subtitle,
                adjustment: new Gtk.Adjustment({
                    lower, upper, step_increment: step, page_increment: step * 5,
                }),
                digits,
            });
            settings.bind(key, row, 'value', Gio.SettingsBindFlags.DEFAULT);
            layout.add(row);
        };
        spin('水平位置', '0 为左侧，1 为右侧', 'x-position', 0, 1, 0.01, 2);
        spin('垂直位置', '0 为顶部，1 为底部', 'y-position', 0, 1, 0.01, 2);
        spin('缩放', '小屏幕会自动缩小，保持在屏幕内', 'scale', 0.55, 1.8, 0.05, 2);
        spin('不透明度', '标题、时钟与背景的整体可见度', 'opacity', 0.2, 1, 0.05, 2);
        spin('显示器', '-1 跟随主显示器，0 为第一块显示器', 'monitor', -1, 15, 1, 0);
        const appearance = new Adw.PreferencesGroup({title: '外观'});
        page.add(appearance);
        for (const [key, title, subtitle] of [
            ['show-seconds', '显示秒数', '关闭时由系统时钟通知更新，减少持续唤醒'],
            ['veil', '微暗底色', '提高明亮壁纸上的文字对比度'],
        ]) {
            const row = new Adw.SwitchRow({title, subtitle});
            appearance.add(row);
            settings.bind(key, row, 'active', Gio.SettingsBindFlags.DEFAULT);
        }
    }
}
