import {
  AppointmentResponse,
  DXMainCodeResponse,
  EventScheduleResponse,
  PathologicalHistoryResponse,
  PatientResponse,
  PhysicalExamResponse,
  PhysicalExamResultResponse,
} from 'src/Domine/Responses';
import {
  IconSVG,
  Gender,
  Messages,
  Validators,
} from 'src/Application/Utilities';
import { ClinicHistoryMediator } from 'src/Infraestructure/Mediators/ClinicHistoryMediator';
import {
  InfoPatientState,
  MedicalProcedureState,
  PreliminaryDataState,
} from 'src/Domine/IStates';
import {
  Controller,
  IControllersMediator,
  IFactoryMethodNotifications,
  Notificator,
  Bloc,
  UseCase,
} from 'src/Domine/IPatterns';
import { GenericService } from 'src/Application/Repositories';
import { PhysicalExamResultService } from 'src/Application/Services/PhysicalExamResultService';
import { ModalType, PhysicalExamResume } from 'src/Domine/Types';
import { IExam, IPhysicalExam } from 'src/Domine/Request';
import { NotFoundElementNotify } from './Commands';
import { IStoreClinicHistory } from 'src/Domine/IStores';
import { ActionsScheduleMediator } from 'src/Infraestructure/Mediators';

export class InforPatientPanelBloc extends Bloc<InfoPatientState> {
  private iconSVG = IconSVG;
  constructor(
    private searchPatientByIdentificationUseCase: UseCase<
      string,
      PatientResponse | null
    >,
    private findScheduleByIdentificationPatientUseCase: UseCase<
      string,
      ScheduleResponse | null
    >,
    private notificator: IFactoryMethodNotifications
  ) {
    const state: InfoPatientState = {
      identificationPatient: '',
      age: 0,
      currentPatient: {} as PatientResponse,
      iconAvatar: '',
      labelAge: 'Años',
    };
    super(state);
  }
  public receiveData(data: IControllersMediator): void {
    return;
  }

  public getGender(patient: PatientResponse) {
    if (this.state.currentPatient == null) return;
    const iconAvatar =
      patient.gender.id == Gender.FEMALE
        ? this.iconSVG.female_avatar
        : this.iconSVG.male_avatar;

    this.changeState({ ...this.state, iconAvatar: iconAvatar });
  }

  public sendData(state: InfoPatientState): void {
    if (this.mediator === null || this.mediator === undefined) {
      throw new Error('Aun no se definido un mediador para esta operacion');
    }
    this.mediator.notify(state, this);
  }

  public clear() {
    this.changeState({
      ...this.state,
      currentPatient: {} as PatientResponse,
      age: 0,
      iconAvatar: '',
    });
  }

  async patientHasAppointment() {
    const patient = await this.searchPatientByIdentificationUseCase.execute(
      this.state.identificationPatient
    );

    if (patient === null) {
      this.clear();
      const notFound = new NotFoundElementNotify(
        Messages.notFoundInfoPatient,
        this.notificator,
        '/patient'
      );
      await notFound.execute();
      return;
    }
    const validator = Validators.getInstance();
    let age = validator.calculateAge(patient.dateBirth.toString());

    if (age == 0) {
      age = validator.calculateMonths(patient.dateBirth.toString());
    }
    const dateBirth = new Date(patient.dateBirth.toLocaleString());
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    } as const;
    patient.dateBirth = dateBirth.toLocaleDateString('es-Es', options);
    this.getGender(patient);
    this.changeState({
      ...this.state,
      currentPatient: patient,
      age: age < 0 ? 0 : age,
      labelAge: age < 0 ? 'Meses' : 'Años',
    });
    const schedule =
      await this.findScheduleByIdentificationPatientUseCase.execute(
        patient.identification.toString()
      );
    const store = <IStoreClinicHistory>this.mediator.getStore();
    store.currentSchedule = schedule;
    // this.mediator.notify(store, this);

    if (schedule === null) {
      const notFound = new NotFoundElementNotify(
        Messages.patientNotSchedule,
        this.notificator,
        '/schedule'
      );
      await notFound.execute();
      return;
    }
    this.sendData(this.state);
  }
}
export class PreliminaryDataBloc extends Bloc<PreliminaryDataState> {
  public constructor(
    private service: GenericService<IPhysicalExam, PhysicalExamResponse>
  ) {
    const state: PreliminaryDataState = {
      allPathologies: [],
      pathology: null,
      items: [],
      reasonConsultation: '',
      descriptionConsultation: '',
      pathologiesForFilter: [],
      allDxMainCodes: [],
      allRelationCodes: [],
      dxMainCode: null,
      relationCode: null,
    };
    super(state);
  }

  clear(): void {
    throw new Error('Method not implemented.');
  }

  async receiveData(data: ClinicHistoryMediator): Promise<void> {
    if (!(data instanceof ClinicHistoryMediator)) {
      return;
    }
    const mediator = <ActionsScheduleMediator>(<unknown>this.mediator);
    const speciality = data.store.currentSchedule?.speciality;
    const listAllDxMainCodes = await mediator.getAllDxMainCodes();
    const dxMainCodeFiltered = listAllDxMainCodes.filter(
      (dxMainCode) => dxMainCode.speciality.id === speciality?.id
    );
    this.changeState({ ...this.state, allDxMainCodes: dxMainCodeFiltered });
    // console.log(response);
    // this.adaptPhysicalExam(response, appointment);
  }

  async loadInitialData() {
    const mediator = <ActionsScheduleMediator>(<unknown>this.mediator);
    const listPathologies = await mediator.getAllPathologies();

    this.changeState({
      ...this.state,
      allPathologies: listPathologies,
      pathologiesForFilter: listPathologies,
    });
  }

  async dxMainCodeChanged(val: number) {
    const mediator = <ActionsScheduleMediator>(<unknown>this.mediator);
    const listRelationCode = await mediator.getAllRelationCode();
    const relationCodeFiltered = listRelationCode.filter(
      (relationCode) => relationCode.dxmaincode.id === val
    );
    this.changeState({
      ...this.state,
      allRelationCodes: relationCodeFiltered,
      relationCode: null,
    });
  }
}

export class MedicalProcedureBloc extends Bloc<MedicalProcedureState> {
  public constructor(
    private getPhysicalExamBySpecilityUseCase: UseCase<
      number,
      Array<PhysicalExamResponse>
    >
  ) {
    const state: MedicalProcedureState = {
      items: [],
    };
    super(state);
  }

  async receiveData(_data: IControllersMediator): Promise<void> {
    // if (this.mediator instanceof ClinicHistoryMediator) {
    //   const store = <IStoreClinicHistory>this.mediator.getStore();
    //   const val = store.currentSchedule?.speciality;
    //   const response = await this.getPhysicalExamBySpecilityUseCase.execute(
    //     val?.id
    //   );
    //   this.changeState({ ...this.state, items: response });
    // }
  }
  clear(): void {
    throw new Error('Method not implemented.');
  }
  async loadInitialData() {
    if (this.mediator instanceof ClinicHistoryMediator) {
      const store = <IStoreClinicHistory>this.mediator.getStore();
      const val = store.currentSchedule?.speciality;
      const response = await this.getPhysicalExamBySpecilityUseCase.execute(
        val?.id
      );
      const adapted: Array<IExam> = response.map((item) => ({
        description: item.description,
        result: '',
        id: item.id,
      }));
      this.changeState({ ...this.state, items: adapted });
    }
  }
  updateValue(_value: string) {
    const store = <IStoreClinicHistory>this.mediator.getStore();
    store.examParameterResult = this.state.items;
  }
}

export class ClinicHistoryResumeController extends Controller {
  public state: object;
  private service: GenericService<IExam, PhysicalExamResultResponse>;
  private notifyQuasar: Notificator;

  public constructor(factoryNotify: IFactoryMethodNotifications) {
    super();
    this.service = new PhysicalExamResultService();
    this.state = {};
    this.notifyQuasar = factoryNotify.createNotificator(ModalType.NotifyQuasar);
  }

  receiveData(data: IControllersMediator): void {
    throw new Error('Method not implemented.');
  }

  clear(): void {
    throw new Error('Method not implemented.');
  }

  public async getAll(): Promise<Array<PhysicalExamResultResponse>> {
    try {
      const items = await this.service.getAll();
      return items;
    } catch (error: any) {
      this.notifyQuasar.setType('error');
      this.notifyQuasar.show(
        undefined,
        'Lo sentimos no pudimos cargar el historial del paciente'
      );
      return [];
    }
  }

  public adaptObject(
    items: Array<PhysicalExamResultResponse>
  ): Array<PhysicalExamResume> {
    const groups = items.reduce((groups: any, game) => {
      const date = new Date(game.date_exam.toString());
      if (!groups[date.getFullYear()]) {
        groups[date.getFullYear()] = [];
      }
      groups[date.getFullYear()].push(game);
      return groups;
    }, {});

    const groupArrays = Object.keys(groups).map((year) => {
      return {
        year,
        results: groups[year],
      };
    });
    return groupArrays;
  }
  public async getHistoryPatient(documentPatient: string) {
    const parameters = { documentPatient: documentPatient };
    const t = await this.service.findByParameters(parameters);
  }
}
