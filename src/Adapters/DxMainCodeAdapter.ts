import { IDXMainCode } from 'src/Domine/ModelsDB';
import { FactoryNotifactors } from './Creators/Factories';
import { Messages } from 'src/Application/Utilities/Messages';
import { DxMainCodeService } from 'src/Application/Services/DxMainCodeService';
import { DXMainCodeResponse } from 'src/Domine/Responses';
import {
  Controller,
  IControllersMediator,
  Notificator,
} from 'src/Domine/IPatterns';
import { DxMainCodeState } from 'src/Domine/IStates';
import { SettingsMediator } from 'src/Infraestructure/Mediators';
import { IStoreSettings } from 'src/Domine/IStores';
import { Convert } from 'src/Application/Utilities';
import { ModalType } from 'src/Domine/Types';

export class DxMainCodeController extends Controller {
  public state: DxMainCodeState;
  private store: IStoreSettings;
  private service = new DxMainCodeService();
  private static instance: DxMainCodeController;
  private convert = new Convert();
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);

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
      const queryParameters = { speciality: val.id };
      const response = await this.findByParameters(queryParameters);
      this.clear();
      this.store.currentDxMainCode = {} as DXMainCodeResponse;
      this.listDxMainCodes = response;
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

  public async dxMainCodeChanged(val: DXMainCodeResponse): Promise<void> {
    if (val === null) {
      this.state.currentDxMainCode = null;
      return;
    }
    this.state.currentDxMainCode = {
      id: val.id,
      description: val.description,
      CUP: val.CUP,
      speciality: val.speciality.id,
    };
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
    if (this.store?.currentSpeciality?.id == null) {
      this.state.error = true;
      return null;
    }

    let payload: IDXMainCode;
    let response: DXMainCodeResponse | null = null;

    this.state.currentDxMainCode.description = this.convert.toTitle(
      this.state.currentDxMainCode.description
    );

    if (this.state.currentDxMainCode.id == undefined) {
      payload = {
        CUP: this.state.currentDxMainCode.CUP,
        description: this.state.currentDxMainCode.description,
        speciality: this.store.currentSpeciality.id,
      };
      response = await this.save(payload);
    }

    if (this.state.currentDxMainCode.id != undefined) {
      payload = {
        id: this.state.currentDxMainCode.id,
        CUP: this.state.currentDxMainCode.CUP,
        description: this.state.currentDxMainCode.description,
        speciality: this.store.currentSpeciality.id,
      };
      response = await this.update(payload);
    }
    if (response === null) return null;
    this.state.currentDxMainCode = {
      id: response.id,
      CUP: response.CUP,
      description: response.description,
      speciality: response.speciality.id,
    };
    const queryParameters = {
      speciality: this.store.currentSpeciality.id,
    };
    this.state.allDxMainCodes = await this.service.findByParameters(
      queryParameters
    );
    this.state.expanded = false;
    return response;
  }

  private async save(payload: IDXMainCode): Promise<DXMainCodeResponse | null> {
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.newRegister
    );
    if (confirm === false) return null;

    const response = await this.service.save(payload);
    return response;
  }

  private async update(
    payload: IDXMainCode
  ): Promise<DXMainCodeResponse | null> {
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.updateRegister
    );

    if (confirm == false) return null;
    const response = await this.service.update(payload);
    return response;
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<DXMainCodeResponse>> {
    return await this.service.findByParameters(queryParameters);
  }

  public get listDxMainCodes(): Array<DXMainCodeResponse> {
    return this.state.allDxMainCodes;
  }

  public set listDxMainCodes(value: Array<DXMainCodeResponse>) {
    this.state.allDxMainCodes = value;
  }
}
