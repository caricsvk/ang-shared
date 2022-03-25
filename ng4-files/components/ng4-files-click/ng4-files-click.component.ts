import {
  Component,
  OnInit,
  DoCheck,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import {Ng4FilesSelected} from '../../declarations/ng4-files-selected';
import {Ng4FilesService} from '../../services/ng4-files.service';
import {Ng4FilesUtilsService} from '../../services/ng4-files-utils.service';

@Component({
    selector: 'ng4-files-click', // tslint:disable-line
    templateUrl: './ng4-files-click.component.html',
    styles: ['.ng4-files-upload-btn { display: none; }'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ng4FilesClickComponent implements OnInit, DoCheck {

  @Input() configId = 'shared';

  @Output() filesSelect: EventEmitter<Ng4FilesSelected> = new EventEmitter<Ng4FilesSelected>();

  public maxFilesCount: number;
  public acceptExtensions: string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private ng4FilesService: Ng4FilesService,
    private ng4FilesUtilsService: Ng4FilesUtilsService
  ) {}

  ngDoCheck() {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    const config = this.ng4FilesService.getConfig(this.configId);

    this.maxFilesCount = config.maxFilesCount || 1;
    this.acceptExtensions = <string>config.acceptExtensions;
  }

  public onChange(files: FileList | null): void {
    if (!files || !files.length) {
        return;
    }

    this.filesSelect.emit(
      this.ng4FilesUtilsService.verifyFiles(files, this.configId)
    );
  }

}
