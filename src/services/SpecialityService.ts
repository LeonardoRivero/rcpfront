import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { QForm } from 'quasar';
import { storeToRefs } from 'pinia';
import { useStoreSettings } from 'src/stores/storeSettings';
import { HttpResponse } from 'src/scripts/Request';
import { ISpeciality } from 'src/interfaces/IConsults';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
const router = useRouter();
const store = useStoreSettings();
export function useSpeciality() {
  const { allSpecialities, currentSpeciality } = storeToRefs(store);

  const speciality = ref<ISpeciality>();
  const expanded = ref(false);
  const formSpeciality = ref<QForm | null>(null);

  function clearSpeciality(val: ISpeciality) {
    currentSpeciality.value = {} as ISpeciality;
  }

  function specialityChanged(val: ISpeciality): void {
    store.currentSpeciality = val;
  }
  function add(): void {
    expanded.value = !expanded.value;
    currentSpeciality.value = {} as ISpeciality;
  }
  function edit(): void {
    if (expanded.value === false) {
      expanded.value = !expanded.value;
    }
    currentSpeciality.value = speciality.value as ISpeciality;
  }
  async function confirmChanges(): Promise<void> {
    const isValid = await formSpeciality.value?.validate();
    if (isValid == false) {
      return;
    }
    if (!currentSpeciality.value) return;
    if (currentSpeciality.value.id == undefined) {
      store.createSpeciality(currentSpeciality.value);
    }
    if (currentSpeciality.value.id != undefined) {
      store.updateSpeciality(currentSpeciality.value);
    }
  }
  async function getAllSpecialities() {
    if (allSpecialities.value == undefined) {
      const response = await store.retrieveAllSpecialities();
      if (response.status == HttpStatusCodes.NOT_FOUND) {
        router.push('/:catchAll');
      }
      return (await response.parsedBody) as Array<ISpeciality>;
    }
    const response = allSpecialities.value;
    return response;
  }

  return {
    //! Properties
    getAllSpecialities,
    clearSpeciality,
    formSpeciality,
    speciality,
    allSpecialities,
    currentSpeciality,
    expanded,
    //! Computed

    //! Metodos
    add,
    edit,
    specialityChanged,
    confirmChanges,
  };
}
