import { reactive } from 'vue';
import { PathologicalHistoryResponse, PatientResponse } from 'src/Domine/Responses';
import { IconSVG } from 'src/Application/Utilities';
import { Gender } from 'src/Application/Utilities';

export class ClinicHistoryAdapter {
  private iconSVG = IconSVG.getInstance();

  private state = reactive({
    identificationPatient: '',
    age: 0,
    currentPatient: {} as PatientResponse | null,
    iconAvatar: '',
  });

  public getState() {
    return this.state;
  }

  public getGender(patient: PatientResponse) {
    if (this.state.currentPatient == null) return;
    this.state.iconAvatar =
      patient.gender.id == Gender.FEMALE
        ? this.iconSVG.female_avatar
        : this.iconSVG.male_avatar;
  }
}

export class PreliminaryDataController {
  private state = reactive({
    allPathologies: [] as Array<PathologicalHistoryResponse>,
    pathology: null,
    options: <Array<PathologicalHistoryResponse>>[],
  });
  public getState() {
    return this.state;
  }
}
