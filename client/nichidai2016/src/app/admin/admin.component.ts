import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player } from '../player';
import { Question } from '../question';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';

// tslint:disable-next-line:no-var-keyword
var Stomp = require('stompjs');
var SockJS = require('sockjs-client');

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})

export class AdminComponent implements OnInit, OnDestroy {

  private stompClient: any;
  isValid: boolean = true;
  choiceYes: number;
  choiceNo: number;
  messages: Array<String> = new Array<String>();
  name: string;
  Cquestion: string;
  varYes: number;
  varNo: number;
  private showGraph: boolean = false;
  private showRanking: boolean = false;
  private players: Player[] = [];
  private flickResult: Player[][] = [[]];
  private rank: number;
  private result: number;
  private questions: Question[] = [];
  private resultList: number[][] = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
  private nowIndex: number;
  private showMain: boolean;
  private ansFlag: boolean[] = [];
  private qId: any;
  private connectCt: number;
  private endFlag: string;
  private qbuf: string;


  constructor() { }

  ngOnInit() {
    this.choiceNo = 0;
    this.choiceYes = 0;
    this.nowIndex = -1;
    this.rank = 1;
    this.endFlag = '';
    this.questions.push(new Question('質問1', '年賀状を“ハガキ”で送りますか？'));
    this.questions.push(new Question('質問2', '大晦日に「年越しそば」は食べますか？'));
    this.questions.push(new Question('質問3', '今年は帰省しますか？'));
    this.questions.push(new Question('質問4', '今年１年は、あなたにとって良い1年でしたか？'));
    this.questions.push(new Question('口頭質問1', '口頭で質問を出します 1'));
    this.questions.push(new Question('口頭質問2', '口頭で質問を出します 2'));
    this.questions.push(new Question('口頭質問3', '口頭で質問を出します 3'));
    this.questions.push(new Question('フリック１', 'ユニリタ'));
    this.questions.push(new Question('フリック２', 'ユニーク誠実利他変化挑戦結束グローバル凛'));
    this.Cquestion = '';
    for (let i = 0; i < this.questions.length; i++) {
      this.ansFlag.push(false);
    }
    this.connectCt = 0;
    this.result = 0;
    this.showMain = true;
    this.connect();
  }

  ngOnDestroy() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }


  resetResult() {
    this.choiceNo = 0;
    this.choiceYes = 0;
    this.players = [];
    this.rank = 0;
    this.result = 0;
    this.connectCt = 0;
    this.ansFlag[this.nowIndex] = false;
    this.showGraph = false;
    this.stompClient.send('/app/reset', {}, );
    this.endFlag = 'リセット';
    this.qId = UUID.UUID();
  }

  sendQuestion(qbody: string, nextIndex: number) {
    if (this.nowIndex !== -1) {
      this.resultList[this.nowIndex][0] = this.choiceYes;
      this.resultList[this.nowIndex][1] = this.choiceNo;
      this.choiceYes = this.resultList[nextIndex][0];
      this.choiceNo = this.resultList[nextIndex][1];
      this.result = this.choiceYes + this.choiceNo;
      this.showGraph = false;

      this.flickResult[this.nowIndex] = this.players;
      if (this.flickResult[nextIndex] !== undefined) {
        this.players = this.flickResult[nextIndex];
      } else {
        this.players = [];
        this.stompClient.send('/app/reset', {}, );
        this.rank = 0;
        this.result = 0;
      }

      if (this.nowIndex !== nextIndex) { this.ansFlag[this.nowIndex] = true; }
    }
    this.nowIndex = nextIndex;
    this.endFlag = '投票締め切り';
    if (this.ansFlag[nextIndex] === false) {
      this.qId = UUID.UUID();
      this.stompClient.send('/app/question', {}, JSON.stringify({ 'question': qbody, 'qId': this.qId }));
      this.endFlag = '受付中';
    }
    this.Cquestion = qbody;
  }

  connect() {
    // tslint:disable-next-line:no-var-keyword
    var that = this;
    // tslint:disable-next-line:no-var-keyword
    var socket = new SockJS('/hello');
    this.Cquestion = ' Connecting...';
    this.showMain = true;
    this.showRanking = false;
    this.isValid = false;
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      that.stompClient.subscribe('/topic/admin', function (greeting) {
        if (that.ansFlag[that.nowIndex] === false) {
          if (JSON.parse(greeting.body).qId === that.qId) {
            that.choiceYes += (JSON.parse(greeting.body).choiceYes);
            that.choiceNo += (JSON.parse(greeting.body).choiceNo);
            that.result = that.choiceNo + that.choiceYes;
          }
        }
      });
      that.stompClient.subscribe('/topic/result', function (greeting) {
        that.players.push(new Player(JSON.parse(greeting.body).rank, JSON.parse(greeting.body).name, JSON.parse(greeting.body).time));
        that.rank = (JSON.parse(greeting.body).rank);
      });
      that.Cquestion = null;

    }, function (err) {
      console.log('err', err);
      that.Cquestion = '再度Connectを押して下さい';
      that.connect();
    });
  }


  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    this.Cquestion = ' Connecting...';
    console.log('Disconnected');
  }

  private changeGraph(): void {
    this.varYes = this.choiceYes;
    this.varNo = this.choiceNo;
    this.showGraph = !this.showGraph;
    this.showRanking = false;
    this.varYes = Math.floor(Math.random() * this.result) + 1;
    this.varNo = this.result - this.varYes;
    if (this.showGraph) {
      Observable.interval(1000).take((Math.floor(Math.random() * 5) + 3)).subscribe((x) => {
        this.varYes = Math.floor(Math.random() * this.result) + 1;
        this.varNo = this.result - this.varYes;
      }, (any) => { }, () => {
        this.varYes = this.choiceYes;
        this.varNo = this.choiceNo;
        this.sendAnswer();
      });
    }
  }

  private changeRanking(): void {
    this.showRanking = !this.showRanking;
    this.showGraph = false;
  }

  private endAns(): void {
    this.qbuf = this.qId;
    this.qId = UUID.UUID();
    this.endFlag = '投票締め切り';
  }

  private sendAnswer(): void {
    this.stompClient.send('/app/sendans', {}, JSON.stringify({ 'choiceYes': this.choiceYes, 'choiceNo': this.choiceNo, 'qId': this.qbuf }));
  }

}
