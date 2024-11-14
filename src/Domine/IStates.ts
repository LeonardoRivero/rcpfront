import { DIVIPOLADTO, StateDTO, TownDTO } from './DTOs';
import {
  IPaginationDataTable,
  ITableOptions,
} from './ICommons';
import {
  AddEventToScheduleRequest,
  AddAdmissionRequest,
  IDXMainCode,
  IDoctor,
  IExam,
  IHealthInsurance,
  IPathologycalHistory,
  IPatient,
  IPhysicalExam,
  IReasonConsult,
  IRelationCode,
  ISpeciality,
} from './Request';
import {
  BiologicalSexResponse,
  CountryResponse,
  DXMainCodeResponse,
  DoctorResponse,
  DocumentTypeResponse,
  EthicityResponse,
  GenderResponse,
  HealthInsuranceResponse,
  KindDisabilityResponse,
  MedicalOfficeResponse,
  OcupationResponse,
  PathologicalHistoryResponse,
  PatientResponse,
  PatientStatusResponse,
  PaymentOptionsResponse,
  PhoneCodeResponse,
  PhysicalExamResponse,
  ReasonConsultResponse,
  RelationCodeResponse,
  RoleResponse,
  SpecialityResponse,
  ZoneStayResponse,
} from './Responses';

export interface InfoPatientState {
  identificationPatient: string;
  age: number;
  currentPatient: PatientResponse | null;
  iconAvatar: string;
  labelAge: string;
}
export interface PreliminaryDataState {
  allPathologies: Array<PathologicalHistoryResponse>;
  items: Array<unknown>;
  reasonConsultation: string;
  descriptionConsultation: string;
  pathology: PathologicalHistoryResponse | null;
  pathologiesForFilter: Array<PathologicalHistoryResponse>;
  allDxMainCodes: Array<DXMainCodeResponse>;
  allRelationCodes: Array<RelationCodeResponse>;
  dxMainCode: DXMainCodeResponse | null;
  relationCode: RelationCodeResponse | null;
}

export interface PathologicalHistoryState {
  currentPathology: IPathologycalHistory;
  pathology: PathologicalHistoryResponse | null;
  expanded: boolean;
  allPathologies: Array<PathologicalHistoryResponse>;
}

export interface SpecialityFormState {
  currentSpeciality: ISpeciality;
  expanded: boolean;
  speciality: ISpeciality | null;
  allSpecialities: Array<SpecialityResponse>;
}

export interface MedicalProcedureState {
  items: Array<IExam>;
}

export interface DxMainCodeState {
  allDxMainCodes: Array<DXMainCodeResponse>;
  currentDxMainCode: IDXMainCode;
  expanded: boolean;
  dxMainCode: DXMainCodeResponse | null;
  error: boolean;
}

export interface RelationCodeState {
  allRelationCodes: Array<RelationCodeResponse>;
  currentRelationCode: IRelationCode;
  expanded: boolean;
  relationCode: RelationCodeResponse | null;
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
  // columns: Array<IColumnsDataTable>;
  // data: object;
  // listOptions: Array<unknown>;
  option: unknown | null;
  selected: Array<unknown>;
  pagination: IPaginationDataTable;
  loading: boolean;
}

export interface PatientState {
  currentPatient: IPatient;
  allIDTypes: Array<DocumentTypeResponse>;
  allGenders: Array<GenderResponse>;
  allInsurance: Array<HealthInsuranceResponse>;
  allCountries: CountryResponse[];
  allOcupations: OcupationResponse[];
  allCities: DIVIPOLADTO;
  allTown: TownDTO[]
  allEthnicity: EthicityResponse[]
  allKindDisability: KindDisabilityResponse[]
  allPhoneFormat: PhoneCodeResponse[],
  allBiologicalSex: BiologicalSexResponse[],
  allZoneStay: ZoneStayResponse[],
  biologicalSex: BiologicalSexResponse | null,
  countryOrigin: CountryResponse | null;
  countryStay: CountryResponse | null;
  identificationPatient: string;
  idType: DocumentTypeResponse | null;
  gender: GenderResponse | null;
  insurance: HealthInsuranceResponse | null;
  ocupation: OcupationResponse | null
  state: StateDTO | null
  town: TownDTO | null
  ethnicity: EthicityResponse | null
  kindDisability: KindDisabilityResponse | null
  zoneStay: ZoneStayResponse | null
  phoneFormat: PhoneCodeResponse | null
  foreignPatient: boolean
  lookUpDocumentNumber: string
}

export interface RegisterUserState {
  documentType: number | null;
  documentNumber: string | null;
  phoneNumber: string | null;
  medicalOffice: number[] | null
  medicalRegister: string
  roles: Array<RoleResponse>;
  isActive: boolean;
  firstName: string;
  lastName: string,
  role: string | null,
  email: string,
  phoneFormat: PhoneCodeResponse | null
  allPhoneFormat: PhoneCodeResponse[],
  allDocumentType: DocumentTypeResponse[]
  allMedicalOffice: MedicalOfficeResponse[]
  allSpecialities: SpecialityResponse[]
  speciality: number[]
}

export interface ScheduleState {
  lastConsult: AddAdmissionRequest;
  isReadonly: boolean;
  currentAppointment: AddAdmissionRequest;
  currentPatient: PatientResponse;
  currentSchedule: AddEventToScheduleRequest;
  currentDoctor: DoctorResponse | null;
  allDoctors: Array<DoctorResponse>;
  speciality: SpecialityResponse | null;
  allSpecialities: Array<SpecialityResponse>;
  identificationPatient: string;
  allowToUpdate: boolean;
  allowToDelete: boolean;
  error: boolean;
  card: boolean;
  allMedicalOffice: MedicalOfficeResponse[]
  medicalOfficeSelected: MedicalOfficeResponse | null
  // calendar: InstanceType<typeof FullCalendar>;
}

export interface AdmissionState {
  identificationPatient: string;
  reasonConsult: IReasonConsult | null;
  currentAppointment: AddAdmissionRequest;
  allPaymentOptions: Array<PaymentOptionsResponse>;
  allReasonConsult: Array<ReasonConsultResponse>;
  allPatientStatus: Array<PatientStatusResponse>;
  start: string;
  end: string;
  // schedule: EventScheduleResponse;
  disableCodeTransaction: boolean;
  disableButtonSave: boolean;
}

export interface ChangePasswordState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  visible: boolean;
  message: string
}

export interface DoctorState {
  allDoctor: Array<DoctorResponse>;
  currentDoctor: IDoctor | null;
  expanded: boolean;
  error: boolean;
}

export interface MedicalOfficeState {
  // medicalOffices: Array<MedicalOfficeResponse>;
  medicalOfficeResponse: MedicalOfficeResponse;
  // medicalOfficeEntity: IMedicalOfficeRequest;
  address: string;
  // disableSelectAddress: boolean;
  // enableForEdit: boolean;
  // visibleEdit: boolean;
  country: CountryResponse;
  allCities: DIVIPOLADTO;
  state: StateDTO | null;
  town: TownDTO | null;
  name: string;
  phoneNumber: string
  phoneFormat: PhoneCodeResponse | null
}

export interface LoginState {
  email: string;
  password: string;
  labelMessage: string;
}

export interface AppointmentListState {
  tableOptions: ITableOptions;
  pagination: IPaginationDataTable;
  loading: boolean;
  filter: string;
}
