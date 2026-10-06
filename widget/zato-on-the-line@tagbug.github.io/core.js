/* SPDX-License-Identifier: GPL-2.0-or-later */
/* Widget layout and clock formatting. */
export const SIZE = Object.freeze({width: 440, height: 320});
export const SUBTITLE = 'I Love the World and Everything In It';

function clamp(value, min, max, fallback) {
    const number = Number(value);
    return Math.max(min, Math.min(max, Number.isFinite(number) ? number : fallback));
}

export function placement(area, xFraction, yFraction, requestedScale) {
    // Position within the remaining space after scaling.
    const width = Math.max(1, Number(area.width) || 1);
    const height = Math.max(1, Number(area.height) || 1);
    const scale = Math.min(clamp(requestedScale, 0.55, 1.8, 1),
        width / SIZE.width, height / SIZE.height);
    const x = (Number(area.x) || 0) +
        Math.round((width - SIZE.width * scale) * clamp(xFraction, 0, 1, 0.04));
    const y = (Number(area.y) || 0) +
        Math.round((height - SIZE.height * scale) * clamp(yFraction, 0, 1, 0.12));
    return {x, y, scale};
}

export function monitorIndex(count, primary, requested) {
    if (count <= 0)
        return -1;
    if (Number.isInteger(requested) && requested >= 0 && requested < count)
        return requested;
    return primary >= 0 && primary < count ? primary : 0;
}

export function clockParts(dateTime) {
    return {
        time: dateTime.format('%H:%M'),
        seconds: dateTime.format('%S'),
        date: dateTime.format('%Y.%m.%d  /  %A'),
    };
}

export function nextSecondDelay(realTimeMs) {
    return 1000 - ((Math.floor(realTimeMs) % 1000 + 1000) % 1000) + 5;
}
