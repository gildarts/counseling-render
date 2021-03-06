
export interface QSubject {
  Subject: string;
  QuestionGroup: QGroup[];
}

export interface QGroup {
  Group: string;
  QuestionQuery: QQuery[];
}

export interface QQuery {
  Query: string;
  QuestionText: QQuestion[];
}

export interface QQuestion {
  QuestionCode: string;
  Type: string;
  Require: boolean;
  RequireLink: string;
  Text: string;
  Option: QOption[];
}

export interface QOption {
  AnswerID: number;
  OptionCode: string;
  OptionText: string;
  AnswerValue: string;
  AnswerMatrix: string[];
  AnswerChecked: boolean;
  /**
   * 判斷是否填寫完整，若%RTEXT%項目留空=false
   */
  AnswerComplete: boolean;
}
