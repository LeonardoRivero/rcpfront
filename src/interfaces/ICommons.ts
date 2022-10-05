export interface IQueryParameters {
  parameter: string;
  value: string;
}
export interface Forms {
  visible: boolean;
  title: string;
  data: object;
}
export interface EventSchedule {
  id?: number;
  title: string;
  start: string;
  end: string;
}
export interface IColumnsDataTable {
  name: string;
  required?: boolean;
  label: string;
  align?: string;
  field: string;
  sortable: boolean;
  style?: string;
}
