import { computed } from 'vue';
import { QForm } from 'quasar';
import { defineStore } from 'pinia';
import {
  IRelationCodeRequest,
  IRelationCodeResponse,
} from 'src/models/IConsults';
import modalService from './ModalService';
import { Messages } from 'src/scripts/Constants';
import { RelationCodeRepository } from 'src/patterns/Repository/SettingsRepository';
import { useStoreDxMainCode } from './DxMainCodeService';
import { useStoreSpeciality } from './SpecialityService';

// const serviceModal = modalService();
// const messages = Messages.getInstance();
// const relationCodeRepository = RelationCodeRepository.getInstance();

interface IStoreRelationCode {
  allRelationCodes: Array<IRelationCodeResponse>;
  currentRelationCode: IRelationCodeResponse | null;
  form: QForm | null;
  expanded: boolean;
  relationCode: IRelationCodeResponse | null;
  errorDxMainCode: boolean;
  errorSpeciality: boolean;
}
export const useStoreRelationCode = defineStore('storeRelationCode', {
  state: () =>
    ({
      allRelationCodes: [] as Array<IRelationCodeResponse>,
      currentRelationCode: {} as IRelationCodeResponse,
      form: null,
      expanded: false,
      relationCode: null,
      errorDxMainCode: false,
      errorSpeciality: false,
    } as IStoreRelationCode),
});
export class relationCodeService {
  private store = useStoreRelationCode();
  private storeDxMainCode = useStoreDxMainCode();
  private storeSpeciality = useStoreSpeciality();
  private repository = RelationCodeRepository.getInstance();
  private serviceModal = modalService();
  private messages = Messages.getInstance();

  private static instance: relationCodeService;

  private constructor() {
    return;
  }

  public static getInstance(): relationCodeService {
    if (!relationCodeService.instance) {
      relationCodeService.instance = new relationCodeService();
    }
    return relationCodeService.instance;
  }

  public clear() {
    this.store.relationCode = null;
    this.store.currentRelationCode = {} as IRelationCodeResponse;
  }

  public async relationCodeChanged(val: IRelationCodeResponse): Promise<void> {
    this.store.currentRelationCode = val;
  }

  public add(): void {
    this.store.expanded = !this.store.expanded;
    this.store.currentRelationCode = {} as IRelationCodeResponse;
  }

  public edit(): void {
    if (this.store.expanded === false) {
      this.store.expanded = !this.store.expanded;
    }

    this.store.currentRelationCode = this.store
      .relationCode as IRelationCodeResponse;
  }

  public async processRequest(): Promise<void> {
    const isValid = await this.store.form?.validate();
    if (isValid == false) {
      return;
    }

    if (!this.store.currentRelationCode) return;
    if (this.storeSpeciality.currentSpeciality?.id === undefined) {
      this.store.errorSpeciality = true;
      return;
    }

    this.store.errorSpeciality = false;
    if (this.storeDxMainCode.currentDxMainCode?.id === undefined) {
      this.store.errorDxMainCode = true;
      return;
    }

    this.store.errorDxMainCode = false;
    const data = this.store.currentRelationCode;
    let payload = {} as IRelationCodeRequest;
    let response = null;

    if (this.store.currentRelationCode.id == undefined) {
      payload = {
        code: data.code,
        description: data.description,
        dxmaincode: this.storeDxMainCode.currentDxMainCode.id,
      };
      response = await this.create(payload);
    }

    if (this.store.currentRelationCode.id != undefined) {
      payload = {
        id: data.id,
        code: data.code,
        description: data.description,
        dxmaincode: this.storeDxMainCode.currentDxMainCode.id,
      };
      response = await this.update(payload);
    }

    if (response === null) return;
    this.store.currentRelationCode = response;
    const queryParameters = {
      dxMainCodeId: this.storeDxMainCode.currentDxMainCode.id,
    };
    this.store.allRelationCodes = await this.repository.findByParameters(
      queryParameters
    );
    this.store.expanded = false;
  }

  private async create(
    payload: IRelationCodeRequest
  ): Promise<IRelationCodeResponse | null> {
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
    payload: IRelationCodeRequest
  ): Promise<IRelationCodeResponse | null> {
    const confirm = await this.serviceModal.showModal(
      'Atención',
      this.messages.updateRegister
    );

    if (confirm == false) return null;
    const response = await this.repository.update(payload);
    return response;
  }

  public async getAll(): Promise<Array<IRelationCodeResponse> | null> {
    const response = await this.repository.getAll();
    if (response === null || response.length === 0) {
      return (this.store.allRelationCodes = []);
    }

    this.store.allRelationCodes = response;
    return response;
  }

  public relationCodeOfMainCode = computed({
    get: () => {
      this.clear();
      const listRelationCodes = this.store.allRelationCodes;
      if (listRelationCodes === null) {
        return [] as Array<IRelationCodeResponse>;
      }

      const result = listRelationCodes.filter(
        (relationCode) =>
          relationCode.dxmaincode.id ==
          this.storeDxMainCode.currentDxMainCode?.id
      );
      return result;
    },
    set: (value) => {
      this.store.allRelationCodes = value;
    },
  });
}
// export function relationCodeServices() {
//   const router = useRouter();
//   const store = useStoreSettings();
//   const {
//     allRelationCodes,
//     currentRelationCode,
//     currentSpeciality,
//     currentDxMainCode,
//   } = storeToRefs(store);
//   const relationCode = ref<IRelationCodeResponse>();
//   const expanded = ref(false);
//   const formDXMainCode = ref<QForm | null>(null);
//   const errorDxMainCode = ref(false);
//   const errorSpeciality = ref(false);

//   function clearRelationCode(val: IRelationCodeRequest) {
//     relationCode.value = undefined;
//     currentRelationCode.value = {} as IRelationCodeResponse;
//   }
//   async function relationCodeChanged(
//     val: IRelationCodeResponse
//   ): Promise<void> {
//     currentRelationCode.value = val;
//     // if (val.id === undefined) {
//     //   return;
//     // }
//     // const dxMainCodeId = val.id;
//     // const response = await store.retrieveAllRelationCodeByDxMainId(
//     //   dxMainCodeId
//     // );
//     // console.log(response);
//   }
//   function add(): void {
//     expanded.value = !expanded.value;
//     currentRelationCode.value = {} as IRelationCodeResponse;
//   }
//   function edit(): void {
//     if (expanded.value === false) {
//       expanded.value = !expanded.value;
//     }
//     currentRelationCode.value = relationCode.value as IRelationCodeResponse;
//   }
//   async function confirmChanges(): Promise<void> {
//     const isValid = await formDXMainCode.value?.validate();
//     if (isValid == false) {
//       return;
//     }
//     if (!currentRelationCode.value) return;
//     if (currentSpeciality.value?.id === undefined) {
//       errorSpeciality.value = true;
//       return;
//     }
//     errorSpeciality.value = false;
//     if (currentDxMainCode.value?.id === undefined) {
//       errorDxMainCode.value = true;
//       return;
//     }
//     errorDxMainCode.value = false;
//     const data = currentRelationCode.value;
//     let payload = {} as IRelationCodeRequest;
//     let response = {} as IRelationCodeResponse;
//     let confirmCreate = false;
//     if (currentRelationCode.value.id == undefined) {
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
//         code: data.code,
//         description: data.description,
//         dxmaincode: currentDxMainCode.value.id,
//       };
//       const responseCreate = await relationCodeRepository.create(payload);
//       if (responseCreate == null) {
//         return;
//       }
//       response = responseCreate;
//     }
//     let confirmUpdate = false;
//     if (currentRelationCode.value.id != undefined) {
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
//         code: data.code,
//         description: data.description,
//         dxmaincode: currentDxMainCode.value.id,
//       };
//       const responseUpdate = await relationCodeRepository.update(payload);
//       if (responseUpdate == null) {
//         return;
//       }
//       response = responseUpdate;
//     }
//     currentRelationCode.value = response;
//     const queryParameters = { dxMainCodeId: currentDxMainCode.value.id };
//     allRelationCodes.value = await relationCodeRepository.findByParameters(
//       queryParameters
//     );
//     expanded.value = false;
//   }
//   async function getAllRelationCodes() {
//     let response = {} as HttpResponse<unknown>;
//     if (store.allRelationCodes == undefined) {
//       response = await store.retrieveAllRelationCodes();
//     }
//     if (response.status == HttpStatusCodes.NOT_FOUND) {
//       router.push('/:catchAll');
//     }
//   }
//   const relationCodeOfMainCode = computed({
//     get: () => {
//       clearRelationCode({} as IRelationCodeRequest);
//       // return store.allRelationCodes;
//       const listRelationCodes = allRelationCodes.value;
//       if (listRelationCodes === null) {
//         return [] as Array<IRelationCodeResponse>;
//       }
//       const result = listRelationCodes.filter(
//         (relationCode) =>
//           relationCode.dxmaincode.id == store.currentDxMainCode?.id
//       );
//       return result;
//     },
//     set: (value) => {
//       store.allRelationCodes = value;
//     },
//   });

//   return {
//     //! Properties
//     clearRelationCode,
//     formDXMainCode,
//     relationCode,
//     allRelationCodes,
//     currentRelationCode,
//     expanded,
//     errorDxMainCode,
//     errorSpeciality,
//     //! Computed
//     relationCodeOfMainCode,
//     //! Metodos
//     add,
//     edit,
//     relationCodeChanged,
//     confirmChanges,
//     getAllRelationCodes,
//   };
// }
