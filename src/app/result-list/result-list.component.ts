import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {IOption} from "../shared/model/ioption";
import {OptionStyle} from "../shared/constants/option-style.enum";
import {OptionType} from "../shared/constants/option-type.enum";
import {BarrierUpDown} from "../shared/constants/barrier-up-down.enum";
import {BarrierInOut} from "../shared/constants/barrier-in-out.enum";
import {OptionBinary} from "../shared/constants/option-binary.enum";

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css']
})
export class ResultListComponent implements OnInit {

  constructor() { }
  @Input() newOption: IOption;
  @Output() priceChange = new EventEmitter();

  ngOnInit() {
  }

  options: IOption[] = [];
  value: boolean;
  addOption(option: IOption) {
    this.value = false;
    this.priceChange.emit(this.value);
    this.options = this.options.concat(option);
  }

  lenghts = this.options.length;

  createNewOption(): IOption {
    return {
      timeToExpiration: this.newOption.timeToExpiration,
      type: this.newOption.type,
      strike: this.newOption.strike,
      spot: this.newOption.spot,
      rate: this.newOption.rate,
      dividend: this.newOption.dividend,
      volatility: this.newOption.volatility,
      price: this.newOption.price,
      style: this.newOption.style,
      cashOrAsset: this.newOption.cashOrAsset,
      bonus: this.newOption.bonus,
      upOrDown: this.newOption.upOrDown,
      inOrOut: this.newOption.inOrOut,
      barrier: this.newOption.barrier
    };
  }

  deleteOption(option: IOption) {
    this.options.splice(this.options.indexOf(option), 1);
  }

  optionStyle(style: OptionStyle) {
    switch (style) {
      case OptionStyle.european:
        return 'european';
      case OptionStyle.binary:
        return 'binary';
      default:
        return 'barrier';
    }
  }

  optionType(type: OptionType) {
    switch (type) {
      case OptionType.call:
        return 'call';
      default: return 'put';
    }
  }
  optionBarrierUpDown(upDown: BarrierUpDown) {
    switch (upDown) {
      case BarrierUpDown.up:
        return 'up';
      default : return 'down';
    }
  }

  optionBarrierInOut(inOut: BarrierInOut) {
    switch (inOut) {
      case BarrierInOut.in:
        return 'in';
      default : return 'out';
    }
  }

  optionBinaryCashAsset(cashAsset: OptionBinary) {
    switch (cashAsset) {
      case OptionBinary.asset:
        return 'asset';
      default : return 'cash';
    }
  }
  optionName(option: IOption) {
    switch (option.style) {
      case OptionStyle.barrier:
        return this.optionType(option.type) + ' ' + this.optionBarrierInOut(option.inOrOut) + '-'
          + this.optionBarrierUpDown(option.upOrDown);
      case OptionStyle.binary:
        return this.optionType(option.type) + ' ' + this.optionBinaryCashAsset(option.cashOrAsset);
      default: this.optionType(option.type);
    }
  }



}
