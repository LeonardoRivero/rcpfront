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
  // public repository: Repository<IRelationCode>;
  public constructor() {
    super();
    // this.repository = RelationCodeRepository.getInstance();
    const urlAPI = process.env.RELATION_CODE ? process.env.RELATION_CODE : '';
    this.urlBase = `${process.env.RCP}${urlAPI}all/`;
    this.urlCreate = `${process.env.RCP}${urlAPI}all/`;
    this.urlList = `${process.env.RCP}${this.urlBase}all/`;
    this.urlUpdate = `${process.env.RCP}${this.urlBase}`;
  }
}
