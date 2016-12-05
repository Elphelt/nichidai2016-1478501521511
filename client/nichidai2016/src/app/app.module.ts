import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { MainComponent } from './main/main.component';
import { GraphComponent } from './graph/graph.component';
import { TypingComponent } from './typing/typing.component';
import { DengonComponent } from './dengon/dengon.component';
import { VisualRecoComponent } from './visual-reco/visual-reco.component';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FileSelectDirective } from 'ng2-file-upload';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    MainComponent,
    GraphComponent,
    TypingComponent,
    DengonComponent,
    FileSelectDirective,
    VisualRecoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
