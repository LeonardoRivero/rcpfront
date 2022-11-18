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
  IDoctorResponse,
  IDoctorRequest,
  IPhysicalExamRequest,
} from 'src/interfaces/IConsults';
import { IHealthInsurance, IPatientRequest } from 'src/interfaces/IPatients';
import { EndPoints, Messages } from 'src/scripts/Constants';
import { IColumnsDataTable } from 'src/interfaces/ICommons';
import { serviceDataTable } from 'src/services/DataTableService';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';

const endpoint = EndPoints.getInstance();
const messages = new Messages();
const { setData, titleTable } = serviceDataTable();

export const useStoreSettings = defineStore('settings', {
  state: () => ({
    allSpecialities: undefined as Array<ISpeciality> | undefined,
    currentSpeciality: {} as ISpeciality | null,
    allDxMainCodes: null as Array<IDXMainCodeResponse> | null,
    currentDxMainCode: {} as IDXMainCodeResponse | null,
    dxMainCode: null as IDXMainCodeResponse | null,
    allRelationCodes: null as Array<IRelationCodeResponse> | null,
    currentRelationCode: {} as IRelationCodeResponse | null,
    allInsurance: undefined as Array<IHealthInsurance> | undefined,
    currentInsurance: {} as IHealthInsurance,
    allDoctors: [] as Array<IDoctorResponse>,
    currentDoctor: {} as IDoctorRequest,
    speciality: null as ISpeciality | null,
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
      const columnsr = [
        {
          name: 'id',
          required: true,
          label: 'Id',
          align: 'left',
          field: 'id',
          sortable: true,
          style: 'max-width: 10px',
        },
        {
          name: 'speciality',
          required: true,
          align: 'center',
          label: 'Nombre Especialidad',
          field: 'speciality',
          sortable: true,
          style: 'max-width: 40px',
        },
        {
          name: 'descripcionDX',
          required: true,
          align: 'center',
          label: 'Codigo Principal',
          field: 'descripcionDX',
          sortable: true,
          style: 'display:grid',
        },
        {
          name: 'relationCode',
          required: true,
          align: 'center',
          label: 'Codigo Relacionado',
          field: 'relationCode',
          sortable: true,
          style: 'max-width: 70px',
        },
      ] as Array<IColumnsDataTable>;
      const r = this.allRelationCodes.map((row) => {
        return {
          id: row.id,
          speciality: row.dxmaincode.speciality.description,
          descripcionDX: row.dxmaincode.description,
          relationCode: row.description,
        };
      });
      titleTable.value = 'Resumen';
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
      return response;
    },
    async retrieveAllDoctors(): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreateDoctor;
      const response = await GET(url);
      this.allDoctors = response.parsedBody as Array<IDoctorResponse>;
      return response;
    },
    async createPhysicalExam(
      data: IPhysicalExamRequest
    ): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreatePhysicalExam;
      const response = await POST(url, data);
      handleResponse(response);
      return response;
    },
  },
});
