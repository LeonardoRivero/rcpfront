import { computed } from 'vue';

import modalService from './ModalService';
import { RelationCodeRepository } from 'src/Application/Repositories/SettingsRepository';
import { IStoreRelationCode } from 'src/Infraestructure/stores/SettingsPage/RelationCodeStore';
import { IRelationCode } from 'src/Domine/ModelsDB';
import { RelationCodeService } from 'src/Application/Services/RelationCodeService';
import { Messages } from 'src/Application/Utilities/Messages';
import { RelationCodeResponse } from 'src/Domine/Responses';
import { useStoreDxMainCode } from 'src/Infraestructure/stores/SettingsPage/DxMainCodeStore';
import { useStoreSpeciality } from 'src/Infraestructure/stores/SettingsPage/SpecialityStore';

export class RelationCodeAdapter {
  private store: IStoreRelationCode;
  private storeDxMainCode = useStoreDxMainCode();
  private storeSpeciality = useStoreSpeciality();
  private repository = RelationCodeRepository.getInstance();
  private serviceModal = modalService();
  private messages = Messages.getInstance();
  private service = new RelationCodeService();

  private static instance: RelationCodeAdapter;

  private constructor(store: IStoreRelationCode) {
    this.store = store;
    return;
  }

  public static getInstance(store: IStoreRelationCode): RelationCodeAdapter {
    if (!RelationCodeAdapter.instance) {
      RelationCodeAdapter.instance = new RelationCodeAdapter(store);
    }
    return RelationCodeAdapter.instance;
  }

  public async clear() {
    this.store.relationCode = null;
    this.store.allRelationCodes = [];
    // this.store.currentRelationCode = {} as IRelationCode;
  }

  public async relationCodeChanged(val: IRelationCode): Promise<void> {
    // this.store.currentRelationCode = val;
  }

  public add(): void {
    this.store.expanded = !this.store.expanded;
    // this.store.currentRelationCode = {} as IRelationCode;
  }

  public edit(): void {
    if (this.store.expanded === false) {
      this.store.expanded = !this.store.expanded;
    }

    // this.store.currentRelationCode = this.store.relationCode as IRelationCode;
  }

  public async saveOrUpdate(): Promise<void> {
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
    let payload: IRelationCode;
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
    // this.store.currentRelationCode = response;
    // const queryParameters = {
    //   dxMainCodeId: this.storeDxMainCode.currentDxMainCode.id,
    // };
    // this.store.allRelationCodes = await this.service.findByParameters(
    //   queryParameters
    // );
    this.store.expanded = false;
  }

  private async create(
    payload: IRelationCode
  ): Promise<RelationCodeResponse | null> {
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
    payload: IRelationCode
  ): Promise<RelationCodeResponse | null> {
    const confirm = await this.serviceModal.showModal(
      'Atención',
      this.messages.updateRegister
    );

    if (confirm == false) return null;
    const response = await this.service.update(payload);
    return response;
  }

  public async getAll(): Promise<Array<RelationCodeResponse> | null> {
    const response = await this.repository.getAll();
    if (response === null || response.length === 0) {
      return (this.store.allRelationCodes = []);
    }

    this.store.allRelationCodes = response;
    return null;
    // return response;
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<RelationCodeResponse>> {
    return await this.service.findByParameters(queryParameters);
  }

  // public relationCodeOfMainCode = computed({
  //   get: () => {
  //     this.clear();
  //     const listRelationCodes = this.store.allRelationCodes;
  //     if (listRelationCodes === null) {
  //       return [] as Array<RelationCodeResponse>;
  //     }
  //     const result = listRelationCodes.filter(
  //       (relationCode) =>
  //         relationCode.dxmaincode?.id ==
  //         this.storeDxMainCode.currentDxMainCode?.id
  //     );
  //     return result;
  //   },
  //   set: (value) => {
  //     this.store.allRelationCodes = value;
  //   },
  // });
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
