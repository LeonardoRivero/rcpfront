import { onMounted, ref } from 'vue';
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
import * as Constants from 'src/scripts/Constants';
import { Modal, Notification } from 'src/scripts/Notifications';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { useStoreModal } from 'src/stores/storeCommon';
import table from 'src/components/Forms/RelationCode.vue';
import modalService from './ModalService';
import { Validators } from 'src/scripts/Helpers';
import { routerInstance } from 'src/boot/globalRouter';
import { patientService } from './PatientService';
import { specialityService } from './SpecialityService';
import { dxMainCodeService } from './DxMainCodeService';
import { useStoreSchedule } from 'src/stores/storeSchedule';

const store = useStoreAppointment();
const storeSchedule = useStoreSchedule();
const storePatients = useStorePatients();
const notification = new Notification();
const message = new Constants.Messages();
const storeCommon = useStoreModal();
const serviceModal = modalService();
const validator = new Validators();

export function appointmentService() {
  const { hasArrowForExpanded, expanded, currentAppointment, currentPatient } =
    storeToRefs(store);
  const hoursAllowed = Constants.OPTIONS_HOURS;
  const minutesAllowed = Constants.OPTIONS_MINUTES;
  const timeStamp = Date.now();
  const formattedDate = ref(
    date.formatDate(timeStamp, Constants.FORMAT_DATETIME)
  );
  const formattedTime = ref(
    date.formatDate(timeStamp, Constants.FORMAT_DATETIME)
  );
  currentAppointment.value.date = formattedDate.value;
  const formAppointment = ref<QForm | null>(null);
  const identificationPatient = ref<string>('');
  const dxMainCode = ref<IDXMainCodeResponse>();
  const reasonConsult = ref<IReasonConsult>();
  const show = ref(false);
  const currentYearMonth = Constants.CURRENTYEAR_MONTH;
  const formatDatetime = Constants.FORMAT_DATETIME;

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

      // serviceModal.setTitle('Atención');
      // serviceModal.setObject(message.notFoundInfoPatient);
      // serviceModal.withRedirect('/patient');
      // serviceModal.showModal(true);
      storeSchedule.card = false;
      const confirm = await serviceModal.showModal(
        'Atención',
        message.notFoundInfoPatient
      );
      // const confirm = await serviceModal.simpleModal();
      if (confirm == false) {
        return;
      }

      storePatients.currentPatient = {
        identification: parseInt(identificationPatient.value),
      } as IPatientResponse;
      routerInstance.push('/patient');
      // const modal = new Modal();
      // modal.withRedirectPage(
      //   'Atencion',
      //   'Desea crear el paciente ahora mismo?',
      //   '/patient'
      // );
      //show.value = true;
      return;
    }
    // const patient = (await response.parsedBody) as IPatientResponse;
    // currentAppointment.value.id = patient.id;
    // console.log(patient);

    const data = (await response.parsedBody) as IPatientResponse;
    store.currentPatient = data;
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
  }
  async function confirmChanges(): Promise<void> {
    const isValid = await formAppointment.value?.validate();
    if (isValid == false) {
      return;
    }
    const data = currentAppointment.value;

    const dateIsValid = validator.dateGreater(data.date);
    if (dateIsValid === false) {
      notification.setMessage(message.dateOrHourNotValid);
      notification.showError();
      return;
    }

    const responsePatient = await storePatients.getPatientByIdentification(
      identificationPatient.value
    );
    const patient = (await responsePatient.parsedBody) as IPatientResponse;
    if (!currentAppointment.value) return;

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
      const response = await store.createAppointment(payload);
    }

    if (currentAppointment.value.id != undefined) {
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
    // Properties
    currentYearMonth,
    show,
    formAppointment,
    formattedTime,
    formatDatetime,
    dxMainCode,
    reasonConsult,
    currentPatient,
    currentAppointment,
    identificationPatient,
    hasArrowForExpanded,
    expanded,
    hoursAllowed,
    minutesAllowed,
    // Metodos
    confirmChanges,
    calculateAmountPaid,
    cardIsExpandible,
    searchPatient,
  };
}
