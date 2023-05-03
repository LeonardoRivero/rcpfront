import { ISpeciality } from 'src/Domine/ModelsDB';
import { Modal } from '../Infraestructure/Utilities/Modal';
import { Messages } from 'src/Application/Utilities/Messages';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import { SpecialityResponse } from 'src/Domine/Responses';
import { SpecialityFormState } from 'src/Domine/IStates';
import { Controller, IControllersMediator } from 'src/Domine/IPatterns';
export class SpecialityController extends Controller {
  sendData(data: unknown): void {
    // this.mediator.handleData();
  }
  receiveData(mediator: IControllersMediator): void {
    return;
  }
  public state: SpecialityFormState;
  private serviceModal = new Modal();
  private messages = Messages.getInstance();
  private service = new SpecialityService();
  private static instance: SpecialityController;

  private constructor(state: SpecialityFormState) {
    super();
    this.state = state;
    return;
  }

  public static getInstance(state: SpecialityFormState): SpecialityController {
    if (!SpecialityController.instance) {
      SpecialityController.instance = new SpecialityController(state);
    }
    return SpecialityController.instance;
  }

  public clear(): void {
    this.state.currentSpeciality = {} as ISpeciality;
  }

  public async specialityChanged(val: ISpeciality | null): Promise<void> {
    if (val === null) return;
    this.state.currentSpeciality = val;
  }

  public add(): void {
    this.state.expanded = true;
    this.state.currentSpeciality = {} as ISpeciality;
  }

  public edit(): void {
    if (this.state.expanded === false) {
      this.state.expanded = !this.state.expanded;
    }

    this.state.currentSpeciality = this.state.speciality as ISpeciality;
  }

  public async saveOrUpdate(data: ISpeciality | null): Promise<void> {
    if (!data) return;

    let response = null;
    if (data.id == undefined) {
      response = await this.save(data);
    }

    if (data.id != undefined) {
      response = await this.update(data);
    }

    if (response == null) return;
    this.state.currentSpeciality = response;
    this.state.allSpecialities = await this.service.getAll();
    this.state.expanded = false;
  }

  private async save(payload: ISpeciality): Promise<SpecialityResponse | null> {
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

  private async update(
    payload: ISpeciality
  ): Promise<SpecialityResponse | null> {
    const confirm = await this.serviceModal.showModal(
      'Atención',
      this.messages.updateRegister,
      'question'
    );
    if (confirm === false) {
      return null;
    }

    const response = await this.service.update(payload);
    return response;
  }
}
