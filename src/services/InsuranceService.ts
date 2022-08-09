import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { QForm } from 'quasar';
import { storeToRefs } from 'pinia';
import { useStoreSettings } from 'src/stores/storeSettings';
import { IHealthInsurance } from 'src/interfaces/IModels';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';

const store = useStoreSettings();
const router = useRouter();
export function useInsurance() {
  const { allInsurance, currentInsurance } = storeToRefs(store);
  const insurance = ref<IHealthInsurance>();
  const expanded = ref(false);
  const formInsurance = ref<QForm | null>(null);
  const error = ref(false);

  function clearInsurance(val: IHealthInsurance) {
    insurance.value = undefined;
    currentInsurance.value = {} as IHealthInsurance;
  }
  function insuranceChanged(val: IHealthInsurance): void {
    store.currentInsurance = val;
  }
  function add(): void {
    expanded.value = !expanded.value;
    currentInsurance.value = {} as IHealthInsurance;
  }
  function edit(): void {
    if (expanded.value === false) {
      expanded.value = !expanded.value;
    }
    currentInsurance.value = insurance.value as IHealthInsurance;
  }
  async function confirmChanges(): Promise<void> {
    const isValid = await formInsurance.value?.validate();
    if (isValid == false) {
      return;
    }
    if (!currentInsurance.value) return;
    if (currentInsurance.value?.id == null) {
      error.value = true;
      return;
    }
    const data = currentInsurance.value;
    if (currentInsurance.value.id == undefined) {
      const payload = {
        nameInsurance: data.nameInsurance,
        entityCode: data.entityCode,
      } as IHealthInsurance;
      store.createInsurance(payload);
    }
    if (currentInsurance.value.id != undefined) {
      const payload = {
        id: data.id,
        nameInsurance: data.nameInsurance,
        entityCode: data.entityCode,
      } as IHealthInsurance;
      store.updateInsurance(payload);
    }
  }
  async function getAllInsurance() {
    if (store.allInsurance == undefined) {
      const response = await store.retrieveAllInsurance();
      if (response.status == HttpStatusCodes.NOT_FOUND) {
        router.push('/:catchAll');
      }
    }
  }

  return {
    //! Properties
    clearInsurance,
    formInsurance,
    insurance,
    allInsurance,
    currentInsurance,
    expanded,
    error,
    //! Computed
    //! Metodos
    add,
    edit,
    insuranceChanged,
    confirmChanges,
    getAllInsurance,
  };
}
