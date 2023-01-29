import { IHealthInsurance } from 'src/Domine/ModelsDB';
import { defineStore } from 'pinia';
import { QForm } from 'quasar';

export interface IStoreInsurance {
  allInsurance: Array<IHealthInsurance>;
  currentInsurance: IHealthInsurance;
  form: QForm | null;
  expanded: boolean;
  insurance: IHealthInsurance | null;
  error: boolean;
}
export const useStoreInsurance = defineStore({
  id: 'storeStoreInsurance',
  state: (): IStoreInsurance => ({
    allInsurance: [] as Array<IHealthInsurance>,
    currentInsurance: {} as IHealthInsurance,
    form: null,
    expanded: false,
    error: false,
    insurance: null,
  }),
});
