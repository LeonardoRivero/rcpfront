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
  public dateAndHour(dateString: string): boolean {
    if (!date.isValid(dateString)) {
      return false;
    }
    const timeStamp = Date.now();
    const dateSchedule = new Date(dateString).getTime();
    if (dateSchedule < timeStamp) {
      return false;
    }
    if (dateSchedule > timeStamp) {
      return this.hourIsInRangeAllowed(dateString);
    }

    const hourIsGreater = this.hourGreater(dateString);
    if (hourIsGreater) {
      const response = this.hourIsInRangeAllowed(dateString);
      return response;
    }
    return false;
  }

  public hourIsInRangeAllowed(dateString: string): boolean {
    if (!date.isValid(dateString)) {
      return false;
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

  public hourGreater(dateString: string): boolean {
    if (!date.isValid(dateString)) {
      return false;
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
  public email(email: string): boolean {
    const emailPattern =
      /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(email);
  }
  public calculateAge(birthday: string): number {
    const dateBirthday = new Date(birthday);
    const ageDifMs = Date.now() - dateBirthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - BASE_YEAR);
  }
  public calculateMonths(birthday: string): number {
    const dateBirthday = new Date(birthday);
    const today = new Date();
    return today.getMonth() - dateBirthday.getMonth();
  }

  // public randomPassword(): string {
  //   const chars =
  //     '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //   const passwordLength = 12;
  //   let password = '';
  //   for (let i = 0; i <= passwordLength; i++) {
  //     const randomNumber = Math.floor(Math.random() * chars.length);
  //     password += chars.substring(randomNumber, randomNumber + 1);
  //   }
  //   return password;
  // }
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

const emailPattern =
  /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
const noSpacesPattern = /^[-\w\.\$@\*\!]{8,150}$/;

const onlyNumbersPattern = /^\d+$/;
export const emailRequired = (val: string) =>
  emailPattern.test(val) || 'Email invalido';

export const required = (val: any) =>
  (val && val.length > 0) || 'Campo requerido';

export const numberRequired = (val: any) => val > 0 || 'Numero invalido';
export const isNotNull = (val: any) => (val && val != null) || 'Campo nulo';
export const isNotUndefined = (val: any) =>
  (val && val != undefined) || 'Campo nulo';
export const short = (val: string) =>
  (val && val.length > 3) || 'Longitud mayor a 3 caracteres';

export const noSpaces = (val: string) =>
  noSpacesPattern.test(val) ||
  'Minimo 8 caracteres. Únicamente letras, dígitos y @ . + - _';

export const noLowerZero = (val: string) =>
  parseInt(val) >= 0 || 'Valor negativo no permitido';

export const isDateInFuture1 = (val: string) => {
  if (!val) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(val);
  return selectedDate < today;
};

export const isDateInFuture = (value: string) => {
  if (!value) return true;
  return isDateInFuture1(value) || 'Fecha futura no permitida';
};

export const onlyNumbers = (val: string) =>
  onlyNumbersPattern.test(val) ||
  'Solo numeros';

export const onlyLetters = (val: string) => {
  return /^[A-Za-z]+$/.test(val) || 'Solo se permiten letras';
};
