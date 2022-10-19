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
    currentPatient: {} as IPatientResponse,
    // hasArrowForExpanded: false,
    // expanded: false,
  }),
  actions: {
    // settest(isExpansible: boolean): void {
    //   this.hasArrowForExpanded = isExpansible;
    // },
    // setother(isbool: boolean): void {
    //   this.expanded = isbool;
    // },
    async createAppointment(
      data: IConsultRequest
    ): Promise<HttpResponse<unknown> | null> {
      const url = endpoint.getORcreateConsult;
      const response = await POST(url, data);
      handleResponse(response);
      return response;
    },
    async getAppointmentByScheduleId(
      scheduleId: number
    ): Promise<HttpResponse<unknown>> {
      const url = endpoint.updateOrGetAppointmentByScheduleId(scheduleId);
      const response = await GET(url);
      return response;
    },
  },
});
