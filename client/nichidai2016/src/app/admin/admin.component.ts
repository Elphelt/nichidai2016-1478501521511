import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player } from '../player';
import { Question } from '../question';

var SockJS = require('sockjs-client');
var Stomp = require('stompjs');


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})


export class AdminComponent implements OnInit, OnDestroy {

  private stompClient: any;
  isValid: any;
  choiceYes: number;
  choiceNo: number;
  messages: Array<String> = new Array<String>();
  name: string;
  Cquestion: string;
  varYes: number;
  varNo: number;
  private showGraph: boolean = false;
  private showRanking: boolean = false;
  private domElement: HTMLElement;
  private players: Player[] = [];
  private rank: number;
  private result: number;
  private questions: Question[] = [];
  private resultList: number[][] = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
  private nowIndex: number;

  constructor() { }

  ngOnInit() {
    this.setConnected(false);
    this.choiceNo=0;
    this.choiceYes=0;
    this.nowIndex=0;
    this.rank=1;
    this.questions.push(new Question("フリック1","日本大学生産工学部"));
    this.questions.push(new Question("フリック2","penpineappleapplepen"));
    this.questions.push(new Question("フリック3","ユニーク誠実利他変化挑戦結束グローバル凛"));
    this.questions.push(new Question("質問1","就職しようと思っている人！"));
    this.questions.push(new Question("質問2","IT系の仕事に就きたいと思っている人！"));
    this.questions.push(new Question("質問2-1","プログラマーになりたいと思っている人！"));
    this.questions.push(new Question("質問2-2","SEになりたいと思っている人！"));
    this.questions.push(new Question("質問3","IT系以外に就きたいと思っている人！"));
    this.Cquestion=" Loading..."
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

  resetResult() {
    this.choiceNo=0;
    this.choiceYes=0;
    this.players=[];
    this.rank=0;
    this.result=0;
    this.stompClient.send('/app/reset', {}, );
  }

  sendQuestion(qbody: string, nextIndex: number) {
    this.resultList[this.nowIndex][0] = this.choiceYes;
    this.resultList[this.nowIndex][1] = this.choiceNo;
    this.choiceYes = this.resultList[nextIndex][0];
    this.choiceNo = this.resultList[nextIndex][1];
    this.result=this.choiceYes+this.choiceNo;
    this.nowIndex=nextIndex;
    if(this.choiceNo==0 && this.choiceYes==0) this.stompClient.send('/app/question', {}, JSON.stringify({ 'question': qbody }));
    this.Cquestion=qbody;
  }

  connect() {
    var that = this;
    var socket = new SockJS('/hello');
    this.Cquestion=" Loading..."
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      that.stompClient.subscribe('/topic/admin', function (greeting) {
        that.choiceYes += (JSON.parse(greeting.body).choiceYes);
        that.choiceNo += (JSON.parse(greeting.body).choiceNo);
        that.result = that.choiceNo+that.choiceYes;
      });
      that.stompClient.subscribe('/topic/result', function (greeting) {
        that.players.push(new Player((JSON.parse(greeting.body).rank), (JSON.parse(greeting.body).name)));
        that.rank=(JSON.parse(greeting.body).rank);
      });
      that.Cquestion=null;
    }, function (err) {
      console.log('err', err);
      that.Cquestion="再度Connectを押して下さい";
      that.setConnected(false);
    });
    this.setConnected(true);
  }


  disconnect() {
    if (this.stompClient != null) {
        this.stompClient.disconnect();
    }
    this.setConnected(false);
    this.Cquestion=" Loading..."
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