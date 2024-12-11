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
} from 'src/Domine/IPatterns';
import { ModalType } from 'src/Domine/Types';
import { IMedicalOfficeRequest } from 'src/Domine/Request';
import { DIVIPOLADTO, OpeningHoursDTO } from 'src/Domine/DTOs';
import { ShowModalEditRegister, ShowModalNewRegister } from 'src/Application/Commands';

export class MedicalOfficeBloc extends Bloc<MedicalOfficeState> {
  private notifyQuasar: Notificator;
  private showModalNewMedicalOffice: IUseCase<ModalType, boolean>
  private showModalUpdateMedicalOffice: IUseCase<ModalType, boolean>
  private initialState: MedicalOfficeState

  constructor(
    factoryNotificator: IFactoryMethodNotifications,
    private createMedicalOfficeUseCase: IUseCase<IMedicalOfficeRequest, MedicalOfficeResponse | null>,
    private updateMedicalOfficeUseCase: IUseCase<IMedicalOfficeRequest, MedicalOfficeResponse | null>,
    private getDoctorByUserIdUseCase: IUseCase<string, DoctorResponse | null>
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
        { id: 0, nameDay: 'Lunes', start: '08:00', end: '17:00' },
        { id: 1, nameDay: 'Martes', start: '08:00', end: '17:00' },
        { id: 2, nameDay: 'Miercoles', start: '08:00', end: '17:00' },
        { id: 3, nameDay: 'Jueves', start: '08:00', end: '17:00' },
        { id: 4, nameDay: 'Viernes', start: '08:00', end: '17:00' },
        { id: 5, nameDay: 'Sabado', start: '08:00', end: '17:00' },
        { id: 6, nameDay: 'Domingo', start: '08:00', end: '17:00' },
      ]
    };
    super(state);
    this.initialState = state
    this.notifyQuasar = factoryNotificator.createNotificator(
      ModalType.NotifyQuasar
    );
    this.showModalNewMedicalOffice = new ShowModalNewRegister(factoryNotificator)
    this.showModalUpdateMedicalOffice = new ShowModalEditRegister(factoryNotificator)
    return;
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

    // const listOpeningHours: OpeningHoursRequest[] = this.state.openingHoursDTO.map(g => ({ dayOfWeekId: g.id, end: g.end, start: g.start }))
    const payload: IMedicalOfficeRequest = {
      address: this.state.address,
      cityId: this.state.town == null ? 0 : this.state.town.id,
      countryId: this.state.country == null ? 0 : this.state.country.id,
      name: this.state.name,
      doctor: [doctor.id],
      phoneNumber: this.state.phoneNumber,
      openingHours: this.state.openingHoursDTO.map(g => ({ dayOfWeekId: g.id, end: g.end, start: g.start }))
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
    handleGlobalState.store.currentMedicalOffice.push(response)
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
    let init = 0;

    while (true) {
      let step = 0;
      step = interval * init;
      if (step > 60) {
        break;
      }
      this.state.options.push(step);
      init++;
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
}
