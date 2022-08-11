import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { QForm } from 'quasar';
import { storeToRefs } from 'pinia';
import { useStorePatients } from 'src/stores/storePatients';
import {
  IPatientRequest,
  IPatientResponse,
  IIDType,
  IHealthInsurance,
} from 'src/interfaces/IModels';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
const router = useRouter();
const store = useStorePatients();

export function usePatient() {
  const {
    allIDTypes,
    currentIDType,
    currentGender,
    allGenders,
    currentPatient,
  } = storeToRefs(store);
  const patient = ref<IPatientRequest>();
  const idType = ref<IIDType>();
  const insurance = ref<IHealthInsurance>();
  // const expanded = ref(false);
  const formPatient = ref<QForm | null>(null);
  const error = ref(false);

  function clearIdType(val: IIDType) {
    console.log(val);
    // relationCode.value = undefined;
    // currentRelationCode.value = {} as IRelationCodeResponse;
  }
  function idTypeChanged(val: IIDType): void {
    console.log(val);
    store.currentIDType = val;
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
    if (insurance.value?.id == null || idType.value?.id == null) return;
    const data = currentPatient.value;
    if (currentPatient.value.id == undefined) {
      const payload = {
        name: data.name,
        lastName: data.lastName,
        IDType: idType.value.id,
        identification: data.identification,
        dateBirth: data.dateBirth,
        phoneNumber: data.phoneNumber,
        insurance: insurance.value.id,
        gender: 1,
        email: data.email,
      } as IPatientRequest;
      store.createPatient(payload);
    }
    if (currentPatient.value.id != undefined) {
      console.log('see');
      // const payload = {
      //   id: data.id,
      //   code: data.code,
      //   description: data.description,
      //   dxmaincode: currentDxMainCode.value?.id,
      // } as IRelationCodeRequest;
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
    allIDTypes,
    currentPatient,
    currentIDType,
    currentGender,
    idType,
    insurance,
    // expanded,
    error,
    //! Computed
    // relationCodeOfMainCode: computed(() => {
    //   if (store.allRelationCodes === undefined) {
    //     return null;
    //   }
    //   const result = store.allRelationCodes.filter(
    //     (relationCode) =>
    //       relationCode.dxmaincode.id == store.currentDxMainCode?.id
    //   );

    //   clearRelationCode({} as IRelationCodeRequest);
    //   return result;
    // }),
    //! Metodos
    // add,
    // edit,
    idTypeChanged,
    confirmChanges,
    isValidEmail,
    getAllIDTypes,
    clearIdType,
  };
}
