import { computed, ref } from 'vue';
import { QForm } from 'quasar';
import { storeToRefs } from 'pinia';
import { useCounterStore } from 'src/stores/storeSettings';
import {
  IDXMainCodeRequest,
  IDXMainCodeResponse,
  ISpeciality,
} from 'src/interfaces/IModels';

export function useDxMainCode() {
  const store = useCounterStore();
  const { allDxMainCodes, currentDxMainCode, currentSpeciality } =
    storeToRefs(store);
  const dxMainCode = ref<IDXMainCodeResponse>();
  const expanded = ref(false);
  const formDXMainCode = ref<QForm | null>(null);
  const error = ref(false);

  function clearDxMainCode(val: IDXMainCodeRequest) {
    console.log(val);
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
    currentDxMainCode.value = dxMainCode.value as IDXMainCodeResponse;
  }
  async function confirmChanges(): Promise<void> {
    const isValid = await formDXMainCode.value?.validate();
    if (isValid == false) {
      return;
    }
    if (!currentDxMainCode.value) return;
    console.log(currentSpeciality.value);
    if (currentSpeciality.value?.id == null) {
      error.value = true;
      return;
    }
    const data = currentDxMainCode.value;
    if (currentDxMainCode.value.id == undefined) {
      const payload = {
        CUP: data.CUP,
        description: data.description,
        speciality: data.speciality.id,
      } as IDXMainCodeRequest;
      store.createDxMainCode(payload);
    }
    if (currentDxMainCode.value.id != undefined) {
      const payload = {
        id: data.id,
        CUP: data.CUP,
        description: data.description,
        speciality: data.speciality.id,
      } as IDXMainCodeRequest;
      store.updateDxMainCode(payload);
    }
  }

  return {
    //! Properties
    clearDxMainCode,
    formDXMainCode,
    dxMainCode,
    allDxMainCodes,
    currentDxMainCode,
    expanded,
    error,
    //! Computed
    dxMainCodeofSpeciality: computed(() => {
      if (store.allDxMainCodes === null) {
        return null;
      }
      const result = store.allDxMainCodes.filter(
        (dxMainCode) => dxMainCode.speciality.id == store.currentSpeciality?.id
      );
      clearDxMainCode({} as IDXMainCodeRequest);
      return result;
    }),
    //! Metodos
    add,
    edit,
    dxMainCodeChanged,
    confirmChanges,
  };
}
