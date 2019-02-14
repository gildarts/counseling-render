import { Component, OnInit } from '@angular/core';
import { SentenceService } from 'src/app/render';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sentence-test',
  templateUrl: './sentence-test.component.html',
  styleUrls: ['./sentence-test.component.css']
})
export class SentenceTestComponent implements OnInit {

  sentence = `飛水：天使（%TEXT3%）、聖天馬（%TEXT1%）、吸血蝙蝠（%RTEXT2%）、龍蝦巨獸（%TEXT%）`;
  martix = ['', '雪莉、安潔莉娜', '', '露娜', '', '索妮亞', '', '安潔莉娜'];
  value: string;
  data: any;

  martixControl = new FormControl(this.martix);

  constructor(
    private stnSrv: SentenceService
  ) {
    this.data = stnSrv.apply(this.sentence, this.martix);

    this.value = stnSrv.join(this.data);
  }

  ngOnInit() {

    this.martixControl.valueChanges.subscribe(v => {
      this.martix = v;
    });
  }

}
