import currency from 'currency.js';
import { IHelpers } from 'src/Domine/ICommons';

export class Helpers implements IHelpers {
  getValueFromString(value: string): number {
    if (value === undefined || value === null) {
      return 0
    }
    return currency(value).value

  }
  formatToMoneyString(value: string): string {
    return currency(value).format()
  }
}
