export interface ISpeciality {
  id?: number;
  description: string;
}
export interface IHealthInsurance {
  id?: number;
  nameInsurance: string;
  entityCode: string;
}
export interface IDXMainCodeRequest {
  id?: number;
  CUP: string;
  description: string;
  speciality: number;
}
export interface IDXMainCodeResponse {
  id?: number;
  CUP: string;
  description: string;
  speciality: ISpeciality;
}
export interface IRelationCodeRequest {
  id?: number;
  description: string;
  code: string;
  dxmaincode: number;
}
export interface IRelationCodeResponse {
  id?: number;
  description: string;
  code: string;
  dxmaincode: IDXMainCodeResponse;
}
export interface Forms {
  visible: boolean;
  title: string;
  data: object;
}
export interface IIDType {
  id: number;
  description: string;
  abbreviation: string;
}
export interface IGender {
  id: number;
  nameGender: string;
}
export interface IPatientRequest {
  id?: number;
  name: string;
  lastName: string;
  IDType: number;
  identification: number;
  dateBirth: Date;
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
  dateBirth: Date;
  phoneNumber: number;
  insurance: number;
  gender: IGender;
  email: string;
}
