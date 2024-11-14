import { HTTPClient, IMediatorUseCases, IUseCase } from 'src/Domine/IPatterns';
import { DocumentTypeResponse, GenderResponse, MedicalOfficeResponse, } from 'src/Domine/Responses';
import { GetAllDocumentTypeUseCase } from '../Services/IDTypeService';
import { GetAllGenderUseCase } from '../Services';
import { GetMedicalOfficeBelongToUserUseCase } from './MedicalOfficeUseCase';

export class MediatorUseCases implements IMediatorUseCases {

  private getAllDocumentTypeUseCase: IUseCase<void, DocumentTypeResponse[]>
  private getAllGenderUseCase: IUseCase<void, GenderResponse[]>
  private getMedicalOfficeBelongToUserUseCase: IUseCase<string, MedicalOfficeResponse[]>

  constructor(httpClient: HTTPClient) {
    this.getAllDocumentTypeUseCase = new GetAllDocumentTypeUseCase(httpClient)
    this.getAllGenderUseCase = new GetAllGenderUseCase(httpClient)
    this.getMedicalOfficeBelongToUserUseCase = new GetMedicalOfficeBelongToUserUseCase(httpClient)

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
}

