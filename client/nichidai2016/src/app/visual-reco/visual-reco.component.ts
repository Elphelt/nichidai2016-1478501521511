import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { FileUploader } from 'ng2-file-upload';
import { animateFactory } from 'ng2-animate';

@Component({
  selector: 'app-visual-reco',
  templateUrl: './visual-reco.component.html',
  styleUrls: ['./visual-reco.component.css'],
   animations: [animateFactory(500, 200, 'ease-in')]
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

  public filePreviewPath: SafeUrl;

  constructor(private sanitizer: DomSanitizer) {
    var that = this;
    this.uploader = new FileUploader({ url: '/up', itemAlias: 'multipartFile', disableMultipart: false });
    this.uploader.onAfterAddingFile = (fileItem: any) => {
      that.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
      that.loadingFlag = true;
      that.resultFlag = false;
      that.uploader.uploadAll();
    }
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      that.loadingFlag = false;
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
    };
  }

  ngOnInit() { };

}
