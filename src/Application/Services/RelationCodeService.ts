import { IRelationCode } from 'src/Domine/ModelsDB';
import { IRepository } from '../Repositories/Interface';
import { RelationCodeRepository } from '../Repositories/SettingsRepository';
import { RelationCodeResponse } from 'src/Domine/Responses';

export class RelationCodeService {
  private repository: IRepository<IRelationCode, RelationCodeResponse>;
  public constructor() {
    this.repository = RelationCodeRepository.getInstance();
    return;
  }
  public async create(
    payload: IRelationCode
  ): Promise<RelationCodeResponse | null> {
    const response = await this.repository.create(payload);
    return response;
  }

  public async update(
    payload: IRelationCode
  ): Promise<RelationCodeResponse | null> {
    const response = await this.repository.update(payload);
    return response;
  }
  public async findByParameters(
    queryParameters: object
  ): Promise<Array<RelationCodeResponse>> {
    const response = await this.repository.findByParameters(queryParameters);
    if (response === null) {
      return [];
    }
    return response;
  }
}
