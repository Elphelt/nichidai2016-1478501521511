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

  private changeYesNo(): void {
    this.showMain = true;
    this.showAdmin = false;
    this.showFlick = false;
  }

  private changeAdmin(): void {
    this.showMain = false;
    this.showAdmin = true;
    this.showFlick = false;
  }

  private changeFlick(): void {
    this.showMain = false;
    this.showAdmin = false;
    this.showFlick = true;
  }

}
