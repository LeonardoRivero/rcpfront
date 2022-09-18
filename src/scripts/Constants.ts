export class EndPoints {
  private domine = 'https://leonardorivero.pythonanywhere.com';
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
    return 'Ocurrio un error. Intentelo de nuevo';
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
}
export const MININUM_AGE = 18;
export const BASE_YEAR = 1970;
export const FORMAT_DATE = 'YYYY/MM/DD';
export const FORMAT_HOUR = 'HH:mm';
// export default { EndPoints, Messages };
