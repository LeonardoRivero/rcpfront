import { HTTPClient, IMediatorUseCases, IUseCase } from 'src/Domine/IPatterns';
import { GenderResponse, IDTypeResponse } from 'src/Domine/Responses';
import { GetAllDocumentTypeUseCase } from '../Services/IDTypeService';
import { GetAllGenderUseCase } from '../Services';



export class MediatorUseCases implements IMediatorUseCases {

  private getAllDocumentTypeUseCase: IUseCase<void, IDTypeResponse[]>
  private getAllGenderUseCase: IUseCase<void, GenderResponse[]>

  constructor(httpClient: HTTPClient) {
    this.getAllDocumentTypeUseCase = new GetAllDocumentTypeUseCase(httpClient)
    this.getAllGenderUseCase = new GetAllGenderUseCase(httpClient)

  }

  async getAllDocumentType(): Promise<IDTypeResponse[]> {
    return await this.getAllDocumentTypeUseCase.execute()
  }

  async getAllGender(): Promise<GenderResponse[]> {
    return await this.getAllGenderUseCase.execute()
  }
}

