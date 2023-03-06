import { IStoreDoctor } from 'src/Infraestructure/Mediators/SettingsPage/DoctorStore';
import { DoctorResponse } from 'src/Domine/Responses';
import { DoctorService } from 'src/Application/Services/DoctorService';

export class DoctorAdapter {
  private store: IStoreDoctor;
  // private serviceModal = modalService();
  // private messages = Messages.getInstance();
  private service = new DoctorService();
  private static instance: DoctorAdapter;

  private constructor(store: IStoreDoctor) {
    this.store = store;
    return;
  }

  public static getInstance(store: IStoreDoctor): DoctorAdapter {
    if (!DoctorAdapter.instance) {
      DoctorAdapter.instance = new DoctorAdapter(store);
    }
    return DoctorAdapter.instance;
  }

  // public clear() {
  //   this.store.insurance = null;
  //   this.store.currentInsurance = {} as IHealthInsurance;
  // }

  // public insuranceChanged(val: IHealthInsurance): void {
  //   this.store.currentInsurance = val;
  // }

  // public add(): void {
  //   this.store.currentInsurance = {} as IHealthInsurance;
  //   this.store.expanded = true;
  //   this.store.form?.reset();
  // }

  // public edit(): void {
  //   if (this.store.expanded === false) {
  //     this.store.expanded = !this.store.expanded;
  //   }

  //   this.store.currentInsurance = this.store.insurance as IHealthInsurance;
  // }

  // public async saveOrUpdate(): Promise<void> {
  //   const isValid = await this.store.form?.validate();
  //   if (isValid == false) {
  //     return;
  //   }
  //   if (!this.store.currentInsurance) return;

  //   let payload: IHealthInsurance;
  //   let response = null;

  //   if (this.store.currentInsurance.id == undefined) {
  //     payload = {
  //       nameInsurance: this.store.currentInsurance.nameInsurance,
  //       entityCode: this.store.currentInsurance.entityCode,
  //     };
  //     response = await this.create(payload);
  //   }

  //   if (this.store.currentInsurance.id != undefined) {
  //     payload = {
  //       id: this.store.currentInsurance.id,
  //       nameInsurance: this.store.currentInsurance.nameInsurance,
  //       entityCode: this.store.currentInsurance.entityCode,
  //     };
  //     response = await this.update(payload);
  //   }

  //   if (response == null) {
  //     return;
  //   }
  //   this.store.currentInsurance = response;
  //   this.store.allInsurance = await this.service.getAll();
  //   this.store.expanded = false;
  // }

  // private async create(
  //   payload: IHealthInsurance
  // ): Promise<IHealthInsurance | null> {
  //   const confirm = await this.serviceModal.showModal(
  //     'Atención',
  //     this.messages.newRegister
  //   );
  //   if (confirm === false) {
  //     return null;
  //   }

  //   const response = await this.service.create(payload);
  //   return response;
  // }

  // private async update(
  //   payload: IHealthInsurance
  // ): Promise<IHealthInsurance | null> {
  //   const confirm = await this.serviceModal.showModal(
  //     'Atención',
  //     this.messages.updateRegister
  //   );
  //   if (confirm === false) {
  //     return null;
  //   }

  //   const response = await this.service.update(payload);
  //   return response;
  // }

  public async getAll(): Promise<Array<DoctorResponse>> {
    if (this.store.allDoctor.length !== 0) {
      return this.store.allDoctor;
    }
    const response = await this.service.getAll();
    this.store.allDoctor = response;
    return response;
  }
}
