import {
  Controller,
  IControllersMediator,
  IFactoryMethodNotifications,
  Notificator,
} from 'src/Domine/IPatterns';
import { routerInstance } from 'src/boot/globalRouter';
import { Validators, Messages } from 'src/Application/Utilities';
import {
  FindPatientByIdentificationUseCase,
  PatientService,
} from 'src/Application/Services/PatientService';
import { IPatient } from 'src/Domine/ModelsDB';
import { PatientResponse } from 'src/Domine/Responses';
import { PatientState } from 'src/Domine/IStates';
import { ModalType } from 'src/Domine/Types';
import { EditCommand, InsertCommand } from 'src/Application/Commands';

export class PatientController extends Controller {
  public state: PatientState;
  private sweetAlertModal: Notificator;
  private notifyQuasar: Notificator;
  private validator = Validators.getInstance();
  private static instance: PatientController;
  private service = new PatientService();
  private findPatientByIdentificationUseCase =
    FindPatientByIdentificationUseCase.getInstance();

  private constructor(
    state: PatientState,
    factoryNotificator: IFactoryMethodNotifications
  ) {
    super();
    this.state = state;
    this.notifyQuasar = factoryNotificator.createNotificator(
      ModalType.NotifyQuasar
    );
    this.sweetAlertModal = factoryNotificator.createNotificator(
      ModalType.SweetAlert
    );
  }

  public static getInstance(
    state: PatientState,
    factoryNotificator: IFactoryMethodNotifications
  ): PatientController {
    if (!PatientController.instance) {
      PatientController.instance = new PatientController(
        state,
        factoryNotificator
      );
    }
    return PatientController.instance;
  }

  public receiveData(data: IControllersMediator): void {
    throw new Error('Method not implemented.');
  }

  public clear(): void {
    this.state.currentPatient = { email: null } as IPatient;
    this.state.gender = null;
    this.state.idType = null;
    this.state.insurance = null;
  }

  public async searchByIdentificacion(): Promise<PatientResponse | null> {
    const response = await this.findPatientByIdentificationUseCase.execute(
      this.state.identificationPatient
    );
    if (response === null) {
      this.clear();
      this.notifyQuasar.setType('warning');
      this.notifyQuasar.show(undefined, Messages.notInfoFound);
      this.state.disable = false;
      return null;
    }
    this.setData(response);
    return response;
  }

  public setData(response: PatientResponse) {
    this.state.idType = response.IDType;
    this.state.insurance = response.insurance;
    this.state.gender = response.gender;
    this.state.currentPatient = this.responseToEntity(response);
    this.state.disable = true;
  }

  public enableEdition(): void {
    this.state.disable = false;
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

  public async saveOrUpdate(): Promise<PatientResponse | null> {
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

  public isValidEmail(val: string): void {
    const validEmail = this.validator.email(val);
    if (validEmail == false) {
      this.state.error = true;
      this.notifyQuasar.setType('error');
      this.notifyQuasar.show(undefined, 'Email invalido');
      return;
    }

    this.state.currentPatient.email = val;
    this.state.error = false;
  }

  public async patientNotFound(): Promise<void> {
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

  set IdType(value: number) {
    this.state.currentPatient.insurance = value;
  }
  set Insurance(value: number) {
    this.state.currentPatient.insurance = value;
  }
  set Gender(value: number) {
    this.state.currentPatient.gender = value;
  }
}
