import { Modal } from '../Infraestructure/Utilities/Modal';
import { IStoreInsurance } from 'src/Infraestructure/Mediators/SettingsPage/InsuranceStore';
import { InsuranceService } from 'src/Application/Services/InsuranceService';
import { Messages } from 'src/Application/Utilities/Messages';
import { IHealthInsurance } from 'src/Domine/ModelsDB';
import { Convert } from 'src/Application/Utilities';
import { HealthInsuranceResponse } from 'src/Domine/Responses';
import { reactive } from 'vue';

export class InsuranceAdapter {
  private store: IStoreInsurance;
  private serviceModal = new Modal();
  private messages = Messages.getInstance();
  private service = new InsuranceService();
  private static instance: InsuranceAdapter;
  private convert = new Convert();
  private state = reactive({
    counter: 0,
  });

  private constructor(store: IStoreInsurance) {
    this.store = store;
    return;
  }

  public static getInstance(store: IStoreInsurance): InsuranceAdapter {
    if (!InsuranceAdapter.instance) {
      InsuranceAdapter.instance = new InsuranceAdapter(store);
    }
    return InsuranceAdapter.instance;
  }

  public clear() {
    this.store.insurance = null;
    this.store.currentInsurance = {} as IHealthInsurance;
  }

  // public insuranceChanged(val: IHealthInsurance): void {
  //   this.store.currentInsurance = val;
  // }

  public add(): void {
    this.store.currentInsurance = { takeCopayment: false } as IHealthInsurance;
    this.store.expanded = true;
    this.store.form?.reset();
  }

  // public edit(): void {
  //   if (this.store.expanded === false) {
  //     this.store.expanded = !this.store.expanded;
  //   }

  //   this.store.currentInsurance = this.store.insurance as IHealthInsurance;
  // }

  public async saveOrUpdate(payload: IHealthInsurance): Promise<void> {
    const isValid = await this.store.form?.validate();
    if (isValid == false) {
      return;
    }
    if (!this.store.currentInsurance) return;

    let response: IHealthInsurance | null = null;
    payload.nameInsurance = this.convert.toTitle(payload.nameInsurance);

    if (this.store.currentInsurance.id == undefined) {
      // payload = {
      //   nameInsurance: this.store.currentInsurance.nameInsurance,
      //   entityCode: this.store.currentInsurance.entityCode,
      // };
      response = await this.create(payload);
    }

    if (this.store.currentInsurance.id != undefined) {
      // payload = {
      //   id: this.store.currentInsurance.id,
      //   nameInsurance: this.store.currentInsurance.nameInsurance,
      //   entityCode: this.store.currentInsurance.entityCode,
      // };
      response = await this.update(payload);
    }

    if (response == null) {
      return;
    }
    this.store.currentInsurance = response;
    this.store.allInsurance = await this.service.getAll();
    this.store.expanded = false;
  }

  private async create(
    payload: IHealthInsurance
  ): Promise<IHealthInsurance | null> {
    const confirm = await this.serviceModal.showModal(
      'Atención',
      this.messages.newRegister
    );
    if (confirm === false) {
      return null;
    }

    const response = await this.service.create(payload);
    return response;
  }

  private async update(
    payload: IHealthInsurance
  ): Promise<IHealthInsurance | null> {
    const confirm = await this.serviceModal.showModal(
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
    if (this.store.allInsurance.length !== 0) {
      this.state.counter = 10;
      return this.store.allInsurance;
    }
    this.state.counter = 19;
    const response = await this.service.getAll();
    this.store.allInsurance = response;

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
  public addToArrayDefault(
    item: HealthInsuranceResponse
  ): Array<HealthInsuranceResponse> {
    const insuranceList = this.store.allInsurance.filter(
      (x) => x.nameInsurance == 'Particular'
    );
    insuranceList.push(item);
    return insuranceList;
  }

  public getState() {
    return this.state;
  }
}
export interface ITest {
  test: boolean;
}
