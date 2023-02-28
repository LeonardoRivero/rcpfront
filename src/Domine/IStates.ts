import { PathologicalHistoryResponse } from './Responses';

export interface PreliminaryDataState {
  allPathologies: Array<PathologicalHistoryResponse>;
  items: Array<unknown>;
  reasonConsultation: string;
  pathology: PathologicalHistoryResponse | null;
}
