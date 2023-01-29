import { date } from 'quasar';
import { BASE_YEAR, OPTIONS_HOURS, OPTIONS_MINUTES } from './Constants';

export class Validators {
  private static instance: Validators;
  private options_hours = OPTIONS_HOURS;
  private options_minutes = OPTIONS_MINUTES;
  private constructor() {
    return;
  }
  public static getInstance(): Validators {
    if (!Validators.instance) {
      Validators.instance = new Validators();
    }

    return Validators.instance;
  }
  public dateGreater(dateString: string): boolean | null {
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
      return false;
    }
    const days = 'days';
    const diffDays = date.getDateDiff(dateString, timeStamp, days);
    if (diffDays < 0) {
      return false;
    }
    let hourIsValid = null;
    if (diffDays == 0) {
      hourIsValid = this.hourGreater(dateString);
    }
    if (diffDays > 0) {
      hourIsValid = this.hourIsInRangeAllowed(dateString);
    }
    return hourIsValid == null || hourIsValid == false ? false : true;
    return true;
  }

  public hourIsInRangeAllowed(dateString: string): boolean | null {
    if (!date.isValid(dateString)) {
      return null;
    }

    const dateFormated = new Date(dateString);
    const hour = dateFormated.getHours();
    const minutes = dateFormated.getMinutes();

    if (
      this.options_hours.includes(hour) &&
      this.options_minutes.includes(minutes)
    ) {
      return true;
    }

    return false;
  }

  public hourGreater(dateString: string): boolean | null {
    if (!date.isValid(dateString)) {
      return null;
    }

    const dateFormated = new Date(dateString);
    const hour = dateFormated.getHours();
    const minutes = dateFormated.getMinutes();
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinutes = today.getMinutes();

    if (
      this.options_hours.includes(hour) &&
      this.options_minutes.includes(minutes) &&
      hour >= currentHour
    ) {
      if (minutes > currentMinutes) {
        return true;
      }
      return false;
    }

    return false;
  }
  email(email: string): boolean {
    const emailPattern =
      /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(email);
  }
  calculateAge(birthday: string): number {
    const dateBirthday = new Date(birthday);
    const ageDifMs = Date.now() - dateBirthday.getTime();
    const ageDate = new Date(ageDifMs);
    const result = Math.abs(ageDate.getUTCFullYear() - BASE_YEAR);
    return result;
  }
}

export class Convert {
  public toTitle(sentence: string): string {
    const stringLowered = sentence.toLowerCase();
    const words = stringLowered.split(' ');
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substring(1);
    }
    const result = words.join(' ');
    return result;
  }
}
