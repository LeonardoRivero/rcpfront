import { IPermission } from 'src/Domine/ICommons';
import { UserResponse } from 'src/Domine/Responses';
import { IStorePermissions } from './IStores';

export interface StrategyUser {
  store: IStorePermissions | undefined;
  setPermission(): Promise<void>;
}
export class BasePermission implements IPermission {
  canCreate = true;
  canDelete = false;
  canUpdate = true;
  canGet = true;
}

export class ContextUser {
  private static instance: ContextUser;
  private strategy: StrategyUser;
  private store: IStorePermissions;
  private constructor(strategy?: StrategyUser) {
    this.strategy = strategy!;
    this.store = this.createStore();
  }

  public static getInstance(strategy?: StrategyUser): ContextUser {
    if (!ContextUser.instance) {
      ContextUser.instance = new ContextUser(strategy);
    }
    // ContextUser.instance.createStore(true);
    return ContextUser.instance;
  }
  public createStore() {
    const storePermissions: IStorePermissions = {
      userData: {} as UserResponse,
      specialities: new BasePermission(),
      dxMainCode: new BasePermission(),
      relationCode: new BasePermission(),
      healthInsurances: new BasePermission(),
      doctors: new BasePermission(),
      patients: new BasePermission(),
      patientStatus: new BasePermission(),
      reasonConsult: new BasePermission(),
      paymentOptions: new BasePermission(),
    };

    return storePermissions;
  }
  public setStrategy(strategy: StrategyUser) {
    this.strategy = strategy;
  }

  public setUserData(data: UserResponse) {
    this.store.userData = data;
  }

  public getStore() {
    return this.store;
  }
  public async execute(): Promise<void> {
    this.strategy.store = this.store;
    this.strategy.setPermission();
  }
}

export class SecretaryStrategy implements StrategyUser {
  public store: IStorePermissions | undefined;

  public async setPermission(): Promise<void> {
    if (this.store == undefined) {
      throw Error('Store is undefined');
    }
    this.store.healthInsurances.canUpdate = false;
    this.store.healthInsurances.canCreate = false;
    this.store.doctors.canCreate = false;
    this.store.doctors.canUpdate = false;
    this.store.specialities.canCreate = true;
    this.store.specialities.canUpdate = true;
    this.store.paymentOptions.canCreate = false;
    this.store.paymentOptions.canUpdate = false;
    this.store.dxMainCode.canUpdate = false;
    this.store.dxMainCode.canCreate = false;
    this.store.relationCode.canUpdate = false;
    this.store.relationCode.canCreate = false;
    this.store.paymentOptions.canCreate = false;
    this.store.paymentOptions.canUpdate = false;
    this.store.reasonConsult.canCreate = false;
    this.store.reasonConsult.canUpdate = false;
  }
}
export class DoctorStrategy implements StrategyUser {
  public store: IStorePermissions | undefined;
  public async setPermission(): Promise<void> {
    console.log('doctor');
    if (this.store == undefined) {
      throw Error('Store is undefined');
    }
    this.store.paymentOptions.canCreate = false;
    this.store.paymentOptions.canUpdate = false;
    this.store.reasonConsult.canCreate = false;
    this.store.reasonConsult.canUpdate = false;
  }
}
