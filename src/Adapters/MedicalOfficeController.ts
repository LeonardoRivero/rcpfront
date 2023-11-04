import { Messages } from 'src/Application/Utilities/Messages';
import { MedicalOfficeResponse, SubRegionResponse } from 'src/Domine/Responses';
import { MedicalOfficeState } from 'src/Domine/IStates';
import {
  Controller,
  ICommand,
  IControllersMediator,
  Notificator,
} from 'src/Domine/IPatterns';
import { FactoryNotifactors } from './Creators/Factories';
import container from 'src/inversify.config';
import { ModalType } from 'src/Domine/Types';
import { SubRegionService } from 'src/Application/Services/GeographicCollectionService';
import { CreateCommand, InsertCommand } from 'src/Application/Commands';
import { MedicalOfficeService } from 'src/Application/Services/MedicalOfficeService';

export class MedicalOfficeController extends Controller {
  public state: MedicalOfficeState;
  private saveCommand: ICommand | undefined;
  private updateCommand: ICommand | undefined;
  private notifyQuasar: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.NotifyQuasar);
  private subRegionService =
    container.get<SubRegionService>('SubRegionService');
  private static instance: MedicalOfficeController;

  private constructor(state: MedicalOfficeState) {
    super();
    this.state = state;
    return;
  }

  receiveData(mediator: IControllersMediator): void {
    return;
  }

  public static getInstance(
    state: MedicalOfficeState
  ): MedicalOfficeController {
    if (!MedicalOfficeController.instance) {
      MedicalOfficeController.instance = new MedicalOfficeController(state);
    }
    return MedicalOfficeController.instance;
  }

  public clear(): void {
    this.state.address = '';
    this.state.region = undefined;
    this.state.subRegion = undefined;
  }

  public resetAllCommand() {
    this.saveCommand = undefined;
    this.updateCommand = undefined;
  }

  public setOnSave(command: ICommand): void {
    this.saveCommand = command;
  }

  public async saveOrUpdate(): Promise<MedicalOfficeResponse | null> {
    let response: MedicalOfficeResponse | null = null;
    if (
      this.isCommand(this.saveCommand) &&
      this.saveCommand instanceof InsertCommand
    ) {
      response = <MedicalOfficeResponse | null>await this.saveCommand.execute();
    }

    if (response === null) {
      this.notifyQuasar.setType('error');
      this.notifyQuasar.show(undefined, Messages.errorMessage);
      return response;
    } else {
      this.notifyQuasar.setType('success');
      this.notifyQuasar.show(undefined, Messages.successMessage);
    }

    this.state.expanded = false;
    // if (
    //   this.isCommand(this.updateCommand) &&
    //   this.saveCommand instanceof UpdateCommand
    // ) {
    //   const response = <UserResponse>await this.updateCommand.execute();
    //   return response;
    // }
    return response;
  }

  public async getCitiesByDepartment(
    url: string
  ): Promise<Array<SubRegionResponse>> {
    const id = this.getIdByUrl(url);
    const response = await this.subRegionService.findByParameters({
      region_id: id,
    });
    this.state.subRegions = response;
    this.state.subRegion = undefined;
    return response;
  }

  public getIdByUrl(url: string): number {
    const id = url.split('/')[6];
    if (id == undefined) {
      throw new EvalError('id cant be undefined');
    }
    return parseInt(id);
  }

  public showInfoMedicalOffice(id: number) {
    this.state.medicalOffices.length;
    const medicalOffice = this.state.medicalOffices.find(
      (element) => element.id == id
    );
    if (medicalOffice == undefined) return;
    this.state.region = medicalOffice.department;
    this.state.subRegion = medicalOffice.city;
    this.state.address = medicalOffice.address;
    console.log(medicalOffice);
  }

  public async getAllMedicalOffice() {
    const serviceMedicalOffice = container.get<MedicalOfficeService>(
      'MedicalOfficeService'
    );
    this.state.medicalOffices = await serviceMedicalOffice.getAll();
  }
}
