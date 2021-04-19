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

  @Input() shownScroll: boolean;
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
    const wrapperWidth = this.hostElement.nativeElement.offsetWidth;
    const offset = (wrapperWidth - this.offset) * (next ? 1 : -1);
    let scrollTo = scrollElement.scrollLeft + offset;
    this.scrolled.emit(scrollTo);
    if (this.center) {
      const center = scrollElement.scrollLeft + wrapperWidth / 2;
      let centerElementIndex = -1
      while (
        ++ centerElementIndex < children.length &&
        (children[centerElementIndex].offsetLeft + children[centerElementIndex].offsetWidth) <= center
      ) { }
      const centerElementEnd = children[centerElementIndex].offsetLeft + children[centerElementIndex].offsetWidth;
      // console.log('center', center, children[centerElementIndex].offsetLeft, '+', children[centerElementIndex].offsetWidth);
      if (next && children[centerElementIndex + 1]) {
        scrollTo = centerElementEnd + children[centerElementIndex + 1].offsetWidth / 2 - wrapperWidth / 2;
      } else if (! next && centerElementIndex > 0) {
        scrollTo = children[centerElementIndex].offsetLeft - children[centerElementIndex - 1].offsetWidth / 2 - wrapperWidth / 2;
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
