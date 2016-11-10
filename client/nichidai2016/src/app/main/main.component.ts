import { Component, OnInit, ElementRef } from '@angular/core';

var SockJS = require('sockjs-client');
var Stomp = require('stompjs');

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  stompClient: any;
  isValid: any;
  result: any;
  messages: Array<String> = new Array<String>();
  question: string;
  
  constructor() { }

  ngOnInit() {
    this.setConnected(false);
    this.question=" Loading..."
  }
  
  setConnected(connected) {
    document.getElementById('connect').style.visibility = !connected ? 'visible' : 'hidden';
    document.getElementById('disconnect').style.visibility = connected ? 'visible' : 'hidden';
    document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
  }

  sendYes() {
    this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choice': 1 }));
    this.result="Yes";
  }
  sendNo() {
    this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choice': -1 }));
    this.result="No";
  }
  

  connect() {
    var that = this;
    var socket = new SockJS('/hello');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        that.stompClient.subscribe('/topic/greetings', function (greeting) {
            that.question=JSON.parse(greeting.body).content;
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
