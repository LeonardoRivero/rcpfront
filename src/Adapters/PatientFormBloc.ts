import {
  Bloc,
  IFactoryMethodNotifications,
  IHandleGlobalState,
  IMediatorUseCases,
  IUseCase,
  Notificator,
} from 'src/Domine/IPatterns';
import { Messages } from 'src/Application/Utilities';
import { IPatient } from 'src/Domine/Request';
import {
  DocumentTypeResponse,
  GenderResponse,
  HealthInsuranceResponse,
  PatientResponse,
} from 'src/Domine/Responses';
import { PatientState } from 'src/Domine/IStates';
import { ModalType } from 'src/Domine/Types';
import { ShowModalEditRegister, ShowModalNewRegister } from 'src/Application/Commands';
import { DIVIPOLADTO } from 'src/Domine/DTOs';

export class PatientFormBloc extends Bloc<PatientState> {
  private notifyQuasar: Notificator;
  private showModalNewPatient: IUseCase<ModalType, boolean>
  private showModalUpdatePatient: IUseCase<ModalType, boolean>

  constructor(
    private factoryNotificator: IFactoryMethodNotifications,
    private findPatientByIdentificationUseCase: IUseCase<
      string,
      PatientResponse | null
    >,
    private createPatientUseCase: IUseCase<
      IPatient,
      PatientResponse | null
    >,
    private mediatorUseCases: IMediatorUseCases,
    private updatePatientUseCase: IUseCase<
      IPatient,
      PatientResponse | null
    >,
  ) {
    const state: PatientState = {
      currentPatient: { email: '' } as IPatient,
      allIDTypes: [] as Array<DocumentTypeResponse>,
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
    this.showModalNewPatient = new ShowModalNewRegister(factoryNotificator)
    this.showModalUpdatePatient = new ShowModalEditRegister(factoryNotificator)
  }

  clear(): void {
    this.changeState({
      ...this.state,
      currentPatient: {} as IPatient,
      gender: null,
      idType: null,
      insurance: null,
      countryOrigin: null,
      countryStay: null,
      ocupation: null,
      town: null,
      state: null,
      ethnicity: null,
      kindDisability: null,
      zoneStay: null,
      phoneFormat: null,
      lookUpDocumentNumber: '',
      biologicalSex: null,
    });
  }

  async searchByIdentificacion(): Promise<PatientResponse | null> {
    const response = await this.findPatientByIdentificationUseCase.execute(
      this.state.lookUpDocumentNumber
    );
    if (response === null) {
      this.clear();
      this.notifyQuasar.setType('warning');
      this.notifyQuasar.show(undefined, Messages.notInfoFound);
      return response;
    }
    this.changeState({
      ...this.state,
      idType: response.documentType,
      insurance: response.healthEntity,
      gender: response.gender,
      currentPatient: this.responseToEntity(response),
      identificationPatient: response.identification,
      biologicalSex: response.biologicalSex,
      ocupation: response.ocupation,
      countryOrigin: response.country,
      countryStay: response.countryStay,
      town: response.cityStay,
      kindDisability: response.kindDisability,
      ethnicity: response.ethnicity,
      zoneStay: response.zoneStay,
      state: response.cityStay
    });
    return response;
  }

  // enableEdition(): void {
  //   this.changeState({ ...this.state, disable: false });
  // }

  private responseToEntity(response: PatientResponse): IPatient {
    const responser: IPatient = {
      id: response.id,
      name: response.name,
      lastName: response.lastName,
      documentTypeId: response.documentType?.id,
      identification: response.identification,
      dateBirth: response.dateBirth,
      phoneNumber: response.phoneNumber,
      healthEntityId: response.healthEntity.id,
      genderId: response.gender.id,
      email: response.email,
      biologicalSexId: response.biologicalSex.id,
      cityStayId: response.cityStay.id,
      countryStayId: response.countryStay.id,
      ethnicityId: response.ethnicity.id,
      kindDisabilityId: response.kindDisability.id,
      nationalityId: response.country.id,
      occupationId: response.ocupation.id,
      zoneStayId: response.zoneStay.id
    };
    return responser
  }

  async saveOrUpdate(): Promise<PatientResponse | null> {
    if (!this.state.currentPatient) return null;
    let response: PatientResponse | null = null;

    const payload: IPatient = {
      dateBirth: new Date(this.state.currentPatient.dateBirth).toISOString(),
      email: this.state.currentPatient.email,
      lastName: this.state.currentPatient.lastName,
      name: this.state.currentPatient.name,
      phoneNumber: this.state.currentPatient.phoneNumber,
      healthEntityId: this.getId(this.state.insurance),
      identification: this.state.identificationPatient,
      genderId: this.getId(this.state.gender),
      documentTypeId: this.getId(this.state.idType),
      nationalityId: this.getId(this.state.countryOrigin),
      biologicalSexId: this.getId(this.state.biologicalSex),
      occupationId: this.getId(this.state.ocupation),
      kindDisabilityId: this.getId(this.state.kindDisability),
      countryStayId: this.getId(this.state.countryStay),
      cityStayId: this.getId(this.state.town),
      ethnicityId: this.getId(this.state.ethnicity),
      zoneStayId: this.getId(this.state.zoneStay),
    }
    if (this.state.currentPatient.id == undefined) {
      delete this.state.currentPatient['id'];

      const confirm: boolean = await this.showModalNewPatient.execute(ModalType.SweetAlert)
      if (!confirm) return null
      response = await this.createPatientUseCase.execute(payload)
    }
    else {
      payload.id = this.state.currentPatient.id
      const confirm: boolean = await this.showModalUpdatePatient.execute(ModalType.SweetAlert)
      if (!confirm) return null
      response = await this.updatePatientUseCase.execute(payload)
    }

    if (response != null) {
      this.notifyQuasar.setType('success')
      this.notifyQuasar.show('', Messages.successMessage)
      this.clear();
    }
    else {
      this.notifyQuasar.setType('error')
      this.notifyQuasar.show('', Messages.errorMessage)
    }
    return response;
  }

  private getId(item: { id?: number } | null): number {
    return item?.id ?? 0;
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
