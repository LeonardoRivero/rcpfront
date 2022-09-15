import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
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
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { BASE_YEAR, MININUM_AGE, Messages } from 'src/scripts/Constants';
import { Notification } from 'src/scripts/Notifications';

const router = useRouter();
const store = useStorePatients();
const notification = new Notification();
const message = new Messages();

export function patientService() {
  const {
    allIDTypes,
    currentIDType,
    currentGender,
    allGenders,
    currentPatient,
  } = storeToRefs(store);
  const patient = ref<IPatientRequest>();
  const idType = ref<IIDType>();
  const gender = ref<IGender>();
  const insurance = ref<IHealthInsurance>();
  const identificationPatient = ref<string>('');
  const formPatient = ref<QForm | null>(null);
  const error = ref(false);
  const disable = ref(false);

  async function searchPatient(): Promise<void> {
    const response = await store.getPatientByIdentification(
      identificationPatient.value
    );
    if (response.status == HttpStatusCodes.NO_CONTENT) {
      const now = new Date().toJSON().split('T');
      store.currentPatient = {
        dateBirth: now[0],
      } as IPatientResponse;
      formPatient.value?.resetValidation();
      // const defaultIDType = {
      //   description: '',
      //   abbreviation: '',
      // } as IIDType;

      // const t = new Date().toLocaleString().split(',')[0];
      // console.log(t);
      // store.currentPatient = {
      //   IDType: defaultIDType,
      //   dateBirth: t,
      // } as IPatientResponse;
      // console.log(store.currentPatient);

      //disable.value = false;
      notification.setMessage(message.notInfoFound);
      notification.showWarning();
      return;
    }
    const data = response.parsedBody as IPatientResponse;
    idType.value = data.IDType;
    // insurance.value = data.insurance;
    // gender.value = data.gender;
    disable.value = true;
    store.currentPatient = data;
  }
  function enableEdition(): void {
    disable.value = false;
  }
  function idTypeChanged(val: IIDType): void {
    console.log(val);
    store.currentIDType = val;
  }
  function genderChanged(val: IGender): void {
    console.log(val);
    store.currentGender = val;
  }
  function isAdult(birthday: Date): boolean {
    const dateBirthday = new Date(birthday);
    const ageDifMs = Date.now() - dateBirthday.getTime();
    const ageDate = new Date(ageDifMs);
    const result = Math.abs(ageDate.getUTCFullYear() - BASE_YEAR);
    if (result > MININUM_AGE) {
      return true;
    }
    return false;
  }
  // function add(): void {
  //   expanded.value = !expanded.value;
  //   currentRelationCode.value = {} as IRelationCodeResponse;
  // }
  // function edit(): void {
  //   if (expanded.value === false) {
  //     expanded.value = !expanded.value;
  //   }
  //   currentRelationCode.value = relationCode.value as IRelationCodeResponse;
  // }
  async function confirmChanges(): Promise<void> {
    const isValid = await formPatient.value?.validate();
    console.log(isValid);
    if (isValid == false) {
      return;
    }
    console.log(currentPatient.value, insurance.value, idType.value);

    if (!currentPatient.value) return;

    const data = currentPatient.value;
    // const adult = isAdult(data.dateBirth);
    // if (adult == false) {
    //   notification.setMessage(message.isNotAdult);
    //   notification.showError();
    //   return;
    // }

    if (currentPatient.value.id == undefined) {
      const payload = {
        name: data.name,
        lastName: data.lastName,
        IDType: idType.value?.id,
        identification: data.identification,
        dateBirth: data.dateBirth,
        phoneNumber: data.phoneNumber,
        insurance: insurance.value?.id,
        gender: gender.value?.id,
        email: data.email,
      } as IPatientRequest;
      console.log('first');
      //Sstore.createPatient(payload);
    }
    if (currentPatient.value.id != undefined) {
      console.log('see');
      const payload = {
        id: data.id,
        name: data.name,
        lastName: data.lastName,
        IDType: idType.value?.id,
        identification: data.identification,
        dateBirth: data.dateBirth,
        phoneNumber: data.phoneNumber,
        insurance: insurance.value?.id,
        gender: gender.value?.id,
        email: data.email,
      } as IPatientRequest;
      // store.updateRelationCode(payload);
    }
  }
  async function getAllIDTypes() {
    if (store.allIDTypes == undefined) {
      const response = await store.retrieveAllIDTypes();
      if (response.status == HttpStatusCodes.NOT_FOUND) {
        router.push('/:catchAll');
      }
    }
  }
  async function getAllGenders() {
    if (store.allGenders == null) {
      const response = await store.retrieveAllGenders();
      if (response.status == HttpStatusCodes.NOT_FOUND) {
        router.push('/:catchAll');
      }
    }
  }
  function isValidEmail(val: string) {
    const emailPattern =
      /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(val) || 'Email no valido';
  }

  return {
    //! Properties
    // clearRelationCode,
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
    // expanded,
    error,
    //! Computed

    //! Metodos
    // add,
    // edit,
    searchPatient,
    idTypeChanged,
    genderChanged,
    confirmChanges,
    isValidEmail,
    getAllIDTypes,
    getAllGenders,
    enableEdition,
  };
}
