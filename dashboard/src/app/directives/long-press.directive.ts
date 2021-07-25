import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {

  pressing: boolean;
  longPressing: boolean;
  timeout: any;
  deBouce: any;
  interval: number;

  @Output()
  onLongPress = new EventEmitter();

  @Output()
  onShortPress = new EventEmitter();

  @Output()
  onLongPressing = new EventEmitter();

  @HostBinding('class.press')
  get press() { return this.pressing; }

  @HostBinding('class.longpress')
  get longPress() { return this.longPressing; }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: any) {
    this.pressing = true;
    this.longPressing = false;
    this.timeout = setTimeout(() => {
      this.longPressing = true;
      this.onLongPress.emit(event);
      this.interval = setInterval(() => {
        this.onLongPressing.emit(event);
      }, 50);
      event.preventDefault();
    }, 500);
  }

  @HostListener('touchend', ['$event'])
  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  endPress(event: any) {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
    if ((this.pressing === true) && (this.longPressing === false)) {
      clearTimeout(this.deBouce);
      this.deBouce = setTimeout(() => { this.onShortPress.emit(event); }, 50);
    }
    this.longPressing = false;
    this.pressing = false;
  }

}
