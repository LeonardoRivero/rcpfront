import {
  Bloc,
  IFactoryMethodNotifications,
  IHandleGlobalState,
  IMediatorUseCases,
  IUseCase,
  Notificator,
  UseCase,
} from 'src/Domine/IPatterns';
import { routerInstance } from 'src/boot/globalRouter';
import { Messages } from 'src/Application/Utilities';
import { IHealthInsurance, IPatient } from 'src/Domine/Request';
import {
  GenderResponse,
  HealthInsuranceResponse,
  IDTypeResponse,
  PatientResponse,
} from 'src/Domine/Responses';
import { PatientState } from 'src/Domine/IStates';
import { ModalType } from 'src/Domine/Types';
import { EditCommand, ShowModalNewRegister } from 'src/Application/Commands';
import { GenericService } from 'src/Application/Repositories';
import { DIVIPOLADTO } from 'src/Domine/DTOs';

export class PatientFormBloc extends Bloc<PatientState> {
  private sweetAlertModal: Notificator;
  private notifyQuasar: Notificator;
  private showModalNewPatient: IUseCase<ModalType, boolean>

  constructor(
    private factoryNotificator: IFactoryMethodNotifications,
    private service: GenericService<IPatient, PatientResponse>,
    private findPatientByIdentificationUseCase: UseCase<
      string,
      PatientResponse | null
    >,
    private createPatientUseCase: IUseCase<
      IPatient,
      PatientResponse | null
    >,
    private mediatorUseCases: IMediatorUseCases
  ) {
    const state: PatientState = {
      currentPatient: { email: '' } as IPatient,
      allIDTypes: [] as Array<IDTypeResponse>,
      allGenders: [] as Array<GenderResponse>,
      allInsurance: [] as Array<HealthInsuranceResponse>,
      allTown: [],
      allEthnicity: [],
      allKindDisability: [],
      allPhoneFormat: [],
      allBiologicalSex: [],
      identificationPatient: '',
      allCountries: [],
      allCities: {} as DIVIPOLADTO,
      allOcupations: [],
      allZoneStay: [],
      idType: null,
      gender: null,
      insurance: null,
      disable: false,
      error: false,
      currentInsurance: {} as IHealthInsurance,
      countryOrigin: null,
      countryStay: null,
      ocupation: null,
      town: null,
      state: null,
      ethnicity: null,
      kindDisability: null,
      zoneStay: null,
      phoneFormat: null,
      foreignPatient: false,
      lookUpDocumentNumber: '',
      biologicalSex: null
    };
    super(state, mediatorUseCases);
    this.notifyQuasar = this.factoryNotificator.createNotificator(
      ModalType.NotifyQuasar
    );
    this.sweetAlertModal = this.factoryNotificator.createNotificator(
      ModalType.SweetAlert
    );

    this.showModalNewPatient = new ShowModalNewRegister(factoryNotificator)
  }

  clear(): void {
    this.changeState({
      ...this.state,
      currentPatient: {} as IPatient,
      gender: null,
      idType: null,
      insurance: null,
    });
  }

  async searchByIdentificacion(): Promise<PatientResponse | null> {
    const response = await this.findPatientByIdentificationUseCase.execute(
      this.state.identificationPatient
    );
    if (response === null) {
      this.clear();
      this.notifyQuasar.setType('warning');
      this.notifyQuasar.show(undefined, Messages.notInfoFound);
      this.changeState({ ...this.state, disable: false });
      return null;
    }
    this.changeState({
      ...this.state,
      idType: response.IDType,
      insurance: response.insurance,
      gender: response.gender,
      currentPatient: this.responseToEntity(response),
      disable: true,
    });
    return response;
  }

  enableEdition(): void {
    this.changeState({ ...this.state, disable: false });
  }

  private responseToEntity(response: PatientResponse): IPatient {
    const responser = {
      id: response.id,
      name: response.name,
      lastName: response.lastName,
      documentTypeId: response.IDType?.id,
      identification: response.identification,
      dateBirth: response.dateBirth,
      phoneNumber: response.phoneNumber,
      healthEntityId: response.insurance.id,
      genderId: response.gender.id,
      email: response.email,
      biologicalSexId: 0,
      cityStayId: 0

    };
    return responser as IPatient
  }

  async saveOrUpdate(): Promise<PatientResponse | null> {
    if (!this.state.currentPatient) return null;
    let payload: IPatient;
    let response: PatientResponse | null = null;

    if (this.state.currentPatient.id == undefined) {
      delete this.state.currentPatient['id'];
      const payload: IPatient = {
        dateBirth: new Date(this.state.currentPatient.dateBirth).toISOString(),
        email: this.state.currentPatient.email,
        lastName: this.state.currentPatient.lastName,
        name: this.state.currentPatient.name,
        phoneNumber: this.state.currentPatient.phoneNumber,
        healthEntityId: this.state.insurance == null ? 0 : this.state.insurance?.id,
        identification: this.state.identificationPatient,
        genderId: this.state.gender == null ? 0 : this.state.gender?.id,
        documentTypeId: this.state.idType?.id == null ? 0 : this.state.idType.id,
        nationalityId: this.state.countryOrigin?.id == null ? 0 : this.state.countryOrigin.id,
        biologicalSexId: this.state.biologicalSex?.id == null ? 0 : this.state.biologicalSex.id,
        occupationId: this.state.ocupation?.id == null ? 0 : this.state.ocupation.id,
        kindDisabilityId: this.state.kindDisability?.id == null ? 0 : this.state.kindDisability.id,
        countryStayId: this.state.countryStay?.id == null ? 0 : this.state.countryStay.id,
        cityStayId: this.state.town?.id == null ? 0 : this.state.town.id,
        ethnicityId: this.state.ethnicity?.id == null ? 0 : this.state.ethnicity.id,
        zoneStayId: this.state.zoneStay?.id == null ? 0 : this.state.zoneStay.id
      }
      const confirm: boolean = await this.showModalNewPatient.execute(ModalType.SweetAlert)
      if (!confirm) return null
      response = await this.createPatientUseCase.execute(payload)
    }
    else {
      payload = this.state.currentPatient;
      const editCommand = new EditCommand(
        payload,
        this.state.currentPatient.id,
        this.service
      );
      response = <PatientResponse | null>await editCommand.execute();
      editCommand.showNotification(response);
    }

    if (response != null) {
      this.clear();
    }
    else {
      this.notifyQuasar.setType('error')
      this.notifyQuasar.show('', Messages.errorMessage)
    }
    return response;
  }

  // async patientNotFound(): Promise<void> {
  //   this.sweetAlertModal.setType('error');
  //   const confirm = await this.sweetAlertModal.show(
  //     'Error',
  //     Messages.notFoundInfoPatient
  //   );
  //   if (confirm == false) {
  //     return;
  //   }

  //   routerInstance.push('/patient');
  //   return;
  // }

  public async asignPhoneFormat(numericIso: string) {
    const phoneFormat = this.state.allPhoneFormat.find((option) => {
      return option.numericIso == numericIso;
    });

    if (phoneFormat === undefined) return

    this.changeState({
      ...this.state,
      phoneFormat: phoneFormat,
      currentPatient: {
        ...this.state.currentPatient,
        phoneNumber: phoneFormat.format,
      },
    });
  }

  async loadInitialData(handleGlobalState: IHandleGlobalState): Promise<void> {
    const allGenders = await this.mediatorUseCases.getAllGender();
    const allIDTypes = await this.mediatorUseCases.getAllDocumentType();
    const ocupations = await handleGlobalState.getAllOcupation();
    const countries = await handleGlobalState.getAllCountries();
    const cities = await handleGlobalState.getAllCities();
    const allHealhEntity = await handleGlobalState.getAllHealthEntity()
    const allEthnicity = await handleGlobalState.getAllEthnicity()
    const allKindDisability = await handleGlobalState.getAllKindDisability()
    const allPhoneFormat = await handleGlobalState.getAllPhoneCodes()
    const allBiologicalSex = await handleGlobalState.getAllBiologicalSex()
    const allZoneStay = await handleGlobalState.getAllZoneStay()

    this.changeState({
      ...this.state,
      allIDTypes: allIDTypes,
      allGenders: allGenders,
      allCountries: countries,
      allOcupations: ocupations,
      allCities: cities,
      allInsurance: allHealhEntity,
      allEthnicity: allEthnicity,
      allKindDisability: allKindDisability,
      allPhoneFormat: allPhoneFormat,
      allBiologicalSex: allBiologicalSex,
      allZoneStay: allZoneStay
    });
  }
}
