import { HealthInsuranceResponse, ResponseData } from 'src/Domine/Responses';
import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class GetAllInsuranceUseCase implements IUseCase<void, HealthInsuranceResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.INSURANCE}`;
    this.url = ENDPOINTS.INSURANCE.root
  }
  async execute(): Promise<HealthInsuranceResponse[]> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }

    const { result }: ResponseData<HealthInsuranceResponse[]> = await response.json();
    return result;
  }

}
