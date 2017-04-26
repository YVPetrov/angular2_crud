import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {OptionStyle} from '../shared/constants/option-style.enum';

@Component({
  selector: 'app-option-style',
  templateUrl: './option-style.component.html',
  styleUrls: ['./option-style.component.css']
})
export class OptionStyleComponent implements OnInit {

  @Input() currentOptionStyle: OptionStyle;
  @Output() optionStyleChange = new EventEmitter();

  constructor() {
  }

  optionStyle = OptionStyle;

  ngOnInit() {
  }

  isActive(value: OptionStyle) {
    return this.currentOptionStyle === value;
  }

  setOptionStyle(value: OptionStyle) {
    this.optionStyleChange.emit(value);
  }

}
