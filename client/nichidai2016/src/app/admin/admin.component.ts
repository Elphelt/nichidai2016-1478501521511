import { Component, OnInit } from '@angular/core';
import { Player } from '../player';

var SockJS = require('sockjs-client');
var Stomp = require('stompjs');


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})


export class AdminComponent implements OnInit {

  stompClient: any;
  isValid: any;
  choiceYes: number;
  choiceNo: number;
  messages: Array<String> = new Array<String>();
  name: string;
  question: string;
  varYes: number;
  varNo: number;
  private showGraph: boolean = false;
  private showRanking: boolean = false;
  private domElement: HTMLElement;
  private players: Player[] = [];
  private rank: number;
  private result: number;

  constructor() { }

  ngOnInit() {
    this.setConnected(false);
    this.choiceNo=0;
    this.choiceYes=0;
    this.rank=1;
  }
  
  setConnected(connected) {
    document.getElementById('connect').style.visibility = !connected ? 'visible' : 'hidden';
    document.getElementById('disconnect').style.visibility = connected ? 'visible' : 'hidden';
    document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
  }

  resetResult() {
    this.choiceNo=0;
    this.choiceYes=0;
    this.players=[];
    this.rank=1;
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
        that.result = that.choiceNo+that.choiceYes;
      });
      that.stompClient.subscribe('/topic/result', function (greeting) {
        that.players.push(new Player(that.rank, (JSON.parse(greeting.body).name)));
        that.rank++;
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
    this.varYes = this.choiceYes;
    this.varNo = this.choiceNo;
    this.showGraph = !this.showGraph;
    this.showRanking = false;
  }

  private changeRanking(): void {
    this.showRanking = !this.showRanking;
    this.showGraph = false;
  }

}