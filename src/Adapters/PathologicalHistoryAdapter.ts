import { PathologicalHistoryService } from 'src/Application/Services';
import { IPathologycalHistory } from 'src/Domine/ModelsDB';
import { PathologicalHistoryResponse } from 'src/Domine/Responses';
import { PathologicalHistoryState } from 'src/Domine/IStates';
import { EditCommand, InsertCommand } from 'src/Application/Commands';

export class PathologicalHistoryController {
  private state: PathologicalHistoryState;
  private service = new PathologicalHistoryService();
  private static instance: PathologicalHistoryController;

  private constructor(state: PathologicalHistoryState) {
    this.state = state;
    return;
  }

  public static getInstance(
    store: PathologicalHistoryState
  ): PathologicalHistoryController {
    if (!PathologicalHistoryController.instance) {
      PathologicalHistoryController.instance =
        new PathologicalHistoryController(store);
    }
    return PathologicalHistoryController.instance;
  }

  public add(): void {
    this.state.expanded = true;
    this.state.currentPathology = {} as IPathologycalHistory;
  }

  public async saveOrUpdate(): Promise<void> {
    if (!this.state.currentPathology) return;
    let response: PathologicalHistoryResponse | null = null;
    let payload: IPathologycalHistory;

    if (this.state.currentPathology.id == undefined) {
      delete this.state.currentPathology['id'];
      const insertCommand = new InsertCommand(
        this.state.currentPathology,
        this.service
      );
      response = <PathologicalHistoryResponse | null>(
        await insertCommand.execute()
      );
      insertCommand.showNotification(response);
    }

    if (this.state.currentPathology.id != undefined) {
      payload = {
        id: this.state.currentPathology.id,
        description: this.state.currentPathology.description,
      };
      const editCommand = new EditCommand(
        payload,
        this.state.currentPathology.id,
        this.service
      );
      response = <PathologicalHistoryResponse | null>(
        await editCommand.execute()
      );
      editCommand.showNotification(response);
    }

    if (response == null) {
      return;
    }
    this.state.allPathologies = await this.service.getAll();
    this.state.pathology = response;
    this.state.currentPathology = {} as IPathologycalHistory;
    this.state.expanded = false;
  }

  public async edit() {
    if (this.state.expanded === false) {
      this.state.expanded = !this.state.expanded;
    }
    this.state.currentPathology = this.responseToEntity(this.state.pathology);
  }

  public async getAll(): Promise<Array<PathologicalHistoryResponse>> {
    if (this.state.allPathologies.length != 0) {
      return this.state.allPathologies;
    }
    const response = await this.service.getAll();
    this.state.allPathologies = response;
    return response;
  }

  private responseToEntity(
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

  public pathologyChanged(val: PathologicalHistoryResponse): void {
    const entity = this.responseToEntity(val);
    this.state.currentPathology = entity;
  }
}
