import { date } from 'quasar';
const timeStamp = Date.now();

export class IconSVG {
  private static instance: IconSVG;
  private constructor() {
    return;
  }
  public static getInstance(): IconSVG {
    if (!IconSVG.instance) {
      IconSVG.instance = new IconSVG();
    }
    return IconSVG.instance;
  }
  get stethoscope() {
    return 'svguse:stethoscope.svg#icon-1';
  }
  get female_avatar() {
    return 'img:female-avatar.svg';
  }
  get male_avatar() {
    return 'img:male-user.svg';
  }
  get outpatient() {
    return 'img:outpatient.svg';
  }
  get womanAndMan() {
    return 'woman-and-man.svg';
  }
  get medicalResults() {
    return 'img:medical-results-folders.svg';
  }
  get bookMedical() {
    return 'img:book-health-medical.svg';
  }
  get barCode() {
    return 'img:barcode.svg';
  }
  get barCodePrice() {
    return 'img:barcode-price.svg';
  }
  get medicalHospital() {
    return 'img:medical-hospital-building.svg';
  }
  get calendarCheckMark() {
    return 'img:calendar-checkmark.svg';
  }
  get scheduleCalendar() {
    return 'img:schedule-calendar.svg';
  }
  get historyLog() {
    return 'img:history-log.svg';
  }
  get hurt() {
    return 'img:hurt.svg';
  }
  get physicalTherapy() {
    return 'img:physical-therapy.svg';
  }
}
export enum Gender {
  FEMALE = 1,
  MALE = 2,
}
export const MININUM_AGE = 18;
export const BASE_YEAR = 1970;
export const FORMAT_DATE = 'YYYY/MM/DD';
export const FORMAT_HOUR = 'HH:mm';
export const FORMAT_DATETIME = 'YYYY-MM-DD HH:mm';
export const OPTIONS_MINUTES = [0, 20, 40];
export const OPTIONS_HOURS = [
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
];
export const CURRENTYEAR_MONTH = date.formatDate(timeStamp, 'YYYY/MM');
export const FIELD_REQUIRED = 'Campo Requerido';
export const START_TIME = '07:00';
export const END_TIME = '18:00';
export const DURATION_APPOINTMENT = '00:20';
export const MINUTES_APPOINTMENT = parseInt(DURATION_APPOINTMENT.split(':')[1]);
