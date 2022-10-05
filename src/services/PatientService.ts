import { ref } from 'vue';
import { QForm, date } from 'quasar';
import { storeToRefs } from 'pinia';
import { useStorePatients } from 'src/stores/storePatients';
import {
  IPatientRequest,
  IPatientResponse,
  IIDType,
  IHealthInsurance,
  IGender,
} from 'src/interfaces/IPatients';
import { HttpResponse } from 'src/scripts/Request';
import * as Constants from 'src/scripts/Constants';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { Messages, FORMAT_DATE } from 'src/scripts/Constants';
import { Modal, Notification } from 'src/scripts/Notifications';
import { useStoreSettings } from 'src/stores/storeSettings';
import modalService from './ModalService';
import { useStoreModal } from 'src/stores/storeCommon';
import { insuranceService } from './InsuranceService';
import { routerInstance } from 'src/boot/globalRouter';
import { Validators } from 'src/scripts/Helpers';
const store = useStorePatients();
const storeInsurance = useStoreSettings();
const storeCommon = useStoreModal();
const serviceInsurance = insuranceService();
const notification = new Notification();
const serviceModal = modalService();
const messages = new Messages();
const validator = new Validators();

export function patientService() {
  const {
    allIDTypes,
    allReasonConsult,
    allPatientStatus,
    currentIDType,
    currentGender,
    allGenders,
    currentPatient,
    formPatient,
  } = storeToRefs(store);
  const { currentInsurance } = storeToRefs(storeInsurance);
  // const { title, urlToRedirect, visible, redirect } = storeToRefs(storeCommon);
  const patient = ref<IPatientRequest>();
  const idType = ref<IIDType>();
  const gender = ref<IGender>();
  const insurance = ref<IHealthInsurance>();
  const identificationPatient = ref<string>('');
  // const formPatient = ref<QForm | null>(null);
  const error = ref(false);
  const disable = ref(false);
  let payload = {} as IPatientRequest;
  let response = {} as HttpResponse<unknown>;

  function clearPatient(val: IPatientRequest) {
    currentPatient.value = {} as IPatientResponse;
  }
  async function searchPatient(): Promise<void> {
    const response = await store.getPatientByIdentification(
      identificationPatient.value
    );
    if (response.status == HttpStatusCodes.NO_CONTENT) {
      clearPatient({} as IPatientRequest);
      formPatient.value?.reset();
      notification.setMessage(messages.notInfoFound);
      notification.showWarning();
      return;
    }
    const data = response.parsedBody as IPatientResponse;
    idType.value = data.IDType;
    insurance.value = data.insurance;
    gender.value = data.gender;
    disable.value = true;
    currentPatient.value = data;
  }
  function enableEdition(): void {
    disable.value = false;
  }
  function idTypeChanged(val: IIDType): void {
    currentIDType.value = val;
    currentPatient.value.IDType = val;
  }
  function genderChanged(val: IGender): void {
    currentGender.value = val;
    currentPatient.value.gender = val;
  }
  async function confirmChanges(): Promise<void> {
    const isValid = await formPatient.value?.validate();
    if (isValid == false) {
      return;
    }
    if (!currentPatient.value) return;
    let confirmCreate = false;
    if (currentPatient.value.id == undefined) {
      confirmCreate = await serviceModal.showModal(
        'Atención',
        messages.newRegister
      );
      if (confirmCreate === false) {
        return;
      }
    }
    if (confirmCreate == true) {
      if (
        currentIDType.value?.id == null ||
        currentInsurance.value?.id == null ||
        currentGender.value?.id == null
      ) {
        return;
      }

      payload = {
        name: currentPatient.value.name,
        lastName: currentPatient.value.lastName,
        IDType: currentIDType.value?.id,
        identification: currentPatient.value.identification,
        dateBirth: currentPatient.value.dateBirth,
        phoneNumber: currentPatient.value.phoneNumber,
        insurance: currentInsurance.value?.id,
        gender: currentGender.value?.id,
        email: currentPatient.value.email,
      } as IPatientRequest;
      const responseCreate = await store.createPatient(payload);
      if (responseCreate == null) {
        return;
      }
      response = responseCreate;
      clearPatient({} as IPatientRequest);
      formPatient.value?.reset();
      //currentPatient.value = response.parsedBody as IPatientResponse;
    }
    let confirmUpdate = false;
    if (currentPatient.value.id != undefined) {
      confirmUpdate = await serviceModal.showModal(
        'Atención',
        messages.updateRegister
      );
      if (confirmUpdate == false) {
        return;
      }
    }
    if (confirmUpdate == true) {
      if (
        currentPatient.value.IDType.id == null ||
        currentPatient.value.insurance.id == null ||
        currentPatient.value.gender.id == null
      ) {
        notification.setMessage('existen parametros o datos invalidos');
        notification.showWarning();
        return;
      }
      payload = {
        id: currentPatient.value.id,
        name: currentPatient.value.name,
        lastName: currentPatient.value.lastName,
        IDType: currentPatient.value.IDType.id,
        identification: currentPatient.value.identification,
        dateBirth: currentPatient.value.dateBirth,
        phoneNumber: currentPatient.value.phoneNumber,
        insurance: currentPatient.value.insurance.id,
        gender: currentPatient.value.gender.id,
        email:
          currentPatient.value.email == undefined
            ? ''
            : currentPatient.value.email,
      };
      const responseUpdate = await store.updatePatient(payload);
      if (responseUpdate == null) {
        return;
      }
      response = responseUpdate;
    }
    //currentPatient.value = response.parsedBody as IPatientResponse;
  }
  async function getAllIDTypes() {
    if (store.allIDTypes == undefined) {
      const response = await store.retrieveAllIDTypes();
      if (response.status == HttpStatusCodes.NOT_FOUND) {
        routerInstance.push('/:catchAll');
      }
    }
  }
  async function getAllGenders() {
    let response = {} as HttpResponse<unknown>;
    if (store.allGenders == null) {
      response = await store.retrieveAllGenders();
    }
    if (response.status == HttpStatusCodes.NOT_FOUND) {
      routerInstance.push('/:catchAll');
    }
  }
  async function getAllReasonConsult() {
    let response = {} as HttpResponse<unknown>;
    if (store.allReasonConsult.length == 0) {
      response = await store.retrieveAllReasonConsult();
    }
    if (response.status == HttpStatusCodes.NOT_FOUND) {
      routerInstance.push('/:catchAll');
    }
  }
  async function getAllPatientStatus() {
    let response = {} as HttpResponse<unknown>;
    if (store.allPatientStatus.length == 0) {
      response = await store.retrieveAllPatientStatus();
    }
    if (response.status == HttpStatusCodes.NOT_FOUND) {
      routerInstance.push('/:catchAll');
    }
  }
  function isValidEmail(val: string): void {
    const validEmail = validator.email(val);
    if (validEmail == false) {
      error.value = true;
      notification.setMessage('Email invalido');
      notification.showError();
      return;
    }
    currentPatient.value.email = val;
    error.value = false;
  }

  return {
    //! Properties
    allGenders,
    formPatient,
    patient,
    gender,
    allIDTypes,
    currentPatient,
    currentIDType,
    currentGender,
    idType,
    insurance,
    identificationPatient,
    disable,
    allReasonConsult,
    allPatientStatus,
    error,
    //! Computed

    //! Metodos
    searchPatient,
    idTypeChanged,
    genderChanged,
    confirmChanges,
    isValidEmail,
    getAllIDTypes,
    getAllGenders,
    getAllReasonConsult,
    getAllPatientStatus,
    enableEdition,
  };
}
