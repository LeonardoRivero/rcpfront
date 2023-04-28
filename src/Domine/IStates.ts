import { IColumnsDataTable } from './ICommons';
import {
  IDXMainCode,
  IHealthInsurance,
  IPathologycalHistory,
  IPatient,
  IPhysicalExam,
  IRelationCode,
  ISpeciality,
} from './ModelsDB';
import {
  DXMainCodeResponse,
  GenderResponse,
  HealthInsuranceResponse,
  IDTypeResponse,
  PathologicalHistoryResponse,
  PatientResponse,
  PhysicalExamResponse,
  RelationCodeResponse,
  SpecialityResponse,
} from './Responses';

export interface InfoPatientState {
  identificationPatient: string;
  age: number;
  currentPatient: PatientResponse | null;
  iconAvatar: string;
}
export interface PreliminaryDataState {
  allPathologies: Array<PathologicalHistoryResponse>;
  items: Array<unknown>;
  reasonConsultation: string;
  descriptionConsultation: string;
  pathology: PathologicalHistoryResponse | null;
}

export interface PathologicalHistoryState {
  currentPathology: IPathologycalHistory;
  pathology: PathologicalHistoryResponse | null;
  expanded: boolean;
  allPathologies: Array<PathologicalHistoryResponse>;
}

export interface SpecialityFormState {
  currentSpeciality: ISpeciality | null;
  expanded: boolean;
  speciality: ISpeciality | null;
  allSpecialities: Array<SpecialityResponse>;
}

export interface MedicalProcedureState {
  items: Array<unknown>;
}

export interface DxMainCodeState {
  allDxMainCodes: Array<DXMainCodeResponse>;
  currentDxMainCode: IDXMainCode | null;
  expanded: boolean;
  dxMainCode: DXMainCodeResponse | null;
  error: boolean;
}

export interface RelationCodeState {
  allRelationCodes: Array<RelationCodeResponse>;
  currentRelationCode: IRelationCode | null;
  expanded: boolean;
  relationCode: RelationCodeResponse | null;
  errorDxMainCode: boolean;
  errorSpeciality: boolean;
}

export interface InsuranceState {
  allInsurance: Array<HealthInsuranceResponse>;
  currentInsurance: IHealthInsurance;
  expanded: boolean;
  insurance: HealthInsuranceResponse | null;
  error: boolean;
}

export interface PhysicalExamParameterState {
  currentPhysicalExamParameter: IPhysicalExam;
  allPhysicalMedicalParameter: Array<PhysicalExamResponse>;
  allSpecialities: Array<ISpeciality>;
  disable: boolean;
  userCanEdit: boolean;
}

export interface DataTableState {
  title: string;
  columns: Array<IColumnsDataTable>;
  data: object;
  listOptions: Array<unknown>;
  option: unknown | null;
  selected: Array<unknown>;
}

export interface PatientState {
  currentPatient: IPatient;
  allIDTypes: Array<IDTypeResponse>;
  allGenders: Array<GenderResponse>;
  allInsurance: Array<HealthInsuranceResponse>;
  identificationPatient: string;
  idType: IDTypeResponse | null;
  gender: GenderResponse | null;
  insurance: HealthInsuranceResponse | null;
  disable: boolean;
  error: boolean;
  currentInsurance: IHealthInsurance;
}

export interface UserBase {
  email: string;
  username: string;
  password: string;
}
export interface LoginState extends UserBase {
  register: boolean;
  title: string;
  visibility: boolean;
  passwordFieldType: string;
  visibilityIcon: string;
  repassword: string;
  labelMessage: string;
}

export interface UserState extends UserBase {
  name: string;
  lastName: string;
  IdType: number | null;
  identification: number | null;
  dateBirthday: string | Date;
  phoneNumber: number | null;
  groups: Array<number>;
  isActive: boolean;
  lastLogin: string | Date;
  dateJoined: string | Date;
  repassword: string;
}
