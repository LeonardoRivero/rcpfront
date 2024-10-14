export interface ISpeciality {
  id?: number;
  description: string;
  code: number;
}

export interface IDXMainCode {
  id?: number;
  CUP: string;
  description: string;
  speciality: number;
}

export interface IRelationCode {
  id?: number;
  description: string;
  code: string;
  dxmaincode: number;
}

export interface IDoctor {
  id?: number;
  codigo: string;
  user: number;
  speciality: Array<number> | Array<ISpeciality>;
}

export interface IPhysicalExam {
  id?: number;
  description: string;
  speciality: number;
  active: boolean;
}

export interface IPatientStatus {
  id?: number;
  code: string;
  description: string;
}

export interface IReasonConsult {
  id?: number;
  abbreviation: string;
}

export interface IAppointment {
  id?: number;
  price: number;
  copayment: number;
  amountPaid: number;
  date: string;
  authorizationNumber: string;
  patientStatus: number;
  reasonConsult: number;
  schedule: number;
  patient: number;
  doctor: number;
  paymentMethod: number;
  codeTransaction: string | null;
  isPrivate: boolean;
}

export interface EventSchedule {
  id?: number;
  title: string;
  start: string;
  end: string;
  patient: number;
  speciality: number;
  doctor: number;
  observations: string;
}

export interface IGender {
  id: number;
  nameGender: string;
}

export interface IHealthInsurance {
  id?: number;
  nameInsurance: string;
  entityCode: string;
  takeCopayment: boolean;
}

export interface IIDType {
  id?: number;
  description: string;
  abbreviation: string;
}

export interface IPatient {
  id?: number;
  nationalityId: number;
  documentTypeId: number;
  identification: string;
  name: string;
  lastName: string;
  dateBirth: string;
  biologicalSexId: number;
  genderId: number;
  occupationId: number;
  kindDisabilityId: number;
  countryStayId: number;
  cityStayId: number;
  ethnicityId: number;
  zoneStayId: number;
  healthEntityId: number;
  phoneNumber: string;
  email: string;
}

export interface IPaymentOptions {
  id: number;
  description: string;
  code: string;
}

export interface IPathologycalHistory {
  id?: number;
  description: string;
}

export interface IUser {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  first_time: boolean;
  group: number | null;
  medical_office: number | null;
}

export interface ILogin {
  id?: number;
  email: string;
  password: string;
}

export interface IKeyEmailRegistration {
  key: string;
}

export interface Permission {
  id?: number;
  name: string;
  codename: string;
  content_type: number;
}

export interface IExam {
  id?: number;
  description: string;
  result: string;
}

export interface IMedicalOffice {
  id?: number;
  country: number;
  city: number;
  department: number;
  address: string;
}

export interface IMedicalHistory {
  current_disease: string;
  reason_consultation: string;
  appointment: number;
  speciality: number;
  patient: number;
  doctor: number;
  dx_main_code: number;
  relation_code: number;
  pathologies: Array<number>;
  physical_exam_result: Array<IExam>;
}
