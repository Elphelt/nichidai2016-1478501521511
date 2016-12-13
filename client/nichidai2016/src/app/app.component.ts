import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private showMain: boolean = true;
  private showAdmin: boolean = false;
  private showFlick: boolean = false;
  private showDengon: boolean = false;
  private showWatson: boolean = false;
  private location: any;

  constructor() { }

  private changeYesNo(): void {
    this.showMain = true;
    this.showAdmin = false;
    this.showFlick = false;
    this.showDengon = false;
    this.showWatson = false;
  }

  private changeAdmin(): void {
    this.showMain = false;
    this.showAdmin = true;
    this.showFlick = false;
    this.showDengon = false;
    this.showWatson = false;
  }

  private changeFlick(): void {
    this.showMain = false;
    this.showAdmin = false;
    this.showFlick = true;
    this.showDengon = false;
    this.showWatson = false;
  }

  private changeDengon(): void {
    this.showMain = false;
    this.showAdmin = false;
    this.showFlick = false;
    this.showDengon = true;
    this.showWatson = false;
  }

  private changeWatson(): void {
    this.showMain = false;
    this.showAdmin = false;
    this.showFlick = false;
    this.showDengon = false;
    this.showWatson = true;
  }


}
