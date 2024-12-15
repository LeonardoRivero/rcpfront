import { IExam, Permission } from './Request';
export interface ResponseData<T> {
  description: string
  result: T
}
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
export interface DocumentTypeResponse {
  id: number
  code: string
  description: string
}
export interface DoctorResponse {
  id: number
  name: string
  lastName: string
  documentTypeId: number
  documentNumber: number
  userId: string
  phoneNumber: string
  documentType: DocumentTypeResponse
}

interface SecretaryMedicalOffice {
  secretaryId: number,
  medicalOfficeId: number
}
export interface SecretaryResponse {
  id: number
  name: string
  lastName: string
  documentTypeId: number
  documentNumber: number
  userId: string
  phoneNumber: string
  documentType: DocumentTypeResponse
  secretaryMedicalOffice: SecretaryMedicalOffice[]
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
  schedule: ScheduleResponse;
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
export interface ScheduleResponse {
  id: number;
  title: string;
  start: string;
  end: string;
  specialityId: number
  doctorId: number
  medicalofficeId: number
  patientId: number
  patient: Patient;
  speciality: SpecialityResponse;
  doctor: DoctorResponse;
  medicalOffice: MedicalOfficeResponse
  observations: string;
  healthEntity: HealthInsuranceResponse
}
export interface GenderResponse {
  id: number;
  code: string;
  description: string;
}
export interface HealthInsuranceResponse {
  id: number;
  name: string;
  code: string;
  regimen: string;
  nit: string
}

export interface Patient {
  id: number;
  identification: string;
  name: string;
  lastName: string;
  dateBirth: string;
  phoneNumber: string;
  email: string;
}
export interface PatientResponse extends Patient {
  country: CountryResponse;
  countryStay: CountryResponse;
  cityStay: CityResponse;
  healthEntity: HealthInsuranceResponse;
  ethnicity: EthicityResponse;
  documentType: DocumentTypeResponse
  gender: GenderResponse;
  ocupation: OcupationResponse;
  kindDisability: KindDisabilityResponse;
  biologicalSex: BiologicalSexResponse;
  zoneStay: ZoneStayResponse
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
  refreshToken: string,
  token: string,
  isFirstLogin: boolean
  userId: string
  roles: string[]
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


export interface CountryResponse {
  id: number;
  alpha2: string;
  alpha3: string;
  name: string;
  numeric: string;
}

export interface AttentionScheduleMedicalResponse {
  id: number,
  start: string,
  end: string,
  dayOfWeekId: number,
  interval: number,
  medicalOfficeId: number,
  daysOfWeek: {
    id: number,
    code: string,
    nameDay: string
  }
}
export interface CityResponse {
  id: number;
  state: string
  codeState: string
  codeTown: string
  town: string
}

export interface MedicalOfficeResponse {
  address: string;
  city: CityResponse;
  country: CountryResponse;
  id: number;
  name: string;
  phoneNumber: string
  attentionScheduleMedicalOffice: AttentionScheduleMedicalResponse[]
  interval: number
}

export interface OcupationResponse {
  id: number;
  group: string;
  code: number;
  name: string;
}

export interface EthicityResponse {
  id: number;
  description: string;
  code: string;
}

export interface KindDisabilityResponse {
  id: number;
  description: string;
  code: string;
}

export interface PhoneCodeResponse {
  id: number,
  country: string,
  isoCode: string,
  numericIso: string,
  callingCode: string,
  format: string
}

export interface BiologicalSexResponse {
  id: number,
  code: string,
  description: string
}

export interface ZoneStayResponse {
  id: number,
  code: string,
  description: string
}

export interface RoleResponse {
  concurrencyStamp: string,
  id: string,
  name: string,
  normalizedName: string
}

export interface EventScheduleResponse {
  id: number
  end: string
  start: string
  title: string;
  medicalOffice: string
  doctor: string
  speciality: string
}

export interface MedicalEntryResponse {
  id: number;
  description: string;
  code: number;
}

export interface CIE10Response {
  id: number;
  description: string;
  code: string;
  name: string;
}

export interface AllergieResponse {
  id: number;
  description: string;
  code: string;
}

export interface KinshipResponse {
  id: number;
  description: string;
  code: string;
}

export interface CUPResponse {
  id: number;
  code: string;
  name: string;
}
