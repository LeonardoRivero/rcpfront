import {
  CIE10Response,
  GenderResponse,
  MedicalOfficeResponse,
  PatientResponse,
  ScheduleResponse,
} from 'src/Domine/Responses';
import {
  IconSVG,
  Messages,
} from 'src/Application/Utilities';
// import { ClinicHistoryMediator } from 'src/Infraestructure/Mediators/ClinicHistoryMediator';
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
  Observer,
  IHandleGlobalState,
} from 'src/Domine/IPatterns';
import { ModalType } from 'src/Domine/Types';
import { FilterScheduleRequest } from 'src/Domine/Request';
import { IHelpers } from 'src/Domine/ICommons';
import { routerInstance } from 'src/boot/globalRouter';
import { NotificatorIndexBloc } from './IndexBloc';
// import { ActionsScheduleMediator } from 'src/Infraestructure/Mediators';

export class InfoPatientPanelBloc extends Bloc<InfoPatientState> {
  private iconSVG = IconSVG;
  private notifySweetAlert: Notificator;
  private static instance: InfoPatientPanelBloc
  private constructor(
    private searchPatientByIdentificationUseCase: IUseCase<string, PatientResponse | null>,
    private findScheduleByIdentificationPatientUseCase: IUseCase<FilterScheduleRequest, ScheduleResponse | null>,
    private notificator: IFactoryMethodNotifications,
    private helper: IHelpers
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

  public static getInstance(searchPatientByIdentificationUseCase: IUseCase<string, PatientResponse | null>,
    findScheduleByIdentificationPatientUseCase: IUseCase<FilterScheduleRequest, ScheduleResponse | null>,
    notificator: IFactoryMethodNotifications,
    helper: IHelpers) {

    if (!InfoPatientPanelBloc.instance) {
      InfoPatientPanelBloc.instance = new InfoPatientPanelBloc(searchPatientByIdentificationUseCase,
        findScheduleByIdentificationPatientUseCase, notificator, helper);
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
    await this.patientHasAppointment(scheduleResponse.medicalOffice)
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

  async patientHasAppointment(medicaloffice: MedicalOfficeResponse) {
    const patient = await this.searchPatientByIdentificationUseCase.execute(
      this.state.identificationPatient
    );

    if (patient === null) {
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

    const request: FilterScheduleRequest = {
      identificationPatient: this.state.identificationPatient,
      medicalOfficeId: medicaloffice.id
    }

    const schedule = await this.findScheduleByIdentificationPatientUseCase.execute(request);
    if (schedule === null) {
      this.clear()
      this.notifySweetAlert.setType('error')
      const confirm = await this.notifySweetAlert.show('Error', Messages.patientNotSchedule)
      if (confirm) {
        routerInstance.push('/schedule')
      }
    }
  }
}

export class AppointmentBloc extends Bloc<AppointmentState> {
  public constructor(private getByFilterCIE10UseCase: IUseCase<string, CIE10Response[]>) {
    const state: AppointmentState = {
      allPathologies: [],
      pathology: null,
      items: [],
      reasonConsultation: '',
      descriptionConsultation: '',
      pathologiesForFilter: [],
      allDxMainCodes: [],
      allRelationCodes: [],
      allAllergies: [],
      dxMainCode: null,
      relationCode: null,
      allergie: null,
      allergen: null,
      filterCIE10: null,
      filterRelatedCode: null,
      alcohol: false,
      drugs: false,
      smoke: false,
      treatmentMedical: null,
      alcoholObservations: null,
      smokeObservations: null,
      drugsObservations: null,
      patientHasTreatment: false
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
    this.changeState({
      ...this.state,
      allAllergies: allAllergies,
    });
  }

  async dxMainCodeChanged() {
    const dxMainCode = await this.getByFilterCIE10UseCase.execute(this.state.filterCIE10 ?? '')
    this.changeState({ ...this.state, allDxMainCodes: dxMainCode, dxMainCode: dxMainCode[0] })
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
    const relatedCode = await this.getByFilterCIE10UseCase.execute(this.state.filterRelatedCode ?? '')
    this.changeState({ ...this.state, allRelationCodes: relatedCode, relationCode: relatedCode[0] })
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
