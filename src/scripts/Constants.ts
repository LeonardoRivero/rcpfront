import { date } from 'quasar';
const timeStamp = Date.now();

export class EndPoints {
  private domine = 'https://leonardorivero.pythonanywhere.com';
  //private domine = 'http://127.0.0.1:8000';
  get getAllIDType() {
    return `${this.domine}/api/idtype/all/`;
  }
  get getORcreateInsurance(): string {
    return `${this.domine}/api/insurance/all/`;
  }
  get getORcreateSpeciality(): string {
    return `${this.domine}/api/speciality/all/`;
  }
  get getORcreateDxMainCode(): string {
    return `${this.domine}/api/dxmaincode/all/`;
  }
  get getORcreateRelationCode(): string {
    return `${this.domine}/api/relationcode/all/`;
  }
  get getAllGender(): string {
    return `${this.domine}/api/gender/all/`;
  }
  get getORcreatePatient(): string {
    return `${this.domine}/api/patient/all/`;
  }
  get getORcreateConsult() {
    return `${this.domine}/api/consult/all/`;
  }
  get getORcreatePatientStatus() {
    return `${this.domine}/api/patientstatus/all/`;
  }
  get getORcreateReasonConsult() {
    return `${this.domine}/api/reasonconsult/all/`;
  }
  get getORcreateSchedule() {
    return `${this.domine}/api/schedule/all/`;
  }
  updateInsurance(id: number): string {
    return `${this.domine}/api/insurance/${id}/`;
  }
  updateSpeciality(id: number): string {
    return `${this.domine}/api/speciality/${id}/`;
  }
  updateDxMainCode(id: number): string {
    return `${this.domine}/api/dxmaincode/${id}/`;
  }
  updateRelationCode(id: number): string {
    return `${this.domine}/api/relationcode/${id}/`;
  }
  updatePatient(id: number): string {
    return `${this.domine}/api/patient/${id}/`;
  }
  updateSchedule(id: number): string {
    return `${this.domine}/api/schedule/${id}/`;
  }
  urlQueryParameter(urlBase: string, parameters: object): string {
    urlBase = urlBase.concat('?');
    for (const [key, value] of Object.entries(parameters)) {
      urlBase = urlBase.concat(key, '=', value, '&');
    }
    const fullUrl = urlBase.slice(0, -1);
    return fullUrl;
  }
}
export class Messages {
  get successMessage(): string {
    return 'Datos Guardados Exitosamente';
  }
  get errorMessage(): string {
    return 'Ocurrio un error. Intentalo de nuevo';
  }
  get isNotAdult(): string {
    return 'Paciente menor de edad';
  }
  get notInfoFound(): string {
    return 'No se encontró información';
  }
  get searchIncorrect(): string {
    return 'Busqueda incorrecta o campos invalidos';
  }
  get updateSuccesfully(): string {
    return 'Datos actualizados correctamente';
  }
  get notFoundInfoPatient(): string {
    return 'No encontramos el paciente con la información suministrada, ¿Deseas crearlo ahora mismo ?';
  }
  get dateOrHourNotValid(): string {
    return 'Hora o fecha ingresada no es valida.Intentelo de nuevo';
  }
  get newRegister(): string {
    return '¿Haz verificado los datos para crear el nuevo registro?';
  }
  get updateRegister(): string {
    return '¿Deseas actualizar los datos ingresados?';
  }
}
export const MININUM_AGE = 18;
export const BASE_YEAR = 1970;
export const FORMAT_DATE = 'YYYY/MM/DD';
export const FORMAT_HOUR = 'HH:mm';
export const FORMAT_DATETIME = 'YYYY-MM-DD HH:mm';
export const OPTIONS_MINUTES = [0, 20, 40];
export const OPTIONS_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
export const CURRENTYEAR_MONTH = date.formatDate(timeStamp, 'YYYY/MM');
