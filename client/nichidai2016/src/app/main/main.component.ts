import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { FileUploader } from 'ng2-file-upload'

var Stomp = require('stompjs');
var SockJS = require('sockjs-client');

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  stompClient: any;
  isValid: any;
  result: any;
  messages: Array<String> = new Array<String>();
  question: string;
  sendFlag: boolean;
  showAns: boolean;
  watsonResult: any;
  private loading: string;
  private showMain: boolean = false;

  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  constructor() {
    this.uploader = new FileUploader({ url: '/up', itemAlias: 'multipartFile', disableMultipart: false });
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.watsonResult = JSON.parse(response).images[0].classifiers[0].classes;
    };
  }

  ngOnInit() {
    this.question = " Loading...";
    this.loading = "";
    this.showAns = true;
    this.isValid = true;
  }

  ngOnDestroy() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

  sendYes() {
    if (this.result != "Yes") {
      if (this.sendFlag == true) {
        this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choiceYes': 1, 'choiceNo': -1 }));
      } else {
        this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choiceYes': 1, 'choiceNo': 0 }));
      }
      this.result = "Yes";
      this.sendFlag = true;
    }
  }

  sendNo() {
    if (this.result != "No") {
      if (this.sendFlag == true) {
        this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choiceYes': -1, 'choiceNo': 1 }));
      } else {
        this.stompClient.send('/app/choice', {}, JSON.stringify({ 'choiceYes': 0, 'choiceNo': 1 }));
      }
      this.result = "No";
      this.sendFlag = true;
    }
  }

  connect() {
    var that = this;
    var socket = new SockJS('/hello');
    this.isValid = false;
    this.showMain = true;
    this.loading = " Connecting...";
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      that.stompClient.subscribe('/topic/greetings', function (greeting) {
        that.question = JSON.parse(greeting.body).content;
        that.sendFlag = false;
        that.showAns = true;
        that.result = "";
      });
      that.loading = null;
    }, function (err) {
      console.log('err', err);
      that.loading = "再度Connectを押して下さい";
      that.connect();
    });
  }


  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    this.question = " Loading..."
    console.log("Disconnected");
  }

}

