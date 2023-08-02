import { IRelationCode } from 'src/Domine/ModelsDB';
import { Repository, Service } from '../Repositories/Interface';
import { RelationCodeRepository } from '../Repositories/SettingsRepository';
import { RelationCodeResponse } from 'src/Domine/Responses';

export class RelationCodeService extends Service<
  IRelationCode,
  RelationCodeResponse
> {
  public repository: Repository<IRelationCode>;
  public constructor() {
    super();
    this.repository = RelationCodeRepository.getInstance();
  }
}
