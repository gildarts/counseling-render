
export interface QuestionSubject {
  Subject: string;
  QuestionGroup: QuestionGroup[];
}

export interface QuestionGroup {
  Group: string;
  QuestionQuery: QuestionQuery[];
}

export interface QuestionQuery {
  Query: string;
  QuestionText: QuestionText[];
}

export interface QuestionText {
  QuestionCode: string;
  Type: string;
  Require: boolean;
  RequireLink: string;
  Text: string;
  Options: Option[];
}

export interface Option {
  AnswerID: number;
  OptionCode: string;
  OptionText: string;
  AnswerValue: string;
  AnswerMatrix: any[];
  AnswerChecked: boolean;
  AnswerComplete: boolean;
}
