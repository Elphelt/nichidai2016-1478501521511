import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() { }

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

  connect() {
    var that = this;
    var socket = new SockJS('/hello');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      that.stompClient.subscribe('/topic/admin', function (greeting) {
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


}
