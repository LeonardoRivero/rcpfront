import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { OcupationResponse } from 'src/Domine/Responses';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class GetAllOcupationUseCase implements IUseCase<void, OcupationResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.OCUPATION}`;
    this.url = ENDPOINTS.OCUPATION.root
  }
  async execute(): Promise<Array<OcupationResponse>> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    return await response.json()
  }

}
