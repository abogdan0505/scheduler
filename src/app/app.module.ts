import { SchedulerModule } from './scheduler/scheduler.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SchedulerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
