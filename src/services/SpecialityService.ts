import { ref } from 'vue';
import { QForm } from 'quasar';
import { routerInstance } from 'boot/globalRouter';
import { storeToRefs } from 'pinia';
import { useStoreSettings } from 'src/stores/storeSettings';
import { IDXMainCodeRequest, ISpeciality } from 'src/interfaces/IConsults';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import modalService from './ModalService';
import { Messages } from 'src/scripts/Constants';
import { HttpResponse } from 'src/scripts/Request';
import { dxMainCodeService } from './DxMainCodeService';

const store = useStoreSettings();
const serviceModal = modalService();
const messages = new Messages();
const serviceDxMainCode = dxMainCodeService();

export function specialityService() {
  const { allSpecialities, currentSpeciality, speciality } = storeToRefs(store);
  const expanded = ref(false);
  const formSpeciality = ref<QForm | null>(null);

  function clearSpeciality(val: ISpeciality) {
    currentSpeciality.value = {} as ISpeciality;
  }
  async function specialityChanged(val: ISpeciality): Promise<void> {
    currentSpeciality.value = val;
    if (val.id === undefined) {
      return;
    }
    const specialityId = val.id;
    const response = await store.retrieveAllDxMainCodeBySpecialityId(
      specialityId
    );
    serviceDxMainCode.clearDxMainCode({} as IDXMainCodeRequest);
    // dxMainCode.value = {} as IDXMainCodeResponse;
    // currentDxMainCode.value = {} as IDXMainCodeResponse;
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
    let response = {} as HttpResponse<unknown>;
    let confirmCreate = false;
    if (currentSpeciality.value.id == undefined) {
      confirmCreate = await serviceModal.showModal(
        'Atención',
        messages.newRegister
      );
      if (confirmCreate === false) {
        return;
      }
    }
    if (confirmCreate === true) {
      const responseCreate = await store.createSpeciality(
        currentSpeciality.value
      );
      if (responseCreate == null) {
        return;
      }
      response = responseCreate;
    }
    let confirmUpdate = false;
    if (currentSpeciality.value.id != undefined) {
      confirmUpdate = await serviceModal.showModal(
        'Atención',
        messages.updateRegister
      );
      if (confirmUpdate === false) {
        return;
      }
    }
    if (confirmUpdate == true) {
      const responseUpdate = await store.updateSpeciality(
        currentSpeciality.value
      );
      if (responseUpdate == null) {
        return;
      }
      response = responseUpdate;
    }
    currentSpeciality.value = response.parsedBody as ISpeciality;
    await store.retrieveAllSpecialities();
    expanded.value = false;
  }
  async function getAllSpecialities() {
    if (allSpecialities.value == undefined) {
      const response = await store.retrieveAllSpecialities();
      if (response.status == HttpStatusCodes.NOT_FOUND) {
        routerInstance.push('/:catchAll');
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
