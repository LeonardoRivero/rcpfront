import { QForm } from 'quasar';
import { routerInstance } from 'boot/globalRouter';
import { defineStore } from 'pinia';
import { ISpeciality } from 'src/models/IConsults';
import modalService from './ModalService';
import { Messages } from 'src/scripts/Constants';
import { SpecialityRepository } from 'src/patterns/Repository/SettingsRepository';
import { dxMainCodeService } from 'src/services/DxMainCodeService';

interface IStoreSpeciality {
  allSpecialities: Array<ISpeciality>;
  currentSpeciality: ISpeciality | null;
  form: QForm | null;
  expanded: boolean;
  speciality: ISpeciality | null;
}

export const useStoreSpeciality = defineStore('storeSpeciality', {
  state: () =>
    ({
      allSpecialities: [] as Array<ISpeciality>,
      currentSpeciality: {} as ISpeciality,
      expanded: false,
      speciality: null,
      form: null,
    } as IStoreSpeciality),
});

export class specialityService {
  private store = useStoreSpeciality();
  private dxMainService = dxMainCodeService.getInstance();
  private serviceModal = modalService();
  private messages = Messages.getInstance();
  private repository = SpecialityRepository.getInstance();
  private static instance: specialityService;

  private constructor() {
    return;
  }

  public static getInstance(): specialityService {
    if (!specialityService.instance) {
      specialityService.instance = new specialityService();
    }
    return specialityService.instance;
  }
  public clear(): void {
    this.store.currentSpeciality = {} as ISpeciality;
  }
  public async specialityChanged(val: ISpeciality | null): Promise<void> {
    if (val === null) return;
    this.store.currentSpeciality = val;

    if (val.id === undefined) {
      return;
    }

    const queryParameters = { speciality: this.store.currentSpeciality.id };
    const response = await this.dxMainService.findByParameters(queryParameters);
    this.dxMainService.clear();
    this.dxMainService.listDxMainCodes = response;
  }

  public add(): void {
    this.store.expanded = true;
    this.store.currentSpeciality = {} as ISpeciality;
    this.store.form?.reset();
  }

  public edit(): void {
    if (this.store.expanded === false) {
      this.store.expanded = !this.store.expanded;
    }

    this.store.currentSpeciality = this.store.speciality as ISpeciality;
  }

  public async processRequest(): Promise<void> {
    const isValid = await this.store.form?.validate();
    if (isValid == false) {
      return;
    }

    if (!this.store.currentSpeciality) return;
    let response = null;

    if (this.store.currentSpeciality.id == undefined) {
      response = await this.save(this.store.currentSpeciality);
    }

    if (this.store.currentSpeciality.id != undefined) {
      response = await this.update(this.store.currentSpeciality);
    }

    if (response == null) return;
    this.store.currentSpeciality = response;
    await this.repository.getAll();
    this.store.expanded = false;
  }

  private async save(payload: ISpeciality): Promise<ISpeciality | null> {
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

  private async update(payload: ISpeciality): Promise<ISpeciality | null> {
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

  public async getAll(): Promise<Array<ISpeciality>> {
    if (this.store.allSpecialities.length != 0) {
      return this.store.allSpecialities;
    }
    const response = await this.repository.getAll();

    if (response == null) return [];
    this.store.allSpecialities = response;
    return response;
  }
}

// const store = useStoreSettings();
// const serviceModal = modalService();
// const messages = Messages.getInstance();
// const serviceDxMainCode = dxMainCodeService();
// const specialityRepository = SpecialityRepository.getInstance();
// const dxMainCodeRepository = DxMainCodeRepository.getInstance();

// export function specialityService() {
//   const {
//     allSpecialities,
//     currentSpeciality,
//     speciality,
//     allDxMainCodes,
//     expanded,
//     formSpeciality,
//   } = storeToRefs(store);
//   // const expanded = ref(false);
//   // const formSpeciality = ref<QForm | null>(null);

//   function clearSpeciality(val: ISpeciality) {
//     currentSpeciality.value = {} as ISpeciality;
//   }
//   async function specialityChanged(val: ISpeciality): Promise<void> {
//     currentSpeciality.value = val;
//     if (val.id === undefined) {
//       return;
//     }
//     const queryParameters = { speciality: currentSpeciality.value.id };
//     allDxMainCodes.value = await dxMainCodeRepository.findByParameters(
//       queryParameters
//     );
//     serviceDxMainCode.clearDxMainCode({} as IDXMainCodeRequest);
//   }
//   function add(): void {
//     expanded.value = !expanded.value;
//     currentSpeciality.value = {} as ISpeciality;
//   }
//   function edit(): void {
//     if (expanded.value === false) {
//       expanded.value = !expanded.value;
//     }
//     currentSpeciality.value = speciality.value as ISpeciality;
//   }
//   async function confirmChanges(): Promise<void> {
//     const isValid = await formSpeciality.value?.validate();
//     if (isValid == false) {
//       return;
//     }
//     if (!currentSpeciality.value) return;
//     let response = {} as ISpeciality;
//     let confirmCreate = false;
//     if (currentSpeciality.value.id == undefined) {
//       confirmCreate = await serviceModal.showModal(
//         'Atención',
//         messages.newRegister
//       );
//       if (confirmCreate === false) {
//         return;
//       }
//     }
//     if (confirmCreate === true) {
//       const responseCreate = await specialityRepository.create(
//         currentSpeciality.value
//       );
//       if (responseCreate == null) {
//         return;
//       }
//       response = responseCreate;
//     }
//     let confirmUpdate = false;
//     if (currentSpeciality.value.id != undefined) {
//       confirmUpdate = await serviceModal.showModal(
//         'Atención',
//         messages.updateRegister
//       );
//       if (confirmUpdate === false) {
//         return;
//       }
//     }
//     if (confirmUpdate == true) {
//       const responseUpdate = await specialityRepository.update(
//         currentSpeciality.value
//       );
//       if (responseUpdate == null) {
//         return;
//       }
//       response = responseUpdate;
//     }
//     currentSpeciality.value = response as ISpeciality;
//     await specialityRepository.getAll();
//     expanded.value = false;
//   }
//   async function getAllSpecialities() {
//     if (allSpecialities.value == undefined) {
//       const response = await specialityRepository.getAll();
//       if (response == null) return;
//       allSpecialities.value = response;
//       return response;
//     }
//     return allSpecialities.value;
//   }

//   return {
//     //! Properties
//     getAllSpecialities,
//     clearSpeciality,
//     formSpeciality,
//     speciality,
//     allSpecialities,
//     currentSpeciality,
//     expanded,
//     //! Computed

//     //! Metodos
//     add,
//     edit,
//     specialityChanged,
//     confirmChanges,
//   };
// }
