import {OptionType} from '../constants/option-type.enum';
import {OptionStyle} from '../constants/option-style.enum';
import {OptionBinary} from '../constants/option-binary.enum';
import {BarrierInOut} from '../constants/barrier-in-out.enum';
import {BarrierUpDown} from '../constants/barrier-up-down.enum';
export interface IOption {
  timeToExpiration: number;
  type: OptionType;
  strike: number;
  spot: number;
  rate: number;
  dividend: number;
  volatility: number;
  price?: number;
  style: OptionStyle;
  cashOrAsset?: OptionBinary;
  bonus?: number;
  inOrOut?: BarrierInOut;
  upOrDown?: BarrierUpDown;
  barrier?: number;
}
