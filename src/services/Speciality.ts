import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { QForm } from 'quasar';
import { storeToRefs } from 'pinia';
import { useCounterStore } from 'src/stores/storeSettings';
import { HttpResponse } from 'src/scripts/Request';
import { ISpeciality } from 'src/interfaces/IModels';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
//import { Specialities } from 'src/services/SettingsService';


export function useSpeciality() {
  const router = useRouter();
  const store = useCounterStore();

  const { allSpecialities, currentSpeciality } = storeToRefs(store);

  const speciality = ref<ISpeciality>();
  const expanded = ref(false);
  // const service = new Specialities();
  const formSpeciality = ref<QForm | null>(null);

  function clearSpeciality(val: ISpeciality) {
    console.log(val);
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

  return {
    //! Properties
    clearSpeciality,
    formSpeciality,
    speciality,
    allSpecialities,
    currentSpeciality,
    expanded,
    //! Computed
    getAllSpecialities: computed(async () => {
      if (store.allSpecialities == undefined) {
        const response =
          (await store.retrieveAllSpecialities()) as HttpResponse<unknown>;
        if (response.status == HttpStatusCodes.NOT_FOUND) {
          router.push('/:catchAll');
        }
        return response.parsedBody as Array<ISpeciality>;
      }
      return store.allSpecialities;
    }),
    //! Metodos
    add,
    edit,
    specialityChanged,
    confirmChanges,
  };
}
