import { Component, OnInit } from '@angular/core';

var SockJS = require('sockjs-client');
var Stomp = require('stompjs');

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  stompClient: any;
  isValid: any;
  text: any;
  messages: Array<String> = new Array<String>();
  name: string;
  
  constructor() { }

  ngOnInit() {
    this.setConnected(false);
    this.text="0";
  }
  
  setConnected(connected) {
    document.getElementById('connect').style.visibility = !connected ? 'visible' : 'hidden';
    document.getElementById('disconnect').style.visibility = connected ? 'visible' : 'hidden';
    document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
  }

  sendName() {
    this.stompClient.send('/app/name', {}, JSON.stringify({ 'name': this.name }));
  }

  

  connect() {
    var that = this;
    var socket = new SockJS('/hello');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      that.stompClient.subscribe('/topic/admin', function (greeting) {
        that.text += parseInt(JSON.parse(greeting.body).content, 10);
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
