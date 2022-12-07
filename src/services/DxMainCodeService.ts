import { computed } from 'vue';
import { QForm } from 'quasar';
import { defineStore } from 'pinia';
import { IDXMainCodeRequest, IDXMainCodeResponse } from 'src/models/IConsults';
import modalService from './ModalService';
import { Messages } from 'src/scripts/Constants';
import { DxMainCodeRepository } from 'src/patterns/Repository/SettingsRepository';
import { useStoreSpeciality } from './SpecialityService';

interface IStoreDxMainCode {
  allDxMainCodes: Array<IDXMainCodeResponse>;
  currentDxMainCode: IDXMainCodeResponse | null;
  form: QForm | null;
  expanded: boolean;
  dxMainCode: IDXMainCodeResponse | null;
  error: boolean;
}

export const useStoreDxMainCode = defineStore('storeDxMainCode', {
  state: () =>
    ({
      allDxMainCodes: [] as Array<IDXMainCodeResponse>,
      currentDxMainCode: {} as IDXMainCodeResponse,
      form: null,
      expanded: false,
      dxMainCode: null,
      error: false,
    } as IStoreDxMainCode),
});
export class dxMainCodeService {
  private store = useStoreDxMainCode();
  private storeSpeciality = useStoreSpeciality();
  private repository = DxMainCodeRepository.getInstance();
  private serviceModal = modalService();
  private messages = Messages.getInstance();

  private static instance: dxMainCodeService;

  private constructor() {
    return;
  }

  public static getInstance(): dxMainCodeService {
    if (!dxMainCodeService.instance) {
      dxMainCodeService.instance = new dxMainCodeService();
    }
    return dxMainCodeService.instance;
  }

  public clear(): void {
    this.store.dxMainCode = null;
    this.store.currentDxMainCode = {} as IDXMainCodeResponse;
    this.store.error = false;
  }

  public dxMainCodeChanged(val: IDXMainCodeResponse): void {
    this.store.currentDxMainCode = val;
  }

  public add(): void {
    this.store.expanded = true;
    this.store.currentDxMainCode = {} as IDXMainCodeResponse;
    this.store.dxMainCode = null;
  }

  public edit(): void {
    if (this.store.expanded === false) {
      this.store.expanded = !this.store.expanded;
    }
  }

  public async processRequest(): Promise<void> {
    const isValid = await this.store.form?.validate();
    if (isValid == false) return;
    if (!this.store.currentDxMainCode) return;

    if (this.storeSpeciality.currentSpeciality?.id == null) {
      this.store.error = true;
      return;
    }

    let payload = {} as IDXMainCodeRequest;
    let response = null;

    if (this.store.currentDxMainCode.id == undefined) {
      payload = {
        CUP: this.store.currentDxMainCode.CUP,
        description: this.store.currentDxMainCode.description,
        speciality: this.storeSpeciality.currentSpeciality.id,
      };
      response = await this.save(payload);
    }

    if (this.store.currentDxMainCode.id != undefined) {
      payload = {
        id: this.store.currentDxMainCode.id,
        CUP: this.store.currentDxMainCode.CUP,
        description: this.store.currentDxMainCode.description,
        speciality: this.storeSpeciality.currentSpeciality.id,
      };
      response = await this.update(payload);
    }

    this.store.currentDxMainCode = response;
    const queryParameters = {
      speciality: this.storeSpeciality.currentSpeciality.id,
    };
    this.store.allDxMainCodes = await this.repository.findByParameters(
      queryParameters
    );
    this.store.expanded = false;
  }

  private async save(
    payload: IDXMainCodeRequest
  ): Promise<IDXMainCodeResponse | null> {
    const confirm = await this.serviceModal.showModal(
      'Atención',
      this.messages.newRegister
    );
    if (confirm === false) return null;

    const response = await this.repository.create(payload);
    return response;
  }

  private async update(
    payload: IDXMainCodeRequest
  ): Promise<IDXMainCodeResponse | null> {
    const confirm = await this.serviceModal.showModal(
      'Atención',
      this.messages.updateRegister
    );

    if (confirm == false) return null;
    const response = await this.repository.update(payload);
    return response;
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<IDXMainCodeResponse>> {
    return await this.repository.findByParameters(queryParameters);
  }

  public get listDxMainCodes(): Array<IDXMainCodeResponse> {
    return this.store.allDxMainCodes;
  }

  public set listDxMainCodes(value: Array<IDXMainCodeResponse>) {
    this.store.allDxMainCodes = value;
  }

  public dxMainCodeofSpeciality = computed({
    get: () => {
      if (this.store.allDxMainCodes === null) {
        return [] as Array<IDXMainCodeResponse>;
      }
      return this.store.allDxMainCodes;
    },
    set: (value) => {
      this.store.allDxMainCodes = value;
    },
  });
}

// const store = useStoreSettings();

// const dxMainCodeRepository = DxMainCodeRepository.getInstance();

// export function dxMainCodeService() {
//   const { allDxMainCodes, currentDxMainCode, currentSpeciality, dxMainCode } =
//     storeToRefs(store);
//   // const dxMainCode = ref<IDXMainCodeResponse>();
//   const expanded = ref(false);
//   const formDXMainCode = ref<QForm | null>(null);
//   const error = ref(false);

//   function clearDxMainCode(val: IDXMainCodeRequest) {
//     dxMainCode.value = null;
//     currentDxMainCode.value = {} as IDXMainCodeResponse;
//     error.value = false;
//   }
//   function dxMainCodeChanged(val: IDXMainCodeResponse): void {
//     currentDxMainCode.value = val;
//   }
//   function add(): void {
//     expanded.value = !expanded.value;
//     currentDxMainCode.value = {} as IDXMainCodeResponse;
//   }
//   function edit(): void {
//     if (expanded.value === false) {
//       expanded.value = !expanded.value;
//     }
//     //currentDxMainCode.value = dxMainCode.value as IDXMainCodeResponse;
//   }
//   async function confirmChanges(): Promise<void> {
//     const isValid = await formDXMainCode.value?.validate();
//     if (isValid == false) {
//       return;
//     }
//     if (!currentDxMainCode.value) return;
//     if (currentSpeciality.value?.id == null) {
//       error.value = true;
//       return;
//     }
//     const data = currentDxMainCode.value;
//     let payload = {} as IDXMainCodeRequest;
//     let response = {} as IDXMainCodeResponse;
//     let confirmCreate = false;
//     if (currentDxMainCode.value.id == undefined) {
//       confirmCreate = await serviceModal.showModal(
//         'Atención',
//         messages.newRegister
//       );
//       if (confirmCreate === false) {
//         return;
//       }
//     }
//     if (confirmCreate == true) {
//       payload = {
//         CUP: data.CUP,
//         description: data.description,
//         speciality: currentSpeciality.value.id,
//       };
//       const responseCreate = await dxMainCodeRepository.create(payload);
//       if (responseCreate == null) {
//         return;
//       }
//       response = responseCreate;
//     }
//     let confirmUpdate = false;
//     if (currentDxMainCode.value.id != undefined) {
//       confirmUpdate = await serviceModal.showModal(
//         'Atención',
//         messages.updateRegister
//       );
//       if (confirmUpdate == false) {
//         return;
//       }
//     }

//     if (confirmUpdate == true) {
//       payload = {
//         id: data.id,
//         CUP: data.CUP,
//         description: data.description,
//         speciality: currentSpeciality.value.id,
//       };
//       const responseUpdate = await dxMainCodeRepository.update(payload);
//       if (responseUpdate == null) {
//         return;
//       }
//       response = responseUpdate;
//     }
//     currentDxMainCode.value = response;
//     const queryParameters = { speciality: currentSpeciality.value.id };
//     allDxMainCodes.value = await dxMainCodeRepository.findByParameters(
//       queryParameters
//     );
//     expanded.value = false;
//   }
//   async function getAllDxMainCode(): Promise<void> {
//     if (allDxMainCodes.value == undefined) {
//       const response = await dxMainCodeRepository.getAll();
//       allDxMainCodes.value = response;
//     }
//   }
//   const dxMainCodeofSpeciality = computed({
//     get: () => {
//       //clearDxMainCode({} as IDXMainCodeRequest);
//       // return store.allDxMainCodes;
//       if (store.allDxMainCodes === null) {
//         return [] as Array<IDXMainCodeResponse>;
//       }
//       return store.allDxMainCodes;
//       // const result = store.allDxMainCodes.filter(
//       //   (dxMainCode) => dxMainCode.speciality.id == store.currentSpeciality?.id
//       // );

//       // return result;
//     },
//     set: (value) => {
//       store.allDxMainCodes = value;
//     },
//   });

//   return {
//     //! Properties
//     clearDxMainCode,
//     formDXMainCode,
//     dxMainCode,
//     allDxMainCodes,
//     currentDxMainCode,
//     expanded,
//     error,
//     dxMainCodeofSpeciality,

//     //! Computed
//     // dxMainCodeofSpeciality: computed(() => {
//     //   if (store.allDxMainCodes === null) {
//     //     return null;
//     //   }
//     //   const result = store.allDxMainCodes.filter(
//     //     (dxMainCode) => dxMainCode.speciality.id == store.currentSpeciality?.id
//     //   );
//     //   clearDxMainCode({} as IDXMainCodeRequest);
//     //   return result;
//     // }),
//     //! Metodos
//     add,
//     edit,
//     dxMainCodeChanged,
//     confirmChanges,
//     getAllDxMainCode,
//   };
// }
