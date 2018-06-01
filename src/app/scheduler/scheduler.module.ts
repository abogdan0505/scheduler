import { DropTargetDirective } from './drop-target.directive';
import { DraggableDirective } from './draggable.directive';
import { DragService } from './drag.service';
import { DomService } from './dom.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerComponent, MyComponent } from './container/scheduler/scheduler.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DdTableComponent } from './container/dd-table/dd-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [SchedulerComponent, MyComponent, DraggableDirective, DropTargetDirective, DdTableComponent],
  exports: [SchedulerComponent, DdTableComponent],
  providers: [DomService, DragService],
  entryComponents: [ MyComponent ]
})
export class SchedulerModule { }
