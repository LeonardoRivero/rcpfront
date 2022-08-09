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
