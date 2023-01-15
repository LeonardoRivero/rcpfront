import { StoreInstance } from '@quasar/app-vite';
import {
  defineStore,
  DefineStoreOptions,
  Store,
  StoreDefinition,
  storeToRefs,
} from 'pinia';
import { ISpeciality } from 'src/Domine/models/IConsults';
import { Messages } from 'src/Application/Utilities/Constants';
import modalService from 'src/services/ModalService';
import { useStoreSettings } from 'src/Infraestructure/stores/storeSettings';
import { ref } from 'vue';
import { IRepository } from '../Application/Repositories/SettingsRepository';
// const store = useStoreSettings();
// const { allSpecialities, currentSpeciality, speciality } = storeToRefs(store);

interface Command {
  execute(): void;
}
interface Service {
  setStore(): void;
}

class ServiceBase {
  setStore(): void {
    throw new Error('Method not implemented.');
  }
}
const serviceModal = modalService();
const messages = Messages.getInstance();
export class SimpleCommand implements Command {
  private payload: string;
  private receiver: Receiver;

  constructor(receiver: Receiver, payload: string) {
    this.payload = payload;
    this.receiver = receiver;
  }

  public execute(): void {
    console.log(
      `SimpleCommand: See, I can do simple things like printing (${this.payload})`
    );
  }
}
export class ComplexCommand implements Command {
  private receiver: Receiver;
  private a: string;

  private b: string;

  constructor(receiver: Receiver, a: string, b: string) {
    this.receiver = receiver;
    this.a = a;
    this.b = b;
  }
  public execute(): void {
    console.log(
      'ComplexCommand: Complex stuff should be done by a receiver object.'
    );
    this.receiver.doSomething(this.a);
    this.receiver.doSomethingElse(this.b);
  }
}
export class GetCommand implements Command {
  // private payload: string;
  private receiver: IRepository<unknown>;
  constructor(receiver: IRepository<unknown>) {
    // this.payload = payload;
    this.receiver = receiver;
  }
  async execute(): Promise<void> {
    const h = await this.receiver.getAll();
    console.log(h);
  }
}
export class UpdateCommand implements Command {
  private payload: string;
  private receiver: IRepository<unknown>;
  constructor(receiver: IRepository<unknown>, payload: string) {
    this.payload = payload;
    this.receiver = receiver;
  }
  execute(): void {
    this.receiver.update(this.payload);
  }
}

type Services = ServiceTest;
export class PostCommand implements Command {
  private payload: object;
  private receiver: Service<Services>;
  private confirm = false;
  constructor(receiver: Service<Services>, payload: object) {
    this.payload = payload;
    this.receiver = receiver;
  }
  async execute(): Promise<void> {
    this.confirm = await serviceModal.showModal(
      'Atención',
      messages.newRegister
    );
    if (this.confirm === false) return;
    this.receiver.create(this.payload);
  }
}

export class ServiceTest extends ServiceBase {
  private store = useStoreSettings();

  setStore(): void {
    const { allDxMainCodes, currentSpeciality } = storeToRefs(this.store);
    allDxMainCodes.value = [];
    currentSpeciality.value;
  }
  public test(): void {
    // const store = useStoreSettings();
    const { allDxMainCodes, currentSpeciality } = storeToRefs(this.store);
    // allDxMainCodes.value = [];
    allDxMainCodes.value;
  }
}
export class Receiver {
  public doSomething(a: string): void {
    console.log(`Receiver: Working on (${a}.)`);
  }

  public doSomethingElse(b: string): void {
    console.log(`Receiver: Also working on (${b}.)`);
  }
}

// export class Invoker {
//   private onStart: Command | undefined;
//   private onFinish: Command | undefined;

//   public setOnStart(command: Command): void {
//     this.onStart = command;
//   }

//   public setOnFinish(command: Command): void {
//     this.onFinish = command;
//   }

//   public doSomethingImportant(): void {
//     console.log('Invoker: Does anybody want something done before I begin?');
//     if (this.isCommand(this.onStart)) {
//       this.onStart.execute();
//     }

//     console.log('Invoker: ...doing something really important...');

//     console.log('Invoker: Does anybody want something done after I finish?');
//     if (this.isCommand(this.onFinish)) {
//       this.onFinish.execute();
//     }
//   }

//   private isCommand(object: Command | undefined): object is Command {
//     return object?.execute !== undefined;
//   }
// }

export class Invoker {
  private commands: Command[] = [];

  add(command: Command) {
    this.commands.push(command);
  }

  executeAll() {
    this.commands.forEach((c) => c.execute());
  }
}

// const invoker = new Invoker();
// const receiver = new Receiver();
// invoker.setOnStart(new SimpleCommand(receiver, 'Say Hi!'));
// invoker.setOnFinish(new ComplexCommand(receiver, 'Send email', 'Save report'));
// invoker.doSomethingImportant();
