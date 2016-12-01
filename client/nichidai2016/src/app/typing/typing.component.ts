import { Component, OnInit, OnDestroy } from '@angular/core';
import { Stopwatch } from '../stopwatch';

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
  sw: Stopwatch = new Stopwatch();

  constructor() { }

  ngOnInit() {
    this.setConnected(false);
    this.question=" Loading..."
    this.showAns=true;
    this.showOK=true;
    this.showRanking=false;
  }

  ngOnDestroy() {
    if (this.stompClient != null) {
        this.stompClient.disconnect();
    }
  }

  setConnected(connected) {
    document.getElementById('connect').style.visibility = !connected ? 'visible' : 'hidden';
    document.getElementById('disconnect').style.visibility = connected ? 'visible' : 'hidden';
    document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
  }

  sendAns() {
    if(this.answer==this.question && this.sendFlag==false && this.player!=""){
      this.sw.toggle();
      this.stompClient.send('/app/flick', {}, JSON.stringify({ 'name': this.player, 'time': this.sw.timeString }));
      this.sendFlag=true;
    }
  }

  connect() {
    var that = this;
    var socket = new SockJS('/hello');
    this.question=" Connecting..."
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        that.stompClient.subscribe('/topic/greetings', function (greeting) {
            if(that.answer=that.question) that.answer="";
            that.question=JSON.parse(greeting.body).content;
            that.sendFlag=false;
            // that.showAns=true;
            that.showRanking=false;
            that.result="";
            that.sw.reset();
            that.sw.toggle();
        });
        that.stompClient.subscribe('/user/queue/flick', function (greeting) {
            that.rank=JSON.parse(greeting.body).content + " タイム：" + that.sw.timeString;
            that.showRanking=true;
        });
        that.question=null;
    }, function (err) {
        console.log('err', err);
        // that.question="再度Connectを押して下さい";
        that.setConnected(false);
        that.connect();
    });
    this.setConnected(true);
  }


  disconnect() {
    if (this.stompClient != null) {
        this.stompClient.disconnect();
    }
    this.setConnected(false);
    this.question=" Loading..."
    console.log("Disconnected");
  }

  setName() {
    this.showOK = !this.showOK;
  }
  editName() {
    this.showOK = !this.showOK;
  }


}
