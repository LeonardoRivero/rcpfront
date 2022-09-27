import { date } from 'quasar';
export class Validators {
  dateGreater(dateString: string): boolean | null {
    if (!date.isValid(dateString)) {
      return null;
    }
    const timeStamp = Date.now();
    console.log(dateString);
    const years = 'years';

    const diffYear = date.getDateDiff(dateString, timeStamp, years);
    if (diffYear < 0) {
      return false;
    }
    const month = 'months';
    const diffMonth = date.getDateDiff(dateString, timeStamp, month);
    if (diffMonth < 0) {
      this.hourGreater(dateString);
      return false;
    }
    const days = 'days';
    const diffDays = date.getDateDiff(dateString, timeStamp, days);
    if (diffDays < 0) {
      return false;
    }
    const hourIsValid = this.hourGreater(dateString);
    if (hourIsValid === false) {
      return false;
    }
    return true;
  }
  hourGreater(dateString: string): boolean | null {
    if (!date.isValid(dateString)) {
      return null;
    }
    const timeStamp = Date.now();
    const hours = 'hours';
    const diffHour = date.getDateDiff(dateString, timeStamp, hours);
    if (diffHour < 0) {
      return false;
    }
    const minutes = 'minutes';
    const diffMinutes = date.getDateDiff(dateString, timeStamp, minutes);
    if (diffMinutes < 0) {
      return false;
    }
    return true;
  }
}
