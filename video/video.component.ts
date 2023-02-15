import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements AfterViewInit {

  @Input() srcMp4AndWebm: string;
  @Input() fullPathSources: VideoSource[];
  @Input() autoplay: 'autoplay' | false = 'autoplay';
  @Input() showToggleButton = false;

  @ViewChild('creationVideo') videoElement: ElementRef;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.init();
  }

  ngAfterViewInit(): void {
    this.init();
  }

  private init() {
    if (this.autoplay && this.videoElement) {
      this.autoplay = false;
      const video = this.videoElement.nativeElement as HTMLVideoElement;
      video.muted = true;
      video.play();
      this.changeDetectorRef.detectChanges();
    }
  }

}

export interface VideoSource {
  src: string;
  type: string;
}
