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
