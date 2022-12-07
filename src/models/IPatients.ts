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
export interface IPatientRequest {
  id?: number;
  name: string;
  lastName: string;
  IDType: number;
  identification: number;
  dateBirth: string;
  phoneNumber: number;
  insurance: number;
  gender: number;
  email: string;
}
export interface IPatientResponse {
  id?: number;
  name: string;
  lastName: string;
  IDType: IIDType;
  identification: number;
  dateBirth: string;
  phoneNumber: number;
  insurance: IHealthInsurance;
  gender: IGender;
  email?: string;
}
