import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { QForm } from 'quasar';
import { storeToRefs } from 'pinia';
import { useStoreSettings } from 'src/stores/storeSettings';
import {
  IRelationCodeRequest,
  IRelationCodeResponse,
} from 'src/interfaces/IConsults';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { HttpResponse } from 'src/scripts/Request';
import modalService from './ModalService';
import { Messages } from 'src/scripts/Constants';

const serviceModal = modalService();
const messages = new Messages();

export function relationCodeService() {
  const router = useRouter();
  const store = useStoreSettings();
  const {
    allRelationCodes,
    currentRelationCode,
    currentSpeciality,
    currentDxMainCode,
  } = storeToRefs(store);
  const relationCode = ref<IRelationCodeResponse>();
  const expanded = ref(false);
  const formDXMainCode = ref<QForm | null>(null);
  const errorDxMainCode = ref(false);
  const errorSpeciality = ref(false);

  function clearRelationCode(val: IRelationCodeRequest) {
    relationCode.value = undefined;
    currentRelationCode.value = {} as IRelationCodeResponse;
  }
  async function relationCodeChanged(
    val: IRelationCodeResponse
  ): Promise<void> {
    currentRelationCode.value = val;
    // if (val.id === undefined) {
    //   return;
    // }
    // const dxMainCodeId = val.id;
    // const response = await store.retrieveAllRelationCodeByDxMainId(
    //   dxMainCodeId
    // );
    // console.log(response);
  }
  function add(): void {
    expanded.value = !expanded.value;
    currentRelationCode.value = {} as IRelationCodeResponse;
  }
  function edit(): void {
    if (expanded.value === false) {
      expanded.value = !expanded.value;
    }
    currentRelationCode.value = relationCode.value as IRelationCodeResponse;
  }
  async function confirmChanges(): Promise<void> {
    const isValid = await formDXMainCode.value?.validate();
    if (isValid == false) {
      return;
    }
    if (!currentRelationCode.value) return;
    if (currentSpeciality.value?.id === undefined) {
      errorSpeciality.value = true;
      return;
    }
    errorSpeciality.value = false;
    if (currentDxMainCode.value?.id === undefined) {
      errorDxMainCode.value = true;
      return;
    }
    errorDxMainCode.value = false;
    const data = currentRelationCode.value;
    let payload = {} as IRelationCodeRequest;
    let response = {} as HttpResponse<unknown>;
    let confirmCreate = false;
    if (currentRelationCode.value.id == undefined) {
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
        code: data.code,
        description: data.description,
        dxmaincode: currentDxMainCode.value.id,
      };
      const responseCreate = await store.createRelationCode(payload);
      if (responseCreate == null) {
        return;
      }
      response = responseCreate;
    }
    let confirmUpdate = false;
    if (currentRelationCode.value.id != undefined) {
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
        code: data.code,
        description: data.description,
        dxmaincode: currentDxMainCode.value.id,
      };
      const responseUpdate = await store.updateRelationCode(payload);
      if (responseUpdate == null) {
        return;
      }
      response = responseUpdate;
    }
    currentRelationCode.value = response.parsedBody as IRelationCodeResponse;
    await store.retrieveAllRelationCodeByDxMainId(currentDxMainCode.value.id);
    expanded.value = false;
  }
  async function getAllRelationCodes() {
    let response = {} as HttpResponse<unknown>;
    if (store.allRelationCodes == undefined) {
      response = await store.retrieveAllRelationCodes();
    }
    if (response.status == HttpStatusCodes.NOT_FOUND) {
      router.push('/:catchAll');
    }
  }
  const relationCodeOfMainCode = computed({
    get: () => {
      clearRelationCode({} as IRelationCodeRequest);
      // return store.allRelationCodes;
      const listRelationCodes = allRelationCodes.value;
      if (listRelationCodes === null) {
        return [] as Array<IRelationCodeResponse>;
      }
      const result = listRelationCodes.filter(
        (relationCode) =>
          relationCode.dxmaincode.id == store.currentDxMainCode?.id
      );
      return result;
    },
    set: (value) => {
      store.allRelationCodes = value;
    },
  });

  return {
    //! Properties
    clearRelationCode,
    formDXMainCode,
    relationCode,
    allRelationCodes,
    currentRelationCode,
    expanded,
    errorDxMainCode,
    errorSpeciality,
    //! Computed
    relationCodeOfMainCode,
    //! Metodos
    add,
    edit,
    relationCodeChanged,
    confirmChanges,
    getAllRelationCodes,
  };
}
