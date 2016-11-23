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
  private choiceNum: number[] = [];
  private isDisabled: any[] = [];
  private choice1: number[] = [];
  private choice2: number[] = [];
  private teamNum: number;

  constructor(private http: Http) { }

  ngOnInit() {
    this.isDisabled.push(null);
    this.isDisabled.push(null);
    this.isDisabled.push(null);
    this.isDisabled.push(null);
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
        if(JSON.parse(greeting.body).teamNum == 1){
          that.choice1 = that.choiceNum;
        }else{
          that.choice2 = that.choiceNum;
        }
      });
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

  private choice(buf: number): void {
    this.choiceNum.push(buf);
    this.isDisabled[buf]="false";

  }

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
            return res.json();
        });
  }

  teamSet(num: number): void{
    this.teamNum = num;
  }


}