import {
  CountryResponse,
  RegionResponse,
  SubRegionResponse,
} from 'src/Domine/Responses';
import { GenericService, Repository, Service } from '../Repositories/Interface';
import { SpecialityResponse } from 'src/Domine/Responses';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';

@injectable()
export class CountryService extends Service<any, CountryResponse> {
  public repository: Repository<CountryResponse>;
  public constructor(
    @inject('CountryRepository')
    repository: Repository<CountryResponse>
  ) {
    super();
    this.repository = repository;
    return;
  }
}

@injectable()
export class SubRegionService extends Service<any, SubRegionResponse> {
  public repository: Repository<SubRegionResponse>;
  public constructor(
    @inject('SubRegionRepository')
    repository: Repository<SubRegionResponse>
  ) {
    super();
    this.repository = repository;
    return;
  }
}

@injectable()
export class RegionService extends Service<any, RegionResponse> {
  public repository: Repository<RegionResponse>;
  public constructor(
    @inject('RegionRepository')
    repository: Repository<RegionResponse>
  ) {
    super();
    this.repository = repository;
    return;
  }
}
