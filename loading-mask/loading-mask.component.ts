import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingMaskService } from './loading-mask.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  imports: [ CommonModule, MatProgressSpinnerModule ],
  selector: 'milo-loading-mask',
  templateUrl: './loading-mask.component.html',
  styleUrls: ['./loading-mask.component.scss']
})
export class LoadingMaskComponent implements OnInit, OnDestroy {

  private static globalMaskInitialized = false;
  private globalMaskSubscription: Subscription;

  @Input() diameter = 100;
  @Input() strokeWidth = 8;
  @Input() isGlobal = false;
  @Input() checkAndFixParent: boolean;

  globalMaskShown = false;

  constructor(
    private elementRef: ElementRef,
    protected loadingMaskService: LoadingMaskService
  ) {
  }

  ngOnInit(): void {

    if (this.checkAndFixParent === undefined) {
      this.checkAndFixParent = this.isGlobal;
    }

    if (this.isGlobal) {
      if (LoadingMaskComponent.globalMaskInitialized) {
        throw new Error('Global mask was already initialized, use mask local mask instead ,' +
          ' or use LoadingMaskService to adjust behaviour');
      }
      LoadingMaskComponent.globalMaskInitialized = true;
    } else {
      this.loadingMaskService.registerLocalMask();
    }

    this.globalMaskSubscription = this.loadingMaskService.isGlobalMaskShown().subscribe(
      globalMaskShown => this.globalMaskShown = globalMaskShown
    );

    this.checkAndFixParentPosition();
  }

  ngOnDestroy(): void {
    if (!this.isGlobal) {
      this.loadingMaskService.deregisterLocalMask();
    }
    if (this.globalMaskSubscription) {
      this.globalMaskSubscription.unsubscribe();
    }
  }

  private checkAndFixParentPosition(): void {
    if (this.checkAndFixParent && this.elementRef) {
      const parentElement = this.elementRef.nativeElement.parentElement;
      const parentPosition = getComputedStyle(parentElement).position;
      const parentDisplay = getComputedStyle(parentElement).display;
      const allowablePos = ['relative', 'absolute', 'fixed'];
      const nodeWarnTitle = `[Loading mask]: Warning! Host's parent element`;
      if (allowablePos.indexOf(parentPosition) < 0) {
        parentElement.style.position = 'relative';
        console && console.warn(`${nodeWarnTitle} <${parentElement.tagName}> ` +
          `has had none of allowed style positions (${allowablePos}), set to "relative".`);
      }
      if (parentDisplay === 'inline') {
        console && console.warn(`${nodeWarnTitle} <${parentElement.tagName}> ` +
          `behaves as "inline", it's NOT recommended to use loading mask inside inline nodes.`);
      }
    }
  }
}
