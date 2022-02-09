import { AfterViewInit, Component, OnDestroy, TemplateRef, Type } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MessagingService } from './messaging.service';
import { MatDialogRef } from '@angular/material/dialog';
import { delay, filter } from 'rxjs/operators';

@Component({
  template: ''
})
export abstract class BaseDialogComponent implements AfterViewInit, OnDestroy {

  private readonly delayTimeToOpenNext = 100;
  private component: Type<any> | TemplateRef<any>;

  destroyed = false;
  dialog: MatDialogRef<any>;
  private static dialogsOpen = 0;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected messagingService: MessagingService
  ) { }

  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const component = this.getComponent(params);
      if (component !== this.component) {
        this.component = component;
        BaseDialogComponent.dialogsOpen ++;
        if (this.closeDialog(false)) {
          setTimeout(() => BaseDialogComponent.dialogsOpen --, this.delayTimeToOpenNext + 500);
        }
        this.dialog = this.messagingService.showDialog(component, null);
        this.dialog.afterClosed().pipe(
          delay(this.delayTimeToOpenNext),
          filter(() => BaseDialogComponent.dialogsOpen <= 1 && !this.destroyed)
        ).subscribe(() => this.afterClosed());
      }
    });
  }

  protected abstract getComponent(urlParams: Params): Type<any> | TemplateRef<any>;
  protected abstract afterClosed(): void;

  ngOnDestroy(): void {
    // console.log('destroying manager', this.dialog, DialogComponent.dialogsOpen);
    this.destroyed = true;
    this.closeDialog();
  }

  private closeDialog(substract = true) {
    if (this.dialog) {
      if (substract) {
        // console.log('closeDialog substract')
        BaseDialogComponent.dialogsOpen --;
      }
      this.dialog.close();
      return true;
    }
    return false;
  }
}
