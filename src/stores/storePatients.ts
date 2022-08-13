import { defineStore } from 'pinia';
import {
  GET,
  POST,
  PUT,
  handleResponse,
  HttpResponse,
} from 'src/scripts/Request';
import { IPatientRequest, IIDType, IGender } from 'src/interfaces/IModels';
import { EndPoints } from 'src/scripts/Constants';

const endpoint = new EndPoints();

export const useStorePatients = defineStore('patients', {
  state: () => ({
    currentPatient: {} as IPatientRequest,
    allIDTypes: undefined as Array<IIDType> | undefined,
    currentIDType: {} as IIDType | null,
    allGenders: null as Array<IGender> | null,
    currentGender: {} as IGender | null,
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
  },
});
