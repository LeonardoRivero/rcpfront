import { Observer } from 'src/patterns/Observer/Observer';
export interface IColumnsDataTable {
  name: string;
  required?: boolean;
  label: string;
  align?: string;
  field: string;
  sortable: boolean;
  style?: string;
}
export interface ITableSelect {
  optionValue: string;
  optionLabel: string;
  listOptions: Array<object>;
  label: string;
  style: string;
}
export type SelectionType = 'none' | 'single' | 'multiple';

export class TableSelect implements ITableSelect {
  optionValue = 'none';
  optionLabel = 'none';
  listOptions = [] as Array<object>;
  label = 'Seleccione';
  style = 'min-width: 30%';
}

export interface ITableOptions {
  virtualScroll?: boolean;
  title: string;
  columns: Array<IColumnsDataTable>;
  data: unknown;
  enableSearch?: boolean;
  selectionRow: string;
  enableSelect?: boolean;
  select: TableSelect;
  textCite: string;
  observer: Observer | null;
}

// export class TableOptions implements ITableOptions {
//   virtualScroll = false;
//   title = '';
//   columns = [] as Array<IColumnsDataTable>;
//   data = [] as unknown;
//   enableSearch = false;
//   enableSelect = false;
//   selectionRow = 'none';
//   select = new TableSelect();
//   textCite = '';
//   observer: Observer | undefined;
// }
