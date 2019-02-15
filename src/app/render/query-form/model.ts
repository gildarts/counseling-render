
export interface Question {
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
