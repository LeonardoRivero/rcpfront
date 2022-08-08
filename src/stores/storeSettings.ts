import { defineStore } from 'pinia';
import {
  GET,
  POST,
  PUT,
  handleResponse,
  HttpResponse,
} from 'src/scripts/Request';
import {
  ISpeciality,
  Forms,
  IDXMainCodeRequest,
  IDXMainCodeResponse,
  IRelationCodeRequest,
  IRelationCodeResponse,
} from 'src/interfaces/IModels';
import { EndPoints } from 'src/scripts/Constants';

const endpoint = new EndPoints();

export const useCounterStore = defineStore('settings', {
  state: () => ({
    allSpecialities: undefined as Array<ISpeciality> | undefined,
    currentSpeciality: {} as ISpeciality | null,
    allDxMainCodes: null as Array<IDXMainCodeResponse> | null,
    currentDxMainCode: {} as IDXMainCodeResponse | null,
    listDxMainCodesBySpeciality: null as Array<IDXMainCodeResponse> | null,
    allRelationCodes: undefined as Array<IRelationCodeResponse> | undefined,
    currentRelationCode: {} as IRelationCodeResponse | null,
    specialityForm: {} as Forms | undefined,
  }),
  getters: {},
  actions: {
    async createSpeciality(data: ISpeciality): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreateSpeciality;
      const response = await POST(url, data);
      handleResponse(response);
      return response;
    },
    async retrieveAllSpecialities(): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreateSpeciality;
      const response = await GET(url);
      this.allSpecialities = (await response.parsedBody) as Array<ISpeciality>;
      return response;
    },
    async updateSpeciality(
      data: ISpeciality
    ): Promise<HttpResponse<unknown> | null> {
      if (data.id == null) {
        return null;
      }
      const url = endpoint.updateSpeciality(data.id);
      const response = await PUT(url, data);
      handleResponse(response);
      return response;
    },
    async createDxMainCode(
      data: IDXMainCodeRequest
    ): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreateDxMainCode;
      const response = await POST(url, data);
      handleResponse(response);
      return response;
    },
    async retrieveAllDxMainCode(): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreateDxMainCode;
      const response = await GET(url);
      this.allDxMainCodes = response.parsedBody as Array<IDXMainCodeResponse>;
      handleResponse(response);
      return response;
    },
    async updateDxMainCode(
      data: IDXMainCodeRequest
    ): Promise<HttpResponse<unknown> | null> {
      if (data.id == null) {
        return null;
      }
      const url = endpoint.updateDxMainCode(data.id);
      const response = await PUT(url, data);
      handleResponse(response);
      return response;
    },
    async createRelationCode(
      data: IRelationCodeRequest
    ): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreateRelationCode;
      const response = await POST(url, data);
      handleResponse(response);
      return response;
    },
    async retrieveAllRelationCodes(): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreateRelationCode;
      const response = await GET(url);
      this.allRelationCodes =
        response.parsedBody as Array<IRelationCodeResponse>;
      handleResponse(response);
      return response;
    },
    async updateRelationCode(
      data: IRelationCodeRequest
    ): Promise<HttpResponse<unknown> | null> {
      if (data.id == null) {
        return null;
      }
      const url = endpoint.updateRelationCode(data.id);
      const response = await PUT(url, data);
      handleResponse(response);
      return response;
    },
  },
});
