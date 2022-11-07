import { ref } from 'vue';
import { QForm } from 'quasar';
import { routerInstance } from 'boot/globalRouter';
import { storeToRefs } from 'pinia';
import { useStorePatients } from 'src/stores/storePatients';
import { IPatientResponse } from 'src/interfaces/IPatients';
import { HttpResponse } from 'src/scripts/Request';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import modalService from './ModalService';
import * as Constants from 'src/scripts/Constants';

const message = new Constants.Messages();
const storePatients = useStorePatients();
const serviceModal = modalService();

export function clinicHistoryService() {
  const identificationPatient = ref<string>('');
  const currentPatient = ref<IPatientResponse>({} as IPatientResponse);

  async function searchPatient(val: string): Promise<void> {
    let response = {} as HttpResponse<unknown>;
    response = await storePatients.getPatientByIdentification(
      identificationPatient.value
    );
    if (response.status == HttpStatusCodes.NO_CONTENT) {
      const confirm = await serviceModal.showModal(
        'Atención',
        message.notFoundInfoPatient
      );
      if (confirm == false) {
        currentPatient.value = {} as IPatientResponse;
        return;
      }

      storePatients.currentPatient = {
        identification: parseInt(identificationPatient.value),
      } as IPatientResponse;
      routerInstance.push('/patient');
      return;
    }
    currentPatient.value = response.parsedBody as IPatientResponse;
    return;
  }
  return {
    searchPatient,
    identificationPatient,
    currentPatient,
  };
}
