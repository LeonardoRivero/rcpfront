
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
  speciality: Array<number>;
}

export interface IPhysicalExam {
  id?: number;
  description: string;
  speciality: number;
  active: boolean;
}

export interface IReasonConsult {
  id?: number;
  abbreviation: string;
}

export interface AddAdmissionRequest {
  id?: number;
  appointmentPrice: number;
  copayment: number;
  amountPaid: number;
  authorizationNumber: string;
  medicalEntryId: number;
  scheduleId: number;
  patientId: number;
  doctorId: number;
  paymentMethodId: number;
  transactionCode: string | null;
  isParticular: boolean;
  userId: string
}

export interface AddEventToScheduleRequest {
  id?: number;
  title: string;
  start: string;
  // end?: string;
  specialityId: number;
  doctorId: number;
  observations: string;
  medicalOfficeId: number
  patientId: number;
  userId: string
}

export interface IHealthInsurance {
  id?: number;
  nameInsurance: string;
  entityCode: string;
  takeCopayment: boolean;
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
  role: string;
  medical_office: number | null;
}

export interface LoginRequest {
  Email: string;
  Password: string;
  RememberMe: boolean
}

export interface ChangePasswordRequest {
  UserId: string;
  CurrentPassword: string;
  NewPassword: string
}
export interface ConfirmEmailRequest {
  userId: string;
  token: string
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

export interface OpeningHoursRequest {
  start: string;
  end: string;
  dayOfWeek: string
}
export interface IMedicalOfficeRequest {
  id?: number;
  name: string;
  address: string;
  countryId: number;
  cityId: number;
  phoneNumber: string;
  doctor: number[];
  openingHours: OpeningHoursRequest[]
  intervalAttention: number
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

export interface RegisterUserRequest {
  email: string;
  role: string;
  lastName: string;
  firstName: string;
}

export interface NewOrEditDoctorRequest {
  name: string
  lastName: string
  documentTypeId: number
  documentNumber: string
  userId: string
  phoneNumber: string
  specialities: number[]
}

export interface NewOrEditSecretaryRequest {
  name: string
  lastName: string
  documentTypeId: number
  documentNumber: string
  userId: string
  phoneNumber: string
  medicalOffice: number[];
}

export interface FilterScheduleRequest {
  identificationPatient: string;
  medicalOfficeId: number[]
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface NewPasswordRequest {
  userId: string
  token: string
  newPassword: string
}
export interface AttentionScheduleMedicalRequest {
  dayOfWeek: number
  medicalOfficeId: number
}

export interface CheckAdmissionPatientRequest {
  medicalOfficeId: number
  scheduleId: number
}
