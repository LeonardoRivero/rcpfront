import { Observer } from 'src/patterns/Observer/Observer';
import { IKeyEmailRegistration, IUser } from './ModelsDB';
import { RegisterResponse } from './Responses';
import { QTableProps } from 'quasar';
export interface IColumnsDataTable {
  name: string;
  label: string;
  field: string;
  required?: boolean;
  align?: 'left' | 'right' | 'center';
  sortable: boolean;
  format?: any;
  style?: string;
  classes?: string;
  headerStyle?: string;
  headerClasses?: string;
}
export interface ITableSelect {
  optionValue: string;
  optionLabel: string;
  listOptions: Array<object>;
  label: string;
  style: string;
}
export type SelectionRow = 'none' | 'single' | 'multiple' | undefined;

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
  columns: Array<IColumnsDataTable> | undefined;
  rows: any[] | undefined;
  enableSearch?: boolean;
  tableProps: QTableProps;
  selectionRow: SelectionRow;
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
export interface IPermission {
  canGet: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canCreate: boolean;
}

export interface IUserService {
  register(user: IUser): Promise<RegisterResponse | null>;
  confirmEmailRegistration(key: IKeyEmailRegistration): Promise<Response>;
  changePassword(user: IUser): Promise<void>;
}
