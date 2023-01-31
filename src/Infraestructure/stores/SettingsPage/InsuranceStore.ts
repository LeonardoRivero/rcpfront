import { IHealthInsurance } from 'src/Domine/ModelsDB';
import { defineStore } from 'pinia';
import { QForm } from 'quasar';
import { HealthInsuranceResponse } from 'src/Domine/Responses';

export interface IStoreInsurance {
  allInsurance: Array<HealthInsuranceResponse>;
  currentInsurance: IHealthInsurance;
  form: QForm | null;
  expanded: boolean;
  insurance: HealthInsuranceResponse | null;
  error: boolean;
}
export const useStoreInsurance = defineStore({
  id: 'storeStoreInsurance',
  state: (): IStoreInsurance => ({
    allInsurance: [] as Array<HealthInsuranceResponse>,
    currentInsurance: {} as IHealthInsurance,
    form: null,
    expanded: false,
    error: false,
    insurance: null,
  }),
});
