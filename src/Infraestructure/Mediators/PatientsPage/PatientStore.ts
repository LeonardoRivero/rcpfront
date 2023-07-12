// import { defineStore } from 'pinia';
// import { QForm } from 'quasar';
// import { IHealthInsurance, IPatient } from 'src/Domine/ModelsDB';
// import {
//   GenderResponse,
//   HealthInsuranceResponse,
//   IDTypeResponse,
// } from 'src/Domine/Responses';

// export interface IStorePatient {
//   currentPatient: IPatient;
//   allIDTypes: Array<IDTypeResponse>;
//   idType: IDTypeResponse | null;
//   form: QForm | null;
//   allGenders: Array<GenderResponse>;
//   gender: GenderResponse | null;
//   // allPatientStatus: Array<PatientStatusResponse>;
//   // patientStatus: PatientStatusResponse;
//   // allReasonConsult: Array<ReasonConsultResponse>;
//   // reasonConsult: ReasonConsultResponse;
//   identificationPatient: string;
//   allInsurance: Array<HealthInsuranceResponse>;
//   insurance: HealthInsuranceResponse | null;
//   disable: boolean;
//   error: boolean;
//   currentInsurance: IHealthInsurance;
// }
// export const useStorePatient = defineStore({
//   id: 'storePatient',
//   state: () =>
//     ({
//       currentPatient: {} as IPatient,
//       allIDTypes: [] as Array<IDTypeResponse>,
//       // currentIDType: {} as IIDType,
//       form: null,
//       allGenders: [] as Array<GenderResponse>,
//       allInsurance: [] as Array<HealthInsuranceResponse>,
//       identificationPatient: '',
//       idType: null,
//       gender: null,
//       insurance: null,
//       disable: false,
//       error: false,
//       currentInsurance: {} as IHealthInsurance,
//     } as IStorePatient),
// });
