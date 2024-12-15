import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { KinshipResponse, ResponseData } from 'src/Domine/Responses';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class GetAllKinshipUseCase implements IUseCase<void, KinshipResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.KINSHIP}`;
    this.url = ENDPOINTS.KINSHIP.root
  }
  async execute(): Promise<Array<KinshipResponse>> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    const { result }: ResponseData<KinshipResponse[]> = await response.json();
    return result;
  }
}
