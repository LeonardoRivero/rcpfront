import {
  IPhysicalExamRequest,
  IPhysicalExamResponse,
  ISpeciality,
} from 'src/Domine/models/IConsults';
import { DataTableService } from 'src/services/DataTableService';
import { useStorePhysicalExamParameter } from 'src/services/PhysicalExamService';

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

// export class ConcreteSubject implements Subject {
//   public state = 0;

//   private observers: Observer[] = [];

//   public attach(observer: Observer): void {
//     const isExist = this.observers.includes(observer);
//     if (isExist) {
//       return console.log('Subject: Observer has been attached already.');
//     }

//     console.log('Subject: Attached an observer.');
//     this.observers.push(observer);
//   }

//   public detach(observer: Observer): void {
//     const observerIndex = this.observers.indexOf(observer);
//     if (observerIndex === -1) {
//       return console.log('Subject: Nonexistent observer.');
//     }

//     this.observers.splice(observerIndex, 1);
//     console.log('Subject: Detached an observer.');
//   }

//   public notify(data): void {
//     console.log('Subject: Notifying observers...');
//     for (const observer of this.observers) {
//       observer.update(this, data);
//     }
//   }

//   public someBusinessLogic(): void {
//     console.log("\nSubject: I'm doing something important.");
//     this.state = Math.floor(Math.random() * (10 + 1));

//     console.log(`Subject: My state has just changed to: ${this.state}`);
//     this.notify();
//   }
// }

export interface Observer {
  handleNotification(subject: Subject, data: object): void;
}

export class TableObserver implements Observer {
  // public update(subject: Subject): void {
  //   if (subject instanceof DataTableService && subject.state < 3) {
  //     console.log('ConcreteObserverA: Reacted to the event.');
  //   }
  // }
  private store = useStorePhysicalExamParameter();
  public handleNotification(subject: Subject, data: object): void {
    const isInstance = subject instanceof DataTableService;
    if (isInstance == false) {
      throw Error('Instancia no admitida');
    }
    this.store.currentPhysicalExamParameter = data as IPhysicalExamRequest;
    // console.log('ConcreteObserverA', subject.store);
    // const t = subject.store.option;
    if (<IPhysicalExamResponse>data === ({} as IPhysicalExamResponse)) {
      console.log('object', 'ok');
    }
    if (<Array<ISpeciality>>data == ([] as Array<ISpeciality>)) {
      console.log('object', 'ok');
    }
  }
}
