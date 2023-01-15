import { ref } from 'vue';
import { date, QForm } from 'quasar';
import { routerInstance } from 'boot/globalRouter';
import { HttpResponse } from 'src/Infraestructure/Utilities/Request';
import HttpStatusCodes from 'src/Application/Utilities/HttpStatusCodes';
import modalService from './ModalService';
import * as Constants from 'src/Application/Utilities/Constants';
import { Validators } from 'src/Application/Utilities/Helpers';
import { Messages } from 'src/Application/Utilities/Messages';
import { PatientResponse } from 'src/Domine/Responses';

const message = Messages.getInstance();
// const storePatients = useStorePatients();
const serviceModal = modalService();
const validator = Validators.getInstance();
const iconSVG = Constants.IconSVG.getInstance();

export function clinicHistoryService() {
  const identificationPatient = ref<string>('');
  const iconAvatar = ref<string>('');
  const age = ref<number>(0);
  const currentPatient = ref<PatientResponse>({} as PatientResponse);

  async function searchPatient(val: string): Promise<void> {
    // let response = {} as HttpResponse<unknown>;
    // response = await storePatients.getPatientByIdentification(
    //   identificationPatient.value
    // );
    // if (response.status == HttpStatusCodes.NO_CONTENT) {
    //   const confirm = await serviceModal.showModal(
    //     'Atención',
    //     message.notFoundInfoPatient
    //   );
    //   if (confirm == false) {
    //     currentPatient.value = {} as PatientResponse;
    //     age.value = 0;
    //     iconAvatar.value = '';
    //     return;
    //   }
    //   storePatients.currentPatient = {
    //     identification: parseInt(identificationPatient.value),
    //   } as PatientResponse;
    //   routerInstance.push('/patient');
    //   return;
    // }
    // currentPatient.value = (await response.parsedBody) as PatientResponse;
    // const dateBirth = currentPatient.value.dateBirth.replaceAll('-', '/');
    // currentPatient.value.dateBirth = date.formatDate(
    //   dateBirth,
    //   Constants.FORMAT_DATE
    // );
    // iconAvatar.value =
    //   currentPatient.value.gender.id == Constants.Gender.FEMALE
    //     ? iconSVG.female_avatar
    //     : iconSVG.male_avatar;
    // age.value = validator.calculateAge(currentPatient.value.dateBirth);
  }
  return {
    searchPatient,
    identificationPatient,
    currentPatient,
    iconAvatar,
    age,
  };
}
