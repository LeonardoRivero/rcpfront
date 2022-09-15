import { defineStore } from 'pinia';
import {
  GET,
  POST,
  PUT,
  handleResponse,
  HttpResponse,
} from 'src/scripts/Request';
import {
  IPatientRequest,
  IPatientResponse,
  IIDType,
  IGender,
} from 'src/interfaces/IPatients';
import { EndPoints } from 'src/scripts/Constants';
import HttpStatusCode from 'src/scripts/HttpStatusCodes';
import { IConsultRequest } from 'src/interfaces/IConsults';

const endpoint = new EndPoints();

export const useStoreAppointment = defineStore('appointment', {
  state: () => ({
    currentAppointment: {} as IConsultRequest,
    // allIDTypes: undefined as Array<IIDType> | undefined,
    // currentIDType: {} as IIDType | null,
    // allGenders: null as Array<IGender> | null,
    // currentGender: {} as IGender | null,
    hasArrowForExpanded: false,
    expanded: false,
  }),
  actions: {
    settest(isExpansible: boolean): void {
      this.hasArrowForExpanded = isExpansible;
    },
    setother(isbool: boolean): void {
      this.expanded = isbool;
    },
  },
});
