import {
  AllergieResponse,
  CIE10Response,
  CUPResponse,
  GenderResponse,
  MedicalOfficeResponse,
  PatientResponse,
  ReasonConsultResponse,
  ScheduleResponse,
} from 'src/Domine/Responses';
import { Messages } from 'src/Application/Utilities';

import {
  AppointmentState,
  InfoPatientState,
} from 'src/Domine/IStates';
import {
  IFactoryMethodNotifications,
  Notificator,
  Bloc,
  IUseCase,
  Subject,
  IHandleGlobalState,
} from 'src/Domine/IPatterns';
import { ModalType } from 'src/Domine/Types';
import { CheckAdmissionPatientRequest } from 'src/Domine/Request';
import { IHelpers } from 'src/Domine/ICommons';
import { routerInstance } from 'src/boot/globalRouter';
import { NotificatorIndexBloc } from './IndexBloc';


export class InfoPatientPanelBloc extends Bloc<InfoPatientState> {
  private notifySweetAlert: Notificator;
  private static instance: InfoPatientPanelBloc
  private constructor(
    private checkAdmissionForPatient: IUseCase<CheckAdmissionPatientRequest, [string, boolean]>,
    private notificator: IFactoryMethodNotifications,
    private helper: IHelpers,
  ) {
    const state: InfoPatientState = {
      identificationPatient: '',
      age: '',
      currentPatient: { gender: {} as GenderResponse, healthEntity: {} } as PatientResponse,
      showSkeleton: true,

    };
    super(state);
    this.notifySweetAlert = notificator.createNotificator(
      ModalType.SweetAlert
    );
  }

  public static getInstance(checkAdmissionForPatient: IUseCase<CheckAdmissionPatientRequest, [string, boolean]>,
    notificator: IFactoryMethodNotifications, helper: IHelpers) {

    if (!InfoPatientPanelBloc.instance) {
      InfoPatientPanelBloc.instance = new InfoPatientPanelBloc(checkAdmissionForPatient, notificator, helper);
    }
    return InfoPatientPanelBloc.instance
  }

  public override async handleNotification<T>(subject: Subject, data: T): Promise<void> {
    const isInstance = subject instanceof NotificatorIndexBloc;
    if (isInstance == false) {
      throw Error('Instancia no admitida');
    }
    const scheduleResponse = <ScheduleResponse>data
    this.changeState({ ...this.state, identificationPatient: scheduleResponse.patient.identification })
    await this.patientHasAppointment(scheduleResponse.id, scheduleResponse.medicalOffice)
  };

  public clear() {
    this.changeState({
      ...this.state,
      currentPatient: {
        gender: {} as GenderResponse,
        healthEntity: {}
      } as PatientResponse,
      age: '',
    });
  }

  async patientHasAppointment(scheduleId: number, medicaloffice: MedicalOfficeResponse) {
    const patient = await this.mediator?.findPatientByIdentification(this.state.identificationPatient)
    if (patient === null || patient === undefined) {
      this.clear();
      this.notifySweetAlert.setType('error')
      const confirm = await this.notifySweetAlert.show('Error', Messages.notFoundInfoPatient)
      if (confirm) {
        routerInstance.push('/patient')
      }
      return;
    }

    const dateBirth = new Date(patient.dateBirth.toLocaleString());
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    } as const;
    patient.dateBirth = dateBirth.toLocaleDateString('es-Es', options);
    this.changeState({
      ...this.state,
      currentPatient: patient,
      age: this.helper.calculateAge(patient.dateBirth),
      showSkeleton: false
    });

    const request: CheckAdmissionPatientRequest = {
      scheduleId: scheduleId,
      medicalOfficeId: medicaloffice.id
    }

    const [message, wasAdmissioned] = await this.checkAdmissionForPatient.execute(request);
    if (!wasAdmissioned) {
      this.clear()
      this.notifySweetAlert.setType('error')
      const confirm = await this.notifySweetAlert.show('Error', message)
      if (confirm) {
        routerInstance.push('/schedule')
      }
    }
  }
}

export class AppointmentBloc extends Bloc<AppointmentState> {
  public constructor(private getByFilterCIE10UseCase: IUseCase<string, CIE10Response[]>,
    private getByFilterCUPUseCase: IUseCase<string, CUPResponse[]>,
  ) {
    const state: AppointmentState = {
      reasonConsultation: null,
      descriptionConsultation: '',
      allDxMainCodes: [],
      allRelationCodes: [],
      allAllergies: [],
      allKinship: [],
      allCUP: [],
      allReasonConsult: [],
      allPurposeService: [],
      dxMainCode: null,
      relationCode: null,
      cupCode: null,
      allergie: null,
      allergen: null,
      reasonConsult: null,
      filterCIE10: null,
      filterRelatedCode: null,
      filterCUP: null,
      filterReasonConsult: null,
      treatmentMedical: null,
      diagnosticObservations: null,
      procedureObservations: null,
      patientHasTreatment: false,
      patientHasAllergie: false,
      patientWithFamilyHistory: false,
      kinship: null,
      familiarCondition: null,
    };
    super(state);
  }

  clear(): void {
    throw new Error('Method not implemented.');
  }

  public override async handleNotification<T>(subject: Subject, data: T): Promise<void> {
    const isInstance = subject instanceof NotificatorIndexBloc;
    if (isInstance == false) {
      throw Error('Instancia no admitida');
    }
    const scheduleResponse = <ScheduleResponse>data
    console.log({ scheduleResponse }, 'en appointment bloc');
    // this.changeState({ ...this.state, identificationPatient: scheduleResponse.patient.identification })
    // await this.patientHasAppointment(scheduleResponse.medicalOffice)
  };

  async receiveData(): Promise<void> {
    // if (!(data instanceof ClinicHistoryMediator)) {
    //   return;
    // }
    // const mediator = <ActionsScheduleMediator>(<unknown>this.mediator);
    // const speciality = data.store.currentSchedule?.speciality;
    // const listAllDxMainCodes = await mediator.getAllDxMainCodes();
    // const dxMainCodeFiltered = listAllDxMainCodes.filter(
    //   (dxMainCode) => dxMainCode.speciality.id === speciality?.id
    // );
    // this.changeState({ ...this.state, allDxMainCodes: dxMainCodeFiltered });
    // console.log(response);
    // this.adaptPhysicalExam(response, appointment);
  }

  async loadInitialData(handleGlobalState: IHandleGlobalState): Promise<void> {
    const allAllergies = await handleGlobalState.getAllAllergies()
    const allKinship = await handleGlobalState.getAllKinship()
    const allReasonConsult = await handleGlobalState.getAllReasonConsult()
    this.changeState({
      ...this.state,
      allAllergies: allAllergies,
      allKinship: allKinship,
      allReasonConsult: allReasonConsult
    });
  }

  async filterDxMainCode() {
    // if (this.state.filterCIE10 == '') return
    const dxMainCode = await this.getByFilterCIE10UseCase.execute(this.state.filterCIE10 ?? '')
    this.changeState({ ...this.state, allDxMainCodes: dxMainCode })
    // const mediator = <ActionsScheduleMediator>(<unknown>this.mediator);
    // const listRelationCode = await mediator.getAllRelationCode();
    // const relationCodeFiltered = listRelationCode.filter(
    //   (relationCode) => relationCode.dxmaincode.id === val
    // );
    // this.changeState({
    //   ...this.state,
    //   allRelationCodes: relationCodeFiltered,
    //   relationCode: null,
    // });
  }

  async filterRelatedCode() {
    if (this.state.filterRelatedCode == '') return
    const relatedCode = await this.getByFilterCIE10UseCase.execute(this.state.filterRelatedCode ?? '')
    this.changeState({ ...this.state, allRelationCodes: relatedCode })
    // const mediator = <ActionsScheduleMediator>(<unknown>this.mediator);
    // const listRelationCode = await mediator.getAllRelationCode();
    // const relationCodeFiltered = listRelationCode.filter(
    //   (relationCode) => relationCode.dxmaincode.id === val
    // );
    // this.changeState({
    //   ...this.state,
    //   allRelationCodes: relationCodeFiltered,
    //   relationCode: null,
    // });
  }

  async filterCUP() {
    if (this.state.filterCUP == '') return
    const cupCode = await this.getByFilterCUPUseCase.execute(this.state.filterCUP ?? '')
    this.changeState({ ...this.state, allCUP: cupCode })
  }

  async filterReasonConsult(value: string): Promise<ReasonConsultResponse[]> {
    if (value == '') return this.state.allReasonConsult
    const needle = value.toLowerCase();
    return this.state.allReasonConsult.filter((option) => {
      return option.description.toLowerCase().indexOf(needle) > -1;
    })
    // this.changeState({ ...this.state, allReasonConsult: reason })
  }

  allergieChanged(allergie: AllergieResponse) {
    this.changeState({ ...this.state, patientHasAllergie: allergie.description.toLowerCase() != 'ninguna' })
  }
}

export class LastAppointmentPanelBloc extends Bloc<string> {
  public constructor(
    private checkAdmissionForPatient: IUseCase<CheckAdmissionPatientRequest, [string, boolean]>,
  ) {
    super('state');
  }
}
// export class MedicalProcedureBloc extends Bloc<MedicalProcedureState> {
//   public constructor(
//     private getPhysicalExamBySpecilityUseCase: UseCase<
//       number,
//       Array<PhysicalExamResponse>
//     >
//   ) {
//     const state: MedicalProcedureState = {
//       items: [],
//     };
//     super(state);
//   }

//   async receiveData(_data: IControllersMediator): Promise<void> {
//     // if (this.mediator instanceof ClinicHistoryMediator) {
//     //   const store = <IStoreClinicHistory>this.mediator.getStore();
//     //   const val = store.currentSchedule?.speciality;
//     //   const response = await this.getPhysicalExamBySpecilityUseCase.execute(
//     //     val?.id
//     //   );
//     //   this.changeState({ ...this.state, items: response });
//     // }
//   }
//   clear(): void {
//     throw new Error('Method not implemented.');
//   }
//   async loadInitialData() {
//     if (this.mediator instanceof ClinicHistoryMediator) {
//       const store = <IStoreClinicHistory>this.mediator.getStore();
//       const val = store.currentSchedule?.speciality;
//       const response = await this.getPhysicalExamBySpecilityUseCase.execute(
//         val?.id
//       );
//       const adapted: Array<IExam> = response.map((item) => ({
//         description: item.description,
//         result: '',
//         id: item.id,
//       }));
//       this.changeState({ ...this.state, items: adapted });
//     }
//   }
//   updateValue(_value: string) {
//     const store = <IStoreClinicHistory>this.mediator.getStore();
//     store.examParameterResult = this.state.items;
//   }
// }

// export class ClinicHistoryResumeController extends Controller {
//   public state: object;
//   private service: GenericService<IExam, PhysicalExamResultResponse>;
//   private notifyQuasar: Notificator;

//   public constructor(factoryNotify: IFactoryMethodNotifications) {
//     super();
//     this.service = new PhysicalExamResultService();
//     this.state = {};
//     this.notifyQuasar = factoryNotify.createNotificator(ModalType.NotifyQuasar);
//   }

//   receiveData(data: IControllersMediator): void {
//     throw new Error('Method not implemented.');
//   }

//   clear(): void {
//     throw new Error('Method not implemented.');
//   }

//   public async getAll(): Promise<Array<PhysicalExamResultResponse>> {
//     try {
//       const items = await this.service.getAll();
//       return items;
//     } catch (error: any) {
//       this.notifyQuasar.setType('error');
//       this.notifyQuasar.show(
//         undefined,
//         'Lo sentimos no pudimos cargar el historial del paciente'
//       );
//       return [];
//     }
//   }

//   public adaptObject(
//     items: Array<PhysicalExamResultResponse>
//   ): Array<PhysicalExamResume> {
//     const groups = items.reduce((groups: any, game) => {
//       const date = new Date(game.date_exam.toString());
//       if (!groups[date.getFullYear()]) {
//         groups[date.getFullYear()] = [];
//       }
//       groups[date.getFullYear()].push(game);
//       return groups;
//     }, {});

//     const groupArrays = Object.keys(groups).map((year) => {
//       return {
//         year,
//         results: groups[year],
//       };
//     });
//     return groupArrays;
//   }
//   public async getHistoryPatient(documentPatient: string) {
//     const parameters = { documentPatient: documentPatient };
//     const t = await this.service.findByParameters(parameters);
//   }
// }
