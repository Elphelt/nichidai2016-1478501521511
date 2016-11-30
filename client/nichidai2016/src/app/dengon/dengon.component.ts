import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http'

var Stomp = require('stompjs');

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

  constructor(private http: Http) { }

  ngOnInit() {
    for(var i = 0; i < 6; i++) {
      this.isDisabled.push(null);
    }
    this.loading = "";
  }

  ngOnDestroy() {
    if (this.stompClient != null) {
        this.stompClient.disconnect();
    }
  }

  setConnected(connected) {
    document.getElementById('connect').style.visibility = !connected ? 'visible' : 'hidden';
    document.getElementById('disconnect').style.visibility = connected ? 'visible' : 'hidden';
  }

  connect() {
    var that = this;
    var socket = new WebSocket('ws://' + location.host + '/hello');
    this.loading = " Connecting...";
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      that.stompClient.subscribe('/topic/dengon', function (greeting) {
        that.choiceNum = JSON.parse(greeting.body).choiceNum;
        if(JSON.parse(greeting.body).teamNum == "ウォーターフォール"){
          that.choice1 = that.choiceNum;
        }else{
          that.choice2 = that.choiceNum;
        }
      });
      that.loading=null;
    }, function (err) {
      console.log('err', err);
      that.loading="再度Connectを押して下さい";
      that.setConnected(false);
    });
    this.setConnected(true);
  }


  disconnect() {
    if (this.stompClient != null) {
        this.stompClient.disconnect();
    }
    this.setConnected(false);
    this.loading = " Connecting...";
    console.log("Disconnected");
  }

  private changePlayer(): void {
    this.showPlayer = true;
    this.showDisplay = false;
  }

  private changeDisplay(): void {
    this.showPlayer = false;
    this.showDisplay = true;
  }

  private reset(): void {
    this.choiceNum=[];
    this.isDisabled[0]=null;
    this.isDisabled[1]=null;
    this.isDisabled[2]=null;
    this.isDisabled[3]=null;
    this.result="";
  }

  sendAns() {
    let body = JSON.stringify({ 'teamNum': this.teamNum, 'choiceNum' : this.choiceNum });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    this.result="";
    return this.http.post('/dengon', body, options)
    .subscribe((res) => {
      this.result="送信完了";
    });
  }

  teamSet(num: string): void{
    this.teamNum = num;
  }


}
