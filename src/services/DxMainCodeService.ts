import { computed, ref } from 'vue';
import { QForm } from 'quasar';
import { storeToRefs } from 'pinia';
import { useStoreSettings } from 'src/stores/storeSettings';
import {
  IDXMainCodeRequest,
  IDXMainCodeResponse,
} from 'src/interfaces/IConsults';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { HttpResponse } from 'src/scripts/Request';
// import modalService from './ModalService';
// import { Modal } from 'src/scripts/Notifications';
import { routerInstance } from 'src/boot/globalRouter';

const store = useStoreSettings();
// const serviceModal = modalService();
// const modal = new Modal();

export function dxMainCodeService() {
  const { allDxMainCodes, currentDxMainCode, currentSpeciality } =
    storeToRefs(store);
  const dxMainCode = ref<IDXMainCodeResponse>();
  const expanded = ref(false);
  const formDXMainCode = ref<QForm | null>(null);
  const error = ref(false);

  function clearDxMainCode(val: IDXMainCodeRequest) {
    dxMainCode.value = undefined;
    currentDxMainCode.value = {} as IDXMainCodeResponse;
  }
  function dxMainCodeChanged(val: IDXMainCodeResponse): void {
    store.currentDxMainCode = val;
  }
  function add(): void {
    expanded.value = !expanded.value;
    currentDxMainCode.value = {} as IDXMainCodeResponse;
  }
  function edit(): void {
    if (expanded.value === false) {
      expanded.value = !expanded.value;
    }
    //currentDxMainCode.value = dxMainCode.value as IDXMainCodeResponse;
  }
  async function confirmChanges(): Promise<void> {
    const isValid = await formDXMainCode.value?.validate();
    if (isValid == false) {
      return;
    }
    if (!currentDxMainCode.value) return;
    if (currentSpeciality.value?.id == null) {
      error.value = true;
      return;
    }
    const data = currentDxMainCode.value;
    let payload = {} as IDXMainCodeRequest;
    let response = {} as HttpResponse<unknown>;
    if (currentDxMainCode.value.id == undefined) {
      payload = {
        CUP: data.CUP,
        description: data.description,
        speciality: currentSpeciality.value.id,
      };
      response = await store.createDxMainCode(payload);
    }
    if (currentDxMainCode.value.id != undefined) {
      payload = {
        id: data.id,
        CUP: data.CUP,
        description: data.description,
        speciality: currentSpeciality.value.id,
      };
      //serviceModal.testSw('test', 'other');
      // const responseUpdate = await store.updateDxMainCode(payload);
      // if (responseUpdate != null) {
      //   response = responseUpdate;
      // }
      return;
    }
    currentDxMainCode.value = response.parsedBody as IDXMainCodeResponse;
    response = await store.retrieveAllDxMainCodeBySpecialityId(
      currentSpeciality.value.id
    );
    // dxMainCodeofSpeciality.value =
    //   (await response.parsedBody) as Array<IDXMainCodeResponse>;
    //clearDxMainCode({} as IDXMainCodeRequest);
  }
  async function getAllDxMainCode(): Promise<void> {
    let response = {} as HttpResponse<unknown>;
    if (store.allDxMainCodes == undefined) {
      response = await store.retrieveAllDxMainCode();
    }
    if (response.status == HttpStatusCodes.NOT_FOUND) {
      routerInstance.push('/:catchAll');
    }
  }
  const dxMainCodeofSpeciality = computed({
    get: () => {
      // clearDxMainCode({} as IDXMainCodeRequest);
      // return store.allDxMainCodes;
      clearDxMainCode({} as IDXMainCodeRequest);
      if (store.allDxMainCodes === null) {
        return [] as Array<IDXMainCodeResponse>;
      }
      return store.allDxMainCodes;
      // const result = store.allDxMainCodes.filter(
      //   (dxMainCode) => dxMainCode.speciality.id == store.currentSpeciality?.id
      // );

      // return result;
    },
    set: (value) => {
      store.allDxMainCodes = value;
    },
  });

  return {
    //! Properties
    clearDxMainCode,
    formDXMainCode,
    dxMainCode,
    allDxMainCodes,
    currentDxMainCode,
    expanded,
    error,
    dxMainCodeofSpeciality,

    //! Computed
    // dxMainCodeofSpeciality: computed(() => {
    //   if (store.allDxMainCodes === null) {
    //     return null;
    //   }
    //   const result = store.allDxMainCodes.filter(
    //     (dxMainCode) => dxMainCode.speciality.id == store.currentSpeciality?.id
    //   );
    //   clearDxMainCode({} as IDXMainCodeRequest);
    //   return result;
    // }),
    //! Metodos
    add,
    edit,
    dxMainCodeChanged,
    confirmChanges,
    getAllDxMainCode,
  };
}
