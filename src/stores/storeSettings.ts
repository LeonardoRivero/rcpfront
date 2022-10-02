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
  IDXMainCodeRequest,
  IDXMainCodeResponse,
  IRelationCodeRequest,
  IRelationCodeResponse,
} from 'src/interfaces/IConsults';
import { IHealthInsurance } from 'src/interfaces/IPatients';
import { EndPoints, Messages } from 'src/scripts/Constants';
import { IColumnsDataTable } from 'src/interfaces/ICommons';
import { serviceDataTable } from 'src/services/DataTableService';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';

const endpoint = new EndPoints();
const messages = new Messages();
const { setData, titleTable } = serviceDataTable();

export const useStoreSettings = defineStore('settings', {
  state: () => ({
    allSpecialities: undefined as Array<ISpeciality> | undefined,
    currentSpeciality: {} as ISpeciality | null,
    allDxMainCodes: null as Array<IDXMainCodeResponse> | null,
    currentDxMainCode: {} as IDXMainCodeResponse | null,
    // listDxMainCodesBySpeciality: null as Array<IDXMainCodeResponse> | null,
    allRelationCodes: null as Array<IRelationCodeResponse> | null,
    currentRelationCode: {} as IRelationCodeResponse | null,
    allInsurance: undefined as Array<IHealthInsurance> | undefined,
    currentInsurance: {} as IHealthInsurance,
    // specialityForm: {} as Forms | undefined,
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
    async createInsurance(
      data: IHealthInsurance
    ): Promise<HttpResponse<unknown> | null> {
      const url = endpoint.getORcreateInsurance;
      const response = await POST(url, data);
      handleResponse(response);
      if (response.status === HttpStatusCodes.BAD_REQUEST) {
        return null;
      }
      return response;
    },
    async retrieveAllInsurance(): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreateInsurance;
      const response = await GET(url);
      this.allInsurance =
        (await response.parsedBody) as Array<IHealthInsurance>;
      return response;
    },
    async updateInsurance(
      data: IHealthInsurance
    ): Promise<HttpResponse<unknown> | null> {
      if (data.id == null) {
        return null;
      }
      const url = endpoint.updateInsurance(data.id);
      const response = await PUT(url, data);
      if (response.status === HttpStatusCodes.BAD_REQUEST) {
        return null;
      }
      handleResponse(response, messages.updateSuccesfully);
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
    async retrieveAllDxMainCodeBySpecialityId(
      specialityId: number
    ): Promise<HttpResponse<unknown>> {
      const urlBase = endpoint.getORcreateDxMainCode;
      const queryParameters = { speciality: specialityId };
      const url = endpoint.urlQueryParameter(urlBase, queryParameters);
      const response = await GET(url);
      this.allDxMainCodes = response.parsedBody as Array<IDXMainCodeResponse>;
      //handleResponse(response);
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
      handleResponse(response, messages.updateSuccesfully);
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
      const columnsr = [
        {
          name: 'id',
          required: true,
          label: 'Id',
          align: 'left',
          field: 'id',
          sortable: true,
        },
        {
          name: 'descripcionDX',
          required: true,
          align: 'center',
          label: 'Nombre Especialidad',
          field: 'descripcionDX',
          sortable: true,
        },
        {
          name: 'speciality',
          required: true,
          align: 'center',
          label: 'Nombre Especialidad',
          field: 'speciality',
          sortable: true,
        },
      ] as Array<IColumnsDataTable>;
      const r = this.allRelationCodes.map((row) => {
        return {
          id: row.id,
          descripcionDX: row.dxmaincode.description,
          speciality: row.dxmaincode.speciality.description,
        };
      });
      console.log(r);
      titleTable.value = 'Examples fulss';
      setData(columnsr, r);
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
    async retrieveAllRelationCodeByDxMainId(
      dxMainCodeId: number
    ): Promise<HttpResponse<unknown>> {
      const urlBase = endpoint.getORcreateRelationCode;
      const queryParameters = { dxMainCodeId: dxMainCodeId };
      const url = endpoint.urlQueryParameter(urlBase, queryParameters);
      const response = await GET(url);
      this.allRelationCodes =
        response.parsedBody as Array<IRelationCodeResponse>;
      //handleResponse(response);
      return response;
    },
  },
});
