import { IDXMainCode } from 'src/Domine/ModelsDB';
import { Repository, Service } from '../Repositories/Interface';
import { DXMainCodeResponse } from 'src/Domine/Responses';
import HttpStatusCodes from '../Utilities/HttpStatusCodes';
import { DxMainCodeRepository } from '../Repositories';

export class DxMainCodeService extends Service<
  IDXMainCode,
  DXMainCodeResponse
> {
  public repository: Repository<IDXMainCode>;
  public constructor() {
    super();
    this.repository = DxMainCodeRepository.getInstance();
    return;
  }
  getById(id: number): Promise<DXMainCodeResponse | null> {
    throw new Error('Method not implemented.' + { id });
  }
  // public async getAll(): Promise<DXMainCodeResponse[] | null> {
  //   const response = await this.repository.getAll();
  //   if (response.status == HttpStatusCodes.NOT_FOUND) {
  //     return null;
  //   }
  //   const data: DXMainCodeResponse[] = await response.json();
  //   return data;
  // }

  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.' + { id });
  }

  // public async create(
  //   payload: IDXMainCode
  // ): Promise<DXMainCodeResponse | null> {
  //   const response = await this.repository.create(payload);
  //   if (!response.ok || response.status === HttpStatusCodes.BAD_REQUEST) {
  //     return null;
  //   }
  //   const data: DXMainCodeResponse = await response.json();
  //   return data;
  // }

  // public async update(
  //   payload: IDXMainCode
  // ): Promise<DXMainCodeResponse | null> {
  //   if (payload.id == null) {
  //     return null;
  //   }
  //   const response = await this.repository.update(payload, payload.id);
  //   if (!response.ok || response.status === HttpStatusCodes.BAD_REQUEST) {
  //     return null;
  //   }
  //   const data: DXMainCodeResponse = await response.json();
  //   return data;
  // }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<DXMainCodeResponse>> {
    const response = await this.repository.findByParameters(queryParameters);
    if (!response.ok || response.status == HttpStatusCodes.NO_CONTENT)
      return [];
    const data: DXMainCodeResponse[] = await response.json();
    return data;
  }
}

// export class DxMainCodeRepository extends AbstractRepository<IDXMainCode> {
//   public url: string;
//   public urlWithParameters: string;
//   public constructor() {
//     super();
//     this.url =
//       process.env.DX_MAIN_CODE == undefined ? '' : process.env.DX_MAIN_CODE;
//     this.urlWithParameters = '';
//   }
// }
