import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { PhoneCodeResponse } from 'src/Domine/Responses';


export class GetAllPhoneCodeUseCase implements IUseCase<void, PhoneCodeResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.PHONECODE}`;
  }
  async execute(): Promise<Array<PhoneCodeResponse>> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    return await response.json()
  }

}
