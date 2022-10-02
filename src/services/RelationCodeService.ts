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
  const error = ref(false);

  function clearRelationCode(val: IRelationCodeRequest) {
    console.log(val);
    relationCode.value = undefined;
    currentRelationCode.value = {} as IRelationCodeResponse;
  }
  async function relationCodeChanged(
    val: IRelationCodeResponse
  ): Promise<void> {
    store.currentRelationCode = val;
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
    if (!currentRelationCode.value || currentDxMainCode.value?.id === undefined)
      return;
    if (currentSpeciality.value?.id === undefined) {
      error.value = true;
      return;
    }
    const data = currentRelationCode.value;
    console.log(data);
    let payload = {} as IRelationCodeRequest;
    if (currentRelationCode.value.id == undefined) {
      payload = {
        code: data.code,
        description: data.description,
        dxmaincode: currentDxMainCode.value.id,
      };
      const response = await store.createRelationCode(payload);
      currentRelationCode.value =
        (await response.parsedBody) as IRelationCodeResponse;
    }
    if (currentRelationCode.value.id != undefined) {
      payload = {
        id: data.id,
        code: data.code,
        description: data.description,
        dxmaincode: currentDxMainCode.value.id,
      };
      await store.updateRelationCode(payload);
    }
    const response = await store.retrieveAllRelationCodeByDxMainId(
      currentDxMainCode.value.id
    );
    relationCodeOfMainCode.value =
      (await response.parsedBody) as Array<IRelationCodeResponse>;
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
    error,
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
