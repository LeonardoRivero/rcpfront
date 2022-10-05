import { date } from 'quasar';
import { BASE_YEAR, MININUM_AGE } from './Constants';
export class Validators {
  dateGreater(dateString: string): boolean | null {
    if (!date.isValid(dateString)) {
      return null;
    }
    const timeStamp = Date.now();
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
  email(email: string): boolean {
    const emailPattern =
      /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(email);
  }
  isAdult(birthday: Date): boolean {
    const dateBirthday = new Date(birthday);
    const ageDifMs = Date.now() - dateBirthday.getTime();
    const ageDate = new Date(ageDifMs);
    const result = Math.abs(ageDate.getUTCFullYear() - BASE_YEAR);
    if (result > MININUM_AGE) {
      return true;
    }
    return false;
  }
}
