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
  public uploader:FileUploader;
  watsonResult: any;
  

  constructor(){
    this.uploader = new FileUploader({url: '/up',itemAlias: 'multipartFile',disableMultipart: false});
    this.uploader.onCompleteItem = (item:any,response:any,status:any,headers:any) => {
      this.watsonResult = JSON.parse(response).images[0].classifiers[0].classes;
    };
  }

  ngOnInit() { };

}
