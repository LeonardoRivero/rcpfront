import { InsuranceService } from 'src/Application/Services/InsuranceService';
import { Messages } from 'src/Application/Utilities/Messages';
import { IHealthInsurance } from 'src/Domine/ModelsDB';
import { Convert } from 'src/Application/Utilities';
import { HealthInsuranceResponse } from 'src/Domine/Responses';
import { InsuranceState } from 'src/Domine/IStates';
import { FactoryNotifactors } from './Creators/Factories';
import { ModalType, Notificator } from 'src/Domine/IPatterns';

export class InsuranceAdapter {
  private state: InsuranceState;
  private notifySweetAlert: Notificator =
    FactoryNotifactors.getInstance().createNotificator(ModalType.SweetAlert);
  private messages = Messages.getInstance();
  private service = new InsuranceService();
  private static instance: InsuranceAdapter;
  private convert = new Convert();

  private constructor(state: InsuranceState) {
    this.state = state;
    return;
  }

  public static getInstance(state: InsuranceState): InsuranceAdapter {
    if (!InsuranceAdapter.instance) {
      InsuranceAdapter.instance = new InsuranceAdapter(state);
    }
    return InsuranceAdapter.instance;
  }

  public clear() {
    this.state.insurance = null;
    this.state.currentInsurance = {} as IHealthInsurance;
  }

  public add(): void {
    this.state.currentInsurance = { takeCopayment: false } as IHealthInsurance;
    this.state.expanded = true;
  }

  public async saveOrUpdate(payload: IHealthInsurance): Promise<void> {
    if (!this.state.currentInsurance) return;

    let response: IHealthInsurance | null = null;
    payload.nameInsurance = this.convert.toTitle(payload.nameInsurance);

    if (this.state.currentInsurance.id == undefined) {
      response = await this.create(payload);
    }

    if (this.state.currentInsurance.id != undefined) {
      response = await this.update(payload);
    }

    if (response == null) {
      return;
    }
    this.state.currentInsurance = response;
    this.state.allInsurance = await this.service.getAll();
    this.state.expanded = false;
  }

  private async create(
    payload: IHealthInsurance
  ): Promise<IHealthInsurance | null> {
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
    payload: IHealthInsurance
  ): Promise<IHealthInsurance | null> {
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

  public async getAll(): Promise<Array<HealthInsuranceResponse>> {
    if (this.state.allInsurance.length !== 0) {
      return this.state.allInsurance;
    }
    const response = await this.service.getAll();
    this.state.allInsurance = response;

    return response;
  }
  public responseToEntity(
    payload: HealthInsuranceResponse | null
  ): IHealthInsurance {
    if (payload === null) {
      return {} as IHealthInsurance;
    }
    const entity: HealthInsuranceResponse = {
      nameInsurance: payload.nameInsurance,
      id: payload.id,
      entityCode: payload.entityCode,
      takeCopayment: payload.takeCopayment,
    };
    return entity;
  }
}
