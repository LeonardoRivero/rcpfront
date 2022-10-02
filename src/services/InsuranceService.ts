import { ref } from 'vue';
import { QForm } from 'quasar';
import { storeToRefs } from 'pinia';
import { useStoreSettings } from 'src/stores/storeSettings';
import { IHealthInsurance } from 'src/interfaces/IPatients';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { HttpResponse } from 'src/scripts/Request';
import { routerInstance } from 'src/boot/globalRouter';
import modalService from './ModalService';
import { Messages } from 'src/scripts/Constants';

const serviceModal = modalService();
const messages = new Messages();
const store = useStoreSettings();

export function insuranceService() {
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

    const data = currentInsurance.value;
    let response = {} as HttpResponse<unknown>;
    let confirmCreate = false;
    if (currentInsurance.value.id == undefined) {
      confirmCreate = await serviceModal.showModal(
        'Atención',
        messages.newRegister
      );
      if (confirmCreate === false) {
        return;
      }
    }
    if (confirmCreate === true) {
      const payload = {
        nameInsurance: data.nameInsurance,
        entityCode: data.entityCode,
      } as IHealthInsurance;
      const responseCreate = await store.createInsurance(payload);
      if (responseCreate == null) {
        return;
      }
      response = responseCreate;
    }
    let confirmUpdate = false;
    if (currentInsurance.value.id != undefined) {
      confirmUpdate = await serviceModal.showModal(
        'Atención',
        messages.updateRegister
      );
      if (confirmUpdate === false) {
        return;
      }
    }
    if (confirmUpdate == true) {
      const payload = {
        id: data.id,
        nameInsurance: data.nameInsurance,
        entityCode: data.entityCode,
      } as IHealthInsurance;
      const responseUpdate = await store.updateInsurance(payload);
      if (responseUpdate == null) {
        return;
      }
      response = responseUpdate;
    }

    currentInsurance.value = response.parsedBody as IHealthInsurance;
    await store.retrieveAllInsurance();
  }
  async function getAllInsurance() {
    let response = {} as HttpResponse<unknown>;
    if (store.allInsurance == undefined) {
      response = await store.retrieveAllInsurance();
    }
    if (response.status == HttpStatusCodes.NOT_FOUND) {
      routerInstance.push('/:catchAll');
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
