import { FactoryNotifactors } from './Creators/Factories';
import { RelationCodeRepository } from 'src/Application/Repositories/SettingsRepository';
import { IRelationCode } from 'src/Domine/ModelsDB';
import { RelationCodeService } from 'src/Application/Services/RelationCodeService';
import { Messages } from 'src/Application/Utilities/Messages';
import { RelationCodeResponse } from 'src/Domine/Responses';
import {
  Controller,
  IControllersMediator,
  ModalType,
  Notificator,
} from 'src/Domine/IPatterns';
import { RelationCodeState } from 'src/Domine/IStates';
import { SettingsMediator } from 'src/Infraestructure/Mediators';
import { IStoreSettings } from 'src/Domine/IStores';
export class RelationCodeController extends Controller {
  public state: RelationCodeState;
  private repository = RelationCodeRepository.getInstance();
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);
  private service = new RelationCodeService();

  private static instance: RelationCodeController;

  private constructor(state: RelationCodeState) {
    super();
    this.state = state;
    return;
  }

  sendData(data: unknown): void {
    throw new Error('Method not implemented.');
  }
  async receiveData(mediator: IControllersMediator): Promise<void> {
    if (mediator instanceof SettingsMediator) {
      const val = mediator.store.currentDxMainCode;
      this.clear();
      if (val == null || val.id == undefined) {
        return;
      }
      const queryParameters = { dxMainCodeId: val.id };
      const response = await this.findByParameters(queryParameters);
      console.log(response);
      this.state.allRelationCodes = response;
    }
  }

  public static getInstance(store: RelationCodeState): RelationCodeController {
    if (!RelationCodeController.instance) {
      RelationCodeController.instance = new RelationCodeController(store);
    }
    return RelationCodeController.instance;
  }

  public async clear() {
    this.state.relationCode = null;
    this.state.allRelationCodes = [];
    // this.state.currentRelationCode = {} as IRelationCode;
  }

  public async relationCodeChanged(val: IRelationCode): Promise<void> {
    // this.state.currentRelationCode = val;
  }

  public add(): void {
    this.state.expanded = true;
  }

  public edit(): void {
    if (this.state.expanded === false) {
      this.state.expanded = !this.state.expanded;
    }
  }

  public async saveOrUpdate(): Promise<void> {
    const store = this.mediator.getStore() as IStoreSettings;
    if (!this.state.currentRelationCode) return;
    if (store.currentSpeciality?.id === undefined) {
      this.state.errorSpeciality = true;
      return;
    }

    this.state.errorSpeciality = false;
    if (store.currentDxMainCode?.id === undefined) {
      this.state.errorDxMainCode = true;
      return;
    }

    this.state.errorDxMainCode = false;
    const data = this.state.currentRelationCode;
    let payload: IRelationCode;
    let response = null;

    if (this.state.currentRelationCode.id == undefined) {
      payload = {
        code: data.code,
        description: data.description,
        dxmaincode: store.currentDxMainCode.id,
      };
      response = await this.create(payload);
    }
    // if (this.state.currentRelationCode.id != undefined) {
    //   payload = {
    //     id: data.id,
    //     code: data.code,
    //     description: data.description,
    //     dxmaincode: this.storeDxMainCode.currentDxMainCode.id,
    //   };
    //   response = await this.update(payload);
    // }

    this.state.relationCode = response;
    this.state.allRelationCodes = await this.service.getAll();
    this.state.expanded = false;
  }

  private async create(
    payload: IRelationCode
  ): Promise<RelationCodeResponse | null> {
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.newRegister
    );
    if (confirm === false) {
      return null;
    }

    const response = await this.service.save(payload);
    return response;
  }

  private async update(
    payload: IRelationCode
  ): Promise<RelationCodeResponse | null> {
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      Messages.updateRegister
    );

    if (confirm == false) return null;
    const response = await this.service.update(payload);
    return response;
  }

  public async getAll(): Promise<Array<RelationCodeResponse> | null> {
    const response = await this.repository.getAll();
    if (!response.ok) {
      return (this.state.allRelationCodes = []);
    }

    this.state.allRelationCodes = await response.json();
    return null;
    // return response;
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<RelationCodeResponse>> {
    return await this.service.findByParameters(queryParameters);
  }
}
