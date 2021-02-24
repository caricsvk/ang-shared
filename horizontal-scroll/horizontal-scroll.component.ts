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

  scrollLeft(): void {
    let left = this.scrollableElement.nativeElement.scrollLeft - (this.wrapperWidth - this.offset);
    if (left < 0) {
      left = 0;
    }
    this.scrollableElement.nativeElement.scroll({left, behavior: 'smooth'});
  }

  scrollRight(): void {
    this.scrollableElement.nativeElement.scroll({
      left: this.scrollableElement.nativeElement.scrollLeft + (this.wrapperWidth - this.offset),
      behavior: 'smooth'
    });
  }

}
