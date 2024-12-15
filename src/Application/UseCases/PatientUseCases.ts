import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { PatientResponse, ResponseData } from 'src/Domine/Responses';
import { IPatient } from 'src/Domine/Request';
import HttpStatusCode from '../Utilities/HttpStatusCodes';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class CreatePatientUseCase implements IUseCase<IPatient, PatientResponse | null> {
  private url: string
  public constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.PATIENT}`;
    this.url = ENDPOINTS.PATIENT.root
  }

  async execute(payload: IPatient): Promise<PatientResponse | null> {
    const response = await this.httpClient.POST(this.url, payload);
    if (!response.ok) {
      return null;
    }
    const patient: PatientResponse = await response.json();
    return patient;
  }
}

export class FindPatientByIdentificationUseCase implements IUseCase<string, PatientResponse | null> {
  private url: string
  public constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.PATIENT}${'filter/'}`;
    this.url = ENDPOINTS.PATIENT.filter
  }

  async execute(
    identification: string | undefined
  ): Promise<PatientResponse | null> {
    const queryParameters = { identification: identification };
    const response = await this.httpClient.GET(this.url, queryParameters);
    if (!response.ok || response.status == HttpStatusCode.NO_CONTENT) {
      return null;
    }
    const patient: ResponseData<PatientResponse> = await response.json();
    return patient.result;
  }
}

export class UpdatePatientUseCase implements IUseCase<IPatient, PatientResponse | null> {
  private url: string
  public constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.PATIENT}`;
    this.url = ENDPOINTS.PATIENT.root
  }

  async execute(payload: IPatient): Promise<PatientResponse | null> {
    const fullUrl = `${this.url}${payload.id}`
    const response = await this.httpClient.PUT(fullUrl, payload);
    if (!response.ok) {
      return null;
    }
    const patient: ResponseData<PatientResponse> = await response.json();
    return patient.result;
  }
}
