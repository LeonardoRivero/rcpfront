import { defineStore } from 'pinia';
import {
  IColumnsDataTable,
  ITableOptions,
  TableSelect,
} from 'src/Domine/ICommons';

export interface IDataTableStore {
  title: string;
  columns: Array<IColumnsDataTable>;
  data: object;
  listOptions: Array<unknown>;
  option: unknown | null;
  selected: Array<unknown>;
  tableOptions: ITableOptions;
}

export const useStoreDataTable = defineStore({
  id: 'storeDataTable',
  state: () =>
    ({
      title: '',
      visible: false,
      columns: [] as Array<IColumnsDataTable>,
      data: [],
      listOptions: [],
      option: null,
      selected: [] as Array<unknown>,
      tableOptions: {
        virtualScroll: false,
        title: '',
        columns: undefined,
        rows: undefined,
        enableSearch: false,
        enableSelect: false,
        selectionRow: 'none',
        select: new TableSelect(),
        textCite: '',
      } as ITableOptions,
    } as IDataTableStore),
});
