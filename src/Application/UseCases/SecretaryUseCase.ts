import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { NewOrEditSecretaryRequest } from 'src/Domine/Request';
import { ResponseData, SecretaryResponse } from 'src/Domine/Responses';
import HttpStatusCode from '../Utilities/HttpStatusCodes';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class CreateSecretaryUseCase implements IUseCase<NewOrEditSecretaryRequest, SecretaryResponse | null> {
  private url: string
  constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.SECRETARY}`;
    this.url = ENDPOINTS.SECRETARY.root
  }

  async execute(payload: NewOrEditSecretaryRequest): Promise<SecretaryResponse | null> {
    if (payload.medicalOffice.length == 0) {
      throw new EvalError('Secretary medical office cant be empty')
    }
    const response = await this.httpClient.POST(this.url, payload);
    if (!response.ok && response.status !== HttpStatusCode.FOUND) {
      return null;
    }
    const doctorResponse: ResponseData<SecretaryResponse> = await response.json();
    return doctorResponse.result;
  }
}

export class GetSecretaryByUserIdUseCase implements IUseCase<string, SecretaryResponse | null> {
  private url: string
  constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.SECRETARY}${'byUser'}`;
    this.url = ENDPOINTS.SECRETARY.byUser
  }

  async execute(userId: string): Promise<SecretaryResponse | null> {
    const params = { userId: userId }
    const response = await this.httpClient.GET(this.url, params);
    if (!response.ok && response.status !== HttpStatusCode.FOUND) {
      return null;
    }
    const doctorResponse: ResponseData<SecretaryResponse> = await response.json();
    return doctorResponse.result;
  }
}
