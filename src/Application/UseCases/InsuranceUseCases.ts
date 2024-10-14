import { HealthInsuranceResponse } from 'src/Domine/Responses';
import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';

export class GetAllInsuranceUseCase implements IUseCase<void, HealthInsuranceResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.INSURANCE}`;
  }
  async execute(): Promise<HealthInsuranceResponse[]> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    return await response.json()
  }

}
