import { IGender } from 'src/Domine/ModelsDB';
import { Repository, Service } from '../Repositories';
import { GenderResponse } from 'src/Domine/Responses';
import HttpStatusCode from '../Utilities/HttpStatusCodes';

export class GenderService extends Service<IGender, GenderResponse> {
  public repository: Repository<IGender>;
  public constructor() {
    super();
    this.repository = new GenderRepository();
  }

  public override async save(payload: IGender): Promise<GenderResponse | null> {
    throw new Error('Method not implemented.' + { payload });
  }

  public override async update(
    payload: IGender
  ): Promise<GenderResponse | null> {
    throw new Error('Method not implemented.' + { payload });
    const response = await this.repository.update(payload, payload.id);
    if (response.status != HttpStatusCode.ACCEPTED) return null;
    const data = await response.json();
    return data;
  }

  public override async findByParameters(
    queryParameters: object
  ): Promise<Array<GenderResponse>> {
    throw new Error('Method not implemented.' + { queryParameters });
    const response = await this.repository.findByParameters(queryParameters);
    const data = await response.json();
    if (response.status != HttpStatusCode.ACCEPTED) return [];
    return data;
  }

  public async getAll(): Promise<Array<GenderResponse>> {
    const response = await this.repository.getAll();
    const data = await response.json();
    if (response.status != HttpStatusCode.ACCEPTED) return [];
    return data;
  }

  public async getById(id: number): Promise<GenderResponse | null> {
    throw new Error('Method not implemented.' + { id });
    const response = await this.repository.getById(id);
    const data = await response.json();
    return data;
  }
}

export class GenderRepository extends Repository<IGender> {
  url: string;
  urlWithParameters: string;
  public constructor() {
    super();
    const urlAPI = process.env.GENDER ? process.env.GENDER : '';
    this.url = `${process.env.RCP}${urlAPI}`;
    this.urlWithParameters = '';
  }
}
