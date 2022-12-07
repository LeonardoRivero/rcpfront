import { ref } from 'vue';
import { QForm } from 'quasar';
import { defineStore } from 'pinia';
// import { useStoreSettings } from 'src/stores/storeSettings';
import { IHealthInsurance } from 'src/models/IPatients';
// import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
// import { HttpResponse } from 'src/scripts/Request';
// import { routerInstance } from 'src/boot/globalRouter';
import modalService from './ModalService';
import { Messages } from 'src/scripts/Constants';
import { InsuranceRepository } from 'src/patterns/Repository/SettingsRepository';

// const serviceModal = modalService();
// const messages = Messages.getInstance();
// const store = useStoreSettings();
// const insuranceRepository = InsuranceRepository.getInstance();

interface IStoreInsurance {
  allInsurance: Array<IHealthInsurance>;
  currentInsurance: IHealthInsurance;
  form: QForm | null;
  expanded: boolean;
  insurance: IHealthInsurance | null;
  error: boolean;
}
export const useStoreInsurance = defineStore('storeStoreInsurance', {
  state: () =>
    ({
      allInsurance: [] as Array<IHealthInsurance>,
      currentInsurance: {} as IHealthInsurance,
      form: null,
      expanded: false,
      error: false,
      insurance: null,
    } as IStoreInsurance),
});

export class insuranceService {
  private store = useStoreInsurance();
  private repository = InsuranceRepository.getInstance();
  private serviceModal = modalService();
  private messages = Messages.getInstance();
  private static instance: insuranceService;

  private constructor() {
    return;
  }

  public static getInstance(): insuranceService {
    if (!insuranceService.instance) {
      insuranceService.instance = new insuranceService();
    }
    return insuranceService.instance;
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

  public async processRequest(): Promise<void> {
    const isValid = await this.store.form?.validate();
    if (isValid == false) {
      return;
    }
    if (!this.store.currentInsurance) return;

    let payload = {} as IHealthInsurance;
    let response = null;

    if (this.store.currentInsurance.id == undefined) {
      payload = {
        nameInsurance: this.store.currentInsurance.nameInsurance,
        entityCode: this.store.currentInsurance.entityCode,
      } as IHealthInsurance;
      response = await this.create(payload);
    }

    if (this.store.currentInsurance.id != undefined) {
      payload = {
        id: this.store.currentInsurance.id,
        nameInsurance: this.store.currentInsurance.nameInsurance,
        entityCode: this.store.currentInsurance.entityCode,
      } as IHealthInsurance;
      response = await this.update(payload);
    }

    if (response == null) {
      return;
    }
    this.store.currentInsurance = response;
    const allInsurances = await this.repository.getAll();
    if (allInsurances == null) {
      this.store.allInsurance = [];
      return;
    }

    this.store.allInsurance = allInsurances;
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

    const response = await this.repository.create(payload);
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

    const response = await this.repository.update(payload);
    return response;
  }

  public async getAll(): Promise<Array<IHealthInsurance>> {
    if (this.store.allInsurance.length !== 0) {
      return this.store.allInsurance;
    }
    const response = await this.repository.getAll();
    if (response == null) return [];
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
