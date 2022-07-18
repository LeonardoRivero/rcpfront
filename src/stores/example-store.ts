import { defineStore } from 'pinia';
import { get, handleResponse, http } from 'src/scripts/Request';
import { Speciality } from 'src/interfaces/IConsults';
import { EndPoints } from 'src/scripts/Constants';

const endpoint = new EndPoints();

export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 2,
    allSpecialities: undefined as Array<Speciality> | undefined,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
    async getAllInsurance() {
      const url = endpoint.getORcreateSpeciality;
      const response = await get(url);
      this.allSpecialities = response.parsedBody as Array<Speciality>;
      console.log({ response });
      handleResponse(response);
      return response;
    },
  },
});
