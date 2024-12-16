import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { PurposeServiceResponse, ResponseData } from 'src/Domine/Responses';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class GetAllPurposeServiceUseCase implements IUseCase<void, PurposeServiceResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    this.url = ENDPOINTS.PURPOSE_SERVICE.root
  }
  async execute(): Promise<PurposeServiceResponse[]> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    const reasonConsult: ResponseData<PurposeServiceResponse[]> = await response.json()
    return reasonConsult.result
  }
}
