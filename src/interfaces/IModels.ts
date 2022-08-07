export interface ISpeciality {
  id?: number;
  description: string;
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
export interface Forms {
  visible: boolean;
  title: string;
  data: object;
}
