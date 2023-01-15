import { defineStore } from 'pinia';
import { QForm } from 'quasar';
import { IRelationCode } from 'src/Domine/ModelsDB';
import { RelationCodeResponse } from 'src/Domine/Responses';

export interface IStoreRelationCode {
  allRelationCodes: Array<RelationCodeResponse>;
  currentRelationCode: IRelationCode | null;
  form: QForm | null;
  expanded: boolean;
  relationCode: RelationCodeResponse | null;
  errorDxMainCode: boolean;
  errorSpeciality: boolean;
}
export const useStoreRelationCode = defineStore({
  id: 'storeRelationCode',
  state: () =>
    ({
      allRelationCodes: [],
      currentRelationCode: {} as IRelationCode,
      form: null,
      expanded: false,
      relationCode: null,
      errorDxMainCode: false,
      errorSpeciality: false,
    } as IStoreRelationCode),
});
