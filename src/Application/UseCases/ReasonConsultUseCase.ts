import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { ReasonConsultResponse, ResponseData } from 'src/Domine/Responses';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class GetAllReasonConsultUseCase implements IUseCase<void, ReasonConsultResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    this.url = ENDPOINTS.REASON_CONSULT.root
  }
  async execute(): Promise<Array<ReasonConsultResponse>> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    const reasonConsult: ResponseData<ReasonConsultResponse[]> = await response.json()
    return reasonConsult.result
  }
}
