/**
 * handles keydown event in a javascript application, dispatching new custom keydown events
 */

import { listen, dispatch } from "@brendangooch/utils";

export class KeyboardInput {

    public static THROTTLE_DURATION: number = 200;
    private static TARGET_CODES: string[] = ['Numpad2', 'Numpad4', 'Numpad6', 'Numpad8', 'PageUp', 'PageDown', 'Home', 'End', 'Insert', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Space', 'Escape', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Backspace', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period'];

    private isOn: boolean = false;
    private throttled: boolean = false;
    private enabled: string[] = [];
    private code: string = '';
    private translated: string = '';
    private eventName: string = '';
    private ctrl: boolean = false;
    private shift: boolean = false;
    private alt: boolean = false;

    public constructor() {
        listen('keydown', this.keydown.bind(this));
    }

    public turnOn(): void {
        this.isOn = true;
    }

    public turnOff(): void {
        this.isOn = false;
    }

    public enable(enabled: string[]): void {
        this.enabled = enabled;
    }

    private keydown(e: KeyboardEvent): void {
        this.code = e.code;
        if (this.canProcess) {
            e.preventDefault();
            this.ctrl = e.ctrlKey;
            this.shift = e.shiftKey;
            this.alt = e.altKey;
            this.toLowercase();
            this.translateCode();
            this.setEventName();
            this.dispatchEvent();
            this.throttle();
        }
    }

    private get canProcess(): boolean {
        return this.isOn && !this.throttled && KeyboardInput.TARGET_CODES.includes(this.code);
    }

    private toLowercase(): void {
        this.translated = this.code.toLowerCase();
    }

    private translateCode(): void {
        this.translateKey();
        this.translateArrows();
        this.translateDigits();
        this.translateSpacebar();
        this.translatePeriod();
        this.translateNumpad();
    }

    private translateKey(): void {
        this.translated = this.translated.replace('key', '');
    }

    private translateArrows(): void {
        this.translated = this.translated.replace('arrow', '');
    }

    private translateDigits(): void {
        this.translated = this.translated.replace('digit', '');
    }

    // ignore backspace
    private translateSpacebar(): void {
        if (this.translated === 'space') this.translated = this.translated.replace('space', 'spacebar');
    }

    private translatePeriod(): void {
        this.translated = this.translated.replace('period', 'fullstop');
    }

    private translateNumpad(): void {
        switch (this.translated) {
            case 'numpad2':
                this.translated = 'down';
                break;
            case 'numpad4':
                this.translated = 'left';
                break;
            case 'numpad6':
                this.translated = 'right';
                break;
            case 'numpad8':
                this.translated = 'up';
                break;
        }
    }

    private setEventName(): void {
        this.eventName = `${this.ctrlString}${this.shiftString}${this.altString}${this.keyString}-pressed`;
    }

    private get ctrlString(): string {
        return (this.ctrl) ? 'ctrl-' : '';
    }

    private get shiftString(): string {
        return (this.shift) ? 'shift-' : '';
    }

    private get altString(): string {
        return (this.alt) ? 'alt-' : '';
    }

    private get keyString(): string {
        if (this.isExcluded || this.isCtrlShiftAlt) return this.translated;
        if (this.isNumber) return `number-${this.translated}`;
        return `${this.translated}-key`;
    }

    private get isCtrlShiftAlt(): boolean {
        return this.ctrl || this.shift || this.alt;
    }

    private get isNumber(): boolean {
        return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(this.translated);
    }

    private get isExcluded(): boolean {
        return ['escape', 'spacebar', 'enter', 'backspace', 'insert', 'delete', 'home', 'end', 'pageup', 'pagedown'].includes(this.translated);
    }

    private dispatchEvent(): void {
        if (this.enabled.includes(this.eventName)) dispatch(this.eventName);
    }

    private throttle(): void {
        this.throttled = true;
        setTimeout(() => {
            this.throttled = false;
        }, KeyboardInput.THROTTLE_DURATION);
    }

}