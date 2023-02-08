import { reactive, ref } from 'vue';
import { PatientResponse } from 'src/Domine/Responses';

// interface InfoPatientState {
//   currentPatient: PatientResponse;
// }

// export class InfoPatientController {
//   private stateGG: InfoPatientState = reactive({
//     currentPatient: {} as PatientResponse,
//   });

//   public getState(): InfoPatientState {
//     return this.stateGG;
//   }
// }

export class ClinicHistoryAdapter {
  identificationPatient = ref<string>('');
  iconAvatar = ref<string>('');
  age = ref<number>(0);
  currentPatient = ref<PatientResponse>({} as PatientResponse);

  private state = reactive({
    counter: 0,
  });

  public async searchPatient(val: string) {
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
  // return {
  //   searchPatient,
  //   identificationPatient,
  //   currentPatient,
  //   iconAvatar,
  //   age,
  // };
}
