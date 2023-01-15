import { IDXMainCode } from 'src/Domine/ModelsDB';
import { DxMainCodeRepository } from '../Repositories/SettingsRepository';
import { IRepository } from '../Repositories/Interface';
import { DXMainCodeResponse } from 'src/Domine/Responses';

export class DxMainCodeService {
  private repository: IRepository<IDXMainCode, DXMainCodeResponse>;
  public constructor() {
    this.repository = DxMainCodeRepository.getInstance();
    return;
  }
  public async save(payload: IDXMainCode): Promise<DXMainCodeResponse | null> {
    const response = await this.repository.create(payload);
    return response;
  }

  public async update(
    payload: IDXMainCode
  ): Promise<DXMainCodeResponse | null> {
    const response = await this.repository.update(payload);
    return response;
  }
  public async findByParameters(
    queryParameters: object
  ): Promise<Array<DXMainCodeResponse>> {
    const response = await this.repository.findByParameters(queryParameters);
    if (response == null) return [];
    return response;
  }
  public setRepository(
    repository: IRepository<IDXMainCode, DXMainCodeResponse>
  ) {
    this.repository = repository;
  }
}
