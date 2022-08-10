import { defineStore } from 'pinia';
import {
  GET,
  POST,
  PUT,
  handleResponse,
  HttpResponse,
} from 'src/scripts/Request';
import { IPatient } from 'src/interfaces/IModels';
import { EndPoints } from 'src/scripts/Constants';

const endpoint = new EndPoints();

export const useStorePatients = defineStore('patients', {
  state: () => ({
    currentPatient: {} as IPatient | null,
  }),
});
