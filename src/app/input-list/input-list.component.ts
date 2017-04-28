import { Component, OnInit } from '@angular/core';
import {IOption} from '../shared/model/ioption';
import {OptionType} from '../shared/constants/option-type.enum';
import {OptionStyle} from '../shared/constants/option-style.enum';
import {BarrierUpDown} from '../shared/constants/barrier-up-down.enum';
import {OptionBinary} from '../shared/constants/option-binary.enum';
import {BarrierInOut} from '../shared/constants/barrier-in-out.enum';
import {IOptionService} from '../shared/model/ioption.service';

@Component({
  selector: 'app-input-list',
  templateUrl: './input-list.component.html',
  styleUrls: ['./input-list.component.css'],
})
export class InputListComponent implements OnInit {
  currentStyle: OptionStyle = OptionStyle.european;
  calc: boolean;

  newOption: IOption = {
    timeToExpiration: 1,
    type: OptionType.call,
    strike: 35,
    spot: 30,
    rate: 0.02,
    dividend: 0,
    volatility: 0.3,
    price: NaN,
    style: OptionStyle.european,
    cashOrAsset: OptionBinary.asset,
    bonus: 50,
    upOrDown: BarrierUpDown.up,
    inOrOut: BarrierInOut.in,
    barrier: 35
  }

  constructor(private optionService: IOptionService) { }

  ngOnInit() {
  }
  calculatePrice() {
    this.calc = true;
    switch (this.currentStyle) {
      case OptionStyle.binary:
        this.newOption.price = this.optionService.optionPriceBinary(this.newOption.timeToExpiration, this.newOption.type, this.newOption.spot,
          this.newOption.strike, this.newOption.rate, this.newOption.dividend, this.newOption.volatility, this.newOption.bonus,
          this.newOption.cashOrAsset);
        return this.newOption.price;

      case OptionStyle.barrier:
        this.newOption.price = this.optionService.optionPriceBarrier(this.newOption.timeToExpiration, this.newOption.type, this.newOption.spot,
          this.newOption.strike, this.newOption.rate, this.newOption.dividend, this.newOption.volatility, this.newOption.barrier,
          this.newOption.inOrOut, this.newOption.upOrDown);
        return this.newOption.price;

      default:
        this.newOption.price = this.optionService.blackScholes(this.newOption.timeToExpiration, this.newOption.type, this.newOption.spot,
          this.newOption.strike, this.newOption.rate, this.newOption.dividend, this.newOption.volatility);
        return this.newOption.price;
    };
  }

  isCalculate() {
    return this.calc;
  }

  onPrice(value: boolean) {
    this.calc = value;
  }

  onOptionStyleChange(value: OptionStyle) {
    this.currentStyle = value;
    this.newOption.style = value;
  }
  changeType() {
    this.newOption.type = this.newOption.type === OptionType.call  ? OptionType.put : OptionType.call;
  }
  changeCashOrAsset() {
    this.newOption.cashOrAsset = this.newOption.cashOrAsset === OptionBinary.asset  ? OptionBinary.cash : OptionBinary.asset;
  }
  changeUpOrDown() {
    this.newOption.upOrDown = this.newOption.upOrDown === BarrierUpDown.up  ? BarrierUpDown.down : BarrierUpDown.up;
  }
  changeInOrOut() {
    this.newOption.inOrOut = this.newOption.inOrOut === BarrierInOut.in  ? BarrierInOut.out : BarrierInOut.in;
  }


}
