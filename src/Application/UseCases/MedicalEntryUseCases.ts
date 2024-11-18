import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { MedicalEntryResponse, ResponseData } from 'src/Domine/Responses';

export class GetAllMedicalEntryUseCase implements IUseCase<void, MedicalEntryResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.MEDICAL_ENTRY}`;
  }
  async execute(): Promise<Array<MedicalEntryResponse>> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    const medicalEntry: ResponseData<MedicalEntryResponse[]> = await response.json()
    return medicalEntry.result
  }
}
