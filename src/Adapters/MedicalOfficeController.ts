import { Messages } from 'src/Application/Utilities/Messages';
import {
  MedicalOfficeResponse,
  RegionResponseModel,
  SubRegionResponse,
  SubRegionResponseModel,
} from 'src/Domine/Responses';
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
import {
  CreateCommand,
  EditCommand,
  InsertCommand,
  UpdateCommand,
} from 'src/Application/Commands';
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
    this.state.medicalOfficeResponse = {
      department: {} as RegionResponseModel,
      city: {} as SubRegionResponseModel,
    } as MedicalOfficeResponse;
  }

  public edit(): void {
    this.state.expanded = true;
  }

  public resetAllCommand() {
    this.saveCommand = undefined;
    this.updateCommand = undefined;
  }

  public setOnSave(command: ICommand): void {
    this.saveCommand = command;
  }

  public setOnUpdate(command: ICommand): void {
    this.updateCommand = command;
  }
  public async saveOrUpdate(): Promise<MedicalOfficeResponse | null> {
    let response: MedicalOfficeResponse | null = null;
    if (
      this.isCommand(this.saveCommand) &&
      this.saveCommand instanceof InsertCommand
    ) {
      response = <MedicalOfficeResponse | null>await this.saveCommand.execute();
    }
    if (
      this.isCommand(this.updateCommand) &&
      this.updateCommand instanceof EditCommand
    ) {
      response = <MedicalOfficeResponse | null>(
        await this.updateCommand.execute()
      );
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
    id: number
  ): Promise<Array<SubRegionResponse>> {
    const response = await this.subRegionService.findByParameters({
      region_id: id,
    });
    this.state.subRegions = response;
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
    const medicalOffice = this.state.medicalOffices.find(
      (element) => element.id == id
    );
    if (medicalOffice == undefined) return;
    // this.state.region = medicalOffice.department.name;
    // this.state.subRegion = medicalOffice.city.id;
    // this.state.address = medicalOffice.address;
    this.state.medicalOfficeResponse = medicalOffice;
    console.log(medicalOffice);
  }

  // public async getAllCities(): Promise<void> {
  //   console.log(this.state.subRegions);
  //   if (this.state.subRegions.length != 0) {
  //     return;
  //   }
  //   const subRegionService =
  //     container.get<SubRegionService>('SubRegionService');
  //   this.state.subRegions = await subRegionService.getAll();
  // }

  public async getAllMedicalOffice() {
    const serviceMedicalOffice = container.get<MedicalOfficeService>(
      'MedicalOfficeService'
    );
    this.state.medicalOffices = await serviceMedicalOffice.getAll();
  }
}
