import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit, Output,
  ViewChild,
  EventEmitter, OnChanges, SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-horizontal-scroll',
  templateUrl: './horizontal-scroll.component.html',
  styleUrls: ['./horizontal-scroll.component.scss']
})
export class HorizontalScrollComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() shownScroll;
  @Input() offset = 50;
  @Input() center = false;
  @Output() scrolled = new EventEmitter<number>();

  @ViewChild('scrollableElement', {read: ElementRef})

  private scrollableElement: ElementRef;
  private wrapperWidth: number;

  constructor(
    private hostElement: ElementRef,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.wrapperWidth = this.hostElement.nativeElement.offsetWidth;
    const classList = this.hostElement.nativeElement.classList;
    if (this.shownScroll) {
      classList.add('shown-scroll');
    } else if (this.shownScroll === false) {
      classList.remove('shown-scroll');
    } else {
      const interval = setInterval(() => {
        const shownScroll = this.wrapperWidth < this.scrollableElement.nativeElement.scrollWidth;
        if (this.shownScroll != shownScroll) {
          classList.toggle('shown-scroll');
          this.shownScroll = shownScroll;
        }
      }, 500);
      setTimeout(() => clearInterval(interval), 1510);
    }
  }

  scroll(next: boolean): void {
    const scrollElement = this.scrollableElement.nativeElement;
    const children = scrollElement.children;
    const offset = (this.wrapperWidth - this.offset) * (next ? 1 : -1);
    let scrollTo = scrollElement.scrollLeft + offset;
    this.scrolled.emit(scrollTo);
    if (this.center) {
      const center = scrollElement.scrollLeft + this.wrapperWidth / 2;
      let lastElementEnd = 0;
      let i = 0
      for (; i < children.length; i++) {
        lastElementEnd += children[i].clientWidth + this.offset;
        if (lastElementEnd >= center) {
          break;
        }
      }
      try {
        scrollTo = next ? lastElementEnd + children[i + 1].clientWidth / 2 - this.wrapperWidth / 2 :
          lastElementEnd - children[i - 1].clientWidth - children[i - 1].clientWidth / 2 - this.wrapperWidth / 2;
      } catch (e) { // children index out of bound
        return;
      }
    }
    if (scrollTo < 0) {
      scrollTo = 0;
    }
    scrollElement.scroll({
      left: scrollTo,
      behavior: 'smooth'
    });
  }

}
