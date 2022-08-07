import { computed, ref } from 'vue';
import { QForm } from 'quasar';
import { storeToRefs } from 'pinia';
import { useCounterStore } from 'src/stores/storeSettings';
import {
  IRelationCodeRequest,
  IRelationCodeResponse,
} from 'src/interfaces/IModels';

export function useRelationCode() {
  const store = useCounterStore();
  const { allRelationCodes, currentRelationCode, currentSpeciality } =
    storeToRefs(store);
  const relationCode = ref<IRelationCodeResponse>();
  const expanded = ref(false);
  const formDXMainCode = ref<QForm | null>(null);
  const error = ref(false);

  function clearRelationCode(val: IRelationCodeRequest) {
    console.log(val);
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
      // const payload = {
      //   CUP: data.CUP,
      //   description: data.description,
      //   speciality: data.speciality.id,
      // } as IRelationCodeResponse;
      // store.createRelationCode(payload);
    }
    if (currentRelationCode.value.id != undefined) {
      // const payload = {
      //   id: data.id,
      //   CUP: data.CUP,
      //   description: data.description,
      //   speciality: data.speciality.id,
      // } as IRelationCodeResponse;
      // store.updateRelationCode(payload);
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
  };
}
