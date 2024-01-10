import { IExam, Permission } from './ModelsDB';
export interface SpecialityResponse {
  id: number;
  description: string;
  code: number;
}
export interface DXMainCodeResponse {
  id: number;
  CUP: string;
  description: string;
  speciality: SpecialityResponse;
}
export interface RelationCodeResponse {
  id: number;
  description: string;
  code: string;
  dxmaincode: DXMainCodeResponse;
}
export interface DoctorResponse {
  id: number;
  codigo: string;
  name: string;
  lastName: string;
  speciality: Array<SpecialityResponse>;
}
export interface PhysicalExamResponse {
  id: number;
  description: string;
  speciality: SpecialityResponse;
  active: boolean;
}
export interface PatientStatusResponse {
  id: number;
  code: string;
  description: string;
}
export interface ReasonConsultResponse {
  id: number;
  abbreviation: string;
}
export interface AppointmentResponse {
  price: number;
  copayment: number;
  amountPaid: number;
  date: string;
  authorizationNumber: string;
  patientStatus: PatientResponse;
  reasonConsult: ReasonConsultResponse;
  schedule: EventScheduleResponse;
  patient: PatientResponse;
  doctor: DoctorResponse;
  paymentMethod: PaymentOptionsResponse;
  codeTransaction: string;
  isPrivate: boolean;
}

export interface PaginationAppointmentResponse {
  count: number;
  total: number;
  page_size: number;
  current: number;
  previous?: number;
  next?: number;
  results: Array<AppointmentResponse>;
}
export interface EventScheduleResponse {
  id: number;
  title: string;
  start: string;
  end: string;
  patient: PatientResponse;
  speciality: SpecialityResponse;
  doctor: DoctorSpecialityResponse;
  observations: string;
}
export interface GenderResponse {
  id: number;
  nameGender: string;
}
export interface HealthInsuranceResponse {
  id: number;
  nameInsurance: string;
  entityCode: string;
  takeCopayment: boolean;
}
export interface IDTypeResponse {
  id: number;
  description: string;
  abbreviation: string;
}
export interface PatientResponse {
  id: number;
  name: string;
  lastName: string;
  IDType: IDTypeResponse;
  identification: number;
  dateBirth: string;
  phoneNumber: number;
  insurance: HealthInsuranceResponse;
  gender: GenderResponse;
  email: string;
}
export interface PaymentOptionsResponse {
  id: number;
  description: string;
  code: string;
}
export interface PathologicalHistoryResponse {
  id: number;
  description: string;
}
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  first_time: boolean;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  groups: Array<Group>;
}

export interface RegisterResponse {
  detail: string;
}
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: UserResponse;
  groups: Array<Group>;
}

export interface RefreshTokenResponse {
  access: string;
  access_token_expiration: Date;
}

export interface Group {
  id: number;
  name: string;
  permissions: Array<Permission>;
}

export interface PhysicalExamResultResponse {
  _id: string;
  date_exam: string | Date;
  patient_id: number;
  result: Array<IExam>;
}

export interface DoctorSpecialityResponse {
  codigo: string;
  user: UserBase;
  id: number;
}

export interface UserBase {
  id: number;
  first_name: string;
  last_name: string;
}

interface Country {
  name: string;
  name_ascii: string;
  slug: string;
  geoname_id: number;
  alternate_names: string;
  code2: string;
  code3: string;
  continent: string;
  tld: string;
  phone: string;
}

export interface CountryResponse extends Country {
  url: string;
}

interface CountryResponseModel extends Country {
  id: number;
}

interface SubRegion {
  name: string;
  country: string;
  region: string;
  name_ascii: string;
  geoname_id: number;
  alternate_names: string;
  display_name: string;
  geoname_code: string;
}
export interface SubRegionResponse extends SubRegion {
  url: string;
}

export interface SubRegionResponseModel extends SubRegion {
  id: number;
  slug: string;
}

interface Region {
  country: number;
  name: string;
  name_ascii: string;
  geoname_id: number;
  alternate_names: string;
  display_name: string;
  geoname_code: string;
}

export interface RegionResponse extends Region {
  url: string;
}

export interface RegionResponseModel extends Region {
  id: number;
  slug: string;
}

export interface MedicalOfficeResponse {
  id: number;
  address: string;
  country: CountryResponseModel;
  department: RegionResponseModel;
  city: SubRegionResponseModel;
}
