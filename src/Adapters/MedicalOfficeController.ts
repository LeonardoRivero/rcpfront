import { Messages } from 'src/Application/Utilities/Messages';
import {
  CountryResponse,
  MedicalOfficeResponse,
  RegionResponse,
  RegionResponseModel,
  SubRegionResponse,
  SubRegionResponseModel,
} from 'src/Domine/Responses';
import { MedicalOfficeState } from 'src/Domine/IStates';
import {
  Controller,
  ICommand,
  IControllersMediator,
  IFactoryMethodNotifications,
  Notificator,
} from 'src/Domine/IPatterns';
// import container from 'src/inversify.config';
import { ModalType } from 'src/Domine/Types';
import { EditCommand, InsertCommand } from 'src/Application/Commands';
import { MedicalOfficeService } from 'src/Application/Services/MedicalOfficeService';
import { GenericService } from 'src/Application/Repositories';

export class MedicalOfficeController extends Controller {
  public state: MedicalOfficeState;
  private saveCommand: ICommand | undefined;
  private updateCommand: ICommand | undefined;
  private notifyQuasar: Notificator;
  // private subRegionService =
  //   container.get<GenericService<any, SubRegionResponse>>('SubRegionService');
  private static instance: MedicalOfficeController;
  // private countryService =
  //   container.get<GenericService<any, CountryResponse>>('CountryService');
  // private regionService =
  //   container.get<GenericService<any, RegionResponse>>('RegionService');

  private constructor(
    state: MedicalOfficeState,
    factoryNotificator: IFactoryMethodNotifications
  ) {
    super();
    this.state = state;
    this.notifyQuasar = factoryNotificator.createNotificator(
      ModalType.NotifyQuasar
    );
    return;
  }

  receiveData(mediator: IControllersMediator): void {
    return;
  }

  public static getInstance(
    state: MedicalOfficeState,
    factoryNotificator: IFactoryMethodNotifications
  ): MedicalOfficeController {
    if (!MedicalOfficeController.instance) {
      MedicalOfficeController.instance = new MedicalOfficeController(
        state,
        factoryNotificator
      );
    }
    return MedicalOfficeController.instance;
  }

  public clear(): void {
    this.state.address = '';
    this.state.enableForEdit = true;
    this.state.expanded = true;
    this.state.medicalOfficeResponse = {
      department: {} as RegionResponseModel,
      city: {} as SubRegionResponseModel,
    } as MedicalOfficeResponse;
  }

  public edit(): void {
    this.state.expanded = true;
    this.state.enableForEdit = true;
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
    return response;
  }

  public async getCitiesByDepartment(
    id: number
  ): Promise<Array<SubRegionResponse>> {
    // const response = await this.subRegionService.findByParameters({
    //   region_id: id,
    // });
    // this.state.subRegions = response;
    // return response;
    return [];
  }

  public getIdByUrl(url: string): number {
    const id = url.split('/')[6];
    if (id == undefined) {
      throw new EvalError('id cant be undefined');
    }
    return parseInt(id);
  }

  public async showInfoMedicalOffice(id: number) {
    this.state.visibleEdit = true;
    this.state.expanded = true;
    const medicalOffice = this.state.medicalOffices.find(
      (element) => element.id == id
    );
    if (medicalOffice == undefined) return;
    this.state.medicalOfficeResponse = medicalOffice;

    await this.getCitiesByDepartment(
      this.state.medicalOfficeResponse.department.id
    );
  }

  public async getAllMedicalOffice() {
    // const serviceMedicalOffice = container.get<MedicalOfficeService>(
    //   'MedicalOfficeService'
    // );
    // this.state.medicalOffices = await serviceMedicalOffice.getAll();
    // this.state.disableSelectAddress = false;
  }

  public add() {
    this.state.visibleEdit = false;
    this.clear();
  }

  public cityChanged(id: string) {
    this.state.medicalOfficeEntity.city = parseInt(id);
  }

  public async departmentChanged(url: string) {
    const id = this.getIdByUrl(url);
    await this.getCitiesByDepartment(id);
    this.state.medicalOfficeResponse.city = {} as SubRegionResponseModel;
    this.state.medicalOfficeEntity.department = id;
  }

  public async loadInitialData() {
    // this.state.countries = await this.countryService.getAll();
    // this.state.regions = await this.regionService.getAll();
  }
}
