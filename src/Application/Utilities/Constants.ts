import { date } from 'quasar';
const timeStamp = Date.now();

export enum IconSVG {
  stethoscope = 'svguse:stethoscope.svg#icon-1',
  female_avatar = 'img:female-avatar.svg',
  male_avatar = 'img:male-user.svg',
  outpatient = 'img:outpatient.svg',
  womanAndMan = 'users.svg',
  medicalResults = 'img:medical-results-folders.svg',
  bookMedical = 'img:book-health-medical.svg',
  barCode = 'img:barcode.svg',
  barCodePrice = 'img:barcode-price.svg',
  medicalHospital = 'img:medical-hospital-building.svg',
  calendarCheckMark = 'img:calendar-checkmark.svg',
  scheduleCalendar = 'img:schedule-calendar.svg',
  historyLog = 'img:history-log.svg',
  hurt = 'img:hurt.svg',
  physicalTherapy = 'img:physical-therapy.svg',
  question = 'img:question.svg',
  open_book = 'img:open-book.svg',
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
