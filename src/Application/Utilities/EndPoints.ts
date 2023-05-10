export class EndPoints {
  private static instance: EndPoints;
  private domine: string;
  private constructor() {
    if (process.env.NODE_ENV == 'development') {
      this.domine = process.env.PUBLIC == undefined ? '' : process.env.PUBLIC;
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
  get getORcreateDoctor() {
    return `${this.domine}/api/doctor/all/`;
  }
  get getORcreatePhysicalExamParameter() {
    return `${this.domine}/api/physicalexamparameter/all/`;
  }
  get getAllPaymentOptions() {
    return `${this.domine}/api/paymentoptions/all/`;
  }
  get getAllPathologicalHistory() {
    return `${this.domine}/api/pathologyhistory/all/`;
  }
  get createUser() {
    return `${this.domine}/api/registration/`;
  }
  get login() {
    return `${this.domine}/api/authentication/login/`;
  }
  get refresh_token() {
    return `${this.domine}/api/authentication/token/refresh/`;
  }
  get validate_token() {
    return `${this.domine}/api/authentication/token/verify/`;
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
