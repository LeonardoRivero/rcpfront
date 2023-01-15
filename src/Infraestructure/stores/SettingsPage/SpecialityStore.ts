import { QForm } from 'quasar';
import { defineStore } from 'pinia';
import { ISpeciality } from 'src/Domine/ModelsDB';
import { SpecialityResponse } from 'src/Domine/Responses';

export interface IStoreSpeciality {
  allSpecialities: Array<SpecialityResponse>;
  currentSpeciality: ISpeciality | null;
  form: QForm | null;
  expanded: boolean;
  speciality: ISpeciality | null;
}

export const useStoreSpeciality = defineStore({
  id: 'storeSpeciality',
  state: () =>
    ({
      allSpecialities: [] as Array<SpecialityResponse>,
      currentSpeciality: {} as ISpeciality,
      expanded: false,
      speciality: null,
      form: null,
    } as IStoreSpeciality),
});
