import { ref } from 'vue';
import { QForm } from 'quasar';
import { storeToRefs } from 'pinia';
import { useStoreSettings } from 'src/stores/storeSettings';
import { IPhysicalExamRequest, ISpeciality } from 'src/interfaces/IConsults';
import { HttpResponse } from 'src/scripts/Request';
import modalService from './ModalService';
import { Messages } from 'src/scripts/Constants';

const store = useStoreSettings();
const serviceModal = modalService();
const messages = new Messages();

export function physicalExamService() {
  const { speciality } = storeToRefs(store);
  const icon = ref('');
  // const parameterPhysicalExam = ref(null);
  const parameterPhysicalExam = ref<IPhysicalExamRequest>(
    {} as IPhysicalExamRequest
  );
  const formPhysicalExam = ref<QForm | null>(null);

  async function confirmChanges(): Promise<void> {
    const isValid = await formPhysicalExam.value?.validate();
    if (isValid == false) return;
    if (
      parameterPhysicalExam.value === null ||
      !speciality.value ||
      speciality.value.id == undefined
    )
      return;

    let payload = {} as IPhysicalExamRequest;
    let response = {} as HttpResponse<unknown>;
    let confirmCreate = false;

    if (parameterPhysicalExam.value.id == null) {
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
        description: parameterPhysicalExam.value.description,
        speciality: speciality.value.id,
      };
      const responseCreate = await store.createPhysicalExam(payload);
      if (responseCreate == null) {
        return;
      }
      response = responseCreate;
    }
  }
  return {
    //! Properties
    icon,
    parameterPhysicalExam,
    formPhysicalExam,
    //! Metodos

    confirmChanges,
    speciality,
  };
}
