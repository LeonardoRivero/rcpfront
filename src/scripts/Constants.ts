export class EndPoints {
  private domine = 'https://leonardorivero.pythonanywhere.com';
  get getAllGender() {
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
  updateInsurance(id: number): string {
    return `${this.domine}/api/insurance/${id}/`;
  }
  updateSpeciality(id: number): string {
    return `${this.domine}/api/speciality/${id}/`;
  }
  updateDxMainCode(id: number): string {
    return `${this.domine}/api/dxmaincode/${id}/`;
  }
}
export class Messages {
  get successMessage(): string {
    return 'Datos Guardados Correctamente';
  }
  get errorMessage(): string {
    return 'Ocurrio un error. Intentelo de nuevo';
  }
}
// export default { EndPoints, Messages };
