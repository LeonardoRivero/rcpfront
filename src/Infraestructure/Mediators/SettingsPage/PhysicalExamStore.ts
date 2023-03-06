import { defineStore } from 'pinia';
import { QForm } from 'quasar';
import { IColumnsDataTable } from 'src/Domine/ICommons';
import { IPhysicalExam, ISpeciality } from 'src/Domine/ModelsDB';
import { PhysicalExamResponse } from 'src/Domine/Responses';

export interface IStorePhysicalExamParameter {
  currentPhysicalExamParameter: IPhysicalExam;
  allPhysicalMedicalParameter: Array<PhysicalExamResponse>;
  speciality: ISpeciality | null;
  allSpecialities: Array<ISpeciality>;
  form: QForm | null;
  disable: boolean;
  icon: string;
  columnsr: Array<IColumnsDataTable>;
  rows: Array<unknown>;
  specialityTable: ISpeciality | null;
  selected: Array<unknown>;
  status: boolean;
  titleTable: string;
  userCanEdit: boolean;
}
export const useStorePhysicalExamParameter = defineStore({
  id: 'storePhysicalExamParameter',
  state: () =>
    ({
      currentPhysicalExamParameter: {
        active: true,
        description: '',
      } as IPhysicalExam,
      allPhysicalMedicalParameter: [] as Array<PhysicalExamResponse>,
      speciality: null,
      form: null,
      disable: false,
      icon: '',
      columnsr: [] as Array<IColumnsDataTable>,
      rows: [] as Array<unknown>,
      specialityTable: null,
      selected: [] as Array<unknown>,
      status: false,
      titleTable: 'Parametros Examen Fisico',
      allSpecialities: [],
      userCanEdit: false,
    } as IStorePhysicalExamParameter),
});
