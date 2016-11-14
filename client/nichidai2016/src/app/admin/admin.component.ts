import { Component, OnInit, ViewChildren } from '@angular/core';
import { GraphComponent } from '../graph/graph.component';

var SockJS = require('sockjs-client');
var Stomp = require('stompjs');


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  @ViewChildren(GraphComponent)
  private graph: GraphComponent;

  stompClient: any;
  isValid: any;
  choiceYes: number;
  choiceNo: number;
  messages: Array<String> = new Array<String>();
  name: string;
  question: string;
  private showGraph: boolean = false;

  constructor() { }

  ngOnInit() {
    this.setConnected(false);
    this.choiceNo=1;
    this.choiceYes=2;
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

  private changeGraph(): void {
    this.showGraph = !this.showGraph;
  }

  ngAfterViewInit(){
    this.graph.changeLabels(['YES','NO']);
    this.graph.changeData([this.choiceYes, this.choiceNo]);
  }
}
