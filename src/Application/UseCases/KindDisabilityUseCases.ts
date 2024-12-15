import { KindDisabilityResponse } from 'src/Domine/Responses';
import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class GetAllKindDisabilityUseCase implements IUseCase<void, KindDisabilityResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.KINDDISABILITY}`;
    this.url = ENDPOINTS.KINDDISABILITY.root
  }
  async execute(): Promise<KindDisabilityResponse[]> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    return await response.json()
  }

}
