import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { FileUploader } from 'ng2-file-upload';
import { animateFactory } from 'ng2-animate';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-visual-reco',
  templateUrl: './visual-reco.component.html',
  styleUrls: ['./visual-reco.component.css'],
  animations: [
    animateFactory(500, 200, 'ease-in'),
    trigger('visibilityChangedChapter', [
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
      transition('* => *', animate('.2s'))
    ])
  ]

})

export class VisualRecoComponent implements OnInit {
  title = '画像解析アプリ';
  private alc: any;
  public uploader: FileUploader;
  watsonResult: any;
  watsonFace: any = JSON.stringify('');
  private showFace: boolean = false;
  private showAge: boolean = false;
  private showGender: boolean = false;
  private showIdentity: boolean = false;
  private loadingFlag: boolean = false;
  private resultFlag: boolean = false;
  private updateFlag: boolean = false;
  private modifyFlag: boolean = false;
  private upText: boolean = false;
  private exText: boolean = false;
  private imageSize: number;
  private outFlag: boolean = false;
  private sendFlag: boolean = false;
  private fileSize: number;

  public filePreviewPath: SafeUrl;

  constructor(private sanitizer: DomSanitizer) {
    var that = this;
    this.sendFlag = false;
    this.showFace = false;
    this.showAge = false;
    this.showGender = false;
    this.showIdentity = false;
    this.loadingFlag = false;
    this.resultFlag = false;
    this.updateFlag = false;
    this.modifyFlag = false;
    this.upText = false;
    this.exText = false;
    this.outFlag = false;
    Observable.interval(2000).subscribe((x) => {
      that.upText = !that.upText;
      that.exText = !that.exText;
    });
    this.uploader = new FileUploader({ url: '/up', itemAlias: 'multipartFile', disableMultipart: false });
    this.uploader.onAfterAddingFile = (fileItem: any) => {
      that.sendFlag = true;
      that.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
      that.loadingFlag = true;
      that.resultFlag = false;
      that.updateFlag = true;
      that.uploader.uploadAll();
      that.outFlag = false;
      Observable.interval(3000).take(1).subscribe((x) => {
        that.updateFlag = false;
        that.modifyFlag = true;
      });
    }
    this.uploader.onBeforeUploadItem = () => {
      // that.updateFlag = false;
      // that.modifyFlag = true;
      // that.upText = false;
    }
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      that.loadingFlag = false;
      that.updateFlag = false;
      that.modifyFlag = false;
      // that.exText = false;
      if (JSON.parse(response).out != undefined) {
        that.outFlag = true;
        that.fileSize = JSON.parse(response).out;
      } else {
        that.resultFlag = true;
        that.showAge = false;
        that.showGender = false;
        that.showIdentity = false;
        that.showFace = false;
        that.watsonResult = JSON.parse(response).result[0].images[0].classifiers[0].classes;
        that.watsonFace = JSON.parse(response).result[1].images[0].faces[0];

        if (that.watsonFace) {
          that.showFace = true;
          if (that.watsonFace.age != undefined) {
            that.showAge = true;
          }
          if (that.watsonFace.gender != undefined) {
            that.showGender = true;
          }
          if (that.watsonFace.identity != undefined) {
            that.showIdentity = true;
          }
        }
      }

      that.sendFlag = false;
    };
  }

  ngOnInit() { };

}
