
const KeywordPattern = '\%([r]?)(text+)([0-9]{1,2})?\%';

export class SentenceDissector {

  private _expressions: Expression[];

  constructor(private text: string) {
    this._expressions = this.interpret();
  }

  public applyMartix(martix: string[]) {

    const records: TokenData[] = [];

    for (let i = 0 ; i < this._expressions.length; i++) {
      const exp = this._expressions[i];
      const value = martix[i] || '';

      if (exp instanceof LiterallyExpression) {
        records.push({
          type: 'literally',
          text: exp.text,
          value: value,
          size: 0,
          required: true
        } as TokenData);
      } else if (exp instanceof KeywordExpression) {
        records.push({
          type: 'keyword',
          text: exp.text,
          value: value,
          size: exp.size,
          required: exp.require
        } as TokenData);
      }
    }

    return records;
  }

  private interpret() {

    const reg = new RegExp(KeywordPattern, 'gmi');
    const sentence = this.text;
    const parts: LiterallyExpression[] = [];

    let part: RegExpExecArray = null;
    let previousLast = 0;

    // 不斷 match 直到 match 不到。
    while ((part = reg.exec(sentence)) !== null) {

      if (previousLast !== part.index) {
        const parta = sentence.substring(previousLast, part.index);
        parts.push(Expression.parse(parta));
      }

      const partb = sentence.substring(part.index, reg.lastIndex);
      parts.push(Expression.parse(partb));

      previousLast = reg.lastIndex;
    }

    // 如果句字還有最後一段，就直接處理。
    if (sentence.length > previousLast) {
      const text = sentence.substring(previousLast, sentence.length);
      parts.push(Expression.parse(text));
    }

    return parts;
  }
}

export interface TokenData {

  type: TokenType;

  text: string;

  value: string;

  size: number;

  required: boolean;
}

export class Expression {

  protected _text: string;

  protected _type: TokenType;

  constructor() {
  }

  public get text() {
    return this._text;
  }

  public get type() {
    return this._type;
  }

  public static parse(text: string) {
    const pattern = new RegExp(KeywordPattern, 'i');
    const matchs = pattern.exec(text);

    if (matchs) {
      return new KeywordExpression(matchs, text);
    } else {
      return new LiterallyExpression(text);
    }
  }
}

export class LiterallyExpression extends Expression {

  constructor(text: string) {
    super();

    this._text = text;
    this._type = 'literally';
  }
}

export class KeywordExpression extends Expression {

  constructor(regexp: RegExpExecArray, text: string) {
    super();

    this._text = text;
    this._type = 'keyword';

    this.size = +regexp[3] || 0;
    this.require = ['R', 'r'].indexOf(regexp[1]) >= 0 ? true : false;
  }

  public size: number;

  public require: boolean;
}

export type TokenType = 'literally' | 'keyword';
