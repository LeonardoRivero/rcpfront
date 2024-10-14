import { KindDisabilityResponse } from 'src/Domine/Responses';
import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';

export class GetAllKindDisabilityUseCase implements IUseCase<void, KindDisabilityResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.KINDDISABILITY}`;
  }
  async execute(): Promise<KindDisabilityResponse[]> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    return await response.json()
  }

}
