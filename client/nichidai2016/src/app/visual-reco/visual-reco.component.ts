import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-visual-reco',
  templateUrl: './visual-reco.component.html',
  styleUrls: ['./visual-reco.component.css']
})

export class VisualRecoComponent implements OnInit {
  title = '日大特別講義2016 画像解析アプリ';
  private alc: any;
  public uploader: FileUploader;
  watsonResult: any;
  watsonFace: any = JSON.stringify('');
  private showFace: boolean = false;
  private showAge: boolean = false;
  private showGender: boolean = false;
  private showIdentity: boolean = false;


  constructor() {
    var that = this;
    that.uploader = new FileUploader({ url: '/up', itemAlias: 'multipartFile', disableMultipart: false });
    that.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
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
