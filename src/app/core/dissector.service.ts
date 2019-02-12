import { Injectable } from '@angular/core';
import { SentenceDissector } from './sentence-dissector';

@Injectable({
  providedIn: 'root'
})
export class DissectorService {

  constructor() { }

  /**
   * 解析字串。
   * @param sentence 飛水：天使（%TEXT3%）、聖天馬（%TEXT1%）、吸血蝙蝠（%RTEXT2%）、龍蝦巨獸（%TEXT%）
   * @param martix ['', '雪莉、安潔莉娜', '', '露娜', '', '索妮亞', '', '安潔莉娜']
   */
  public parse(sentence: string, martix: string[]) {
    const interpreter = new SentenceDissector(sentence);
    return interpreter.applyMartix(martix);
  }
}
