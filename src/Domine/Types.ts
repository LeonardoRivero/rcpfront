import { PhysicalExamResultResponse } from './Responses';
export type UpdateFunction = (callback: () => void) => void;
export type PhysicalExamResume = {
  year: string;
  results: Array<PhysicalExamResultResponse>;
};

export enum ModalType {
  SweetAlert = 'SweetAlert',
  NotifyQuasar = 'NotifyQuasar',
  ModalQuasar = 'ModalQuasar',
  DrawAttention = 'DrawAttention',
}

export type NotificationType =
  | 'info'
  | 'warning'
  | 'success'
  | 'error'
  | 'question';


export enum GroupUser {
  DOCTOR = 'Doctor',
  SECRETARY = 'Secretary',
  ADMIN = 'Admin'
}
