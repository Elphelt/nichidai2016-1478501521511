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
  choiceYes: Number;
  choiceNo: Number;
  messages: Array<String> = new Array<String>();
  name: string;
  question: string;

  constructor() { }

  ngOnInit() {
    this.setConnected(false);
    this.choiceNo=0;
    this.choiceYes=0;
  }
  
  setConnected(connected) {
    document.getElementById('connect').style.visibility = !connected ? 'visible' : 'hidden';
    document.getElementById('disconnect').style.visibility = connected ? 'visible' : 'hidden';
    // document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
  }

  resetResult() {
    this.choiceNo=0;
    this.choiceYes=0;
  }

  sendQuestion() {
    this.stompClient.send('/app/question', {}, JSON.stringify({ 'question': this.question }));
  }

  connect() {
    var that = this;
    var socket = new SockJS('/hello');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      that.stompClient.subscribe('/topic/admin', function (greeting) {
        that.choiceYes += (JSON.parse(greeting.body).choiceYes);
        that.choiceNo += (JSON.parse(greeting.body).choiceNo);
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

 // Doughnut
  public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData:number[] = [350, 450, 100];
  public doughnutChartType:string = 'doughnut';

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }
}
