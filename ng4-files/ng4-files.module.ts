import { NgModule } from '@angular/core';
import {Ng4FilesClickComponent} from './components/ng4-files-click/ng4-files-click.component'
import {Ng4FilesDropComponent} from './components/ng4-files-drop/ng4-files-drop.component'
import {Ng4FilesService} from './services/ng4-files.service'
import {Ng4FilesUtilsService} from './services/ng4-files-utils.service'

@NgModule({
  declarations: [
    Ng4FilesClickComponent,
    Ng4FilesDropComponent
  ],
  exports: [
    Ng4FilesClickComponent,
    Ng4FilesDropComponent
  ],
  providers: [
    // Ng4FilesService,
    // Ng4FilesUtilsService
  ]
})
export class Ng4FilesModule {
}
