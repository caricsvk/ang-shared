import { ResizableAction } from './resizable.directive';

export class DragAndDropSorting<T> {

  private draggedItem: T;
  private initialPositionTopLeft: Coordinates;
  private currentPositionTopLeft: Coordinates;
  private initialEvent: Coordinates = null;

  constructor(private items: T[]) {
  }

  dragStarted(event: ResizableAction, element: HTMLElement, draggingShortcut: T) {
    if (event === ResizableAction.Dragging) {
      element.style.zIndex = '-1';
      this.initialEvent = null;
      this.draggedItem = draggingShortcut;
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

  shortcutMouseEnter(index: number, element: HTMLElement) {
    if (this.draggedItem) {
      this.currentPositionTopLeft = element.getBoundingClientRect()
      this.items.splice(index, 0, this.items.splice(this.items.indexOf(this.draggedItem), 1)[0]);
    }
  }
}

export type Coordinates = { x: number; y: number };
