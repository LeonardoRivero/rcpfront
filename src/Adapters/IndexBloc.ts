import { Bloc, IHandleGlobalState, IUseCase, Subject } from 'src/Domine/IPatterns';
import { IndexState } from 'src/Domine/IStates';
import { ScheduleResponse } from 'src/Domine/Responses';

export class NotificatorIndexBloc implements Subject {
  private observers: Bloc<any>[] = [];
  attach(observer: Bloc<any>): void {
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
  detach(observer: Bloc<any>): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
    console.log('Subject: Detached an observer.');
  }
  notify<ScheduleResponse>(data: ScheduleResponse): void {
    for (const observer of this.observers) {
      observer.handleNotification(this, data);
    }
  }
}

export class IndexBloc extends Bloc<IndexState> {
  private initialState: IndexState = {} as IndexState
  constructor(private getScheduleForMedicalOffice: IUseCase<number[], ScheduleResponse[]>) {
    const state: IndexState = {
      scheduleForMedicalOffice: []
    };
    super(state);
  }

  public clear(): void {
    this.changeState({ ...this.initialState, })
  }

  async loadInitialData(handleGlobalState: IHandleGlobalState): Promise<void> {
    const listIds = handleGlobalState.store.currentMedicalOffice.map(t => t.id)
    const response = await this.getScheduleForMedicalOffice.execute(listIds)
    this.changeState({ ...this.state, scheduleForMedicalOffice: response })
  }
}
