import { DoctorResponse } from 'src/Domine/Responses';
import { DoctorService } from 'src/Application/Services/DoctorService';
import { DoctorState } from 'src/Domine/IStates';
import { ICommand } from 'src/Domine/IPatterns';

export class DoctorController {
  private store: DoctorState;
  private service = new DoctorService();
  private static instance: DoctorController;
  private saveCommand: ICommand | undefined;
  private updateCommand: ICommand | undefined;
  private findByParametersCommand: ICommand | undefined;

  private constructor(store: DoctorState) {
    this.store = store;
    return;
  }

  public static getInstance(store: DoctorState): DoctorController {
    if (!DoctorController.instance) {
      DoctorController.instance = new DoctorController(store);
    }
    return DoctorController.instance;
  }

  public setOnSave(command: ICommand): void {
    this.saveCommand = command;
  }

  public setOnUpdate(command: ICommand): void {
    this.updateCommand = command;
  }

  public setOnFindByParameters(command: ICommand): void {
    this.findByParametersCommand = command;
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

  public async findByParameters() {
    this.findByParametersCommand?.execute();
  }
}
