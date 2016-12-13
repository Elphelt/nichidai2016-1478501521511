import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player } from '../player';
import { Question } from '../question';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs/Rx';

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
  private showMain: boolean = false;
  private ansFlag: boolean[] = [];
  private qid: any;
  private connectCt: number;
  private bufCt: number;

  constructor() { }

  ngOnInit() {
    this.choiceNo = 0;
    this.choiceYes = 0;
    this.nowIndex = -1;
    this.rank = 1;
    this.questions.push(new Question("フリック1", "日本大学生産工学部"));
    this.questions.push(new Question("フリック2", "penpineappleapplepen"));
    this.questions.push(new Question("フリック3", "ユニーク誠実利他変化挑戦結束グローバル凛"));
    this.questions.push(new Question("質問1", "就職しようと思っている人！"));
    this.questions.push(new Question("質問2", "IT系の仕事に就きたいと思っている人！"));
    this.questions.push(new Question("質問3", "IT系以外に就きたいと思っている人！"));
    this.questions.push(new Question("質問4", "口頭で質問を出します"));
    this.Cquestion = "";
    for (var i = 0; i < 7; i++) {
      this.ansFlag.push(false);
    }
    this.connectCt = 0;
    this.result = 0;
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
    this.stompClient.send('/app/reset', {}, );
  }

  sendQuestion(qbody: string, nextIndex: number) {
    if (this.nowIndex != -1) {
      this.resultList[this.nowIndex][0] = this.choiceYes;
      this.resultList[this.nowIndex][1] = this.choiceNo;
      this.choiceYes = this.resultList[nextIndex][0];
      this.choiceNo = this.resultList[nextIndex][1];
      this.result = this.choiceYes + this.choiceNo;
      this.showGraph = false;

      this.flickResult[this.nowIndex] = this.players;
      if (this.flickResult[nextIndex] != undefined) this.players = this.flickResult[nextIndex];
      else {
        this.players = [];
        this.stompClient.send('/app/reset', {}, );
        this.rank = 0;
        this.result = 0;
      }

      if (this.nowIndex != nextIndex) this.ansFlag[this.nowIndex] = true;
    }
    this.nowIndex = nextIndex;
    if (this.ansFlag[nextIndex] == false) {
      this.qid = UUID.UUID();
      this.stompClient.send('/app/question', {}, JSON.stringify({ 'question': qbody, 'qId': this.qid }));
    }
    this.Cquestion = qbody;
  }

  connect() {
    var that = this;
    var socket = new SockJS('/hello');
    this.Cquestion = " Connecting..."
    this.showMain = true;
    this.showRanking = true;
    this.isValid = false;
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      that.stompClient.subscribe('/topic/admin', function (greeting) {
        if (that.ansFlag[that.nowIndex] == false) {
          if (JSON.parse(greeting.body).qId == that.qid) {
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
      that.stompClient.subscribe('/topic/adminHb', function (greeting) {
        that.bufCt = greeting.body;
      });
      Observable.interval(5000).subscribe((x) => {
        if (that.connectCt != that.bufCt && that.bufCt >= 0) {
          that.connectCt = that.bufCt;
        }
        that.sendHbToClient();
      });

    }, function (err) {
      console.log('err', err);
      that.Cquestion = "再度Connectを押して下さい";
      that.connect();
    });
  }


  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    this.Cquestion = " Connecting..."
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

  private sendHbToClient() {
    this.stompClient.send('/app/resetHb', {}, );
  }

}
