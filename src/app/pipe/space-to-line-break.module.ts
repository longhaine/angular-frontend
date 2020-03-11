import { NgModule } from '@angular/core';
import { SpaceToLineBreakPipe } from './space-to-line-break.pipe';


@NgModule({
  declarations: [SpaceToLineBreakPipe],
  exports: [SpaceToLineBreakPipe]
})
export class SpaceToLineBreakModule { }
