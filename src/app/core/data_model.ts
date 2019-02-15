
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
  Options: QOption[];
}

export interface QOption {
  AnswerID: number;
  OptionCode: string;
  OptionText: string;
  AnswerValue: string;
  AnswerMatrix: any[];
  AnswerChecked: boolean;
  AnswerComplete: boolean;
}
