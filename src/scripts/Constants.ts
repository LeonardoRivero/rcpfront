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
}
export class Messages {
  get successMessage(): string {
    return 'Datos Guardados Correctamente';
  }
  get errorMessage(): string {
    return 'Ocurrio un error. Intentelo de nuevo';
  }
  get isNotAdult(): string {
    return 'Paciente menor de edad';
  }
}
export const MININUM_AGE = 18;
export const BASE_YEAR = 1970;
// export default { EndPoints, Messages };
