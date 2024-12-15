import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { CIE10Response, ResponseData } from 'src/Domine/Responses';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class GetByFilterCIE10UseCase implements IUseCase<string, CIE10Response[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.CIE10}`;
    this.url = ENDPOINTS.CIE10.filter
  }
  async execute(filter: string): Promise<Array<CIE10Response>> {
    // const fullUrl = this.url + 'filter/'
    // const params: any = { filter: filter }
    const response = await this.httpClient.GET(this.url, { filter })
    if (!response.ok) {
      return []
    }
    const listCIE10: ResponseData<CIE10Response[]> = await response.json()
    return listCIE10.result
  }
}
