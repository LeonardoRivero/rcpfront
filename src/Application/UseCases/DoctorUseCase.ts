import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { NewOrEditDoctorRequest } from 'src/Domine/Request';
import { DoctorResponse, ResponseData } from 'src/Domine/Responses';
import HttpStatusCode from '../Utilities/HttpStatusCodes';

export class CreateDoctorUseCase implements IUseCase<NewOrEditDoctorRequest, DoctorResponse | null> {
  private url: string
  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.DOCTOR}`;
  }

  async execute(payload: NewOrEditDoctorRequest): Promise<DoctorResponse | null> {
    const response = await this.httpClient.POST(this.url, payload);
    if (!response.ok && response.status !== HttpStatusCode.FOUND) {
      return null;
    }
    const doctorResponse: ResponseData<DoctorResponse> = await response.json();
    return doctorResponse.result;
  }
}

export class GetDoctorByUserIdUseCase implements IUseCase<string, DoctorResponse | null> {
  private url: string
  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.DOCTOR}`;
  }

  async execute(userId: string): Promise<DoctorResponse | null> {
    const params = { userId: userId }
    const response = await this.httpClient.GET(this.url, params);
    if (!response.ok && response.status !== HttpStatusCode.FOUND) {
      return null;
    }
    const doctorResponse: ResponseData<DoctorResponse> = await response.json();
    return doctorResponse.result;
  }
}

export class GetDoctorBelongToMedicalOffice implements IUseCase<number, DoctorResponse[]> {
  private url: string
  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.DOCTOR}${'medicaloffice/'}`;
  }
  async execute(medicalofficeId: number): Promise<DoctorResponse[]> {
    const fullUrl = `${this.url}${medicalofficeId.toString()}`;
    const response = await this.httpClient.GET(fullUrl);
    if (!response.ok && response.status !== HttpStatusCode.FOUND) {
      return [];
    }
    const doctorResponse: ResponseData<DoctorResponse[]> = await response.json();
    return doctorResponse.result;
  }

}
