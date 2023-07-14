import { PhysicalExamResultResponse } from './Responses';

export interface PhysicalExamResume {
  year: string;
  results: Array<PhysicalExamResultResponse>;
}
