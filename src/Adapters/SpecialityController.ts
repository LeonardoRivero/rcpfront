import { ISpeciality } from 'src/Domine/ModelsDB';
import { SpecialityService } from 'src/Application/Services/SpecialityService';
import { SpecialityResponse } from 'src/Domine/Responses';
import { SpecialityFormState } from 'src/Domine/IStates';
import {
  Controller,
  ICommand,
  IControllersMediator,
} from 'src/Domine/IPatterns';
import container from 'src/inversify.config';
import { IStoreSettings } from 'src/Domine/IStores';
import { EditCommand, InsertCommand } from 'src/Application/Commands';

export class SpecialityController extends Controller {
  public state: SpecialityFormState;
  private service = container.get<SpecialityService>('SpecialityService');
  private static instance: SpecialityController;
  private saveCommand: ICommand | undefined;
  private updateCommand: ICommand | undefined;

  private constructor(state: SpecialityFormState) {
    super();
    this.state = state;
    return;
  }

  receiveData(mediator: IControllersMediator): void {
    return;
  }

  public static getInstance(state: SpecialityFormState): SpecialityController {
    if (!SpecialityController.instance) {
      SpecialityController.instance = new SpecialityController(state);
    }
    return SpecialityController.instance;
  }

  public clear(): void {
    this.state.currentSpeciality = {} as ISpeciality;
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

  public async notifySpeciality(val: SpecialityResponse | null): Promise<void> {
    if (val === null) return;
    this.state.currentSpeciality = val;
    const store = this.mediator.getStore() as IStoreSettings;
    store.currentSpeciality = val;
    this.mediator.notify(store, this);
  }

  public add(): void {
    this.state.expanded = true;
    this.state.currentSpeciality = {} as ISpeciality;
  }

  public edit(): void {
    if (this.state.expanded === false) {
      this.state.expanded = !this.state.expanded;
    }

    this.state.currentSpeciality = this.state.speciality as ISpeciality;
  }

  public async saveOrUpdate(): Promise<SpecialityResponse | null> {
    let response: SpecialityResponse | null = null;
    if (
      this.isCommand(this.saveCommand) &&
      this.saveCommand instanceof InsertCommand
    ) {
      response = <SpecialityResponse | null>await this.saveCommand.execute();
    }
    if (
      this.isCommand(this.updateCommand) &&
      this.updateCommand instanceof EditCommand
    ) {
      response = <SpecialityResponse | null>await this.updateCommand.execute();
    }
    if (response == null) return response;
    this.state.currentSpeciality = response;
    this.state.allSpecialities = await this.service.getAll();
    this.state.expanded = false;
    return response;
  }
}
