import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { ResponseData, SpecialityResponse } from 'src/Domine/Responses';
import HttpStatusCode from '../Utilities/HttpStatusCodes';

export class GetAllSpecialityUseCase implements IUseCase<void, SpecialityResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.SPECIALITY}`;
  }
  async execute(): Promise<Array<SpecialityResponse>> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    return await response.json()
  }
}

export class GetSpecialityBelongToMedicalOfficeUseCase implements IUseCase<number, SpecialityResponse[]> {
  private url: string
  public constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.MEDICAL_OFFICE}`;
  }
  async execute(medicalOfficeId: number): Promise<SpecialityResponse[]> {
    const response = await this.httpClient.GET(`${this.url}${medicalOfficeId}${'/speciality'}`);
    if (!response.ok || response.status == HttpStatusCode.NO_CONTENT) {
      return [];
    }
    const listSpecialities: ResponseData<SpecialityResponse[]> = await response.json();
    return listSpecialities.result;
  }
}
