import { Notification } from 'src/Infraestructure/Utilities/Notifications';
import { Modal } from '../Infraestructure/Utilities/Modal';
import { routerInstance } from 'src/boot/globalRouter';
import { Validators } from 'src/Application/Utilities/Helpers';
import { Messages } from 'src/Application/Utilities/Messages';
import { PatientService } from 'src/Application/Services/PatientService';
import { IPatient } from 'src/Domine/ModelsDB';
import { PatientResponse } from 'src/Domine/Responses';
import { PatientState } from 'src/Domine/IStates';
import { Controller, IControllersMediator } from 'src/Domine/IPatterns';

export class PatientController extends Controller {
  public state: PatientState;
  private serviceModal = new Modal();
  private messages = Messages.getInstance();
  private notification = new Notification();
  private validator = Validators.getInstance();
  private service = new PatientService();

  private static instance: PatientController;

  private constructor(state: PatientState) {
    super();
    this.state = state;
  }

  public static getInstance(state: PatientState): PatientController {
    if (!PatientController.instance) {
      PatientController.instance = new PatientController(state);
    }
    return PatientController.instance;
  }

  public sendData(data: unknown): void {
    throw new Error('Method not implemented.');
  }
  public receiveData(data: IControllersMediator): void {
    throw new Error('Method not implemented.');
  }

  public clear(): void {
    this.state.currentPatient = {} as IPatient;
    this.state.gender = null;
    this.state.idType = null;
    this.state.insurance = null;
  }

  public async searchByIdentificacion(
    identification: string
  ): Promise<PatientResponse | null> {
    const response = await this.service.findByIdentification(identification);
    if (response === null) {
      this.clear();
      this.notification.setMessage(this.messages.notInfoFound);
      this.notification.showWarning();
      this.state.disable = false;
      return null;
    }
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
      payload = {
        name: this.state.currentPatient.name,
        lastName: this.state.currentPatient.lastName,
        IDType: this.state.currentPatient.IDType,
        identification: this.state.currentPatient.identification,
        dateBirth: this.state.currentPatient.dateBirth,
        phoneNumber: this.state.currentPatient.phoneNumber,
        insurance: this.state.currentPatient.insurance,
        gender: this.state.currentPatient.gender,
        email: this.state.currentPatient.email,
      };
      response = await this.save(payload);
      if (response == null) {
        this.notification.setMessage(this.messages.patientNotSaved);
        this.notification.showError();
        return null;
      }
    }
    if (this.state.currentPatient.id != undefined) {
      payload = {
        id: this.state.currentPatient.id,
        name: this.state.currentPatient.name,
        lastName: this.state.currentPatient.lastName,
        IDType: this.state.currentPatient.IDType,
        identification: this.state.currentPatient.identification,
        dateBirth: this.state.currentPatient.dateBirth,
        phoneNumber: this.state.currentPatient.phoneNumber,
        insurance: this.state.currentPatient.insurance,
        gender: this.state.currentPatient.gender,
        email: this.state.currentPatient.email,
      };
      response = await this.update(payload);
    }
    if (response !== null) {
      this.clear();
    }
    return response;
  }

  private async save(payload: IPatient): Promise<PatientResponse | null> {
    const confirm = await this.serviceModal.showModal(
      'Atención',
      this.messages.newRegister
    );
    if (confirm === false) {
      return null;
    }

    const response = await this.service.save(payload);
    return response;
  }

  private async update(payload: IPatient): Promise<PatientResponse | null> {
    const confirm = await this.serviceModal.showModal(
      'Atención',
      this.messages.updateRegister
    );
    if (confirm == false) return null;

    const response = await this.service.update(payload);
    return response;
  }

  public isValidEmail(val: string): void {
    const validEmail = this.validator.email(val);
    if (validEmail == false) {
      this.state.error = true;
      this.notification.setMessage('Email invalido');
      this.notification.showError();
      return;
    }

    this.state.currentPatient.email = val;
    this.state.error = false;
  }

  public async patientNotFound(): Promise<void> {
    const confirm = await this.serviceModal.showModal(
      'Error',
      this.messages.notFoundInfoPatient,
      'error'
    );
    if (confirm == false) {
      return;
    }

    routerInstance.push('/patient');
    return;
  }
}
