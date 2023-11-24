import { IDXMainCode } from 'src/Domine/ModelsDB';
import { DxMainCodeService } from 'src/Application/Services/DxMainCodeService';
import { DXMainCodeResponse } from 'src/Domine/Responses';
import {
  Controller,
  ICommand,
  IControllersMediator,
} from 'src/Domine/IPatterns';
import { DxMainCodeState } from 'src/Domine/IStates';
import { SettingsMediator } from 'src/Infraestructure/Mediators';
import { IStoreSettings } from 'src/Domine/IStores';
import {
  EditCommand,
  FindByParametersCommand,
  InsertCommand,
} from 'src/Application/Commands';

export class DxMainCodeController extends Controller {
  public state: DxMainCodeState;
  private store: IStoreSettings;
  private service = new DxMainCodeService();
  private static instance: DxMainCodeController;
  private saveCommand: ICommand | undefined;
  private updateCommand: ICommand | undefined;

  private constructor(state: DxMainCodeState) {
    super();
    this.state = state;
    this.store = {} as IStoreSettings;
    return;
  }

  async receiveData(mediator: IControllersMediator): Promise<void> {
    if (mediator instanceof SettingsMediator) {
      this.store = mediator.store;
      const val = mediator.store.currentSpeciality;
      this.clear();
      this.store.currentDxMainCode = {} as DXMainCodeResponse;
      this.listDxMainCodes = await this.findByParameters({
        speciality: val.id,
      });
    }
  }

  public static getInstance(state: DxMainCodeState): DxMainCodeController {
    if (!DxMainCodeController.instance) {
      DxMainCodeController.instance = new DxMainCodeController(state);
    }
    return DxMainCodeController.instance;
  }

  public async clear(): Promise<void> {
    this.state.dxMainCode = null;
    this.state.currentDxMainCode = {} as IDXMainCode;
    this.state.error = false;
  }

  public setOnSave(command: ICommand): void {
    this.saveCommand = command;
  }

  public setOnUpdate(command: ICommand): void {
    this.updateCommand = command;
  }

  public async dxMainCodeChanged(val: DXMainCodeResponse): Promise<void> {
    // if (val === null) {
    //   this.state.currentDxMainCode = null;
    //   return;
    // }
    this.state.currentDxMainCode = {
      id: val.id,
      description: val.description,
      CUP: val.CUP,
      speciality: val.speciality.id,
    };
    if (this.mediator instanceof SettingsMediator) {
      const store: IStoreSettings = this.mediator.getStore();
      store.currentDxMainCode = val;
      this.mediator.notify(store, this);
    }
  }

  public add(): void {
    this.state.expanded = true;
    this.state.currentDxMainCode = {} as IDXMainCode;
    this.state.dxMainCode = null;
  }

  public edit(): void {
    if (this.state.expanded === false) {
      this.state.expanded = !this.state.expanded;
    }
  }

  public async saveOrUpdate(): Promise<DXMainCodeResponse | null> {
    if (!this.state.currentDxMainCode) return null;
    let payload: IDXMainCode;
    let response: DXMainCodeResponse | null = null;

    if (this.state.currentDxMainCode.id == undefined) {
      payload = {
        CUP: this.state.currentDxMainCode.CUP,
        description: this.state.currentDxMainCode.description,
        speciality: this.store.currentSpeciality.id,
      };

      delete this.state.currentDxMainCode['id'];
      this.saveCommand = new InsertCommand(payload, this.service);
      response = <DXMainCodeResponse>await this.saveCommand.execute();
    }

    if (this.state.currentDxMainCode.id != undefined) {
      payload = {
        id: this.state.currentDxMainCode.id,
        CUP: this.state.currentDxMainCode.CUP,
        description: this.state.currentDxMainCode.description,
        speciality: this.store.currentSpeciality.id,
      };
      this.updateCommand = new EditCommand(
        payload,
        this.state.currentDxMainCode.id,
        this.service
      );
      response = <DXMainCodeResponse>await this.updateCommand.execute();
    }

    if (response === null) return null;
    this.state.currentDxMainCode = {
      id: response.id,
      CUP: response.CUP,
      description: response.description,
      speciality: response.speciality.id,
    };

    this.state.allDxMainCodes = await this.findByParameters({
      speciality: this.store.currentSpeciality.id,
    });
    this.state.expanded = false;
    return response;
  }

  private async findByParameters(
    queryParameters: object
  ): Promise<Array<DXMainCodeResponse>> {
    const findByParametersCommand = new FindByParametersCommand(
      queryParameters,
      this.service
    );
    return <Array<DXMainCodeResponse>>await findByParametersCommand.execute();
  }

  public get listDxMainCodes(): Array<DXMainCodeResponse> {
    return this.state.allDxMainCodes;
  }

  public set listDxMainCodes(value: Array<DXMainCodeResponse>) {
    this.state.allDxMainCodes = value;
  }
}
