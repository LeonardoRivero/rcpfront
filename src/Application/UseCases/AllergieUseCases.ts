import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { AllergieResponse, ResponseData } from 'src/Domine/Responses';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class GetAllAllergieUseCase implements IUseCase<void, AllergieResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.ALLERGIE}`;
    this.url = ENDPOINTS.ALLERGE
  }
  async execute(): Promise<Array<AllergieResponse>> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    const allergies: ResponseData<AllergieResponse[]> = await response.json()
    return allergies.result
  }

}
