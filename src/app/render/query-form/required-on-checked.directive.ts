import { Directive, OnInit, OnDestroy } from '@angular/core';
import { SentenceComponent } from '../sentence/sentence.component';
import { ControlContainer } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: 'app-sentence[appRequiredOnChecked]'
})
export class RequiredOnCheckedDirective implements OnInit, OnDestroy {

  private _bag = new Subject<void>();

  constructor(
    private sentence: SentenceComponent,
    private option: ControlContainer
  ) { }

  ngOnInit(): void {
    const {control} = this.option;
    const answer = control.get("AnswerChecked");

    answer.valueChanges.pipe(
      takeUntil(this._bag)
    ).subscribe(v => {
      console.log(v);
      this.sentence.applyRequireConf(v);
    });
  }

  ngOnDestroy(): void {
    this._bag.next();
    this._bag.complete();
  }

}
