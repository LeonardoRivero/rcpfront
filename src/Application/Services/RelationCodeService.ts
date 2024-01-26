import { IRelationCode } from 'src/Domine/ModelsDB';
import { GenericService } from '../Repositories/Interface';
import { RelationCodeResponse } from 'src/Domine/Responses';

export class RelationCodeService extends GenericService<
  IRelationCode,
  RelationCodeResponse
> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;

  public constructor() {
    super();
    const urlAPI = process.env.RELATION_CODE ? process.env.RELATION_CODE : '';
    this.urlBase = `${process.env.RCP}${urlAPI}filter/`;
    this.urlCreate = `${process.env.RCP}${urlAPI}create/`;
    this.urlList = `${process.env.RCP}${urlAPI}list/`;
    this.urlUpdate = `${process.env.RCP}${urlAPI}`;
  }
}
