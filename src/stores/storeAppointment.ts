import { defineStore } from 'pinia';
import {
  GET,
  POST,
  PUT,
  handleResponse,
  HttpResponse,
} from 'src/scripts/Request';
import { IPatientResponse } from 'src/models/IPatients';
import { EndPoints } from 'src/scripts/Constants';
import { IAppointmentRequest } from 'src/models/IConsults';

const endpoint = EndPoints.getInstance();

export const useStoreAppointment = defineStore('appointment', {
  state: () => ({
    currentAppointment: {} as IAppointmentRequest,
    currentPatient: {} as IPatientResponse,
  }),
  // actions: {
  //   async createAppointment(
  //     data: IAppointmentRequest
  //   ): Promise<HttpResponse<unknown> | null> {
  //     const url = endpoint.getORcreateConsult;
  //     const response = await POST(url, data);
  //     handleResponse(response);
  //     return response;
  //   },
  //   async getAppointmentByScheduleId(
  //     scheduleId: number
  //   ): Promise<HttpResponse<unknown>> {
  //     const url = endpoint.updateOrGetAppointmentByScheduleId(scheduleId);
  //     const response = await GET(url);
  //     return response;
  //   },
  // },
});
