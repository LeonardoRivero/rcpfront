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
import { EndPoints, Messages } from 'src/scripts/Constants';
import HttpStatusCode from 'src/scripts/HttpStatusCodes';
import { IPatientStatus, IReasonConsult } from 'src/interfaces/IConsults';
import { QForm } from 'quasar';

const endpoint = new EndPoints();
const messages = new Messages();

export const useStorePatients = defineStore('patients', {
  state: () => ({
    currentPatient: {} as IPatientResponse,
    allIDTypes: undefined as Array<IIDType> | undefined,
    currentIDType: {} as IIDType | null,
    allGenders: null as Array<IGender> | null,
    currentGender: {} as IGender | null,
    allPatientStatus: [] as Array<IPatientStatus>,
    allReasonConsult: [] as Array<IReasonConsult>,
    formPatient: null as QForm | null,
  }),
  actions: {
    async retrieveAllIDTypes(): Promise<HttpResponse<unknown>> {
      const url = endpoint.getAllIDType;
      const response = await GET(url);
      this.allIDTypes = (await response.parsedBody) as Array<IIDType>;
      return response;
    },
    async retrieveAllGenders(): Promise<HttpResponse<unknown>> {
      const url = endpoint.getAllGender;
      const response = await GET(url);
      this.allGenders = (await response.parsedBody) as Array<IGender>;
      return response;
    },
    async createPatient(data: IPatientRequest): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreatePatient;
      const response = await POST(url, data);
      handleResponse(response);
      return response;
    },
    async updatePatient(
      data: IPatientRequest
    ): Promise<HttpResponse<unknown> | null> {
      if (data.id == null) {
        return null;
      }
      const url = endpoint.updatePatient(data.id);
      const response = await PUT(url, data);
      handleResponse(response, messages.updateSuccesfully);
      return response;
    },
    async getPatientByIdentification(
      idPatient: string
    ): Promise<HttpResponse<unknown>> {
      const urlBase = endpoint.getORcreatePatient;
      const queriesParameters = { identification: idPatient };
      const url = endpoint.urlQueryParameter(urlBase, queriesParameters);
      console.log(url);
      const response = await GET(url);
      console.log(response);
      //this.currentPatient = (await response.parsedBody) as IPatientResponse;
      return response;
    },
    async retrieveAllPatientStatus(): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreatePatientStatus;
      const response = await GET(url);
      console.log(response);
      this.allPatientStatus = response.parsedBody as Array<IPatientStatus>;
      handleResponse(response);
      return response;
    },
    async retrieveAllReasonConsult(): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreateReasonConsult;
      const response = await GET(url);
      this.allReasonConsult = response.parsedBody as Array<IReasonConsult>;
      console.log(response);
      handleResponse(response);
      return response;
    },
  },
});
