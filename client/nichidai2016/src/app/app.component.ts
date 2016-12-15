import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private showMain: boolean = false;
  private showAdmin: boolean = false;
  private showFlick: boolean = false;
  private showDengon: boolean = false;
  private showWatson: boolean = true;
  private location: any;

  constructor() { }

  ngOnInit() {
    if (this.showWatson) {
      $('body').addClass("watsonsan");
    }
  }

  private changeYesNo(): void {
    $('body').removeClass("watsonsan");
    this.showMain = true;
    this.showAdmin = false;
    this.showFlick = false;
    this.showDengon = false;
    this.showWatson = false;
  }

  private changeAdmin(): void {
    $('body').removeClass("watsonsan");
    this.showMain = false;
    this.showAdmin = true;
    this.showFlick = false;
    this.showDengon = false;
    this.showWatson = false;
  }

  private changeFlick(): void {
    $('body').removeClass("watsonsan");
    this.showMain = false;
    this.showAdmin = false;
    this.showFlick = true;
    this.showDengon = false;
    this.showWatson = false;
  }

  private changeDengon(): void {
    $('body').removeClass("watsonsan");
    this.showMain = false;
    this.showAdmin = false;
    this.showFlick = false;
    this.showDengon = true;
    this.showWatson = false;
  }

  private changeWatson(): void {
    $('body').addClass("watsonsan");
    this.showMain = false;
    this.showAdmin = false;
    this.showFlick = false;
    this.showDengon = false;
    this.showWatson = true;
  }


}
