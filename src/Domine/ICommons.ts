import { Observer } from './IPatterns';
import { ConfirmEmailRequest, IUser } from './Request';
import { RegisterResponse } from './Responses';
export interface IColumnsDataTable {
  name: string;
  label: string;
  field: string;
  required?: boolean;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  format?: any;
  style?: string;
  classes?: string;
  headerStyle?: string;
  headerClasses?: string;
  actions?: string;
}
export interface ITableSelect {
  optionValue: string;
  optionLabel: string;
  listOptions: Array<object>;
  label: string;
  style: string;
}
export type SelectionRow = 'none' | 'single' | 'multiple' | undefined;

export enum TableType {
  simple = 'simple',
  withActions = 'withActionButtons',
  fetchServer = 'FilterFetchServer',
}

export class TableSelect implements ITableSelect {
  optionValue = 'none';
  optionLabel = 'none';
  listOptions = [] as Array<object>;
  label = 'Seleccione';
  style = 'min-width: 30%';
}

export interface IPaginationDataTable {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber: number;
}
export interface ITableOptions {
  showButtonActions: boolean;
  ///Similar to QTableProps
  rows: any[] | undefined;
  rowKey: string;
  virtualScroll?: boolean | undefined;
  color?: string | undefined;
  dense?: boolean | undefined;
  columns: Array<IColumnsDataTable> | undefined;
  title: string;
  enableSearch?: boolean;
  selectionRow: SelectionRow;
  enableSelect?: boolean;
  select: TableSelect;
  textCite: string;
  observer: Observer | null;
  tableType: TableType;
  pagination?: IPaginationDataTable;
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

export interface ICreateUser {
  register(user: IUser): Promise<RegisterResponse | null>;
  confirmEmailRegistration(key: ConfirmEmailRequest): Promise<Response>;
  changePassword(user: IUser): Promise<void>;
}

export interface IHelpers {
  formatToMoneyString(value: string): string
  getValueFromString(value: string | null): number
  calculateAge(dateBirth: string): string
}
