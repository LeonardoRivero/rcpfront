import { PathologicalHistoryService } from 'src/Application/Services';
import { Notificator } from 'src/Domine/IPatterns';
import { Messages } from 'src/Application/Utilities/Messages';
import { IPathologycalHistory } from 'src/Domine/ModelsDB';
import { PathologicalHistoryResponse } from 'src/Domine/Responses';
import { Convert } from 'src/Application/Utilities';
import { PathologicalHistoryState } from 'src/Domine/IStates';
import { FactoryNotifactors } from './Creators/Factories';

export class PathologicalHistoryAdapter {
  private store: PathologicalHistoryState;
  private messages = Messages.getInstance();
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator('sweetAlert');
  private service = new PathologicalHistoryService();
  private convert = new Convert();
  private static instance: PathologicalHistoryAdapter;

  private constructor(store: PathologicalHistoryState) {
    this.store = store;
    return;
  }

  public static getInstance(
    store: PathologicalHistoryState
  ): PathologicalHistoryAdapter {
    if (!PathologicalHistoryAdapter.instance) {
      PathologicalHistoryAdapter.instance = new PathologicalHistoryAdapter(
        store
      );
    }
    return PathologicalHistoryAdapter.instance;
  }

  public async saveOrUpdate(
    payload: IPathologycalHistory
  ): Promise<PathologicalHistoryResponse | null> {
    if (!payload) return null;
    let response: PathologicalHistoryResponse | null = null;
    payload.description = this.convert.toTitle(payload.description);
    if (payload.id == undefined) {
      response = await this.create(payload);
    }

    if (payload.id != undefined) {
      response = await this.update(payload);
    }
    this.store.allPathologies = await this.service.getAll();
    return response;
  }

  private async create(
    payload: IPathologycalHistory
  ): Promise<PathologicalHistoryResponse | null> {
    const confirm = await this.notifySweetAlert.show(
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
    payload: IPathologycalHistory
  ): Promise<PathologicalHistoryResponse | null> {
    const confirm = await this.notifySweetAlert.show(
      'Atención',
      this.messages.updateRegister
    );
    if (confirm === false) {
      return null;
    }

    const response = await this.service.update(payload);
    return response;
  }

  public async getAll(): Promise<Array<PathologicalHistoryResponse>> {
    if (this.store.allPathologies.length != 0) {
      return this.store.allPathologies;
    }
    const response = await this.service.getAll();
    this.store.allPathologies = response;
    return response;
  }

  public responseToEntity(
    payload: PathologicalHistoryResponse | null
  ): IPathologycalHistory {
    if (payload === null) {
      return {} as IPathologycalHistory;
    }
    const entity: IPathologycalHistory = {
      description: payload.description,
      id: payload.id,
    };
    return entity;
  }
}
