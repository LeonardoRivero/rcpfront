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
} from 'src/interfaces/IModels';
import { EndPoints } from 'src/scripts/Constants';

const endpoint = new EndPoints();

export const useCounterStore = defineStore('settings', {
  state: () => ({
    allSpecialities: undefined as Array<ISpeciality> | undefined,
    allDxMainCodes: null as Array<IDXMainCodeResponse> | null,
    currentSpeciality: null as ISpeciality | null,
    currentDxMainCodes: null as Array<IDXMainCodeResponse> | null,
    specialityForm: {} as Forms | undefined,
  }),
  getters: {
    selectedSpeciality(state) {
      if (this.currentSpeciality == null) {
        const data = {} as ISpeciality;
        return data;
      }
      this.currentDxMainCodes = this.dxMainCodeofSpeciality;
      return state.currentSpeciality;
    },
    dxMainCodeofSpeciality: (state) => {
      if (state.allDxMainCodes === null) {
        const data = [{} as IDXMainCodeResponse];
        return data;
      }
      const result = state.allDxMainCodes.filter(
        (dxMainCode) => dxMainCode.speciality.id == state.currentSpeciality?.id
      );
      return result;
    },
  },
  actions: {
    setSpecialityForm(form: Forms): void {
      this.specialityForm = form;
      this.specialityForm.title = form.title;
      if (form.visible === undefined || form.visible === null) {
        this.specialityForm.visible = false;
        return;
      }
      this.specialityForm.visible = true;
    },
    async createSpeciality(data: ISpeciality): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreateSpeciality;
      const response = await POST(url, data);
      handleResponse(response);
      return response;
    },
    async retrieveAllSpecialities(): Promise<HttpResponse<unknown>> {
      const url = endpoint.getORcreateSpeciality;
      const response = await GET(url);
      this.allSpecialities = response.parsedBody as Array<ISpeciality>;
      console.log({ response });
      handleResponse(response);
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
      console.log({ response });
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
  },
});
