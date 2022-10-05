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
import modalService from './ModalService';
// import { Modal } from 'src/scripts/Notifications';
import { routerInstance } from 'src/boot/globalRouter';
import { Messages } from 'src/scripts/Constants';

const store = useStoreSettings();
const serviceModal = modalService();
const messages = new Messages();
// const modal = new Modal();

export function dxMainCodeService() {
  const { allDxMainCodes, currentDxMainCode, currentSpeciality, dxMainCode } =
    storeToRefs(store);
  // const dxMainCode = ref<IDXMainCodeResponse>();
  const expanded = ref(false);
  const formDXMainCode = ref<QForm | null>(null);
  const error = ref(false);

  function clearDxMainCode(val: IDXMainCodeRequest) {
    dxMainCode.value = null;
    currentDxMainCode.value = {} as IDXMainCodeResponse;
    error.value = false;
  }
  function dxMainCodeChanged(val: IDXMainCodeResponse): void {
    currentDxMainCode.value = val;
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
    let confirmCreate = false;
    if (currentDxMainCode.value.id == undefined) {
      confirmCreate = await serviceModal.showModal(
        'Atención',
        messages.newRegister
      );
      if (confirmCreate === false) {
        return;
      }
    }
    if (confirmCreate == true) {
      payload = {
        CUP: data.CUP,
        description: data.description,
        speciality: currentSpeciality.value.id,
      };
      const responseCreate = await store.createDxMainCode(payload);
      if (responseCreate == null) {
        return;
      }
      response = responseCreate;
    }
    let confirmUpdate = false;
    if (currentDxMainCode.value.id != undefined) {
      confirmUpdate = await serviceModal.showModal(
        'Atención',
        messages.updateRegister
      );
      if (confirmUpdate == false) {
        return;
      }
    }

    if (confirmUpdate == true) {
      payload = {
        id: data.id,
        CUP: data.CUP,
        description: data.description,
        speciality: currentSpeciality.value.id,
      };
      const responseUpdate = await store.updateDxMainCode(payload);
      if (responseUpdate == null) {
        return;
      }
      response = responseUpdate;
    }
    currentDxMainCode.value = response.parsedBody as IDXMainCodeResponse;
    await store.retrieveAllDxMainCodeBySpecialityId(currentSpeciality.value.id);
    expanded.value = false;
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
      //clearDxMainCode({} as IDXMainCodeRequest);
      // return store.allDxMainCodes;
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
