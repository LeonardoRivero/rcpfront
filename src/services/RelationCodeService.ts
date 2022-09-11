import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { QForm } from 'quasar';
import { storeToRefs } from 'pinia';
import { useStoreSettings } from 'src/stores/storeSettings';
import {
  IRelationCodeRequest,
  IRelationCodeResponse,
} from 'src/interfaces/IConsults';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';

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
    relationCode.value = undefined;
    currentRelationCode.value = {} as IRelationCodeResponse;
  }
  function relationCodeChanged(val: IRelationCodeResponse): void {
    store.currentRelationCode = val;
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
    if (currentSpeciality.value?.id == null) {
      error.value = true;
      return;
    }
    const data = currentRelationCode.value;
    console.log(data);
    if (currentRelationCode.value.id == undefined) {
      const payload = {
        code: data.code,
        description: data.description,
        dxmaincode: currentDxMainCode.value?.id,
      } as IRelationCodeRequest;
      store.createRelationCode(payload);
    }
    if (currentRelationCode.value.id != undefined) {
      const payload = {
        id: data.id,
        code: data.code,
        description: data.description,
        dxmaincode: currentDxMainCode.value?.id,
      } as IRelationCodeRequest;
      store.updateRelationCode(payload);
    }
  }
  async function getAllRelationCodes() {
    if (store.allRelationCodes == undefined) {
      const response = await store.retrieveAllRelationCodes();
      if (response.status == HttpStatusCodes.NOT_FOUND) {
        router.push('/:catchAll');
      }
    }
  }

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
    relationCodeOfMainCode: computed(() => {
      if (store.allRelationCodes === undefined) {
        return null;
      }
      const result = store.allRelationCodes.filter(
        (relationCode) =>
          relationCode.dxmaincode.id == store.currentDxMainCode?.id
      );

      clearRelationCode({} as IRelationCodeRequest);
      return result;
    }),
    //! Metodos
    add,
    edit,
    relationCodeChanged,
    confirmChanges,
    getAllRelationCodes,
  };
}
