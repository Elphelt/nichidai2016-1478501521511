import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

// tslint:disable-next-line:no-var-keyword
var Stomp = require('stompjs');
var SockJS = require('sockjs-client');

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  stompClient: any;
  isValid: any;
  result: any;
  messages: Array<String> = new Array<String>();
  question: string;
  sendFlag: boolean;
  showAns: boolean;
  watsonResult: any;
  private loading: string;
  private showMain: boolean;
  private yes: boolean = false;
  private no: boolean = false;
  private qId: string;
  private varYes: number;
  private varNo: number;
  private showGraph: boolean;


  constructor() { }

  ngOnInit() {
    this.question = ' ここに質問内容が表示されたら、YesかNoで答えてください。';
    this.isValid = false;
    this.showMain = true;
    this.loading = ' Connecting...';
    this.showAns = true;
    this.qId = '';
    this.showGraph = false;
  }

  ngAfterViewInit() {
    this.connect();
  }

  ngOnDestroy() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

  sendYes() {
    if (this.result !== 'Yes') {
      if (this.sendFlag === true) {
        this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choiceYes': 1, 'choiceNo': -1, 'qId': this.qId }));
      } else {
        this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choiceYes': 1, 'choiceNo': 0, 'qId': this.qId }));
      }
      this.result = 'Yes';
      this.sendFlag = true;
    }
  }

  sendNo() {
    if (this.result !== 'No') {
      if (this.sendFlag === true) {
        this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choiceYes': -1, 'choiceNo': 1, 'qId': this.qId }));
      } else {
        this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choiceYes': 0, 'choiceNo': 1, 'qId': this.qId }));
      }
      this.result = 'No';
      this.sendFlag = true;
    }
  }

  connect() {
    // tslint:disable-next-line:no-var-keyword
    var that = this;
    // tslint:disable-next-line:no-var-keyword
    var socket = new SockJS('/hello');
    this.isValid = false;
    this.showMain = true;
    this.loading = ' Connecting...';
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      that.stompClient.subscribe('/topic/greetings', function (greeting) {
        if (JSON.parse(greeting.body).qId !== that.qId) {
          that.question = JSON.parse(greeting.body).content;
          that.qId = JSON.parse(greeting.body).qId;
          that.sendFlag = false;
          that.showAns = true;
          that.result = '';
          that.yes = false;
          that.no = false;
          that.showGraph = false;

          if (that.question === '') { that.question = ' ここに質問内容が表示されたら、YesかNoで答えてください。'; }
        }
      });
      that.stompClient.subscribe('/topic/getans', function (greeting) {
        if (JSON.parse(greeting.body).qId === that.qId) {
          that.varYes = (JSON.parse(greeting.body).choiceYes);
          that.varNo = (JSON.parse(greeting.body).choiceNo);
          that.showGraph = true;
        }
      });
      that.loading = null;
      that.getQuestion();
    }, function (err) {
      console.log('err', err);
      that.loading = '再度Connectを押して下さい';
      that.connect();
    });
  }


  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    this.question = ' ここに質問内容が表示されたら、YesかNoで答えてください。';
    console.log('Disconnected');
  }

  private getQuestion(): void {
    this.stompClient.send('/app/getq', {});
  }


}

