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
import { DIVIPOLADTO } from 'src/Domine/DTOs';
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
      range: {
        min: 0,
        max: 24
      },
      intervalAppointment: 15
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

    const payload: IMedicalOfficeRequest = {
      address: this.state.address,
      cityId: this.state.town == null ? 0 : this.state.town.id,
      countryId: this.state.country == null ? 0 : this.state.country.id,
      name: this.state.name,
      doctor: [doctor.id],
      phoneNumber: this.state.phoneNumber
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

}
