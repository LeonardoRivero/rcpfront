export interface ISpeciality {
  id?: number;
  description: string;
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
  name: string;
  lastName: string;
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
  date: string | Date;
  authorizationNumber: string;
  patientStatus: number;
  reasonConsult: number;
  schedule: number;
  patient: number;
  doctor: number;
}
export interface EventSchedule {
  id?: number;
  title: string;
  start: string;
  end: string;
  patient: number;
  speciality: number;
  doctor: number;
}
export interface IGender {
  id: number;
  nameGender: string;
}
export interface IHealthInsurance {
  id?: number;
  nameInsurance: string;
  entityCode: string;
}
export interface IIDType {
  id?: number;
  description: string;
  abbreviation: string;
}
export interface IPatient {
  id?: number;
  name: string;
  lastName: string;
  IDType: number;
  identification: number;
  dateBirth: string | Date;
  phoneNumber: number;
  insurance: number;
  gender: number;
  email: string;
}
// export interface IDXMainCodeResponse {
//   id?: number;
//   CUP: string;
//   description: string;
//   speciality: ISpeciality;
// }
// export interface IRelationCodeResponse {
//   id?: number;
//   description: string;
//   code: string;
//   dxmaincode: IDXMainCodeResponse;
// }

// export interface IDoctorResponse {
//   id?: number;
//   codigo: string;
//   name: string;
//   lastName: string;
//   speciality: ISpeciality;
// }

// export interface IPhysicalExamResponse {
//   id?: number;
//   description: string;
//   speciality:ISpeciality ;
//   active: boolean;
// }
