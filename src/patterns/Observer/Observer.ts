export abstract class Subject {
  attach(observer: Observer): void {
    return;
  }
  detach(observer: Observer): void {
    return;
  }
  notify(data: object): void {
    return;
  }
}
export interface Observer {
  handleNotification(subject: Subject, data: object): void;
}
