import { ref } from 'vue';
import { QForm, date } from 'quasar';
import { storeToRefs } from 'pinia';
import { useStoreAppointment } from 'src/stores/storeAppointment';
import { useStorePatients } from 'src/stores/storePatients';
import {
  IConsultRequest,
  IConsultResponse,
  IPatientStatus,
  IReasonConsult,
} from 'src/interfaces/IConsults';
import {
  IHealthInsurance,
  IPatientRequest,
  IPatientResponse,
} from 'src/interfaces/IPatients';
import * as Constants from 'src/scripts/Constants';
import { Notification } from 'src/scripts/Notifications';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { useStoreModal } from 'src/stores/storeCommon';
import modalService from './ModalService';
import { Validators } from 'src/scripts/Helpers';
import { routerInstance } from 'src/boot/globalRouter';
import { useStoreSchedule } from 'src/stores/storeSchedule';
import { EventScheduleResponse } from 'src/interfaces/ICommons';

const store = useStoreAppointment();
const storeSchedule = useStoreSchedule();
const storePatients = useStorePatients();
const notification = new Notification();
const message = new Constants.Messages();
const storeCommon = useStoreModal();
const serviceModal = modalService();
const validator = new Validators();

export function appointmentService() {
  const { currentAppointment, currentPatient } = storeToRefs(store);
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
  const currentPatientStatus = ref<IPatientStatus>();
  const currentHealthInsurance = ref<IHealthInsurance>({} as IHealthInsurance);
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
  function patientStatusChanged(val: IPatientStatus): void {
    currentPatientStatus.value = val;
  }

  async function searchPatient(): Promise<void> {
    if (identificationPatient.value === '') {
      notification.setMessage(message.searchIncorrect);
      notification.showError();
      return;
    }
    // const response = await storePatients.getPatientByIdentification(
    //   identificationPatient.value
    // );
    const response = await storeSchedule.getScheduleByPatientIdentification(
      identificationPatient.value
    );
    if (response.status == HttpStatusCodes.NO_CONTENT) {
      notification.setMessage(message.notInfoFound);
      notification.showWarning();
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
      return;
    }
    // const patient = (await response.parsedBody) as IPatientResponse;
    // currentAppointment.value.id = patient.id;
    // console.log(patient);
    const data = (await response.parsedBody) as Array<EventScheduleResponse>;
    const lastSchedule = data.pop();
    if (lastSchedule?.start == undefined) {
      return;
    }
    currentAppointment.value.schedule = lastSchedule.id;
    currentAppointment.value.date = date.formatDate(
      lastSchedule.start,
      Constants.FORMAT_DATETIME
    );
    currentPatient.value = lastSchedule?.patient as IPatientResponse;
    currentHealthInsurance.value = lastSchedule.patient
      .insurance as IHealthInsurance;
  }

  async function confirmChanges(): Promise<void> {
    const isValid = await formAppointment.value?.validate();
    if (isValid == false) {
      return;
    }
    const dateIsValid = validator.dateGreater(currentAppointment.value.date);
    if (dateIsValid === false) {
      notification.setMessage(message.dateOrHourNotValid);
      notification.showError();
      return;
    }

    // const responsePatient = await storePatients.getPatientByIdentification(
    //   identificationPatient.value
    // );
    // const patient = (await responsePatient.parsedBody) as IPatientResponse;
    if (!currentAppointment.value) return;
    let confirmCreate = false;
    if (currentAppointment.value.id == undefined) {
      confirmCreate = await serviceModal.showModal(
        'Atención',
        message.newRegister
      );
      if (confirmCreate === false) {
        return;
      }
    }

    if (confirmCreate == true) {
      const payload = {
        copayment: currentAppointment.value.copayment,
        amountPaid: currentAppointment.value.amountPaid,
        date: currentAppointment.value.date,
        authorizationNumber: currentAppointment.value.authorizationNumber,
        patientStatus: currentPatientStatus.value?.id,
        reasonConsult: reasonConsult.value?.id,
        price: currentAppointment.value.price,
        schedule: currentAppointment.value.schedule,
        patient: currentPatient.value.id,
        doctor: 1,
      } as IConsultRequest;
      const responseCreate = await store.createAppointment(payload);
      if (
        responseCreate == null ||
        responseCreate.status == HttpStatusCodes.BAD_REQUEST
      ) {
        notification.setMessage(message.errorMessage);
        notification.showError();
        return;
      }
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
    // dxMainCode,
    reasonConsult,
    currentPatient,
    currentAppointment,
    currentPatientStatus,
    currentHealthInsurance,
    identificationPatient,
    hoursAllowed,
    minutesAllowed,
    // Metodos
    confirmChanges,
    calculateAmountPaid,
    patientStatusChanged,
    // cardIsExpandible,
    searchPatient,
  };
}
