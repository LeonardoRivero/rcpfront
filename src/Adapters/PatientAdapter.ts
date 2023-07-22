import {
  Controller,
  IControllersMediator,
  ModalType,
  Notificator,
} from 'src/Domine/IPatterns';
import { FactoryNotifactors } from './Creators/Factories';
import { routerInstance } from 'src/boot/globalRouter';
import { Validators, Messages } from 'src/Application/Utilities';
import { PatientService } from 'src/Application/Services/PatientService';
import { IPatient } from 'src/Domine/ModelsDB';
import { PatientResponse } from 'src/Domine/Responses';
import { PatientState } from 'src/Domine/IStates';

export class PatientController extends Controller {
  public state: PatientState;
  private notifyQuasar: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.NotifyQuasar);
  private sweetAlertModal: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);
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
      this.notifyQuasar.setType('warning');
      this.notifyQuasar.show(undefined, Messages.notInfoFound);
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
      // payload = {
      //   name: this.state.currentPatient.name,
      //   lastName: this.state.currentPatient.lastName,
      //   IDType: this.state.currentPatient.IDType,
      //   identification: this.state.currentPatient.identification,
      //   dateBirth: this.state.currentPatient.dateBirth,
      //   phoneNumber: this.state.currentPatient.phoneNumber,
      //   insurance: this.state.currentPatient.insurance,
      //   gender: this.state.currentPatient.gender,
      //   email: this.state.currentPatient.email,
      // };
      response = await this.save(this.state.currentPatient);
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
    if (response == null) {
      this.notifyQuasar.setType('error');
      this.notifyQuasar.show(undefined, Messages.patientNotSaved);
    }
    if (response != null) {
      this.notifyQuasar.setType('success');
      this.notifyQuasar.show(undefined, Messages.successMessage);
      this.clear();
    }
    return response;
  }

  private async save(payload: IPatient): Promise<PatientResponse | null> {
    const confirm = await this.sweetAlertModal.show(
      'Atención',
      Messages.newRegister
    );
    if (confirm === false) {
      return null;
    }

    const response = await this.service.save(payload);
    return response;
  }

  private async update(payload: IPatient): Promise<PatientResponse | null> {
    const confirm = await this.sweetAlertModal.show(
      'Atención',
      Messages.updateRegister
    );
    if (confirm == false) return null;

    const response = await this.service.update(payload);
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
}
