import { Component, OnInit } from '@angular/core';
import { OptionCheckCoordinatorService } from 'src/app/render/option-check-coordinator.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-coordinator-test',
  templateUrl: './coordinator-test.component.html',
  styleUrls: ['./coordinator-test.component.css']
})
export class CoordinatorTestComponent implements OnInit {

  _sign: Subject<void> = new Subject<void>();
  optionCode = '10000002';

  constructor(
    private coordinator: OptionCheckCoordinatorService
  ) { }

  ngOnInit() {
  }

  register() {
    if (this._sign.isStopped) { this._sign = new Subject<void>(); }

    this.coordinator.register(this.optionCode, this._sign)
    .subscribe(v => {
      console.log(`event: ${JSON.stringify(v)}`);
    }, null, () => console.log('completed!'));
  }

  emit_event() {
    this.coordinator.emit(this.optionCode, true);
  }

  unregister() {
    this._sign.next();
    this._sign.complete();
  }

  set_states() {
    this.coordinator.setStates([
      { OptionCode: this.optionCode, AnswerChecked: true },
      { OptionCode: `${this.optionCode}a`, AnswerChecked: true }
    ]);
  }
}
