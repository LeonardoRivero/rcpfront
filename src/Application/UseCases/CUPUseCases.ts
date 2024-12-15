import { HTTPClient, IFactoryMethodNotifications, IUseCase, Notificator } from 'src/Domine/IPatterns';
import { CIE10Response, CUPResponse, ResponseData } from 'src/Domine/Responses';
import { ModalType } from 'src/Domine/Types';
import { Messages } from '../Utilities';
import { ENDPOINTS } from '../Utilities/EndPoints';

export class GetByFilterCUPUseCase implements IUseCase<string, CUPResponse[]> {
  url: string
  private notificatorQuasar: Notificator

  constructor(private httpClient: HTTPClient, private factoryNotificator: IFactoryMethodNotifications) {
    this.url = ENDPOINTS.CUP.filter;
    this.notificatorQuasar = this.factoryNotificator.createNotificator(ModalType.NotifyQuasar)
  }
  async execute(filter: string): Promise<Array<CUPResponse>> {
    const response = await this.httpClient.GET(this.url, { filter })
    if (!response.ok) {
      this.notificatorQuasar.setType('warning')
      this.notificatorQuasar.show(undefined, Messages.notInfoFound)
      return []
    }
    const listCUP: ResponseData<CIE10Response[]> = await response.json()
    return listCUP.result
  }
}
