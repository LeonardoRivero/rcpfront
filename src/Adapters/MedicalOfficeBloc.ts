import { Messages } from 'src/Application/Utilities/Messages';
import {
  CityResponse,
  CountryResponse,
  DoctorResponse,
  MedicalOfficeResponse,
} from 'src/Domine/Responses';
import { MedicalOfficeState } from 'src/Domine/IStates';
import {
  Bloc,
  IFactoryMethodNotifications,
  IHandleGlobalState,
  IHandleUserState,
  IUseCase,
  Notificator,
  Subject,
} from 'src/Domine/IPatterns';
import { ModalType } from 'src/Domine/Types';
import { IMedicalOfficeRequest } from 'src/Domine/Request';
import { DIVIPOLADTO, OpeningHoursDTO } from 'src/Domine/DTOs';
import { ShowModalEditRegister, ShowModalNewRegister } from 'src/Application/Commands';
import { routerInstance } from 'src/boot/globalRouter';

export class MedicalOfficeBloc extends Bloc<MedicalOfficeState> {
  private notifyQuasar: Notificator;
  private showModalNewMedicalOffice: IUseCase<ModalType, boolean>
  private showModalUpdateMedicalOffice: IUseCase<ModalType, boolean>
  private initialState: MedicalOfficeState
  private static instance: MedicalOfficeBloc
  private constructor(
    factoryNotificator: IFactoryMethodNotifications,
    private createMedicalOfficeUseCase: IUseCase<IMedicalOfficeRequest, MedicalOfficeResponse | null>,
    private updateMedicalOfficeUseCase: IUseCase<IMedicalOfficeRequest, MedicalOfficeResponse | null>,
    private getDoctorByUserIdUseCase: IUseCase<string, DoctorResponse | null>,
    private getMedicalOfficeBelongToUserUseCase: IUseCase<string, MedicalOfficeResponse[]>,
    private getMedicalOfficeByIdUseCase: IUseCase<number, MedicalOfficeResponse | null>
  ) {
    const state: MedicalOfficeState = {
      address: '',
      medicalOfficeResponse: {
        country: {} as CountryResponse,
        city: {} as CityResponse,
      } as MedicalOfficeResponse,
      country: {} as CountryResponse,
      allCities: {} as DIVIPOLADTO,
      state: null,
      town: null,
      name: '',
      phoneNumber: '',
      phoneFormat: null,
      intervalAppointment: 15,
      options: [0, 15, 30, 45],
      openingHoursDTO: [
        { id: 0, nameDay: 'Domingo', start: '08:00', end: '17:00' },
        { id: 1, nameDay: 'Lunes', start: '08:00', end: '17:00' },
        { id: 2, nameDay: 'Martes', start: '08:00', end: '17:00' },
        { id: 3, nameDay: 'Miercoles', start: '08:00', end: '17:00' },
        { id: 4, nameDay: 'Jueves', start: '08:00', end: '17:00' },
        { id: 5, nameDay: 'Viernes', start: '08:00', end: '17:00' },
        { id: 6, nameDay: 'Sabado', start: '08:00', end: '17:00' },
      ],
      medicalOfficeBelongToDoctor: []
    };
    super(state);
    this.initialState = state
    this.notifyQuasar = factoryNotificator.createNotificator(
      ModalType.NotifyQuasar
    );
    this.showModalNewMedicalOffice = new ShowModalNewRegister(factoryNotificator)
    this.showModalUpdateMedicalOffice = new ShowModalEditRegister(factoryNotificator)
  }

  public static getInstance(factoryNotificator: IFactoryMethodNotifications,
    createMedicalOfficeUseCase: IUseCase<IMedicalOfficeRequest, MedicalOfficeResponse | null>,
    updateMedicalOfficeUseCase: IUseCase<IMedicalOfficeRequest, MedicalOfficeResponse | null>,
    getDoctorByUserIdUseCase: IUseCase<string, DoctorResponse | null>,
    getMedicalOfficeBelongToUserUseCase: IUseCase<string, MedicalOfficeResponse[]>,
    getMedicalOfficeByIdUseCase: IUseCase<number, MedicalOfficeResponse | null>) {

    if (!MedicalOfficeBloc.instance) {
      MedicalOfficeBloc.instance = new MedicalOfficeBloc(factoryNotificator, createMedicalOfficeUseCase,
        updateMedicalOfficeUseCase, getDoctorByUserIdUseCase, getMedicalOfficeBelongToUserUseCase, getMedicalOfficeByIdUseCase);
    }
    return MedicalOfficeBloc.instance
  }

  public clear(): void {
    this.changeState({ ...this.initialState, })
  }

  public async saveOrUpdate(handleUserState: IHandleUserState, handleGlobalState: IHandleGlobalState): Promise<MedicalOfficeResponse | null> {
    let response: MedicalOfficeResponse | null = null;
    const doctor = await this.getDoctorByUserIdUseCase.execute(handleUserState.store.token.userId)
    this.notifyQuasar.setType('error');
    if (doctor == null) {
      this.notifyQuasar.show(undefined, Messages.errorMessage)
      return null
    }

    const payload: IMedicalOfficeRequest = {
      address: this.state.address,
      cityId: this.state.town == null ? 0 : this.state.town.id,
      countryId: this.state.country == null ? 0 : this.state.country.id,
      name: this.state.name,
      doctor: [doctor.id],
      phoneNumber: this.state.phoneNumber,
      openingHours: this.state.openingHoursDTO.map(g => ({ dayOfWeek: g.id.toString(), end: g.end, start: g.start })),
      intervalAttention: this.state.intervalAppointment
    }

    if (this.state.medicalOfficeResponse?.id == undefined) {
      const confirm: boolean = await this.showModalNewMedicalOffice.execute(ModalType.SweetAlert)
      if (!confirm) return null
      response = await this.createMedicalOfficeUseCase.execute(payload)
    }
    else {
      payload.id = this.state.medicalOfficeResponse.id;
      const confirm: boolean = await this.showModalUpdateMedicalOffice.execute(ModalType.SweetAlert)
      if (!confirm) return null
      response = await this.updateMedicalOfficeUseCase.execute(payload);
    }

    if (response === null) {
      this.notifyQuasar.show(undefined, Messages.errorMessage);
      return response;
    } else {
      this.notifyQuasar.setType('success');
      this.notifyQuasar.show(undefined, Messages.successMessage);
    }

    if (this.state.medicalOfficeResponse?.id == undefined) {
      handleGlobalState.store.currentMedicalOffice.push(response)
    }
    else {
      const indexToUpdate = handleGlobalState.store.currentMedicalOffice.findIndex(i => i.id == response.id)
      handleGlobalState.store.currentMedicalOffice[indexToUpdate] = response
    }
    routerInstance.push('/medicaloffice')
    return response;
  }

  public async loadInitialData(handleGlobalState: IHandleGlobalState) {
    const country = (await handleGlobalState.getAllCountries())[0] ?? {} as CountryResponse
    const cities = await handleGlobalState.getAllCities();

    this.changeState({
      ...this.state,
      allCities: cities,
      country: country
    })
  }

  public generateInterval(interval: number) {
    this.state.options = [];

    for (let init = 0; init * interval <= 60; init++) {
      this.state.options.push(init * interval);
    }
  }

  public checkIntervalOpeningHours(listOpeningHours: OpeningHoursDTO[]): boolean {
    for (const element of listOpeningHours) {
      const [hs, ms] = element.start.split(':').map(Number);
      const fechaStart = new Date(1970, 0, 1, hs, ms);

      const [he, me] = element.end.split(':').map(Number);
      const fechaEnd = new Date(1970, 0, 1, he, me);

      if (fechaStart > fechaEnd) {
        this.notifyQuasar.setType('error');
        this.notifyQuasar.show(undefined, Messages.intervalHourInvalid)
        return false
      }
    }
    return true
  }

  public async getListMedicalOffice(userId: string) {
    const listMedicalOffice = await this.getMedicalOfficeBelongToUserUseCase.execute(userId)
    this.changeState({ ...this.state, medicalOfficeBelongToDoctor: listMedicalOffice })
  }

  public async redirectToEdition(medicalOfficeId: string) {
    const medicalOffice = await this.getMedicalOfficeByIdUseCase.execute(parseInt(medicalOfficeId))
    if (medicalOffice == null) {
      throw new Error('MedicalOffice was null')
    }
    this.changeState({ ...this.state, medicalOfficeResponse: medicalOffice })
    routerInstance.push('medicaloffice/edit')
  }

  public override async handleNotification<T>(subject: Subject, data: T): Promise<void> {
    const isInstance = subject instanceof NotificatorListMedicalOfficeBloc;
    if (isInstance == false) {
      throw Error('Instancia no admitida');
    }
    const medicalOfficeResponse = <MedicalOfficeResponse>data

    this.changeState({
      ...this.state, medicalOfficeResponse: medicalOfficeResponse,
      name: medicalOfficeResponse.name,
      country: medicalOfficeResponse.country,
      state: medicalOfficeResponse.city,
      town: medicalOfficeResponse.city,
      phoneNumber: medicalOfficeResponse.phoneNumber,
      address: medicalOfficeResponse.address,
      intervalAppointment: medicalOfficeResponse.interval,
      openingHoursDTO: medicalOfficeResponse.attentionScheduleMedicalOffice.map(
        g => (
          {
            id: parseInt(g.daysOfWeek.code),
            nameDay: g.daysOfWeek.nameDay,
            end: g.end,
            start: g.start
          }))
    })
  };
}

export class NotificatorListMedicalOfficeBloc implements Subject {
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

  notify<MedicalOfficeResponse>(data: MedicalOfficeResponse): void {
    for (const observer of this.observers) {
      observer.handleNotification(this, data);
    }
  }
}

export class ListMedicalOfficeBloc extends Bloc<MedicalOfficeState> {
  constructor(
    private getMedicalOfficeBelongToUserUseCase: IUseCase<string, MedicalOfficeResponse[]>,
    private getMedicalOfficeByIdUseCase: IUseCase<number, MedicalOfficeResponse | null>
  ) {
    const state: MedicalOfficeState = {
      address: '',
      medicalOfficeResponse: {
        country: {} as CountryResponse,
        city: {} as CityResponse,
      } as MedicalOfficeResponse,
      country: {} as CountryResponse,
      allCities: {} as DIVIPOLADTO,
      state: null,
      town: null,
      name: '',
      phoneNumber: '',
      phoneFormat: null,
      intervalAppointment: 15,
      options: [0, 15, 30, 45],
      openingHoursDTO: [
        { id: 0, nameDay: 'Domingo', start: '08:00', end: '17:00' },
        { id: 1, nameDay: 'Lunes', start: '08:00', end: '17:00' },
        { id: 2, nameDay: 'Martes', start: '08:00', end: '17:00' },
        { id: 3, nameDay: 'Miercoles', start: '08:00', end: '17:00' },
        { id: 4, nameDay: 'Jueves', start: '08:00', end: '17:00' },
        { id: 5, nameDay: 'Viernes', start: '08:00', end: '17:00' },
        { id: 6, nameDay: 'Sabado', start: '08:00', end: '17:00' },
      ],
      medicalOfficeBelongToDoctor: []
    };
    super(state);
  }
  public async getListMedicalOffice(userId: string) {
    const listMedicalOffice = await this.getMedicalOfficeBelongToUserUseCase.execute(userId)
    this.changeState({ ...this.state, medicalOfficeBelongToDoctor: listMedicalOffice })
  }

  public async redirectToEdition(medicalOfficeId: string) {
    const medicalOffice = await this.getMedicalOfficeByIdUseCase.execute(parseInt(medicalOfficeId))
    if (medicalOffice == null) {
      throw new Error('MedicalOffice was null')
    }
    this.changeState({ ...this.state, medicalOfficeResponse: medicalOffice })
    routerInstance.push('medicaloffice/edit')
  }
}
