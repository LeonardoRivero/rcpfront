import {
  Bloc,
  IControllersMediator,
  IFactoryMethodNotifications,
  IToRead,
  Notificator,
} from 'src/Domine/IPatterns';
import { routerInstance } from 'src/boot/globalRouter';
import { Validators, Messages } from 'src/Application/Utilities';
import {
  FindPatientByIdentificationUseCase,
  PatientService,
} from 'src/Application/Services/PatientService';
import { IHealthInsurance, IPatient } from 'src/Domine/ModelsDB';
import {
  GenderResponse,
  HealthInsuranceResponse,
  IDTypeResponse,
  PatientResponse,
} from 'src/Domine/Responses';
import { PatientState } from 'src/Domine/IStates';
import { ModalType } from 'src/Domine/Types';
import { EditCommand, InsertCommand } from 'src/Application/Commands';
import { GenericService } from 'src/Application/Repositories';

export class PatientFormBloc extends Bloc<PatientState> {
  private sweetAlertModal: Notificator;
  private notifyQuasar: Notificator;
  private validator = Validators.getInstance();
  private service = new PatientService();
  private findPatientByIdentificationUseCase =
    new FindPatientByIdentificationUseCase();

  constructor(
    private factoryNotificator: IFactoryMethodNotifications,
    private insuranceService: GenericService<
      IHealthInsurance,
      HealthInsuranceResponse
    >,
    private idTypeService: IToRead<IDTypeResponse>,
    private genderService: IToRead<GenderResponse>
  ) {
    const state: PatientState = {
      currentPatient: { email: null } as IPatient,
      allIDTypes: [] as Array<IDTypeResponse>,
      allGenders: [] as Array<GenderResponse>,
      allInsurance: [] as Array<HealthInsuranceResponse>,
      identificationPatient: '',
      idType: null,
      gender: null,
      insurance: null,
      disable: false,
      error: false,
      currentInsurance: {} as IHealthInsurance,
    };
    super(state);
    this.notifyQuasar = this.factoryNotificator.createNotificator(
      ModalType.NotifyQuasar
    );
    this.sweetAlertModal = this.factoryNotificator.createNotificator(
      ModalType.SweetAlert
    );
  }

  receiveData(data: IControllersMediator): void {
    throw new Error('Method not implemented.');
  }

  clear(): void {
    this.changeState({
      ...this.state,
      currentPatient: { email: null } as IPatient,
      gender: null,
      idType: null,
      insurance: null,
    });
  }

  async searchByIdentificacion(): Promise<PatientResponse | null> {
    const response = await this.findPatientByIdentificationUseCase.execute(
      this.state.identificationPatient
    );
    if (response === null) {
      this.clear();
      this.notifyQuasar.setType('warning');
      this.notifyQuasar.show(undefined, Messages.notInfoFound);
      this.changeState({ ...this.state, disable: false });
      return null;
    }
    this.setData(response);
    return response;
  }

  setData(response: PatientResponse) {
    this.changeState({
      ...this.state,
      idType: response.IDType,
      insurance: response.insurance,
      gender: response.gender,
      currentPatient: this.responseToEntity(response),
      disable: true,
    });
  }

  enableEdition(): void {
    this.changeState({ ...this.state, disable: false });
  }

  private responseToEntity(response: PatientResponse): IPatient {
    return {
      id: response.id,
      name: response.name,
      lastName: response.lastName,
      IDType: response.IDType?.id,
      identification: response.identification,
      dateBirth: response.dateBirth,
      phoneNumber: response.phoneNumber,
      insurance: response.insurance.id,
      gender: response.gender.id,
      email: response.email,
    };
  }

  async saveOrUpdate(): Promise<PatientResponse | null> {
    if (!this.state.currentPatient) return null;
    let payload: IPatient;
    let response: PatientResponse | null = null;

    if (this.state.currentPatient.id == undefined) {
      delete this.state.currentPatient['id'];
      const insertCommand = new InsertCommand(
        this.state.currentPatient,
        this.service
      );
      response = <PatientResponse | null>await insertCommand.execute();
      insertCommand.showNotification(response);
    }

    if (this.state.currentPatient.id != undefined) {
      payload = this.state.currentPatient;
      const editCommand = new EditCommand(
        payload,
        this.state.currentPatient.id,
        this.service
      );
      response = <PatientResponse | null>await editCommand.execute();
      editCommand.showNotification(response);
    }

    if (response != null) {
      this.clear();
    }
    return response;
  }

  isValidEmail(val: string): void {
    const validEmail = this.validator.email(val);
    if (validEmail == false) {
      this.changeState({ ...this.state, error: true });
      this.notifyQuasar.setType('error');
      this.notifyQuasar.show(undefined, 'Email invalido');
      return;
    }

    this.state.currentPatient.email = val;
    this.changeState({
      ...this.state,
      currentPatient: this.state.currentPatient,
      error: false,
    });
  }

  async patientNotFound(): Promise<void> {
    this.sweetAlertModal.setType('error');
    const confirm = await this.sweetAlertModal.show(
      'Error',
      Messages.notFoundInfoPatient
    );
    if (confirm == false) {
      return;
    }

    routerInstance.push('/patient');
    return;
  }

  async loadInitialData(): Promise<void> {
    const allIDTypes = await this.idTypeService.getAll();
    const allGenders = await this.genderService.getAll();
    const allInsurance = await this.insuranceService.getAll();
    this.changeState({
      ...this.state,
      allIDTypes: allIDTypes,
      allGenders: allGenders,
      allInsurance: allInsurance,
    });
  }
  set IdType(value: number) {
    this.state.currentPatient.IDType = value;
    this.changeState({
      ...this.state,
      currentPatient: this.state.currentPatient,
    });
  }
  set Insurance(value: number) {
    this.state.currentPatient.insurance = value;
    this.changeState({
      ...this.state,
      currentPatient: this.state.currentPatient,
    });
  }
  set Gender(value: number) {
    this.state.currentPatient.gender = value;
    this.changeState({
      ...this.state,
      currentPatient: this.state.currentPatient,
    });
  }
}
