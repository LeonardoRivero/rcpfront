import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { MedicalOfficeResponse, ResponseData } from 'src/Domine/Responses';
import { IMedicalOfficeRequest } from 'src/Domine/Request';
import HttpStatusCode from '../Utilities/HttpStatusCodes';

export class CreateMedicalOfficeUseCase implements IUseCase<IMedicalOfficeRequest, MedicalOfficeResponse | null> {
  private url: string
  public constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.MEDICAL_OFFICE}`;
  }

  async execute(payload: IMedicalOfficeRequest): Promise<MedicalOfficeResponse | null> {
    const response = await this.httpClient.POST(this.url, payload);
    if (!response.ok) {
      return null;
    }
    const medicaloffice: ResponseData<MedicalOfficeResponse> = await response.json();
    return medicaloffice.result;
  }
}

export class UpdateMedicalOfficeUseCase implements IUseCase<IMedicalOfficeRequest, MedicalOfficeResponse | null> {
  private url: string
  public constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.MEDICAL_OFFICE}`;
  }

  async execute(payload: IMedicalOfficeRequest): Promise<MedicalOfficeResponse | null> {
    const response = await this.httpClient.PUT(`${this.url}${payload.id}`, payload);
    if (!response.ok) {
      return null;
    }
    const patient: MedicalOfficeResponse = await response.json();
    return patient;
  }
}

export class GetMedicalOfficeBelongToUserUseCase implements IUseCase<string, MedicalOfficeResponse[]> {
  private url: string
  public constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.MEDICAL_OFFICE}`;
  }
  async execute(userId: string): Promise<MedicalOfficeResponse[]> {
    const response = await this.httpClient.GET(`${this.url}${'belong'}/${userId}`);
    if (!response.ok || response.status == HttpStatusCode.NO_CONTENT) {
      return [];
    }
    const listMedicalOffice: ResponseData<MedicalOfficeResponse[]> = await response.json();
    return listMedicalOffice.result;
  }
}


