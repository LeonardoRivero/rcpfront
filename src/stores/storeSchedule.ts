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
import { IConsultResponse } from 'src/interfaces/IConsults';
import HttpStatusCode from 'src/scripts/HttpStatusCodes';

const endpoint = new EndPoints();

export const useStoreSchedule = defineStore('schedule', {
  state: () => ({
    lastConsult: {} as IConsultResponse,
    // allIDTypes: undefined as Array<IIDType> | undefined,
    // currentIDType: {} as IIDType | null,
    // allGenders: null as Array<IGender> | null,
    // currentGender: {} as IGender | null,
  }),
  actions: {
    async getLastConsult(): Promise<IConsultResponse> {
      const urlBase = endpoint.getORcreateConsult;
      const url = endpoint.urlQueryParameter(urlBase, { last: 'null' });
      const response = await GET(url);
      console.log(response);
      this.lastConsult = (await response.parsedBody) as IConsultResponse;
      return this.lastConsult;
    },
    // async retrieveAllGenders(): Promise<HttpResponse<unknown>> {
    //   const url = endpoint.getAllGender;
    //   const response = await GET(url);
    //   this.allGenders = (await response.parsedBody) as Array<IGender>;
    //   return response;
    // },
    // async createPatient(data: IPatientRequest): Promise<HttpResponse<unknown>> {
    //   const url = endpoint.getORcreatePatient;
    //   const response = await POST(url, data);
    //   handleResponse(response);
    //   return response;
    // },
    // async getPatientByIdentification(
    //   identification: string
    // ): Promise<HttpResponse<unknown>> {
    //   const urlBase = endpoint.getORcreatePatient;
    //   // const arrayQueriesParameters: IQueryParameters = [
    //   //   { parameter: 'identification',value:identification },
    //   // ];
    //   const url = endpoint.urlQueryParameter(
    //     urlBase,
    //     'identification',
    //     identification
    //   );
    //   console.log(url);
    //   const response = await GET(url);
    //   console.log(response);
    //   //this.currentPatient = (await response.parsedBody) as IPatientResponse;
    //   return response;
    // },
  },
});
