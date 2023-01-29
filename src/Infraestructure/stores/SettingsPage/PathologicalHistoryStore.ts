import { defineStore } from 'pinia';
import { PathologicalHistoryResponse } from 'src/Domine/Responses';

export interface IStorePathologicalHistory {
  allPathologies: Array<PathologicalHistoryResponse>;
}
export const useStorePathological = defineStore({
  id: 'storePathological',
  state: (): IStorePathologicalHistory => ({
    allPathologies: [] as Array<PathologicalHistoryResponse>,
  }),
});
