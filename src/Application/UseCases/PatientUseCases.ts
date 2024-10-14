import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { PatientResponse } from 'src/Domine/Responses';
import { IPatient } from 'src/Domine/Request';

export class CreatePatientUseCase implements IUseCase<IPatient, PatientResponse | null> {
  private url: string
  public constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.PATIENT}`;
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
