import { ref } from 'vue';
import { date, QForm } from 'quasar';
import { routerInstance } from 'boot/globalRouter';
import { storeToRefs } from 'pinia';
import { useStorePatients } from 'src/stores/storePatients';
import { IPatientResponse } from 'src/models/IPatients';
import { HttpResponse } from 'src/scripts/Request';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import modalService from './ModalService';
import * as Constants from 'src/scripts/Constants';
import { Validators } from 'src/scripts/Helpers';

const message = Constants.Messages.getInstance();
const storePatients = useStorePatients();
const serviceModal = modalService();
const validator = Validators.getInstance();
const iconSVG = Constants.IconSVG.getInstance();

export function clinicHistoryService() {
  const identificationPatient = ref<string>('');
  const iconAvatar = ref<string>('');
  const age = ref<number>(0);
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
        age.value = 0;
        iconAvatar.value = '';
        return;
      }

      storePatients.currentPatient = {
        identification: parseInt(identificationPatient.value),
      } as IPatientResponse;
      routerInstance.push('/patient');
      return;
    }
    currentPatient.value = (await response.parsedBody) as IPatientResponse;
    const dateBirth = currentPatient.value.dateBirth.replaceAll('-', '/');
    currentPatient.value.dateBirth = date.formatDate(
      dateBirth,
      Constants.FORMAT_DATE
    );
    iconAvatar.value =
      currentPatient.value.gender.id == Constants.Gender.FEMALE
        ? iconSVG.female_avatar
        : iconSVG.male_avatar;
    age.value = validator.calculateAge(currentPatient.value.dateBirth);
  }
  return {
    searchPatient,
    identificationPatient,
    currentPatient,
    iconAvatar,
    age,
  };
}
