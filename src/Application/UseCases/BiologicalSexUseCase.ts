import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { BiologicalSexResponse } from 'src/Domine/Responses';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class GetAllBiologicalSexUseCase implements IUseCase<void, BiologicalSexResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.BIOLOGICAL_SEX}`;
    this.url = ENDPOINTS.BIOLOGICAL_SEX
  }
  async execute(): Promise<Array<BiologicalSexResponse>> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    return await response.json()
  }

}
