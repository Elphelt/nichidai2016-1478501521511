import { Component, OnInit } from '@angular/core';

var SockJS = require('sockjs-client');
var Stomp = require('stompjs');


@Component({
  selector: 'app-typing',
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.css']
})
export class TypingComponent implements OnInit {
  stompClient: any;
  isValid: any;
  result: any;
  messages: Array<String> = new Array<String>();
  question: string;
  sendFlag: boolean;
  showAns: boolean;
  answer: string;
  player: string;

  constructor() { }

  ngOnInit() {
    this.setConnected(false);
    this.question=" Loading..."
    this.showAns=false;
  }
  
  setConnected(connected) {
    document.getElementById('connect').style.visibility = !connected ? 'visible' : 'hidden';
    document.getElementById('disconnect').style.visibility = connected ? 'visible' : 'hidden';
    document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
  }

  sendAns() {
    if(this.answer==this.question && this.sendFlag==false && this.player!=""){
      this.stompClient.send('/app/flick', {}, JSON.stringify({ 'name': this.player }));
      this.sendFlag=true;
    }
  }

  connect() {
    var that = this;
    var socket = new SockJS('/hello');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        that.stompClient.subscribe('/topic/greetings', function (greeting) {
            that.question=JSON.parse(greeting.body).content;
            that.sendFlag=false;
            that.showAns=true;
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

}