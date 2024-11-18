import { defineStore } from 'pinia';
import FullCalendar from '@fullcalendar/vue3/dist/FullCalendar';
import { GetAllGenderUseCase } from 'src/Application/Services';
import { GetAllDocumentTypeUseCase } from 'src/Application/Services/IDTypeService';
import { GetAllBiologicalSexUseCase } from 'src/Application/UseCases/BiologicalSexUseCase';
import { GetAllCityUseCase } from 'src/Application/UseCases/CityUseCases';
import { GetAllCountryUseCase } from 'src/Application/UseCases/CountryUseCases';
import { GetAllEthnicityUseCase } from 'src/Application/UseCases/EthnicityUseCase';
import { GetAllInsuranceUseCase } from 'src/Application/UseCases/InsuranceUseCases';
import { GetAllKindDisabilityUseCase } from 'src/Application/UseCases/KindDisabilityUseCases';
import { GetAllOcupationUseCase } from 'src/Application/UseCases/OcupationUseCases';
import { GetAllPhoneCodeUseCase } from 'src/Application/UseCases/PhoneCodeUseCase';
import { GetAllSpecialityUseCase } from 'src/Application/UseCases/SpecialityUseCases';
import { GetAllZoneStayUseCase } from 'src/Application/UseCases/ZoneStayUseCase';
import { DIVIPOLADTO, StateDTO, TownDTO } from 'src/Domine/DTOs';
import { HTTPClient, IHandleGlobalState, IUseCase } from 'src/Domine/IPatterns';
import { IGlobalState } from 'src/Domine/IStores';
import { BiologicalSexResponse, CityResponse, CountryResponse, EthicityResponse, GenderResponse, HealthInsuranceResponse, DocumentTypeResponse, KindDisabilityResponse, OcupationResponse, PhoneCodeResponse, ZoneStayResponse, SpecialityResponse, RoleResponse, MedicalOfficeResponse, PaymentOptionsResponse, MedicalEntryResponse } from 'src/Domine/Responses';
import { GetAllPaymentOptionUseCase } from 'src/Application/UseCases/PaymentOptionsUseCases';
import { GetAllMedicalEntryUseCase } from 'src/Application/UseCases/MedicalEntryUseCases';


export class HandleGlobalState implements IHandleGlobalState {
  public store: IGlobalState;
  private static instance: HandleGlobalState;
  private getAllCountriesUseCase: IUseCase<void, CountryResponse[]>
  private getAllOcupationUseCase: IUseCase<void, OcupationResponse[]>
  private getAllCitiesUseCase: IUseCase<void, CityResponse[]>
  private getAllInsuranceUseCase: IUseCase<void, HealthInsuranceResponse[]>
  private getAllEthnicityUseCase: IUseCase<void, EthicityResponse[]>
  private getAllKindDisabilityUseCase: IUseCase<void, KindDisabilityResponse[]>
  private getAllPhoneCodeUseCase: IUseCase<void, PhoneCodeResponse[]>
  private getAllBiologicalSexUseCase: IUseCase<void, BiologicalSexResponse[]>
  private getAllZoneStayUseCase: IUseCase<void, ZoneStayResponse[]>
  private getAllDocumentTypeUseCase: IUseCase<void, DocumentTypeResponse[]>
  private getAllGenderUseCase: IUseCase<void, GenderResponse[]>
  private getAllSpecialityUseCase: IUseCase<void, SpecialityResponse[]>
  private getAllpaymentOptionUseCase: IUseCase<void, PaymentOptionsResponse[]>
  private getAllMedicalEntryUseCase: IUseCase<void, MedicalEntryResponse[]>
  // private getAllGroupsUseCase: IUseCase<string, RoleResponse[]>

  private constructor(httpClient: HTTPClient) {
    this.store = this.createStore();
    this.getAllCountriesUseCase = new GetAllCountryUseCase(httpClient)
    this.getAllOcupationUseCase = new GetAllOcupationUseCase(httpClient)
    this.getAllCitiesUseCase = new GetAllCityUseCase(httpClient)
    this.getAllInsuranceUseCase = new GetAllInsuranceUseCase(httpClient)
    this.getAllEthnicityUseCase = new GetAllEthnicityUseCase(httpClient)
    this.getAllKindDisabilityUseCase = new GetAllKindDisabilityUseCase(httpClient)
    this.getAllPhoneCodeUseCase = new GetAllPhoneCodeUseCase(httpClient)
    this.getAllBiologicalSexUseCase = new GetAllBiologicalSexUseCase(httpClient)
    this.getAllZoneStayUseCase = new GetAllZoneStayUseCase(httpClient)
    this.getAllDocumentTypeUseCase = new GetAllDocumentTypeUseCase(httpClient)
    this.getAllGenderUseCase = new GetAllGenderUseCase(httpClient)
    this.getAllSpecialityUseCase = new GetAllSpecialityUseCase(httpClient)
    this.getAllpaymentOptionUseCase = new GetAllPaymentOptionUseCase(httpClient)
    this.getAllMedicalEntryUseCase = new GetAllMedicalEntryUseCase(httpClient)
    // this.getAllGroupsUseCase = new GetAllGroupsUseCase(httpClient)
  }
  public static getInstance(httpClient: HTTPClient): HandleGlobalState {
    if (!HandleGlobalState.instance) {
      HandleGlobalState.instance = new HandleGlobalState(httpClient);
    }
    return HandleGlobalState.instance;
  }

  public createStore() {
    const store = defineStore({
      id: 'globalState',
      state: (): IGlobalState => ({
        allCountries: <CountryResponse[]>[],
        allOcupations: <OcupationResponse[]>[],
        allCities: <CityResponse[]>[],
        allHealhEntity: <HealthInsuranceResponse[]>[],
        allEthnicity: <EthicityResponse[]>[],
        allKindDisability: <KindDisabilityResponse[]>[],
        allPhoneCode: <PhoneCodeResponse[]>[],
        allBiologicalSex: <BiologicalSexResponse[]>[],
        allZoneStay: <ZoneStayResponse[]>[],
        allDocumentType: [],
        allGender: [],
        allSpecialities: [],
        DIVIPOLA: <DIVIPOLADTO>{},
        currentMedicalOffice: [],
        allPaymentOption: [],
        allMedicalEntry: [],
        calendar: {} as InstanceType<typeof FullCalendar>,
      }),
      persist: true,
    });
    return store();
  }

  public async getAllPaymentOptions(): Promise<PaymentOptionsResponse[]> {
    if (this.store.allPaymentOption.length != 0) {
      return this.store.allPaymentOption;
    }
    const response = await this.getAllpaymentOptionUseCase.execute();
    this.store.allPaymentOption = response;
    return response;
  }

  public refecthEvents(): void {
    const apiCalendar = this.store.calendar.getApi();
    apiCalendar.refetchEvents();
  }

  public async getAllSpecialities(): Promise<SpecialityResponse[]> {
    if (this.store.allSpecialities.length != 0) {
      return this.store.allSpecialities;
    }
    const response = await this.getAllSpecialityUseCase.execute();
    this.store.allSpecialities = response;
    return response;
  }

  public async getAllZoneStay(): Promise<ZoneStayResponse[]> {
    if (this.store.allZoneStay.length != 0) {
      return this.store.allZoneStay;
    }
    const response = await this.getAllZoneStayUseCase.execute();
    this.store.allZoneStay = response;
    return response;
  }

  public async getAllPhoneCodes(): Promise<PhoneCodeResponse[]> {
    if (this.store.allPhoneCode.length != 0) {
      return this.store.allPhoneCode;
    }
    const response = await this.getAllPhoneCodeUseCase.execute();
    this.store.allPhoneCode = response;
    return response;
  }

  public async getAllEthnicity(): Promise<EthicityResponse[]> {
    if (this.store.allEthnicity.length != 0) {
      return this.store.allEthnicity;
    }
    const response = await this.getAllEthnicityUseCase.execute();
    this.store.allEthnicity = response;
    return response;
  }

  public async getAllCountries(): Promise<CountryResponse[]> {
    if (this.store.allCountries.length != 0) {
      return this.moveToFirstCountry(this.store.allCountries);
    }
    const response = await this.getAllCountriesUseCase.execute();
    this.store.allCountries = this.moveToFirstCountry(response);
    return response;
  }

  public async getAllHealthEntity(): Promise<HealthInsuranceResponse[]> {
    if (this.store.allHealhEntity.length != 0) {
      return this.store.allHealhEntity;
    }
    const response = await this.getAllInsuranceUseCase.execute();
    this.store.allHealhEntity = response;
    return response;
  }

  async getAllOcupation(): Promise<OcupationResponse[]> {
    if (this.store.allOcupations.length != 0) {
      return this.store.allOcupations;
    }
    const response = await this.getAllOcupationUseCase.execute()
    this.store.allOcupations = response;
    return response;
  }

  async getAllKindDisability(): Promise<KindDisabilityResponse[]> {
    if (this.store.allKindDisability.length != 0) {
      return this.store.allKindDisability;
    }

    const response = await this.getAllKindDisabilityUseCase.execute()
    const index = this.store.allKindDisability.findIndex(item => item.code.toLowerCase() === '08');
    if (index !== -1) {
      const [item] = this.store.allKindDisability.splice(index, 1);
      this.store.allKindDisability.unshift(item);
    }

    this.store.allKindDisability = response;
    return response;
  }

  async getAllCities(): Promise<DIVIPOLADTO> {
    if (this.store.allCities.length == 0) {
      const allCities = await this.getAllCitiesUseCase.execute()
      this.store.allCities = allCities
    }

    const setState: StateDTO[] = Array.from(
      new Set(this.store.allCities.map(({ state, codeState }) => JSON.stringify({ state, codeState })))
    ).map(item => JSON.parse(item));

    const setCities: TownDTO[] = Array.from(
      new Set(this.store.allCities.map(({ town, codeTown, codeState, id }) => JSON.stringify({ town, codeTown, codeState, id })))
    ).map(item => JSON.parse(item));

    const dto: DIVIPOLADTO = {
      state: setState,
      town: setCities
    }
    return dto
  }

  async getAllBiologicalSex(): Promise<BiologicalSexResponse[]> {
    if (this.store.allBiologicalSex.length != 0) {
      return this.store.allBiologicalSex;
    }

    const response = await this.getAllBiologicalSexUseCase.execute()
    this.store.allBiologicalSex = response;
    return response;
  }

  async getAllDocumentType(): Promise<DocumentTypeResponse[]> {
    if (this.store.allDocumentType.length != 0) {
      return this.store.allDocumentType;
    }
    const response = await this.getAllDocumentTypeUseCase.execute()
    this.store.allDocumentType = response
    return response
  }

  async getAllGender(): Promise<GenderResponse[]> {
    if (this.store.allGender.length != 0) {
      return this.store.allGender;
    }
    const response = await this.getAllGenderUseCase.execute()
    this.store.allGender = response
    return response
  }

  private moveToFirstCountry(countries: CountryResponse[]): CountryResponse[] {
    const index = countries.findIndex(item => item.name.toLowerCase() === 'colombia');
    if (index !== -1) {
      const [item] = countries.splice(index, 1);
      countries.unshift(item);
    }
    return countries
  }

  async saveInfoMedicalOffice(medicalOffice: MedicalOfficeResponse[]) {
    this.store.currentMedicalOffice = medicalOffice
  }

  async getAllMedicalEntry(): Promise<MedicalEntryResponse[]> {
    if (this.store.allMedicalEntry.length != 0) {
      return this.store.allMedicalEntry;
    }
    const response = await this.getAllMedicalEntryUseCase.execute()
    this.store.allMedicalEntry = response
    return response
  }
}
