import { IDXMainCode } from 'src/Domine/ModelsDB';
import { GenericService } from '../Repositories/Interface';
import { DXMainCodeResponse } from 'src/Domine/Responses';

export class DxMainCodeService extends GenericService<
  IDXMainCode,
  DXMainCodeResponse
> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;
  public constructor() {
    super();

    const urlAPI = process.env.DX_MAIN_CODE ? process.env.DX_MAIN_CODE : '';
    this.urlBase = `${process.env.RCP}${urlAPI}all/`;
    this.urlCreate = `${process.env.RCP}${urlAPI}create/`;
    this.urlList = `${this.urlBase}`;
    this.urlUpdate = `${this.urlBase}`;
  }
}
