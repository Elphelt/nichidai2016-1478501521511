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
  sendFlag: boolean;
  showAns: boolean;

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

  sendYes() {
    if(this.result!="Yes"){
      if(this.sendFlag==true){
        this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choiceYes': 1, 'choiceNo' : -1 }));
      }else{
        this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choiceYes': 1, 'choiceNo' : 0 }));
      }
      this.result="Yes";
      this.sendFlag=true;
    }
  }

  sendNo() {
    if(this.result!="No"){
      if(this.sendFlag==true){
        this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choiceYes': -1, 'choiceNo' : 1 }));
      }else{
        this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choiceYes': 0, 'choiceNo' : 1 }));
      }
      this.result="No";
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
            that.result="";
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
