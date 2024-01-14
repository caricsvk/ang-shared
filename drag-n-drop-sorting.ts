import { ResizableAction } from './resizable.directive';

export class DragAndDropSorting<T> {

  private draggedItem: T;
  private initialPositionTopLeft: Coordinates;
  private currentPositionTopLeft: Coordinates;
  private initialEvent: Coordinates = null;

  constructor(private items?: T[]) {
  }

  isBeingDragged() {
    return !!this.draggedItem;
  }

  dragStarted(event: ResizableAction, element: HTMLElement, draggedItem: T) {
    if (event === ResizableAction.Dragging) {
      element.style.zIndex = '-1';
      this.initialEvent = null;
      this.draggedItem = draggedItem;
      this.initialPositionTopLeft = element.getBoundingClientRect();
      this.currentPositionTopLeft = this.initialPositionTopLeft;
    }
  }

  dragEnded(element: HTMLElement) {
    this.draggedItem = null;
    this.initialEvent = null;
    element.style.zIndex = '';
    element.style.transform = '';
  }

  dragging(event: { x: number; y: number }, element: HTMLElement) {
    if (!this.initialEvent) {
      this.initialEvent = event;
    }
    const x = event.x - this.initialEvent.x - (this.currentPositionTopLeft.x - this.initialPositionTopLeft.x);
    const y = event.y - this.initialEvent.y - (this.currentPositionTopLeft.y - this.initialPositionTopLeft.y);
    element.style.transform = `translate(${x}px, ${y}px`;
  }

  mouseEnter(element: HTMLElement, index?: number) {
    if (this.draggedItem) {
      this.currentPositionTopLeft = element.getBoundingClientRect()
      if (this.items && typeof index === 'number') {
        const draggedItem = this.removeDraggedItem();
        this.items.splice(index, 0, draggedItem);
      }
      return true;
    }
    return false;
  }

  removeDraggedItem() {
    return this.items.splice(this.items.indexOf(this.draggedItem), 1)[0];
  }

  getDraggedItem() {
    return this.draggedItem;
  }
}

export type Coordinates = { x: number; y: number };
