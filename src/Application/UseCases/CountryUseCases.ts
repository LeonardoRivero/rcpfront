import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { CountryResponse } from 'src/Domine/Responses';

export class GetAllCountryUseCase implements IUseCase<void, CountryResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.COUNTRIES}`;
  }
  async execute(): Promise<Array<CountryResponse>> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    return await response.json()
  }

}
