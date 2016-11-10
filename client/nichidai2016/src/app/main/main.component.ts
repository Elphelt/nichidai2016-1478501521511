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
  text: any;
  messages: Array<String> = new Array<String>();
  
  constructor() { }

  ngOnInit() {
    this.setConnected(false);
    this.text="456";
  }
  
  setConnected(connected) {
    document.getElementById('connect').style.visibility = !connected ? 'visible' : 'hidden';
    document.getElementById('disconnect').style.visibility = connected ? 'visible' : 'hidden';
    document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
  }

  sendYes() {
    this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choice': 1 }));
  }
  sendNo() {
    this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choice': -1 }));
  }
  

  connect() {
    var that = this;
    var socket = new SockJS('/hello');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        that.stompClient.subscribe('/topic/greetings', function (greeting) {
            that.text=JSON.parse(greeting.body).content;
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
