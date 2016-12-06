import { Component, OnInit, OnDestroy } from '@angular/core';

var Stomp = require('stompjs');
var SockJS = require('sockjs-client');


@Component({
  selector: 'app-typing',
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.css']
})
export class TypingComponent implements OnInit, OnDestroy {
  private stompClient: any;
  isValid: any;
  result: any;
  messages: Array<String> = new Array<String>();
  question: string;
  sendFlag: boolean;
  showAns: boolean;
  answer: string;
  player: string;
  showOK: boolean;
  showRanking: boolean;
  rank: string;
  private showMain: boolean = false;
  private timeResult: any;

  constructor() { }

  ngOnInit() {
    this.question = " Loading..."
    this.showAns = true;
    this.showOK = true;
    this.showRanking = false;
    this.isValid = true;
  }

  ngOnDestroy() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

  sendAns() {
    if (this.answer == this.question && this.sendFlag == false && this.player != "") {
      this.stompClient.send('/app/flick', {}, JSON.stringify({ 'name': this.player, 'time': "" }));
      this.sendFlag = true;
    }
  }

  connect() {
    var that = this;
    var socket = new SockJS('/hello');
    this.isValid = false;
    this.showMain = true;
    this.question = " Connecting..."
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      that.stompClient.subscribe('/topic/greetings', function (greeting) {
        if (that.answer = that.question) that.answer = "";
        that.question = JSON.parse(greeting.body).content;
        that.sendFlag = false;
        // that.showAns=true;
        that.showRanking = false;
        that.result = "入力する文章がここに表示されます。";
      });
      that.stompClient.subscribe('/user/queue/flick', function (greeting) {
        that.rank = JSON.parse(greeting.body).content;
        that.showRanking = true;
      });
      that.question = null;
    }, function (err) {
      console.log('err', err);
      that.connect();
    });
  }


  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    this.question = " Loading..."
    console.log("Disconnected");
  }

  setName() {
    this.showOK = !this.showOK;
  }
  editName() {
    this.showOK = !this.showOK;
  }


}
