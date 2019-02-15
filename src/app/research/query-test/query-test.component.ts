import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-query-test',
  templateUrl: './query-test.component.html',
  styleUrls: ['./query-test.component.css']
})
export class QueryTestComponent implements OnInit {

  data = demo;

  constructor() { }

  ngOnInit() {
  }
}

const demo = [
  {
    "QuestionCode": "Q10000017",
    "Type": "單選",
    "Require": true,
    "RequireLink": "",
    "Text": "領有身心障礙手冊",
    "Options": [
      {
        "AnswerID": 36,
        "OptionCode": "10000037",
        "OptionText": "否",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 37,
        "OptionCode": "10000038",
        "OptionText": "是",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  },
  {
    "QuestionCode": "Q10000018",
    "Type": "填答",
    "Require": true,
    "RequireLink": "",
    "Text": "身心障礙等級",
    "Options": [
      {
        "AnswerID": 38,
        "OptionCode": "10000039",
        "OptionText": "%TEXT2%",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  },
  {
    "QuestionCode": "Q10000019",
    "Type": "填答",
    "Require": true,
    "RequireLink": "",
    "Text": "鑑定日期",
    "Options": [
      {
        "AnswerID": 39,
        "OptionCode": "10000040",
        "OptionText": "%TEXT2%",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  },
  {
    "QuestionCode": "Q10000020",
    "Type": "填答",
    "Require": true,
    "RequireLink": "",
    "Text": "鑑定文號",
    "Options": [
      {
        "AnswerID": 40,
        "OptionCode": "10000041",
        "OptionText": "%TEXT3%",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  },
  {
    "QuestionCode": "Q10000021",
    "Type": "填答",
    "Require": true,
    "RequireLink": "",
    "Text": "身心障礙類別",
    "Options": [
      {
        "AnswerID": 41,
        "OptionCode": "10000042",
        "OptionText": "%TEXT3%",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  }
];
