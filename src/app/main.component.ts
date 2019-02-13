import { Component, OnInit } from '@angular/core';
import { SentenceService } from './render';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  data: any;
  value: string;

  constructor(
    private stnSrv: SentenceService
  ) {

    const sentence = `飛水：天使（%TEXT3%）、聖天馬（%TEXT1%）、吸血蝙蝠（%RTEXT2%）、龍蝦巨獸（%TEXT%）`;
    const martix = ['', '雪莉、安潔莉娜', '', '露娜', '', '索妮亞', '', '安潔莉娜'];
    this.data = stnSrv.apply(sentence, martix);

    this.value = stnSrv.join(this.data);
  }

  ngOnInit() {
  }

}
