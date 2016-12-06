import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http'
import { Dengon } from '../dengon';
import { Observable } from 'rxjs/Rx';

var Stomp = require('stompjs');
var SockJS = require('sockjs-client');

@Component({
  selector: 'app-dengon',
  templateUrl: './dengon.component.html',
  styleUrls: ['./dengon.component.css']
})
export class DengonComponent implements OnInit {

  private stompClient: any;
  private showPlayer: boolean = false;
  private showDisplay: boolean = false;
  private choiceNum: string[] = [];
  private isDisabled: any[] = [];
  private choice1: string[] = [];
  private choice2: string[] = [];
  private teamNum: string;
  private loading: string;
  private result: string;
  private dengons: Dengon[] = [];
  private showTeamSelect: boolean = true;
  private isValid: boolean = true;
  private sendFlag: boolean = false;
  private connectFlag: boolean;
  private myNum: string;
  private showNumSelect: boolean = true;

  constructor(private http: Http) { }

  ngOnInit() {
    for (var i = 0; i < 6; i++) {
      this.isDisabled.push(null);
      this.dengons.push(new Dengon([], []));
    }
    this.loading = "";
    this.connectFlag = true;
  }

  ngOnDestroy() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

  connect() {
    var that = this;
    var socket = new SockJS('/hello');
    this.loading = " Connecting...";
    this.isValid = false;
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      that.stompClient.subscribe('/topic/dengon', function (greeting) {
        that.choiceNum = JSON.parse(greeting.body).choiceNum;
        that.myNum = JSON.parse(greeting.body).myNum;
        if (JSON.parse(greeting.body).teamNum == "ウォーターフォール") {
          that.dengons[that.myNum].setWater(that.choiceNum);
        } else {
          that.dengons[that.myNum].setAgile(that.choiceNum);
        }
      });
      that.loading = null;
    }, function (err) {
      console.log('err', err);
      that.loading = "再度Connectを押して下さい";
      that.connect();
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    this.loading = " Connecting...";
    console.log("Disconnected");
  }

  private changePlayer(): void {
    this.connectFlag = false;
    this.showPlayer = true;
    this.showDisplay = false;
  }

  private changeDisplay(): void {
    this.connectFlag = false;
    this.showPlayer = false;
    this.showDisplay = true;
  }

  private reset(): void {
    this.choiceNum = [];
    this.isDisabled[0] = null;
    this.isDisabled[1] = null;
    this.isDisabled[2] = null;
    this.isDisabled[3] = null;
    this.result = "";
  }

  sendAns() {
    this.result = "送信中...";
    this.sendFlag = true;
    let body = JSON.stringify({ 'teamNum': this.teamNum, 'myNum': this.myNum, 'choiceNum': this.choiceNum });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('/dengon', body, options)
      .subscribe((res) => {
        Observable.interval(1000).take(1).subscribe((x) => {
          this.result = "送信完了";
        });
        Observable.interval(2000).take(1).subscribe((x) => {
          this.sendFlag = false;
        });
      });
  }

  teamSet(num: string): void {
    this.teamNum = num;
    this.showTeamSelect = false;
  }

  numSet(num: string): void {
    this.myNum = num;
    this.showNumSelect = false;
  }

}
