import { computed } from 'vue';
import { IDXMainCode } from 'src/Domine/ModelsDB';
import { Modal } from '../Infraestructure/Utilities/Modal';
import { Messages } from 'src/Application/Utilities/Messages';
import { IStoreDxMainCode } from 'src/Infraestructure/Mediators/SettingsPage/DxMainCodeStore';
import { useStoreSpeciality } from 'src/Infraestructure/Mediators/SettingsPage/SpecialityStore';
import { DxMainCodeService } from 'src/Application/Services/DxMainCodeService';
import { DXMainCodeResponse } from 'src/Domine/Responses';
import { Controller } from 'src/Domine/IPatterns';

export class DxMainCodeController extends Controller {
  sendData(data: unknown): void {
    throw new Error('Method not implemented.');
  }
  receiveData<T>(data: T): void {
    throw new Error('Method not implemented.');
  }
  private store: IStoreDxMainCode;
  private storeSpeciality = useStoreSpeciality();
  private service = new DxMainCodeService();
  private serviceModal = new Modal();
  private messages = Messages.getInstance();
  private static instance: DxMainCodeController;

  private constructor(store: IStoreDxMainCode) {
    super();
    this.store = store;
    return;
  }

  public static getInstance(store: IStoreDxMainCode): DxMainCodeController {
    if (!DxMainCodeController.instance) {
      DxMainCodeController.instance = new DxMainCodeController(store);
    }
    return DxMainCodeController.instance;
  }

  public async clear(): Promise<void> {
    this.store.dxMainCode = null;
    this.store.currentDxMainCode = {} as IDXMainCode;
    this.store.error = false;
  }

  public async dxMainCodeChanged(val: DXMainCodeResponse): Promise<void> {
    if (val === null) {
      this.store.currentDxMainCode = null;
      return;
    }
    this.store.currentDxMainCode = {
      id: val.id,
      description: val.description,
      CUP: val.CUP,
      speciality: val.speciality.id,
    };
  }

  public add(): void {
    this.store.expanded = true;
    this.store.currentDxMainCode = {} as IDXMainCode;
    this.store.dxMainCode = null;
  }

  public edit(): void {
    if (this.store.expanded === false) {
      this.store.expanded = !this.store.expanded;
    }
  }

  public async saveOrUpdate(): Promise<DXMainCodeResponse | null> {
    const isValid = await this.store.form?.validate();
    if (isValid == false) return null;
    if (!this.store.currentDxMainCode) return null;

    if (this.storeSpeciality.currentSpeciality?.id == null) {
      this.store.error = true;
      return null;
    }

    let payload: IDXMainCode;
    let response: DXMainCodeResponse | null = null;

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
    if (response === null) return null;
    this.store.currentDxMainCode = {
      id: response.id,
      CUP: response.CUP,
      description: response.description,
      speciality: response.speciality.id,
    };
    const queryParameters = {
      speciality: this.storeSpeciality.currentSpeciality.id,
    };
    this.store.allDxMainCodes = await this.service.findByParameters(
      queryParameters
    );
    this.store.expanded = false;
    return response;
  }

  private async save(payload: IDXMainCode): Promise<DXMainCodeResponse | null> {
    const confirm = await this.serviceModal.showModal(
      'Atención',
      this.messages.newRegister
    );
    if (confirm === false) return null;

    const response = await this.service.save(payload);
    return response;
  }

  private async update(
    payload: IDXMainCode
  ): Promise<DXMainCodeResponse | null> {
    const confirm = await this.serviceModal.showModal(
      'Atención',
      this.messages.updateRegister
    );

    if (confirm == false) return null;
    const response = await this.service.update(payload);
    return response;
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<DXMainCodeResponse>> {
    return await this.service.findByParameters(queryParameters);
  }

  public get listDxMainCodes(): Array<DXMainCodeResponse> {
    return this.store.allDxMainCodes;
  }

  public set listDxMainCodes(value: Array<DXMainCodeResponse>) {
    this.store.allDxMainCodes = value;
  }

  public dxMainCodeofSpeciality = computed({
    get: () => {
      if (this.store.allDxMainCodes === null) {
        return [] as Array<DXMainCodeResponse>;
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
