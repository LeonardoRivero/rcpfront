import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { QForm, date } from 'quasar';
import { storeToRefs } from 'pinia';
import { useStoreAppointment } from 'src/stores/storeAppointment';
import { useStorePatients } from 'src/stores/storePatients';
import {
  IConsultRequest,
  IConsultResponse,
  IDXMainCodeResponse,
  IReasonConsult,
} from 'src/interfaces/IConsults';
import { IPatientResponse } from 'src/interfaces/IPatients';
import { FORMAT_DATE, FORMAT_HOUR, Messages } from 'src/scripts/Constants';
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
  const timeStamp = Date.now();
  const formattedDate = ref(date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm'));
  const formattedTime = ref(date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm'));
  currentAppointment.value.date = formattedDate.value;
  const formAppointment = ref<QForm | null>(null);
  const identificationPatient = ref<string>('');
  const dxMainCode = ref<IDXMainCodeResponse>();
  const reasonConsult = ref<IReasonConsult>();

  function calculateAmountPaid(val: IConsultRequest) {
    if (currentAppointment.value.price == undefined) {
      currentAppointment.value.price = 0;
    }
    if (currentAppointment.value.copayment == undefined) {
      currentAppointment.value.copayment = 0;
    }

    currentAppointment.value.amountPaid =
      +currentAppointment.value.price + +currentAppointment.value.copayment;
  }
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
    // const patient = (await response.parsedBody) as IPatientResponse;
    // currentAppointment.value.id = patient.id;
    // console.log(patient);

    const data = (await response.parsedBody) as IPatientResponse;
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
    if (isValid == false) {
      return;
    }
    const responsePatient = await storePatients.getPatientByIdentification(
      identificationPatient.value
    );
    const patient = (await responsePatient.parsedBody) as IPatientResponse;
    console.log(currentAppointment.value, currentPatient.value, patient);

    if (!currentAppointment.value) return;

    const data = currentAppointment.value;
    console.log(data);
    if (currentAppointment.value.id == undefined) {
      const payload = {
        copayment: currentAppointment.value.copayment,
        amountPaid: currentAppointment.value.amountPaid,
        date: currentAppointment.value.date,
        authorizationNumber: currentAppointment.value.authorizationNumber,
        patientStatus: 1,
        reasonConsult: reasonConsult.value?.id,
        dxMainCode: dxMainCode.value?.id,
        patient: currentPatient.value.id,
        doctor: 1,
      } as IConsultRequest;
      console.log('first', payload);
      const response = await store.createAppointment(payload);
      console.log('first', response);
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
    formattedTime,
    dxMainCode,
    reasonConsult,
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
    calculateAmountPaid,
    cardIsExpandible,
    searchPatient,
  };
}
