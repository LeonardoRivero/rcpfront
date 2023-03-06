import { defineStore } from 'pinia';
import { PathologicalHistoryService } from 'src/Application/Services';
import { Controller, IControllersMediator } from 'src/Domine/IPatterns';
import { IStorePathologicalHistory } from 'src/Domine/IStores';
import { PathologicalHistoryResponse } from 'src/Domine/Responses';

const useStorePathological = defineStore({
  id: 'storePathological',
  state: (): IStorePathologicalHistory => ({
    allPathologies: [] as Array<PathologicalHistoryResponse>,
  }),
});

export class SettingsMediator implements IControllersMediator {
  private controllers: Controller[] = [];
  public store: IStorePathologicalHistory;
  private static instance: SettingsMediator;
  private service = new PathologicalHistoryService();

  public constructor() {
    this.store = useStorePathological();
  }
  createStore(): object {
    throw new Error('Method not implemented.');
  }

  public add(controller: Controller): void {
    this.controllers.push(controller);
  }
  public handleData(): void {
    throw new Error('Method not implemented.');
  }
  public notify(data: object): void {
    throw new Error('Method not implemented.');
  }

  public async getAllPathologies() {
    if (this.store.allPathologies.length != 0) {
      return this.store.allPathologies;
    }
    const response = await this.service.getAll();
    this.store.allPathologies = response;
    return response;
  }
}
