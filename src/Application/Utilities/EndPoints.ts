export class EndPoints {
  private static instance: EndPoints;
  private domine: string;
  private constructor() {
    if (process.env.NODE_ENV == 'development') {
      this.domine = process.env.LOCAL == undefined ? '' : process.env.LOCAL;
      return;
    }
    this.domine = process.env.PUBLIC == undefined ? '' : process.env.PUBLIC;
  }
  public static getInstance(): EndPoints {
    if (!EndPoints.instance) {
      EndPoints.instance = new EndPoints();
    }
    return EndPoints.instance;
  }
  public static buildFullUrl(endpoint?: string): string {
    const endPointInstance = EndPoints.getInstance();
    if (endpoint == undefined) throw Error('Endpoint undefined');
    return `${endPointInstance.domine}${endpoint}`;
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
  updateOrGetAppointmentByScheduleId(id: number): string {
    return `${this.domine}/api/consult/${id}/`;
  }
  updateOrGetScheduleById(id: number): string {
    return `${this.domine}/api/schedule/${id}/`;
  }
  updateOrGetPhysicalExamParameterById(id: number): string {
    return `${this.domine}/api/physicalexamparameter/${id}/`;
  }
  updateOrGetDoctorById(id: number): string {
    return `${this.domine}/api/doctor/${id}/`;
  }
  updateOrGetPathologyById(id: number): string {
    return `${this.domine}/api/pathologyhistory/${id}/`;
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
