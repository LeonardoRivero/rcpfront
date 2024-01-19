import { ISpeciality } from 'src/Domine/ModelsDB';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import { SpecialityResponse } from 'src/Domine/Responses';
import { SpecialityFormState } from 'src/Domine/IStates';
import {
  Bloc,
  Controller,
  ICommand,
  IControllersMediator,
} from 'src/Domine/IPatterns';
import container from 'src/inversify.config';
import { IStoreSettings } from 'src/Domine/IStores';
import { EditCommand, InsertCommand } from 'src/Application/Commands';
import { ActionsSettingsMediator } from 'src/Infraestructure/Mediators';

export class SpecialityFormBloc extends Bloc<SpecialityFormState> {
  public constructor(private service: SpecialityService) {
    const state: SpecialityFormState = {
      currentSpeciality: {} as SpecialityResponse,
      expanded: false,
      speciality: null,
      allSpecialities: <Array<SpecialityResponse>>[],
    };
    super(state);
    return;
  }

  receiveData(mediator: IControllersMediator): void {
    return;
  }

  public clear(): void {
    this.state.currentSpeciality = {} as ISpeciality;
  }

  public async notifySpeciality(val: SpecialityResponse | null): Promise<void> {
    if (val === null) return;
    this.changeState({ ...this.state, currentSpeciality: val });
    const store = this.mediator.getStore() as IStoreSettings;
    store.currentSpeciality = val;
    // this.mediator.notify(store, this);
  }

  public add(): void {
    this.changeState({
      ...this.state,
      expanded: true,
      currentSpeciality: {} as ISpeciality,
    });
  }

  public edit(): void {
    if (this.state.expanded === false) {
      this.changeState({ ...this.state, expanded: !this.state.expanded });
    }
    this.changeState({
      ...this.state,
      currentSpeciality: this.state.speciality as ISpeciality,
    });
  }

  public async saveOrUpdate(): Promise<SpecialityResponse | null> {
    if (!this.state.currentSpeciality) return null;
    let response: SpecialityResponse | null = null;
    const payload: ISpeciality = this.state.currentSpeciality;

    if (this.state.currentSpeciality.id == undefined) {
      delete this.state.currentSpeciality['id'];
      const insertCommand = new InsertCommand(payload, this.service);
      response = <SpecialityResponse | null>await insertCommand.execute();
      insertCommand.showNotification(response);
    }

    if (this.state.currentSpeciality.id != undefined) {
      const id = this.state.currentSpeciality.id;
      payload.id = id;
      const updateCommand = new EditCommand(payload, id, this.service);
      response = <SpecialityResponse | null>await updateCommand.execute();
      updateCommand.showNotification(response);
    }

    if (response == null) return response;
    const allSpecialities = await this.service.getAll();
    this.changeState({
      ...this.state,
      currentSpeciality: response,
      allSpecialities: allSpecialities,
      expanded: false,
    });
    const store = <IStoreSettings>this.mediator.getStore();
    store.allSpecialities = allSpecialities;
    return response;
  }

  async loadInitialData() {
    const store = <IStoreSettings>this.mediator.getStore();
    const mediator = <ActionsSettingsMediator>(<unknown>this.mediator);
    const listSpecialities = await mediator.getAllSpecialities();
    store.allSpecialities = listSpecialities;
    this.changeState({ ...this.state, allSpecialities: listSpecialities });
  }
}
