import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { MainComponent } from './main/main.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { GraphComponent } from './graph/graph.component';
import { TypingComponent } from './typing/typing.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'yesno', pathMatch: 'full' },
  { path: 'yesno', component: MainComponent },
  { path: 'flick', component: TypingComponent },
  { path: 'admin', component: AdminComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    MainComponent,
    GraphComponent,
    TypingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
