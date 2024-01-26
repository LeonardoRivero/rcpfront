import { IRelationCode } from 'src/Domine/ModelsDB';
import { RelationCodeService } from 'src/Application/Services/RelationCodeService';
import { RelationCodeResponse } from 'src/Domine/Responses';
import { Bloc, IControllersMediator } from 'src/Domine/IPatterns';
import { RelationCodeState } from 'src/Domine/IStates';
import { SettingsMediator } from 'src/Infraestructure/Mediators';
import { IStoreSettings } from 'src/Domine/IStores';
import { EditCommand, InsertCommand } from 'src/Application/Commands';
export class RelationCodeBloc extends Bloc<RelationCodeState> {
  private service = new RelationCodeService();

  constructor() {
    const state: RelationCodeState = {
      allRelationCodes: [],
      currentRelationCode: {
        id: undefined,
        description: '',
        code: '',
        dxmaincode: 0,
      },
      expanded: false,
      relationCode: null,
    };
    super(state);
    return;
  }

  async receiveData(mediator: IControllersMediator): Promise<void> {
    if (mediator instanceof SettingsMediator) {
      const val = mediator.store.currentDxMainCode;
      this.clear();
      if (val == null || val.id == undefined) return;

      const queryParameters = { dxMainCodeId: val.id };
      const response = await this.service.findByParameters(queryParameters);
      this.changeState({ ...this.state, allRelationCodes: response });
    }
  }

  async clear() {
    this.changeState({
      ...this.state,
      relationCode: null,
      currentRelationCode: {} as IRelationCode,
    });
  }

  async relationCodeChanged(val: IRelationCode): Promise<void> {
    this.changeState({
      ...this.state,
      currentRelationCode: {
        code: val.code,
        description: val.description,
        dxmaincode: val.dxmaincode,
        id: val.id,
      },
    });
  }

  add(): void {
    this.changeState({
      ...this.state,
      expanded: true,
      currentRelationCode: {} as IRelationCode,
    });
  }

  edit(): void {
    if (this.state.expanded === false) {
      this.changeState({ ...this.state, expanded: true });
    }
  }

  async saveOrUpdate(): Promise<void> {
    const store = this.mediator.getStore() as IStoreSettings;
    if (!this.state.currentRelationCode) return;
    if (store.currentDxMainCode?.id === undefined) return;

    const data = this.state.currentRelationCode;
    let response: RelationCodeResponse | null = null;
    const payload: IRelationCode = {
      id: data.id,
      code: data.code,
      description: data.description,
      dxmaincode: store.currentDxMainCode.id,
    };
    if (this.state.currentRelationCode.id == undefined) {
      delete this.state.currentRelationCode['id'];
      delete payload['id'];
      const insertCommand = new InsertCommand(payload, this.service);
      response = <RelationCodeResponse | null>await insertCommand.execute();
      insertCommand.showNotification(response);
    }

    if (this.state.currentRelationCode.id != undefined) {
      const editCommand = new EditCommand(
        payload,
        this.state.currentRelationCode.id,
        this.service
      );
      response = <RelationCodeResponse | null>await editCommand.execute();
      editCommand.showNotification(response);
    }

    if (response == null) return;
    const listRelationCode = await this.service.findByParameters({
      dxMainCodeId: store.currentDxMainCode.id,
    });

    this.changeState({
      ...this.state,
      relationCode: response,
      allRelationCodes: listRelationCode,
      expanded: false,
      currentRelationCode: {
        code: response?.code,
        description: response.description,
        dxmaincode: response.dxmaincode.id,
        id: response.id,
      },
    });
  }

  async getAll(): Promise<Array<RelationCodeResponse> | null> {
    this.state.allRelationCodes = await this.service.getAll();
    return this.state.allRelationCodes;
  }

  async findByParameters(
    queryParameters: object
  ): Promise<Array<RelationCodeResponse>> {
    return await this.service.findByParameters(queryParameters);
  }
}
