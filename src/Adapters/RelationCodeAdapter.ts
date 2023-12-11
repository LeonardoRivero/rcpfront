import { IRelationCode } from 'src/Domine/ModelsDB';
import { RelationCodeService } from 'src/Application/Services/RelationCodeService';
import { RelationCodeResponse } from 'src/Domine/Responses';
import { Controller, IControllersMediator } from 'src/Domine/IPatterns';
import { RelationCodeState } from 'src/Domine/IStates';
import { SettingsMediator } from 'src/Infraestructure/Mediators';
import { IStoreSettings } from 'src/Domine/IStores';
import { EditCommand, InsertCommand } from 'src/Application/Commands';
export class RelationCodeController extends Controller {
  public state: RelationCodeState;
  private service = new RelationCodeService();
  private static instance: RelationCodeController;

  private constructor(state: RelationCodeState) {
    super();
    this.state = state;
    return;
  }

  async receiveData(mediator: IControllersMediator): Promise<void> {
    if (mediator instanceof SettingsMediator) {
      const val = mediator.store.currentDxMainCode;
      this.clear();
      if (val == null || val.id == undefined) return;

      const queryParameters = { dxMainCodeId: val.id };
      const response = await this.service.findByParameters(queryParameters);
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
    // this.state.allRelationCodes = [];
    this.state.currentRelationCode = {} as IRelationCode;
  }

  public async relationCodeChanged(val: IRelationCode): Promise<void> {
    this.state.currentRelationCode = val;
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
    // if (store.currentSpeciality?.id === undefined) {
    //   this.state.errorSpeciality = true;
    //   return;
    // }

    // this.state.errorSpeciality = false;
    if (store.currentDxMainCode?.id === undefined) {
      // this.state.errorDxMainCode = true;
      return;
    }

    // this.state.errorDxMainCode = false;
    const data = this.state.currentRelationCode;
    let payload: IRelationCode;
    let response: RelationCodeResponse | null = null;

    if (this.state.currentRelationCode.id == undefined) {
      payload = {
        code: data.code,
        description: data.description,
        dxmaincode: store.currentDxMainCode.id,
      };
      // response = await this.create(payload);
      delete this.state.currentRelationCode['id'];
      const insertCommand = new InsertCommand(payload, this.service);
      response = <RelationCodeResponse | null>await insertCommand.execute();
      insertCommand.showNotification(response);
    }
    if (data.id != undefined) {
      payload = {
        id: data.id,
        code: data.code,
        description: data.description,
        dxmaincode: store.currentDxMainCode.id,
      };
      const editCommand = new EditCommand(payload, data.id, this.service);
      response = <RelationCodeResponse | null>await editCommand.execute();
      editCommand.showNotification(response);
    }

    this.state.relationCode = response;
    this.state.allRelationCodes = await this.service.getAll();
    this.state.expanded = false;
  }

  public async getAll(): Promise<Array<RelationCodeResponse> | null> {
    this.state.allRelationCodes = await this.service.getAll();
    return this.state.allRelationCodes;
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<RelationCodeResponse>> {
    return await this.service.findByParameters(queryParameters);
  }
}
