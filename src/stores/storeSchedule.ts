import { defineStore } from 'pinia';
import {
  GET,
  POST,
  PUT,
  handleResponse,
  HttpResponse,
} from 'src/scripts/Request';
import { IPatientResponse } from 'src/interfaces/IPatients';
import { EndPoints } from 'src/scripts/Constants';
import { IConsultRequest, IConsultResponse } from 'src/interfaces/IConsults';
import HttpStatusCode from 'src/scripts/HttpStatusCodes';
import {
  EventScheduleRequest,
  EventScheduleResponse,
} from 'src/interfaces/ICommons';

const endpoint = new EndPoints();

export const useStoreSchedule = defineStore('schedule', {
  state: () => ({
    lastConsult: {} as IConsultResponse,
    card: false,
    currentAppointment: {} as IConsultRequest,
    currentPatient: {} as IPatientResponse,
    currentSchedule: {} as EventScheduleRequest,
    identificationPatient: '',
    availableButton: true,
  }),
  actions: {
    async getLastConsult(): Promise<IConsultResponse> {
      const urlBase = endpoint.getORcreateConsult;
      const url = endpoint.urlQueryParameter(urlBase, { last: 'null' });
      const response = await GET(url);
      this.lastConsult = (await response.parsedBody) as IConsultResponse;
      return this.lastConsult;
    },
    async createSchedule(
      data: EventScheduleRequest
    ): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreateSchedule;
      const response = await POST(url, data);
      handleResponse(response);
      return response;
    },
    async retrieveScheduleById(
      scheduleId: number
    ): Promise<HttpResponse<unknown>> {
      const url = endpoint.updateOrGetScheduleById(scheduleId);
      const response = await GET(url);
      //this.scheduleResponse = response.parsedBody as EventScheduleResponse;
      //handleResponse(response);
      return response;
    },
  },
});
