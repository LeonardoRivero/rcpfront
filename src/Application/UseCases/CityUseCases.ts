import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { CityResponse } from 'src/Domine/Responses';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class GetAllCityUseCase implements IUseCase<void, CityResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.CITY}`;
    this.url = ENDPOINTS.CITY
  }
  async execute(): Promise<Array<CityResponse>> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    return await response.json()
  }

}
