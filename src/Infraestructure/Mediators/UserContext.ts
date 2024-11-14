import { defineStore } from 'pinia';
import { GetDoctorByUserIdUseCase } from 'src/Application/UseCases/DoctorUseCase';
import { GetSecretaryByUserIdUseCase } from 'src/Application/UseCases/SecretaryUseCase';
// import { CreateUser } from 'src/Application/Services/CreateUser';
import { HTTPClient, IHandleUserState, IUseCase, StrategyUser } from 'src/Domine/IPatterns';
import { IStoreUser } from 'src/Domine/IStores';
import { AuthResponse, DoctorResponse, SecretaryResponse } from 'src/Domine/Responses';
import { GroupUser } from 'src/Domine/Types';
// import {
//   DoctorStrategy,
//   SecretaryStrategy,
//   StrategyUser,
// } from 'src/Domine/StrategyUser';

// export const useStoreUser = defineStore({
//   id: 'storeUser',
//   state: () => ({
//     isAuthenticated: false,
//   }),
// });

// export class UserContext implements IControllersMediator
export class UserContext implements IHandleUserState {
  // private controllers: Controller[] = [];
  private strategy: StrategyUser;
  public store: IStoreUser;
  private static instance: UserContext;
  private httpClient: HTTPClient
  // private CreateUser = new CreateUser();
  // private profilesUser: Record<string, StrategyUser> = {
  //   Secretaria: new SecretaryStrategy(),
  //   Doctor: new DoctorStrategy(),
  // };

  private constructor(httpClient: HTTPClient, strategy: StrategyUser = new GuestStrategy(httpClient)) {
    this.store = this.createStore();
    this.strategy = strategy;
    this.httpClient = httpClient
  }

  public setStrategy(strategy: StrategyUser): void {
    this.strategy = strategy;
  }

  public static getInstance(httpClient: HTTPClient, strategy: StrategyUser = new GuestStrategy(httpClient)): UserContext {
    if (!UserContext.instance) {
      UserContext.instance = new UserContext(httpClient, strategy);
    }
    return UserContext.instance;
  }

  public createStore() {
    const store = defineStore({
      id: 'useUserContext',
      state: (): IStoreUser => ({
        token: {} as AuthResponse,
        isAuthenticated: true,
        changePassword: false,
        email: '',
        userName: '',
        initialLetters: ''
      }),
      persist: true
    });
    return store();
  }

  setRole(roles: string[]): void {
    const validRoles = [GroupUser.DOCTOR.toString(), GroupUser.SECRETARY.toString(), GroupUser.ADMIN.toString()];
    const validFoundRoles = roles.filter(role => validRoles.includes(role));

    if (validFoundRoles.length > 0) {
      const role = validFoundRoles[0];
      switch (role) {
        case GroupUser.ADMIN:
          break;
        case GroupUser.DOCTOR:
          console.log('DOCTOR');
          this.strategy = new DoctorStrategy(this.httpClient);
          break;
        case GroupUser.SECRETARY:
          console.log('SECRETARY');
          this.strategy = new SecretaryStrategy(this.httpClient);
          break;
        default:
          throw new Error('Rol no reconocido');
      }
    } else {
      throw new Error('No se encontraron roles válidos admitidos');
    }
  }

  getInfoUser(): AuthResponse {
    return this.store.token
  }

  saveInfoUser(infoAuthentication: AuthResponse): void {
    this.store.token = infoAuthentication
  }

  saveEmailUser(email: string): void {
    this.store.email = email
  }

  async executeStrategy(): Promise<void> {
    await this.strategy.setPermission(this.store);
    this.store.userName = this.strategy.userName;
    const nameSplitted = this.store.userName.split(' ');
    this.store.initialLetters = nameSplitted
      .map((element) => element[0].toUpperCase())
      .join('');
  }
}

export class SecretaryStrategy implements StrategyUser {
  public userName: string;
  private useCase: IUseCase<string, SecretaryResponse | null>

  public constructor(httpClient: HTTPClient) {
    this.useCase = new GetSecretaryByUserIdUseCase(httpClient)
    this.userName = ''
  }

  public async setPermission(store?: IStoreUser): Promise<void> {
    if (store == undefined) {
      throw Error('Store is undefined');
    }
    const response = await this.useCase.execute(store.token.userId)
    this.userName = response?.name + ' ' + response?.lastName
    // this.store.healthInsurances.canUpdate = false;
    // this.store.healthInsurances.canCreate = false;
    // this.store.doctors.canCreate = false;
    // this.store.doctors.canUpdate = false;
    // this.store.specialities.canCreate = true;
    // this.store.specialities.canUpdate = true;
    // this.store.paymentOptions.canCreate = false;
    // this.store.paymentOptions.canUpdate = false;
    // this.store.dxMainCode.canUpdate = false;
    // this.store.dxMainCode.canCreate = false;
    // this.store.relationCode.canUpdate = false;
    // this.store.relationCode.canCreate = false;
    // this.store.paymentOptions.canCreate = false;
    // this.store.paymentOptions.canUpdate = false;
    // this.store.reasonConsult.canCreate = false;
    // this.store.reasonConsult.canUpdate = false;
  }
}

export class DoctorStrategy implements StrategyUser {
  public userName: string;
  private useCase: IUseCase<string, DoctorResponse | null>

  public constructor(httpClient: HTTPClient) {
    this.useCase = new GetDoctorByUserIdUseCase(httpClient)
    this.userName = ''
  }

  public async setPermission(store?: IStoreUser): Promise<void> {
    if (store == undefined) {
      throw Error('Store is undefined');
    }
    const response = await this.useCase.execute(store.token.userId)
    this.userName = response?.name + ' ' + response?.lastName
    // this.store.paymentOptions.canCreate = false;
    // this.store.paymentOptions.canUpdate = false;
    // this.store.reasonConsult.canCreate = false;
    // this.store.reasonConsult.canUpdate = false;
  }
}

export class GuestStrategy implements StrategyUser {
  userName: string;
  public constructor(httpClient: HTTPClient) {
    this.userName = ''
  }
  setPermission(store: IStoreUser | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
