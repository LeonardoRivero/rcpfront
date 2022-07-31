import { createApp } from 'vue';
import App from './App.vue';
import instance from 'stores/index';
import { useCounterStore } from 'src/stores/example-store';
import { HttpResponse } from 'src/scripts/Request';

const store = useCounterStore();

export interface ISpeciality {
  id?: number;
  description: string;
}
export interface IDXMainCodeRequest {
  id?: number;
  CUP: string;
  description: string;
  speciality: number;
}
export interface IDXMainCodeResponse {
  id?: number;
  CUP: string;
  description: string;
  speciality: ISpeciality;
}
export interface Forms {
  visible: boolean;
  title: string;
  data: object;
}

export class Specialities implements ISpeciality {
  id = undefined;
  description = '';

  public add(description: string): Promise<HttpResponse<unknown>> {
    const data = { description: description } as ISpeciality;
    const response = store.createSpeciality(data);
    return response;
  }
  public edit(speciality: ISpeciality): Promise<HttpResponse<unknown> | null> {
    const response = store.updateSpeciality(speciality);
    return response;
  }
  public default(): ISpeciality {
    const data = {} as ISpeciality;
    return data;
  }
}
export class DXMainCode implements IDXMainCodeRequest {
  id = undefined;
  CUP = '';
  description = '';
  speciality = {} as number;

  public add(description: string): Promise<HttpResponse<unknown>> {
    const data = { description: description };
    const response = store.createSpeciality(data);
    return response;
  }

  public default(): IDXMainCodeRequest {
    const data = {} as IDXMainCodeRequest;
    console.log('first');
    return data;
  }
}
