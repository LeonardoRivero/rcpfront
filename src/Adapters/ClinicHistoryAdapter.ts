import { reactive } from 'vue';
import {
  AppointmentResponse,
  PatientResponse,
  PhysicalExamResponse,
} from 'src/Domine/Responses';
import { IconSVG, Gender } from 'src/Application/Utilities';
import {
  ClinicHistoryMediator,
  useStoreClinicHistory,
} from 'src/Infraestructure/Mediators/ClinicHistoryMediator';
import { PhysicalExamService } from 'src/Application/Services';
import { PreliminaryDataState } from 'src/Domine/IStates';
import { Controller } from 'src/Domine/IPatterns';

export class InfoPatientPanelController extends Controller {
  private iconSVG = IconSVG.getInstance();
  private static instance: InfoPatientPanelController;

  public static getInstance(): InfoPatientPanelController {
    if (!InfoPatientPanelController.instance) {
      InfoPatientPanelController.instance = new InfoPatientPanelController();
    }
    return InfoPatientPanelController.instance;
  }
  private state = reactive({
    identificationPatient: '',
    age: 0,
    currentPatient: {} as PatientResponse | null,
    iconAvatar: '',
  });

  public getState() {
    return this.state;
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
    if (data instanceof useStoreClinicHistory) {
      const j = data;
      console.log({ j });
    }
  }

  public sendData(data: object): void {
    if (this.mediator === null || this.mediator === undefined) {
      throw new Error('Aun no se definido un mediador para esta operacion');
    }
    this.mediator.handleData();
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
  private state: PreliminaryDataState;

  public constructor(state: PreliminaryDataState) {
    super();
    // this.state = reactive({
    //   allPathologies: [],
    //   pathology: null,
    //   items: [],
    //   reasonConsultation: '',
    //   descriptionConsultation: '',
    // });
    this.state = state;
  }

  public getState() {
    return this.state;
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
