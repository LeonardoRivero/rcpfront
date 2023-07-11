import { defineStore } from 'pinia';
import { UserService } from 'src/Application/Services/UserService';
import {
  Controller,
  IControllersMediator,
  StrategyUser,
} from 'src/Domine/IPatterns';
import { IStoreUser } from 'src/Domine/IStores';
import { ILogin, IUser } from 'src/Domine/ModelsDB';
import { AuthResponse } from 'src/Domine/Responses';
import { DoctorStrategy, SecretaryStrategy } from 'src/Domine/StrategyUser';

export const useStoreUser = defineStore({
  id: 'storeUser',
  state: () => ({
    isAuthenticated: false,
  }),
});

export class UserMediator implements IControllersMediator {
  private controllers: Controller[] = [];
  public store: IStoreUser;
  private static instance: UserMediator;
  private userService = new UserService();
  private profilesUser: Record<string, StrategyUser> = {
    Secretaria: new SecretaryStrategy(),
    Doctor: new DoctorStrategy(),
  };

  private constructor() {
    this.store = this.createStore();
  }

  public createStore() {
    const store = defineStore({
      id: 'useStoreSettings',
      state: (): IStoreUser => ({
        user: {} as IUser,
        token: {} as AuthResponse,
        isAuthenticated: false,
        changePassword: false,
      }),
    });
    return store();
  }

  public getStore(): IStoreUser {
    return this.store;
  }

  public static getInstance(): UserMediator {
    if (!UserMediator.instance) {
      UserMediator.instance = new UserMediator();
    }
    return UserMediator.instance;
  }

  public add(controller: Controller): void {
    const isExist = this.controllers.includes(controller);
    if (isExist) {
      return;
    }
    controller.setMediator(this);
    this.controllers.push(controller);
  }

  public notify(data: IUser, sender: Controller): void {
    for (const controller of this.controllers) {
      if (controller !== sender) {
        controller.receiveData(this);
      }
    }
  }

  public clearAll() {
    for (const controller of this.controllers) {
      controller.clear();
    }
  }

  public handleData(): void {
    // for (const controller of this.controllers) {
    //   controller.receiveData(this.store);
    // }
    // this.notify(this.store);
  }
  // public login(): void {
  //   const payload: ILogin = {
  //     email: 'carmen@yopmail.com',
  //     password: 'Rock1989#',
  //   };
  //   this.userService.login(payload);
  // }
}
