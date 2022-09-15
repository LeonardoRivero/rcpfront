import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { QForm, date } from 'quasar';
import { storeToRefs } from 'pinia';
import { useStoreAppointment } from 'src/stores/storeAppointment';
import { useStorePatients } from 'src/stores/storePatients';

import { IConsultRequest, IConsultResponse } from 'src/interfaces/IConsults';
import { IPatientResponse } from 'src/interfaces/IPatients';
import { FORMAT_DATE, Messages } from 'src/scripts/Constants';
import { Notification } from 'src/scripts/Notifications';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';

const store = useStoreAppointment();
const storePatients = useStorePatients();
const notification = new Notification();
const message = new Messages();
const router = useRouter();

export function appointmentService() {
  const { hasArrowForExpanded, expanded, currentAppointment, currentPatient } =
    storeToRefs(store);
  //const { currentPatient } = storeToRefs(storePatients);
  // const dxMainCode = ref<IDXMainCodeResponse>();
  //const expanded = ref(false);

  const timeStamp = Date.now();
  const formattedDate = date.formatDate(timeStamp, FORMAT_DATE);
  currentAppointment.value.date = formattedDate;
  const formAppointment = ref<QForm | null>(null);
  // const formDXMainCode = ref<QForm | null>(null);
  // const error = ref(false);
  const identificationPatient = ref<string>('');

  async function searchPatient(): Promise<void> {
    if (identificationPatient.value === '') {
      notification.setMessage(message.searchIncorrect);
      notification.showError();
      return;
    }
    const response = await storePatients.getPatientByIdentification(
      identificationPatient.value
    );
    if (response.status == HttpStatusCodes.NO_CONTENT) {
      notification.setMessage(message.notInfoFound);
      notification.showWarning();
      store.currentPatient = {} as IPatientResponse;
      return;
    }
    const patient = (await response.parsedBody) as IPatientResponse;
    currentAppointment.value.id = patient.id;
    console.log(patient);

    const data = response.parsedBody as IPatientResponse;
    store.currentPatient = data;
    console.log(data);
  }
  // verificar si es necesaria esta funcion o sino simplificar
  async function cardIsExpandible(isExpansible: boolean): Promise<void> {
    if (isExpansible == false) {
      store.settest(isExpansible);
      store.setother(true);
    }
    if (isExpansible == true) {
      store.settest(!isExpansible);
      store.setother(false);
    }
    console.log(isExpansible);
  }
  async function confirmChanges(): Promise<void> {
    const isValid = await formAppointment.value?.validate();
    console.log(isValid);
    if (isValid == false) {
      return;
    }
    const response = await storePatients.getPatientByIdentification(
      identificationPatient.value
    );
    const patient = (await response.parsedBody) as IPatientResponse;
    console.log(currentAppointment.value, currentPatient.value, patient);

    if (!currentAppointment.value) return;

    const data = currentAppointment.value;
    console.log(data);

    if (currentAppointment.value.id == undefined) {
      // const payload = {
      //   name: data.name,
      //   lastName: data.lastName,
      //   IDType: idType.value?.id,
      //   identification: data.identification,
      //   dateBirth: data.dateBirth,
      //   phoneNumber: data.phoneNumber,
      //   insurance: insurance.value?.id,
      //   gender: gender.value?.id,
      //   email: data.email,
      // } as IConsultRequest;
      console.log('first');
      //Sstore.createPatient(payload);
    }
    if (currentAppointment.value.id != undefined) {
      console.log('see');
      // const payload = {
      //   id: data.id,
      //   name: data.name,
      //   lastName: data.lastName,
      //   IDType: idType.value?.id,
      //   identification: data.identification,
      //   dateBirth: data.dateBirth,
      //   phoneNumber: data.phoneNumber,
      //   insurance: insurance.value?.id,
      //   gender: gender.value?.id,
      //   email: data.email,
      // } as IPatientRequest;
      // store.updateRelationCode(payload);
    }
  }
  return {
    // //! Properties
    // clearDxMainCode,
    formAppointment,
    // dxMainCode,
    // allDxMainCodes,
    currentPatient,
    currentAppointment,
    identificationPatient,
    hasArrowForExpanded,
    expanded,
    // error,
    // //! Computed
    // dxMainCodeofSpeciality: computed(() => {
    //   if (store.allDxMainCodes === null) {
    //     return null;
    //   }
    //   const result = store.allDxMainCodes.filter(
    //     (dxMainCode) => dxMainCode.speciality.id == store.currentSpeciality?.id
    //   );
    //   clearDxMainCode({} as IDXMainCodeRequest);
    //   return result;
    // }),
    // //! Metodos
    // add,
    // edit,
    // dxMainCodeChanged,
    confirmChanges,
    // getAllDxMainCode,
    cardIsExpandible,
    searchPatient,
  };
}
