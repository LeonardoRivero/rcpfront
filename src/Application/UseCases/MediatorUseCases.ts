import { HTTPClient, IMediatorUseCases, IUseCase } from 'src/Domine/IPatterns';
import { AttentionScheduleMedicalResponse, DocumentTypeResponse, GenderResponse, MedicalOfficeResponse, PatientResponse, SpecialityResponse, } from 'src/Domine/Responses';
import { GetAllDocumentTypeUseCase } from '../Services/IDTypeService';
import { GetAllGenderUseCase } from '../Services';
import { GetAttenttionMedicalOfficeUseCase, GetMedicalOfficeBelongToUserUseCase } from './MedicalOfficeUseCase';
import { GetSpecialityBelongToMedicalOfficeUseCase } from './SpecialityUseCases';
import { FindPatientByIdentificationUseCase } from './PatientUseCases';

export class MediatorUseCases implements IMediatorUseCases {

  private getAllDocumentTypeUseCase: IUseCase<void, DocumentTypeResponse[]>
  private getAllGenderUseCase: IUseCase<void, GenderResponse[]>
  private getMedicalOfficeBelongToUserUseCase: IUseCase<string, MedicalOfficeResponse[]>
  private getAttenttionMedicalOfficeUseCase: IUseCase<number, AttentionScheduleMedicalResponse | null>
  private getSpecialityBelongToMedicalOfficeUseCase: IUseCase<number, SpecialityResponse[]>
  private findPatientByIdentificationUseCase: IUseCase<string, PatientResponse | null>

  constructor(httpClient: HTTPClient) {
    this.getAllDocumentTypeUseCase = new GetAllDocumentTypeUseCase(httpClient)
    this.getAllGenderUseCase = new GetAllGenderUseCase(httpClient)
    this.getMedicalOfficeBelongToUserUseCase = new GetMedicalOfficeBelongToUserUseCase(httpClient)
    this.getAttenttionMedicalOfficeUseCase = new GetAttenttionMedicalOfficeUseCase(httpClient)
    this.getSpecialityBelongToMedicalOfficeUseCase = new GetSpecialityBelongToMedicalOfficeUseCase(httpClient)
    this.findPatientByIdentificationUseCase = new FindPatientByIdentificationUseCase(httpClient)
  }

  async getAttentionMedicalOffice(request: number): Promise<AttentionScheduleMedicalResponse | null> {
    return await this.getAttenttionMedicalOfficeUseCase.execute(request)
  }

  async getAllDocumentType(): Promise<DocumentTypeResponse[]> {
    return await this.getAllDocumentTypeUseCase.execute()
  }

  async getAllGender(): Promise<GenderResponse[]> {
    return await this.getAllGenderUseCase.execute()
  }

  async getMedicalOfficeBelongToUser(request: string): Promise<MedicalOfficeResponse[]> {
    return await this.getMedicalOfficeBelongToUserUseCase.execute(request)
  }

  async getSpecialityBelongToMedicalOffice(request: number): Promise<SpecialityResponse[]> {
    return await this.getSpecialityBelongToMedicalOfficeUseCase.execute(request)
  }

  async findPatientByIdentification(request: string): Promise<PatientResponse | null> {
    return await this.findPatientByIdentificationUseCase.execute(request)
  }
}

