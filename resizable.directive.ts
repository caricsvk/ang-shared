import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appResizable]'
})
export class ResizableDirective implements OnInit {

  @Input() resizableGrabWidth = 35;
  @Input() resizableMinWidth = 90;
  @Input() delay = 0;

  @Output() resized = new EventEmitter<Resize>();
  @Output() dropped = new EventEmitter<DragAndDrop>();
  @Output() clicked = new EventEmitter<Event>();
  @Output() action = new EventEmitter<ResizableAction>();
  @Output() dragged = new EventEmitter<{x: number, y: number}>();

  private resizing = false;
  private resizingVertical: null | 'top' | 'bottom' = null;
  private resizingHorizontal: null | 'left' | 'right' = null;
  private dragging: boolean;

  private initialParams: InitialParams;

  private mouseUpTouchLock = false;

  constructor(private el: ElementRef) {

    const nativeEl = el.nativeElement;

    const setupCursor = (event: Event) => {
      if (this.inResizeRegion(getClientX(event), getClientY(event))) {
        const verticalPole = this.resizingVertical === 'top' ? 'n' : this.resizingVertical === 'bottom' ? 's' : '';
        const horizontalPole = this.resizingHorizontal === 'left' ? 'w' : this.resizingHorizontal === 'right' ? 'e' : '';
        document.body.style.cursor = verticalPole + horizontalPole + '-resize';
      } else {
        document.body.style.cursor = 'move';
      }
    };

    const cancelEvent = (event: Event): boolean => {
      // if (event.stopPropagation) {
      //   event.stopPropagation();
      // }
      if (event.preventDefault) {
        event.preventDefault();
      }
      // event.cancelBubble = true;
      // event.returnValue = false;
      // return false;
      return true;
    };

    function restoreGlobalMouseEvents(): void {
      document.body.style.cursor = '';
    }

    const onClickStart = (event: MouseEvent, endEvent: 'mouseup' | 'touchend') => {
      if (this.mouseUpTouchLock) {
        // console.log('mouseUpTouchLock works!!!!');
        return false;
      } else {
        this.mouseUpTouchLock = true;
        setTimeout(() => this.mouseUpTouchLock = false, 180);
      }
      if (this.delay > 0) {
        const delayTimeout = setTimeout(() => {
          if (this.delay !== -1) { // -1 for cancel event
            onClickStartDelayed(event);
            document.removeEventListener(endEvent, onMouseup, true);
          }
        }, this.delay);
        const onMouseup = (mouseUpEvent: Event) => {
          clearTimeout(delayTimeout);
          this.clicked.emit(mouseUpEvent);
          document.removeEventListener(endEvent, onMouseup, true);
        };
        document.addEventListener(endEvent, onMouseup, true);
        return true;
      } else if (!this.delay) {
        return onClickStartDelayed(event);
      }
      return false;
    };

    const onClickStartDelayed = (event: MouseEvent) => {
      setupCursor(event);
      const result = cancelEvent(event);
      this.action.emit(ResizableAction.Initialized);

      document.addEventListener('mousemove', onMouseMove, true);
      document.addEventListener('touchmove', onMouseMove, true);
      document.addEventListener('mouseup', onClickEnd, true);
      document.addEventListener('touchend', onClickEnd, true);

      this.initialParams = new InitialParams(
        nativeEl.style.width,
        nativeEl.offsetWidth,
        nativeEl.style.height,
        nativeEl.offsetHeight,
        getClientX(event),
        getClientY(event),
        nativeEl.getBoundingClientRect()
      );
      return result;
    };

    const onMouseMove = (event: Event) => {
      cancelEvent(event);
      const clientX = getClientX(event);
      const clientY = getClientY(event);
      if (!this.resizing && !this.dragging) {
        if (this.inResizeRegion(this.initialParams.clientX, this.initialParams.clientY)) {
          this.resizing = true;
          this.action.emit(ResizableAction.Resizing);
        } else {
          this.dragging = true;
          this.action.emit(ResizableAction.Dragging);
        }
      }

      if (this.dragging) {
        const translateX = clientX - this.initialParams.clientX;
        const translateY = clientY - this.initialParams.clientY;
        nativeEl.style.transform = `translate(${translateX}px, ${translateY}px)`;
        this.dragged.emit({x: clientX, y: clientY});
      }

      if (this.resizing) {
        const horizontalScrollOffset = nativeEl.offsetTop - (this.initialParams.boundingBox.y || this.initialParams.boundingBox.top);
        if (this.resizingHorizontal === 'right') {
          const wid = clientX - nativeEl.offsetLeft;
          const newWidthVal = Math.max(this.resizableMinWidth, wid);
          nativeEl.style.width = (newWidthVal) + 'px';
        }
        if (this.resizingVertical === 'bottom') {
          const height = (clientY + horizontalScrollOffset) - nativeEl.offsetTop;
          const newHeightVal = Math.max(this.resizableMinWidth, height);
          nativeEl.style.height = (newHeightVal) + 'px';
        }
        let newPositionY;
        if (this.resizingVertical === 'top') {
          const diff = (clientY + horizontalScrollOffset) - nativeEl.offsetTop;
          const newHeightVal = Math.max(this.resizableMinWidth, this.initialParams.offsetHeight - diff);
          nativeEl.style.height = (newHeightVal) + 'px';
          newPositionY = newHeightVal !== this.resizableMinWidth ? diff : this.initialParams.offsetHeight - this.resizableMinWidth;
        }
        let newPositionX;
        if (this.resizingHorizontal === 'left') {
          const diff = clientX - nativeEl.offsetLeft;
          const newWidthVal = Math.max(this.resizableMinWidth, this.initialParams.offsetWidth - diff);
          nativeEl.style.width = (newWidthVal) + 'px';
          newPositionX = newWidthVal !== this.resizableMinWidth ? diff : this.initialParams.offsetWidth - this.resizableMinWidth;
        }
        if (newPositionX || newPositionY) {
          newPositionX = newPositionX || '0';
          newPositionY = newPositionY || '0';
          nativeEl.style.transform = `translate(${newPositionX}px, ${newPositionY}px)`;
        }
      }
    };

    const onClickEnd = (event: Event) => {
      restoreGlobalMouseEvents();
      this.action.emit(null);

      if (this.resizing) {
        this.resizing = false;
        this.resized.emit(
          new Resize(this.initialParams.offsetWidth, nativeEl.offsetWidth, this.initialParams.offsetHeight,
            nativeEl.offsetHeight, this.resizingHorizontal, this.resizingVertical)
        );
        nativeEl.style.width = this.initialParams.width;
        nativeEl.style.height = this.initialParams.weight;
      } else if (this.dragging) {
        this.dragging = false;
        this.dropped.emit(new DragAndDrop(
          getClientX(event), getClientY(event), this.initialParams.clientX, this.initialParams.clientY
        ));
      } else {
        this.clicked.emit(event);
      }
      nativeEl.style.transform = '';

      document.removeEventListener('mousemove', onMouseMove, true);
      document.removeEventListener('touchmove', onMouseMove, true);
      document.removeEventListener('mouseup', onClickEnd, true);
      document.removeEventListener('touchend', onClickEnd, true);
      this.resizing = false;
      this.resizingVertical = null;
      this.resizingHorizontal = null;
      this.dragging = undefined;

      return false;
    };

    const getClientX = (event: any) => {
      return event.type[0] === 't' ? (event.touches[0] || event.changedTouches[0]).clientX : event.clientX;
    };
    const getClientY = (event: any) => {
      return event.type[0] === 't' ? (event.touches[0] || event.changedTouches[0]).clientY : event.clientY;
    };

    nativeEl.addEventListener('mousedown', (event: any) => onClickStart(event, 'mouseup'), true);
    nativeEl.addEventListener('touchstart', (event: any) => onClickStart(event, 'touchend'), true);
    // nativeEl.addEventListener('mousemove', mouseMove, true);
  }

  ngOnInit(): void {
    // this.nativeEl.style['border-right'] = this.resizableGrabWidth + 'px solid darkgrey';
  }

  inResizeRegion(clientX: number, clientY: number): 'left' | 'right' | 'top' | 'bottom' | boolean {

    if (this.resizableGrabWidth === 0) {
      return false;
    }
    const element = this.el.nativeElement;
    const elementBoundingBox = element.getBoundingClientRect();
    const horizontalScrollOffset = element.offsetTop - (elementBoundingBox.y || elementBoundingBox.top);
    const right = element.clientWidth - clientX + element.offsetLeft < this.resizableGrabWidth;
    const left = clientX - element.offsetLeft < this.resizableGrabWidth;
    // XXX issue
    // console.log('isResizeRegion', element.clientWidth, '-', clientX, '+', element.offsetLeft, '<', this.resizableGrabWidth);
    this.resizingHorizontal = right ? 'right' : left ? 'left' : null;
    const top = clientY + horizontalScrollOffset - element.offsetTop < this.resizableGrabWidth;
    const bottom = element.clientHeight - (clientY + horizontalScrollOffset) + element.offsetTop < this.resizableGrabWidth;
    this.resizingVertical = top ? 'top' : bottom ? 'bottom' : null;
    return this.resizingHorizontal || this.resizingVertical;
  }

}

export class Resize {
  constructor(
    public originalWidth: number,
    public newWidth: number,
    public originalHeight: number,
    public newHeight: number,
    public horizontalDirectionStart: 'left' | 'right' | null,
    public verticalDirectionStart: 'bottom' | 'top' | null,
  ) {}
}

export class DragAndDrop {
  leftOffset: number;
  topOffset: number;
  constructor(
    public clientX: number,
    public clientY: number,
    initialClientX: number,
    initialClientY: number
  ) {
    this.leftOffset = clientX - initialClientX;
    this.topOffset = clientY - initialClientY;
  }
}

class InitialParams {
  constructor(
    public width: number,
    public offsetWidth: number,
    public weight: number,
    public offsetHeight: number,
    public clientX: number,
    public clientY: number,
    public boundingBox: any
  ) {
  }
}

export enum ResizableAction {
  Resizing, Dragging, Initialized
}
