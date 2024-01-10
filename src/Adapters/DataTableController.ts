import { Observer, Subject } from 'src/Domine/IPatterns';
import { DataTableState } from 'src/Domine/IStates';

export class DataTableController implements Subject {
  public state: DataTableState;
  private observers: Observer[] = [];
  private static instance: DataTableController;

  private constructor(state: DataTableState) {
    this.state = state;
    return;
  }

  public static getInstance(state: DataTableState): DataTableController {
    if (!DataTableController.instance) {
      DataTableController.instance = new DataTableController(state);
    }
    DataTableController;
    return DataTableController.instance;
  }

  public attach(observer: Observer | null | undefined): void {
    if (observer == null || observer == undefined) {
      console.log('Subject: Observer has been attached already.');
      return;
    }
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Subject: Observer has been attached already.');
    }
    console.log('Subject: Attached an observer.');
    this.observers.push(observer);
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
    console.log('Subject: Detached an observer.');
  }

  public notify(data: object): void {
    for (const observer of this.observers) {
      observer.handleNotification(this, data);
    }
  }
}
