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
  // public async create(
  //   payload: IRelationCode
  // ): Promise<RelationCodeResponse | null> {
  //   const response = await this.repository.create(payload);
  //   if (!response.ok) return null;
  //   return await response.json();
  // }

  // public async update(
  //   payload: IRelationCode
  // ): Promise<RelationCodeResponse | null> {
  //   if (payload.id == undefined) {
  //     throw EvalError('id is undefined');
  //   }
  //   const response = await this.repository.update(payload, payload.id);
  //   if (!response.ok) {
  //     return null;
  //   }
  //   return await response.json();
  // }
  // public async findByParameters(
  //   queryParameters: object
  // ): Promise<Array<RelationCodeResponse>> {
  //   const response = await this.repository.findByParameters(queryParameters);
  //   if (!response.ok) {
  //     return [];
  //   }
  //   return await response.json();
  // }
}
