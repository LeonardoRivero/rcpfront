import { EthicityResponse } from 'src/Domine/Responses';
import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class GetAllEthnicityUseCase implements IUseCase<void, EthicityResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.ETHNICITY}`;
    this.url = ENDPOINTS.ETHNICITY.root
  }
  async execute(): Promise<EthicityResponse[]> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    return await response.json()
  }
}
