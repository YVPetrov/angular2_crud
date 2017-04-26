import { Component, OnInit } from '@angular/core';
import {IOption} from '../shared/model/ioption';
import {OptionType} from '../shared/constants/option-type.enum';
import {OptionStyle} from '../shared/constants/option-style.enum';
import {BarrierUpDown} from '../shared/constants/barrier-up-down.enum';
import {OptionBinary} from '../shared/constants/option-binary.enum';
import {BarrierInOut} from '../shared/constants/barrier-in-out.enum';

@Component({
  selector: 'app-input-list',
  templateUrl: './input-list.component.html',
  styleUrls: ['./input-list.component.css']
})
export class InputListComponent implements OnInit {
  currentStyle: OptionStyle = OptionStyle.european;

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

  constructor() { }

  ngOnInit() {
  }
  addTodo() {
    switch (this.currentStyle) {
      case OptionStyle.binary:
        this.newOption.price = this.optionPriceBinary(this.newOption.timeToExpiration, this.newOption.type, this.newOption.spot,
          this.newOption.strike, this.newOption.rate, this.newOption.dividend, this.newOption.volatility, this.newOption.bonus,
          this.newOption.cashOrAsset);
        return this.newOption.price;

      case OptionStyle.barrier:
        this.newOption.price = this.optionPriceBarrier(this.newOption.timeToExpiration, this.newOption.type, this.newOption.spot,
          this.newOption.strike, this.newOption.rate, this.newOption.dividend, this.newOption.volatility, this.newOption.barrier,
          this.newOption.inOrOut, this.newOption.upOrDown);
        return this.newOption.price;

      default:
        this.newOption.price = this.blackScholes(this.newOption.timeToExpiration, this.newOption.type, this.newOption.spot,
          this.newOption.strike, this.newOption.rate, this.newOption.dividend, this.newOption.volatility);
        return this.newOption.price;
    }
  }
  CND(x: number): number {
    let a1, a2, a3, a4 , a5, k: number ;

    a1 = 0.31938153, a2 = -0.356563782, a3 = 1.781477937, a4 = -1.821255978 , a5 = 1.330274429;

    function result(y: number): number {
      k = 1.0 / (1.0 + 0.2316419 * y);
      return 1.0 - Math.exp(-y * y / 2.0) / Math.sqrt(2 * Math.PI) * k
        * (a1 + k * (a2 + k * (a3 + k * (a4 + k * a5))));
    }

    if (x < 0.0) {
      // x = -1 * x;
      return 1 - result(-x);
    } else {
      return result(x);
    }
  }

  blackScholes(timeToExpiration: number, type: OptionType, spot: number, strike: number,
               rate: number, dividend: number, volatility: number) {

    let d1, d2;

    d1 = (Math.log(spot / strike) + (rate - dividend + volatility * volatility / 2.0) * timeToExpiration)
      / (volatility * Math.sqrt(timeToExpiration));
    d2 = d1 - volatility * Math.sqrt(timeToExpiration);


    if (type === OptionType.call) {
      return spot * Math.exp(-dividend * timeToExpiration) * this.CND(d1) - strike * Math.exp(-rate * timeToExpiration) * this.CND(d2);
    } else {
      return strike * Math.exp(-rate * timeToExpiration) * this.CND(-d2) - spot * Math.exp(-dividend * timeToExpiration) * this.CND(-d1);
    }
  }

  optionPriceBinary(timeToExpiration: number, type: OptionType, spot: number, strike: number,
                    rate: number, dividend: number, volatility: number, bonus: number, cashOrAsset: OptionBinary) {
    let d1, d2;
    d1 = (Math.log(spot / strike) + (rate - dividend + volatility * volatility / 2.0) * timeToExpiration)
      / (volatility * Math.sqrt(timeToExpiration));
    d2 = d1 - volatility * Math.sqrt(timeToExpiration);

    if (cashOrAsset === OptionBinary.cash) {
      if (type === OptionType.call) {
        return bonus * Math.exp(-rate * timeToExpiration) * this.CND(d2);
      } else {
        return bonus * Math.exp(-rate * timeToExpiration) * this.CND(-d2);
      }
    } else {
      if (type === OptionType.call) {
        return bonus * Math.exp(-dividend * timeToExpiration) * this.CND(d1);
      } else {
        return bonus * Math.exp(-dividend * timeToExpiration) * this.CND(-d1);
      }
    }
  }

  optionPriceBarrier(timeToExpiration: number, type: OptionType, spot: number, strike: number, rate: number,
                     dividend: number, volatility: number, barrier: number, inOrOut: BarrierInOut, UpOrDown: BarrierUpDown) {
  let call, put, callOutDown, callInDown, putOutDown, putInDown;
  let callOutUp, callInUp, putOutUp, putInUp;
  let d1, d2;
  d1 = (Math.log(spot / strike) + (rate - dividend + volatility * volatility / 2.0) * timeToExpiration)
    / (volatility * Math.sqrt(timeToExpiration));
  d2 = d1 - volatility * Math.sqrt(timeToExpiration);

  let y1, y2;
  y1 = (rate - dividend + volatility * volatility / 2.0) / (volatility * volatility);
  y2 = Math.log(barrier * barrier / (spot * strike)) / (volatility * Math.sqrt(timeToExpiration))
    + y1 * volatility * Math.sqrt(timeToExpiration);

  let x1, x2;
  x1 = Math.log(spot / barrier) / (volatility * Math.sqrt(timeToExpiration)) + y1 * volatility * Math.sqrt(timeToExpiration);
  x2 = Math.log(barrier / spot) / (volatility * Math.sqrt(timeToExpiration)) + y1 * volatility * Math.sqrt(timeToExpiration);

  call = spot * Math.exp(-dividend * timeToExpiration) * this.CND(d1) - strike * Math.exp(-rate * timeToExpiration) * this.CND(d2);
  put = strike * Math.exp(- rate * timeToExpiration) * this.CND(-d2) - spot * Math.exp(-dividend * timeToExpiration) * this.CND(-d1);

  if (barrier < strike) {
    callInDown = spot * Math.exp(-dividend * timeToExpiration) * Math.pow(barrier / spot, 2 * y1) * this.CND(y2)
      - strike * Math.exp(-rate * timeToExpiration) * Math.pow(barrier / spot, 2 * y1 - 2)
      * this.CND(y2 - volatility * Math.sqrt(timeToExpiration));
    callOutDown = call - callInDown;
    callInUp = call;
    callOutUp = 0;
    putInDown = - spot * Math.exp(-dividend * timeToExpiration) * this.CND(-x1)
      + strike * Math.exp(-rate * timeToExpiration) * this.CND(-x1 + volatility * Math.sqrt(timeToExpiration))
      + spot * Math.exp(-dividend * timeToExpiration) * Math.pow(barrier / spot, 2 * y1) * (this.CND(y2) - this.CND(x2))
      - strike * Math.exp(-rate * timeToExpiration) * Math.pow(barrier / spot, 2 * y1 - 2)
      * (this.CND(y2 - volatility * Math.sqrt(timeToExpiration)) - this.CND(x2 - volatility * Math.sqrt(timeToExpiration)));
    putOutDown = put - putInDown;
    putOutUp = - spot * Math.exp(-dividend * timeToExpiration) * this.CND(-x1)
      + spot * Math.exp(-dividend * timeToExpiration) * Math.pow(barrier / spot, 2 * y1) * this.CND(-x2)
      + strike * Math.exp(-rate * timeToExpiration) * Math.pow(barrier / spot, 2 * y1 - 2)
      * this.CND(-x2 + volatility * Math.sqrt(timeToExpiration));
    putInUp = put - putOutUp;
  } else {
    callOutDown = spot * Math.exp(-dividend * timeToExpiration) * this.CND(x1)
      - strike * Math.exp(- rate * timeToExpiration) * this.CND(x1 - volatility * Math.sqrt(timeToExpiration))
      - spot * Math.exp(-dividend * timeToExpiration) * Math.pow(barrier / spot, 2 * y1) * this.CND(x2)
      + strike * Math.exp(-rate * timeToExpiration) * Math.pow(barrier / spot, 2 * y1 - 2)
      * this.CND(x2 - volatility * Math.sqrt(timeToExpiration));
    callInDown = call - callOutDown;
    callInUp = spot * Math.exp(-dividend * timeToExpiration) * this.CND(x1)
      - strike * Math.exp(-rate * timeToExpiration) * this.CND(x1 - volatility * Math.sqrt(timeToExpiration))
      - spot * Math.exp(-dividend * timeToExpiration) * Math.pow(barrier / spot, 2 * y1) * (this.CND(-y2) - this.CND(-x2))
      + strike * Math.exp(-rate * timeToExpiration) * Math.pow(barrier / spot, 2 * y1 - 2)
      * (this.CND(-y2 + volatility * Math.sqrt(timeToExpiration)) - this.CND(-x2 + volatility * Math.sqrt(timeToExpiration)));
    callOutUp = call - callInUp;
    putOutDown = 0;
    putInDown = put;
    putInUp = - spot * Math.exp(-dividend * timeToExpiration) * Math.pow(barrier / spot, 2 * y1) * this.CND(-y2)
      + strike * Math.exp(-rate * timeToExpiration) * Math.pow(barrier / spot, 2 * y1 - 2)
      * this.CND(-y2 + volatility * Math.sqrt(timeToExpiration));
    putOutUp = put - putInUp;
  }

  if (type === OptionType.call) {
    if (inOrOut === BarrierInOut.in) {
      if (UpOrDown === BarrierUpDown.up) {
        return callInUp;
      } else {
        return callInDown;
      }
    } else {
      if (UpOrDown === BarrierUpDown.up) {
        return callOutUp;
      } else {
        return callOutDown;
      }
    }
  } else {
    if (inOrOut === BarrierInOut.in) {
      if (UpOrDown === BarrierUpDown.up) {
        return putInUp;
      } else {
        return putInDown;
      }
    } else {
      if (UpOrDown === BarrierUpDown.up) {
        return putOutUp;
      } else {
        return putOutDown;
      }
    }
  }
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
