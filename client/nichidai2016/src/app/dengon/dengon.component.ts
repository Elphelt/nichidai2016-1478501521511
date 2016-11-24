import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http'

var SockJS = require('sockjs-client');
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
  private teamNum: number;
  private loading: string;

  constructor(private http: Http) { }

  ngOnInit() {
    for(var i = 0; i < 6; i++) {
      this.isDisabled.push(null);
    }
    this.loading = " Loading...";
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
    var socket = new SockJS('/hello');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      that.stompClient.subscribe('/topic/dengon', function (greeting) {
        that.choiceNum = JSON.parse(greeting.body).choiceNum;
        if(JSON.parse(greeting.body).teamNum == 0){
          that.choice1 = that.choiceNum;
        }else{
          that.choice2 = that.choiceNum;
        }
      });
      that.loading=null;
    }, function (err) {
      console.log('err', err);
    });
    this.setConnected(true);
  }


  disconnect() {
    if (this.stompClient != null) {
        this.stompClient.disconnect();
    }
    this.setConnected(false);
    this.loading = " Loading...";
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

  // private choice(buf: number): void {
  //   this.choiceNum.push(buf);
  //   this.isDisabled[buf]="false";

  // }

  private reset(): void {
    this.choiceNum=[];
    this.isDisabled[0]=null;
    this.isDisabled[1]=null;
    this.isDisabled[2]=null;
    this.isDisabled[3]=null;
  }

  sendAns() {
    let body = JSON.stringify({ 'teamNum': this.teamNum, 'choiceNum' : this.choiceNum });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('/dengon', body, options)
    .subscribe((res) => {
            return res;
        });
  }

  teamSet(num: number): void{
    this.teamNum = num;
  }


}