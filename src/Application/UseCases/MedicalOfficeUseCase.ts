import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { AttentionScheduleMedicalResponse, MedicalOfficeResponse, ResponseData } from 'src/Domine/Responses';
import { AttentionScheduleMedicalRequest, IMedicalOfficeRequest } from 'src/Domine/Request';
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
    const patient: ResponseData<MedicalOfficeResponse> = await response.json();
    return patient.result;
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

export class GetMedicalOfficeByIdUseCase implements IUseCase<number, MedicalOfficeResponse | null> {
  private url: string
  public constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.MEDICAL_OFFICE}`;
  }
  async execute(id: number): Promise<MedicalOfficeResponse | null> {
    const response = await this.httpClient.GET(`${this.url}${id}`);
    if (!response.ok) {
      return null;
    }
    const medicalOffice: ResponseData<MedicalOfficeResponse> = await response.json();
    return medicalOffice.result;
  }
}

export class GetAttenttionMedicalOfficeUseCase implements IUseCase<AttentionScheduleMedicalRequest, AttentionScheduleMedicalResponse | null> {
  private url: string
  public constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.MEDICAL_OFFICE}${'attentionschedule/'}`;
  }
  async execute(request: AttentionScheduleMedicalRequest): Promise<AttentionScheduleMedicalResponse | null> {
    const params = { medicalOfficeId: request.medicalOfficeId, dayOfWeek: request.dayOfWeek }
    const response = await this.httpClient.GET(`${this.url}`, params);
    if (!response.ok) {
      return null;
    }
    const attentionSchedule: ResponseData<AttentionScheduleMedicalResponse> = await response.json();
    return attentionSchedule.result;
  }
}
