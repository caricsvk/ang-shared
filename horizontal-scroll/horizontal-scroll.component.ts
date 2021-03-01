import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-horizontal-scroll',
  templateUrl: './horizontal-scroll.component.html',
  styleUrls: ['./horizontal-scroll.component.scss']
})
export class HorizontalScrollComponent implements OnInit, AfterViewInit {

  @Input() offset = 50;
  @Input() center = false;
  @HostBinding('class') showScrollers: string | undefined;
  @ViewChild('scrollableElement', {read: ElementRef})
  private scrollableElement: ElementRef;
  private wrapperWidth: number;

  constructor(
    private hostElement: ElementRef,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.wrapperWidth = this.hostElement.nativeElement.offsetWidth;
    const interval = setInterval(() => {
      this.showScrollers = this.wrapperWidth < this.scrollableElement.nativeElement.scrollWidth ?
        'shown-scrollers' : 'hidden-scrollers';
      this.changeDetectorRef.detectChanges();
    }, 500);
    setTimeout(() => clearInterval(interval), 10 * 1000);
  }

  scroll(next: boolean): void {
    const scrollElement = this.scrollableElement.nativeElement;
    const children = scrollElement.children;
    const offset = (this.wrapperWidth - this.offset) * (next ? 1 : -1);
    let scrollTo = scrollElement.scrollLeft + offset;
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
