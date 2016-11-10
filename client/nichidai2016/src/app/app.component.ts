import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private showMain: boolean = true;
  private showAdmin: boolean = false;

  private changeAdmin(): void {
    this.showMain = !this.showMain;
    this.showAdmin = !this.showAdmin;
  }

}
