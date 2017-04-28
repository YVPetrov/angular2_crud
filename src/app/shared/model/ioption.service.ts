import { Injectable } from '@angular/core';
import { IOption } from './ioption';
import {OptionType} from '../constants/option-type.enum';
import {OptionBinary} from '../constants/option-binary.enum';
import {BarrierInOut} from '../constants/barrier-in-out.enum';
import {BarrierUpDown} from '../constants/barrier-up-down.enum';

@Injectable()
export class IOptionService {

  private options: IOption[];

  CND(x: number): number {
    const a1 = 0.31938153;
    const a2 = -0.356563782;
    const a3 = 1.781477937;
    const a4 = -1.821255978;
    const a5 = 1.330274429;

    function result(y: number): number {
      const k = 1.0 / (1.0 + 0.2316419 * y);
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

    const d1 = (Math.log(spot / strike) + (rate - dividend + volatility * volatility / 2.0) * timeToExpiration)
      / (volatility * Math.sqrt(timeToExpiration));
    const d2 = d1 - volatility * Math.sqrt(timeToExpiration);


    if (type === OptionType.call) {
      return spot * Math.exp(-dividend * timeToExpiration) * this.CND(d1) - strike * Math.exp(-rate * timeToExpiration) * this.CND(d2);
    } else {
      return strike * Math.exp(-rate * timeToExpiration) * this.CND(-d2) - spot * Math.exp(-dividend * timeToExpiration) * this.CND(-d1);
    }
  }

  optionPriceBinary(timeToExpiration: number, type: OptionType, spot: number, strike: number,
                    rate: number, dividend: number, volatility: number, bonus: number, cashOrAsset: OptionBinary) {
    const d1 = (Math.log(spot / strike) + (rate - dividend + volatility * volatility / 2.0) * timeToExpiration)
      / (volatility * Math.sqrt(timeToExpiration));
    const d2 = d1 - volatility * Math.sqrt(timeToExpiration);

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

    const d1 = (Math.log(spot / strike) + (rate - dividend + volatility * volatility / 2.0) * timeToExpiration)
      / (volatility * Math.sqrt(timeToExpiration));
    const d2 = d1 - volatility * Math.sqrt(timeToExpiration);

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

  constructor() { }

}
