import {
  AppointmentResponse,
  PatientResponse,
  PhysicalExamResponse,
} from 'src/Domine/Responses';
import { IconSVG, Gender } from 'src/Application/Utilities';
import { ClinicHistoryMediator } from 'src/Infraestructure/Mediators/ClinicHistoryMediator';
import { PhysicalExamService } from 'src/Application/Services';
import {
  InfoPatientState,
  MedicalProcedureState,
  PreliminaryDataState,
} from 'src/Domine/IStates';
import { Controller } from 'src/Domine/IPatterns';

export class InfoPatientPanelController extends Controller {
  private iconSVG = IconSVG.getInstance();
  private static instance: InfoPatientPanelController;
  public state: InfoPatientState;

  public constructor(state: InfoPatientState) {
    super();
    this.state = state;
  }

  public static getInstance(
    state: InfoPatientState
  ): InfoPatientPanelController {
    if (!InfoPatientPanelController.instance) {
      InfoPatientPanelController.instance = new InfoPatientPanelController(
        state
      );
    }
    return InfoPatientPanelController.instance;
  }

  public getGender(patient: PatientResponse) {
    if (this.state.currentPatient == null) return;
    this.state.iconAvatar =
      patient.gender.id == Gender.FEMALE
        ? this.iconSVG.female_avatar
        : this.iconSVG.male_avatar;
  }

  public clear() {
    this.state.currentPatient = {} as PatientResponse;
    this.state.age = 0;
    this.state.iconAvatar = '';
  }

  public update(data: ClinicHistoryMediator): void {
    console.log({ data });
  }

  public receiveData<IStoreClinicHistory>(data: IStoreClinicHistory): void {
    console.log('Desde InfoPatient', { data });

    const j = data;
    console.log({ j });
  }

  public sendData(state: InfoPatientState): void {
    if (this.mediator === null || this.mediator === undefined) {
      throw new Error('Aun no se definido un mediador para esta operacion');
    }
    this.mediator.handleData(state);
  }
}

export class PreliminaryDataController extends Controller {
  sendData(data: unknown): void {
    throw new Error('Method not implemented.');
  }
  clear(): void {
    throw new Error('Method not implemented.');
  }
  private static instance: PreliminaryDataController;
  private service = PhysicalExamService.getInstance();
  public state: PreliminaryDataState;

  public constructor(state: PreliminaryDataState) {
    super();
    this.state = state;
  }

  public static getInstance(
    state: PreliminaryDataState
  ): PreliminaryDataController {
    if (!PreliminaryDataController.instance) {
      PreliminaryDataController.instance = new PreliminaryDataController(state);
    }
    return PreliminaryDataController.instance;
  }

  public adaptPhysicalExam(
    physicalExamParameter: Array<PhysicalExamResponse>,
    appointment: AppointmentResponse
  ) {
    const items = physicalExamParameter.map((item) => ({
      id: item.id,
      patient: appointment.patient.id,
      appointment: appointment.id,
      result: '',
      description: item.description,
    }));
    this.state.items = items;
    return items;
  }

  public async receiveData<ClinicHistoryMediator>(
    data: ClinicHistoryMediator
  ): Promise<void> {
    if (!(data instanceof ClinicHistoryMediator)) {
      return;
    }
    const speciality = data.stores.speciality;
    const appointment = data.stores.currentAppointment;
    const response = await this.service.findByParameters({
      speciality: speciality.id,
    });
    this.adaptPhysicalExam(response, appointment);
  }

  // public sendData(data: object): void {
  //   if (this.mediator === null || this.mediator === undefined) {
  //     throw new Error('Aun no se definido un mediador para esta operacion');
  //   }
  //   this.mediator.handleData();
  // }
}

export class MedicalProcedureController extends Controller {
  private static instance: MedicalProcedureController;
  public state: MedicalProcedureState;
  public constructor(state: MedicalProcedureState) {
    super();
    this.state = state;
  }

  public static getInstance(
    state: MedicalProcedureState
  ): MedicalProcedureController {
    if (!MedicalProcedureController.instance) {
      MedicalProcedureController.instance = new MedicalProcedureController(
        state
      );
    }
    return MedicalProcedureController.instance;
  }

  sendData(data: unknown): void {
    throw new Error('Method not implemented.');
  }
  receiveData<T>(data: T): void {
    throw new Error('Method not implemented.');
  }
  clear(): void {
    throw new Error('Method not implemented.');
  }
}
