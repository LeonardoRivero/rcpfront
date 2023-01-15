import modalService from './ModalService';
import { IStoreInsurance } from 'src/Infraestructure/stores/SettingsPage/InsuranceStore';
import { InsuranceService } from 'src/Application/Services/InsuranceService';
import { Messages } from 'src/Application/Utilities/Messages';
import { IHealthInsurance } from 'src/Domine/ModelsDB';

export class InsuranceAdapter {
  private store: IStoreInsurance;
  private serviceModal = modalService();
  private messages = Messages.getInstance();
  private service = new InsuranceService();
  private static instance: InsuranceAdapter;

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

  public insuranceChanged(val: IHealthInsurance): void {
    this.store.currentInsurance = val;
  }

  public add(): void {
    this.store.currentInsurance = {} as IHealthInsurance;
    this.store.expanded = true;
    this.store.form?.reset();
  }

  public edit(): void {
    if (this.store.expanded === false) {
      this.store.expanded = !this.store.expanded;
    }

    this.store.currentInsurance = this.store.insurance as IHealthInsurance;
  }

  public async saveOrUpdate(): Promise<void> {
    const isValid = await this.store.form?.validate();
    if (isValid == false) {
      return;
    }
    if (!this.store.currentInsurance) return;

    let payload: IHealthInsurance;
    let response = null;

    if (this.store.currentInsurance.id == undefined) {
      payload = {
        nameInsurance: this.store.currentInsurance.nameInsurance,
        entityCode: this.store.currentInsurance.entityCode,
      };
      response = await this.create(payload);
    }

    if (this.store.currentInsurance.id != undefined) {
      payload = {
        id: this.store.currentInsurance.id,
        nameInsurance: this.store.currentInsurance.nameInsurance,
        entityCode: this.store.currentInsurance.entityCode,
      };
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

  public async getAll(): Promise<Array<IHealthInsurance>> {
    if (this.store.allInsurance.length !== 0) {
      return this.store.allInsurance;
    }
    const response = await this.service.getAll();
    this.store.allInsurance = response;
    return response;
  }
}

// export function insuranceServices() {
//   const { allInsurance, currentInsurance } = storeToRefs(store);
//   const insurance = ref<IHealthInsurance>();
//   const expanded = ref(false);
//   const formInsurance = ref<QForm | null>(null);
//   const error = ref(false);

//   function clearInsurance(val: IHealthInsurance) {
//     insurance.value = undefined;
//     currentInsurance.value = {} as IHealthInsurance;
//   }
//   function insuranceChanged(val: IHealthInsurance): void {
//     store.currentInsurance = val;
//   }
//   function add(): void {
//     expanded.value = !expanded.value;
//     currentInsurance.value = {} as IHealthInsurance;
//   }
//   function edit(): void {
//     if (expanded.value === false) {
//       expanded.value = !expanded.value;
//     }
//     currentInsurance.value = insurance.value as IHealthInsurance;
//   }
//   async function confirmChanges(): Promise<void> {
//     const isValid = await formInsurance.value?.validate();
//     if (isValid == false) {
//       return;
//     }
//     if (!currentInsurance.value) return;

//     const data = currentInsurance.value;
//     let response = {} as IHealthInsurance;
//     let confirmCreate = false;
//     if (currentInsurance.value.id == undefined) {
//       confirmCreate = await serviceModal.showModal(
//         'Atención',
//         messages.newRegister
//       );
//       if (confirmCreate === false) {
//         return;
//       }
//     }
//     if (confirmCreate === true) {
//       const payload = {
//         nameInsurance: data.nameInsurance,
//         entityCode: data.entityCode,
//       } as IHealthInsurance;
//       const responseCreate = await insuranceRepository.create(payload);
//       if (responseCreate == null) {
//         return;
//       }
//       response = responseCreate;
//     }
//     let confirmUpdate = false;
//     if (currentInsurance.value.id != undefined) {
//       confirmUpdate = await serviceModal.showModal(
//         'Atención',
//         messages.updateRegister
//       );
//       if (confirmUpdate === false) {
//         return;
//       }
//     }
//     if (confirmUpdate == true) {
//       const payload = {
//         id: data.id,
//         nameInsurance: data.nameInsurance,
//         entityCode: data.entityCode,
//       } as IHealthInsurance;
//       const responseUpdate = await insuranceRepository.update(payload);
//       if (responseUpdate == null) {
//         return;
//       }
//       response = responseUpdate;
//     }

//     currentInsurance.value = response;
//     const allInsurances = await insuranceRepository.getAll();
//     if (allInsurances == null) {
//       allInsurance.value = [];
//       return;
//     }
//     allInsurance.value = allInsurances;
//   }
//   async function getAllInsurance() {
//     if (allInsurance.value == undefined) {
//       const response = await insuranceRepository.getAll();
//       if (response == null) return;
//       allInsurance.value = response;
//       return response;
//     }
//     return allInsurance.value;
//   }

//   return {
//     //! Properties
//     clearInsurance,
//     formInsurance,
//     insurance,
//     allInsurance,
//     currentInsurance,
//     expanded,
//     error,
//     //! Computed
//     //! Metodos
//     add,
//     edit,
//     insuranceChanged,
//     confirmChanges,
//     getAllInsurance,
//   };
// }
