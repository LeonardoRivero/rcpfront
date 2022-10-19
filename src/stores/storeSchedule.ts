import { defineStore } from 'pinia';
import FullCalendar from '@fullcalendar/vue3';
import {
  GET,
  POST,
  PUT,
  handleResponse,
  HttpResponse,
  DELETE,
} from 'src/scripts/Request';
import { IPatientResponse } from 'src/interfaces/IPatients';
import { EndPoints, Messages } from 'src/scripts/Constants';
import { IConsultRequest, IConsultResponse } from 'src/interfaces/IConsults';
import HttpStatusCode from 'src/scripts/HttpStatusCodes';
import {
  EventScheduleRequest,
  EventScheduleResponse,
} from 'src/interfaces/ICommons';

const endpoint = new EndPoints();
const messages = new Messages();

export const useStoreSchedule = defineStore('schedule', {
  state: () => ({
    lastConsult: {} as IConsultResponse,
    card: false,
    currentAppointment: {} as IConsultRequest,
    currentPatient: {} as IPatientResponse,
    currentSchedule: {} as EventScheduleResponse,
    identificationPatient: '',
    allowToUpdate: true,
    allowToDelete: false,
    calendar: {} as InstanceType<typeof FullCalendar>,
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
      return response;
    },
    async updateSchedule(
      data: EventScheduleRequest
    ): Promise<HttpResponse<unknown> | null> {
      if (data.id == null) {
        return null;
      }
      const url = endpoint.updateOrGetScheduleById(data.id);
      const response = await PUT(url, data);
      handleResponse(response, messages.updateSuccesfully);
      return response;
    },
    async getScheduleByPatientIdentification(
      identification: string
    ): Promise<HttpResponse<unknown>> {
      const urlBase = endpoint.getORcreateSchedule;
      const url = endpoint.urlQueryParameter(urlBase, {
        patientIdentification: identification,
      });
      const response = await GET(url);
      return response;
    },
    async deleteSchedule(scheduleId: number): Promise<HttpResponse<unknown>> {
      const url = endpoint.updateOrGetScheduleById(scheduleId);
      const response = await DELETE(url);
      return response;
    },
  },
});
