import { DXMainEntryType, ResponseData } from 'src/Domine/Responses';
import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class GetAllDXMainEntryTypeUseCase implements IUseCase<void, DXMainEntryType[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    this.url = ENDPOINTS.DX_MAIN_ENTRY_TYPE.root
  }
  async execute(): Promise<DXMainEntryType[]> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    const list: ResponseData<DXMainEntryType[]> = await response.json();
    return list.result;
  }
}
