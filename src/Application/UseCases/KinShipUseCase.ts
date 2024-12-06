import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { KinshipResponse, ResponseData } from 'src/Domine/Responses';

export class GetAllKinshipUseCase implements IUseCase<void, KinshipResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.KINSHIP}`;
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
