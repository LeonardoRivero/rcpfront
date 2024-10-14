import {
  CountryResponse,
  RegionResponse,
  SubRegionResponse,
} from 'src/Domine/Responses';
import { GenericService } from '../Repositories/Interface';
// import 'reflect-metadata';
// import { injectable } from 'inversify';

// @injectable()
export class CountryService extends GenericService<any, CountryResponse> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;
  public constructor() {
    super();
    this.urlBase = process.env.COUNTRIES ? process.env.COUNTRIES : '';
    this.urlCreate = '';
    this.urlList = `${process.env.RCP}${this.urlBase}`;
    this.urlUpdate = '';
  }
}

// @injectable()
export class SubRegionService extends GenericService<any, SubRegionResponse> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;

  public constructor() {
    super();
    const url = process.env.SUBREGIONS ? process.env.SUBREGIONS : '';
    this.urlBase = `${process.env.RCP}${url}`;
    this.urlCreate = '';
    this.urlList = this.urlBase;
    this.urlUpdate = '';
  }
}

// @injectable()
export class RegionService extends GenericService<any, RegionResponse> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;

  public constructor() {
    super();
    this.urlBase = process.env.REGIONS ? process.env.REGIONS : '';
    this.urlCreate = '';
    this.urlList = `${process.env.RCP}${this.urlBase}`;
    this.urlUpdate = '';
  }
}
