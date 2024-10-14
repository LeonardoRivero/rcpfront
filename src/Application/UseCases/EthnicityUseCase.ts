import { EthicityResponse } from 'src/Domine/Responses';
import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';

export class GetAllEthnicityUseCase implements IUseCase<void, EthicityResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.ETHNICITY}`;
  }
  async execute(): Promise<EthicityResponse[]> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    return await response.json()
  }

}
