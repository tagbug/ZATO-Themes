/* SPDX-License-Identifier: GPL-2.0-or-later */
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GnomeDesktop from 'gi://GnomeDesktop';
import St from 'gi://St';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {SIZE, SUBTITLE, placement, monitorIndex, clockParts, nextSecondDelay} from './core.js';

export default class ZatoLetter extends Extension {
    enable() {
        this._connections = [];
        this._timer = null;
        this._settings = this.getSettings();
        this._actor = new St.Widget({
            style_class: 'zato-letter',
            layout_manager: new Clutter.FixedLayout(),
            width: SIZE.width,
            height: SIZE.height,
            reactive: false,
            can_focus: false,
        });
        this._title = this._asset('wordmark.svg', 24, 20, 392, 76);
        this._subtitle = this._label(SUBTITLE, 'zato-letter-subtitle', 25, 99);
        this._clock = this._label('', 'zato-letter-clock', 22, 122);
        this._seconds = this._label('', 'zato-letter-seconds', 362, 151);
        this._date = this._label('', 'zato-letter-date', 25, 244);
        this._rule = new St.Widget({style_class: 'zato-letter-rule',
            width: 390, height: 1, reactive: false});
        this._rule.set_position(25, 277);
        this._actor.add_child(this._rule);
        this._morse = this._asset('signal.svg', 25, 290, 390, 12);

        // Keep the widget above the wallpaper and below application windows.
        global.window_group.add_child(this._actor);
        this._restack();
        this._wallClock = new GnomeDesktop.WallClock();
        this._connect(this._wallClock, 'notify::clock', () => this._tick());
        this._connect(this._settings, 'changed', () => {
            this._applySettings();
            this._tick();
        });
        this._connect(Main.layoutManager, 'monitors-changed', () => this._place());
        this._connect(global.display, 'workareas-changed', () => this._place());
        this._connect(global.display, 'restacked', () => this._restack());
        this._connect(Main.overview, 'showing', () => this._syncVisibility());
        this._connect(Main.overview, 'hidden', () => this._syncVisibility());
        this._connect(Main.sessionMode, 'updated', () => this._syncVisibility());
        this._applySettings();
        this._tick();
    }

    _connect(object, signal, callback) {
        this._connections.push([object, object.connect(signal, callback)]);
    }

    _asset(name, x, y, width, height) {
        const file = this.dir.get_child('assets').get_child(name);
        const widget = new St.Widget({
            width, height, reactive: false,
            style: 'background-image: url("' + file.get_uri() +
                '"); background-size: contain;',
        });
        widget.set_position(x, y);
        this._actor.add_child(widget);
        return widget;
    }

    _label(text, styleClass, x, y) {
        const label = new St.Label({text, style_class: styleClass, reactive: false});
        label.set_position(x, y);
        this._actor.add_child(label);
        return label;
    }

    _applySettings() {
        this._seconds.visible = this._settings.get_boolean('show-seconds');
        this._actor.opacity = Math.round(this._settings.get_double('opacity') * 255);
        this._actor.set_style(this._settings.get_boolean('veil')
            ? 'background-color: rgba(25,28,34,0.66);'
            : 'background-color: transparent;');
        this._place();
    }

    _place() {
        const count = Main.layoutManager.monitors.length;
        const index = monitorIndex(count, Main.layoutManager.primaryIndex,
            this._settings.get_int('monitor'));
        this._hasMonitor = index >= 0;
        if (this._hasMonitor) {
            const area = Main.layoutManager.getWorkAreaForMonitor(index);
            const pos = placement(area, this._settings.get_double('x-position'),
                this._settings.get_double('y-position'),
                this._settings.get_double('scale'));
            this._actor.set_scale(pos.scale, pos.scale);
            this._actor.set_position(pos.x, pos.y);
        }
        this._syncVisibility();
    }

    _restack() {
        if (this._actor?.get_parent() === global.window_group &&
            Main.layoutManager._backgroundGroup?.get_parent() === global.window_group)
            global.window_group.set_child_above_sibling(
                this._actor, Main.layoutManager._backgroundGroup);
    }

    _syncVisibility() {
        if (this._actor)
            this._actor.visible = Boolean(this._hasMonitor) &&
                !Main.overview.visible && !Main.sessionMode.isLocked;
    }

    _tick() {
        if (this._timer !== null) {
            GLib.Source.remove(this._timer);
            this._timer = null;
        }
        if (!this._actor)
            return;
        const parts = clockParts(GLib.DateTime.new_now_local());
        this._clock.text = parts.time;
        this._seconds.text = parts.seconds;
        this._date.text = parts.date;
        if (this._settings.get_boolean('show-seconds')) {
            this._timer = GLib.timeout_add(GLib.PRIORITY_DEFAULT,
                nextSecondDelay(GLib.get_real_time() / 1000), () => {
                    this._timer = null;
                    this._tick();
                    return GLib.SOURCE_REMOVE;
                });
        }
    }

    disable() {
        if (this._timer !== null && this._timer !== undefined)
            GLib.Source.remove(this._timer);
        this._timer = null;
        for (const [object, id] of this._connections ?? [])
            object.disconnect(id);
        this._connections = [];
        this._wallClock = null;
        this._actor?.destroy();
        this._actor = null;
        this._settings = null;
        this._title = this._subtitle = this._clock = this._seconds = null;
        this._date = this._rule = this._morse = null;
    }
}
