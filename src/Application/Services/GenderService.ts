import { IGender } from 'src/Domine/ModelsDB';
import { Repository } from '../Repositories';
import { GenderResponse } from 'src/Domine/Responses';
import HttpStatusCode from '../Utilities/HttpStatusCodes';

export class GenderService {
  private repository: Repository<IGender>;
  public constructor() {
    this.repository = new GenderRepository();
    return;
  }
  public async save(payload: IGender): Promise<GenderResponse | null> {
    const response = await this.repository.create(payload);
    if (response.status != HttpStatusCode.ACCEPTED) return null;
    const data = await response.json();
    return data;
  }

  public async update(payload: IGender): Promise<GenderResponse | null> {
    const response = await this.repository.update(payload, payload.id);
    if (response.status != HttpStatusCode.ACCEPTED) return null;
    const data = await response.json();
    return data;
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<GenderResponse>> {
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
    const response = await this.repository.getById(id);
    const data = await response.json();
    return data;
  }

  public setRepository(repository: Repository<IGender>) {
    this.repository = repository;
  }
}

export class GenderRepository extends Repository<IGender> {
  url: string;
  urlWithParameters: string;
  public constructor() {
    super();
    this.url = process.env.GENDER ? process.env.GENDER : '';
    this.urlWithParameters = '';
  }
}
