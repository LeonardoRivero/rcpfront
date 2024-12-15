import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { ZoneStayResponse } from 'src/Domine/Responses';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class GetAllZoneStayUseCase implements IUseCase<void, ZoneStayResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.ZONE_STAY}`;
    this.url = ENDPOINTS.ZONE_STAY.root
  }
  async execute(): Promise<Array<ZoneStayResponse>> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    return await response.json()
  }
}
