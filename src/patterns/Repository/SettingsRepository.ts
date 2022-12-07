import { routerInstance } from 'src/boot/globalRouter';
import {
  IDoctorRequest,
  IDoctorResponse,
  IDXMainCodeRequest,
  IDXMainCodeResponse,
  IPhysicalExamRequest,
  IPhysicalExamResponse,
  IRelationCodeRequest,
  IRelationCodeResponse,
  ISpeciality,
} from 'src/models/IConsults';
import { IHealthInsurance } from 'src/models/IPatients';
import { EndPoints, Messages } from 'src/scripts/Constants';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { GET, POST, PUT, handleResponse } from 'src/scripts/Request';
import { IRepository } from './Interface';
const endpoint = EndPoints.getInstance();
const messages = Messages.getInstance();

type IPhysical = IPhysicalExamRequest | IPhysicalExamResponse;
export class PhysicalExamParameterRepository implements IRepository<IPhysical> {
  private static instance: PhysicalExamParameterRepository;
  private constructor() {
    return;
  }
  public static getInstance(): PhysicalExamParameterRepository {
    if (!PhysicalExamParameterRepository.instance) {
      PhysicalExamParameterRepository.instance =
        new PhysicalExamParameterRepository();
    }
    return PhysicalExamParameterRepository.instance;
  }
  getById(id: number): Promise<IPhysicalExamRequest | null> {
    throw new Error('Method not implemented.');
  }
  getAll(): Promise<IPhysicalExamRequest[] | null> {
    throw new Error('Method not implemented.');
  }
  async create(
    entity: IPhysicalExamRequest
  ): Promise<IPhysicalExamRequest | null> {
    const url = endpoint.getORcreatePhysicalExamParameter;
    try {
      const response = await POST(url, entity);
      if (!response.ok) return null;
      handleResponse(response);
      const data = response.parsedBody as IPhysicalExamRequest;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  async update(
    entity: Partial<IPhysicalExamRequest>
  ): Promise<IPhysicalExamResponse | null> {
    if (entity.id == null) {
      return null;
    }
    try {
      const url = endpoint.updateOrGetPhysicalExamParameterById(entity.id);
      const response = await PUT(url, entity);
      if (!response.ok) return null;
      handleResponse(response);
      const data = response.parsedBody as IPhysicalExamResponse;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name}:${error}`);
    }
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async findByParameters(parameters: object): Promise<IPhysicalExamResponse[]> {
    const urlBase = endpoint.getORcreatePhysicalExamParameter;
    const url = endpoint.urlQueryParameter(urlBase, parameters);
    const response = await GET(url);
    if (response.status != HttpStatusCodes.NO_CONTENT) {
      return [];
    }
    return response.parsedBody as Array<IPhysicalExamResponse>;
  }
}

export class SpecialityRepository implements IRepository<ISpeciality> {
  private static instance: SpecialityRepository;
  private constructor() {
    return;
  }
  findByParameters(parameters: object): Promise<ISpeciality[]> {
    throw new Error('Method not implemented.');
  }
  public static getInstance(): SpecialityRepository {
    if (!SpecialityRepository.instance) {
      SpecialityRepository.instance = new SpecialityRepository();
    }
    return SpecialityRepository.instance;
  }
  async getAll(): Promise<ISpeciality[] | null> {
    try {
      const url = endpoint.getORcreateSpeciality;
      const response = await GET(url);
      if (response.status == HttpStatusCodes.NOT_FOUND) {
        routerInstance.push('/:catchAll');
      }
      const data = (await response.parsedBody) as Array<ISpeciality>;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  async create(entity: ISpeciality): Promise<ISpeciality | null> {
    const url = endpoint.getORcreateSpeciality;
    try {
      const response = await POST(url, entity);
      if (!response.ok) return null;
      handleResponse(response);
      const data = response.parsedBody as ISpeciality;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  async update(entity: Partial<ISpeciality>): Promise<ISpeciality | null> {
    if (entity.id == null) {
      return null;
    }
    try {
      const url = endpoint.updateSpeciality(entity.id);
      const response = await PUT(url, entity);
      if (!response.ok) return null;
      handleResponse(response);
      const data = response.parsedBody as ISpeciality;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name}:${error}`);
    }
  }
  async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async getById(id: number): Promise<ISpeciality | null> {
    try {
      // const response = await fetch(`https://randomuser.me/api?id=${id}`);
      // if (!response.ok) throw new Error(response.statusText);

      // const json = await response.json();
      // const data = json as {
      //   results: DataStoreResponseConcrete1[];
      // };
      // const user = Parsers.randomUser(data);

      return null;
    } catch (e) {
      throw Error(`Error in UserRepository calling get with id ${id}: ${e}`);
    }
  }
}

export class InsuranceRepository implements IRepository<IHealthInsurance> {
  private static instance: InsuranceRepository;
  private constructor() {
    return;
  }
  findByParameters(parameters: object): Promise<IHealthInsurance[]> {
    throw new Error('Method not implemented.');
  }
  public static getInstance(): InsuranceRepository {
    if (!InsuranceRepository.instance) {
      InsuranceRepository.instance = new InsuranceRepository();
    }
    return InsuranceRepository.instance;
  }
  async getById(id: number): Promise<IHealthInsurance | null> {
    throw new Error('Method not implemented.');
  }
  async getAll(): Promise<IHealthInsurance[] | null> {
    const url = endpoint.getORcreateInsurance;
    try {
      const response = await GET(url);
      if (response.status == HttpStatusCodes.NOT_FOUND) {
        routerInstance.push('/:catchAll');
      }
      const data = (await response.parsedBody) as Array<IHealthInsurance>;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  async create(entity: IHealthInsurance): Promise<IHealthInsurance | null> {
    try {
      const url = endpoint.getORcreateInsurance;
      const response = await POST(url, entity);
      if (!response.ok) return null;
      handleResponse(response);
      if (response.status === HttpStatusCodes.BAD_REQUEST) {
        return null;
      }
      return response.parsedBody as IHealthInsurance;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  async update(
    entity: Partial<IHealthInsurance>
  ): Promise<IHealthInsurance | null> {
    if (entity.id == null) {
      return null;
    }
    try {
      const url = endpoint.updateInsurance(entity.id);
      const response = await PUT(url, entity);
      handleResponse(response, messages.updateSuccesfully);
      if (!response.ok) return null;
      if (response.status === HttpStatusCodes.BAD_REQUEST) {
        return null;
      }
      const data = response.parsedBody as IHealthInsurance;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name}:${error}`);
    }
  }
  async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

type IDxMainCode = IDXMainCodeRequest | IDXMainCodeResponse;
export class DxMainCodeRepository implements IRepository<IDxMainCode> {
  private static instance: DxMainCodeRepository;
  private constructor() {
    return;
  }
  public static getInstance(): DxMainCodeRepository {
    if (!DxMainCodeRepository.instance) {
      DxMainCodeRepository.instance = new DxMainCodeRepository();
    }
    return DxMainCodeRepository.instance;
  }
  async findByParameters(
    queryParameters: object
  ): Promise<IDXMainCodeResponse[]> {
    const urlBase = endpoint.getORcreateDxMainCode;
    const url = endpoint.urlQueryParameter(urlBase, queryParameters);
    const response = await GET(url);
    const data = response.parsedBody as Array<IDXMainCodeResponse>;
    return data;
  }
  getById(id: number): Promise<IDXMainCodeResponse | null> {
    throw new Error('Method not implemented.');
  }
  async getAll(): Promise<IDXMainCodeResponse[] | null> {
    const url = endpoint.getORcreateDxMainCode;
    try {
      const response = await GET(url);
      if (response.status == HttpStatusCodes.NOT_FOUND) {
        routerInstance.push('/:catchAll');
        return null;
      }
      const data = (await response.parsedBody) as Array<IDXMainCodeResponse>;
      handleResponse(response);
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  async create(
    entity: IDXMainCodeRequest
  ): Promise<IDXMainCodeResponse | null> {
    const url = endpoint.getORcreateDxMainCode;
    try {
      const response = await POST(url, entity);
      handleResponse(response);
      if (!response.ok || response.status === HttpStatusCodes.BAD_REQUEST) {
        return null;
      }
      return response.parsedBody as IDXMainCodeResponse;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  async update(
    entity: Partial<IDXMainCodeRequest>
  ): Promise<IDXMainCodeResponse | null> {
    if (entity.id == null) {
      return null;
    }
    try {
      const url = endpoint.updateDxMainCode(entity.id);
      const response = await PUT(url, entity);
      handleResponse(response, messages.updateSuccesfully);
      if (!response.ok || response.status === HttpStatusCodes.BAD_REQUEST) {
        return null;
      }
      const data = response.parsedBody as IDXMainCodeResponse;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name}:${error}`);
    }
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

type IRelationCode = IRelationCodeRequest | IRelationCodeResponse;
export class RelationCodeRepository implements IRepository<IRelationCode> {
  private static instance: RelationCodeRepository;
  private constructor() {
    return;
  }
  public static getInstance(): RelationCodeRepository {
    if (!RelationCodeRepository.instance) {
      RelationCodeRepository.instance = new RelationCodeRepository();
    }
    return RelationCodeRepository.instance;
  }
  async getById(id: number): Promise<IRelationCode | null> {
    throw new Error('Method not implemented.');
  }
  async getAll(): Promise<IRelationCodeResponse[] | null> {
    try {
      const url = endpoint.getORcreateRelationCode;
      const response = await GET(url);
      if (response.status == HttpStatusCodes.NOT_FOUND) {
        routerInstance.push('/:catchAll');
      }

      if (response.status == HttpStatusCodes.NO_CONTENT) {
        return [];
      }
      const data = (await response.parsedBody) as Array<IRelationCodeResponse>;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  async create(
    entity: IRelationCodeRequest
  ): Promise<IRelationCodeResponse | null> {
    const url = endpoint.getORcreateRelationCode;
    try {
      const response = await POST(url, entity);
      handleResponse(response);
      if (!response.ok || response.status == HttpStatusCodes.BAD_REQUEST)
        return null;
      const data = response.parsedBody as IRelationCodeResponse;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  async update(
    entity: Partial<IRelationCode>
  ): Promise<IRelationCodeResponse | null> {
    if (entity.id == null) {
      return null;
    }
    try {
      const url = endpoint.updateRelationCode(entity.id);
      const response = await PUT(url, entity);
      if (!response.ok || response.status === HttpStatusCodes.BAD_REQUEST) {
        return null;
      }
      handleResponse(response, messages.updateSuccesfully);
      const data = response.parsedBody as IRelationCodeResponse;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name}:${error}`);
    }
  }
  async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async findByParameters(parameters: object): Promise<IRelationCodeResponse[]> {
    const urlBase = endpoint.getORcreateRelationCode;
    const url = endpoint.urlQueryParameter(urlBase, parameters);
    const response = await GET(url);
    const data = response.parsedBody as Array<IRelationCodeResponse>;
    return data;
  }
}

type IDoctor = IDoctorRequest | IDoctorResponse;
export class DoctorRepository implements IRepository<IDoctor> {
  private static instance: DoctorRepository;
  private constructor() {
    return;
  }
  public static getInstance(): DoctorRepository {
    if (!DoctorRepository.instance) {
      DoctorRepository.instance = new DoctorRepository();
    }
    return DoctorRepository.instance;
  }
  getById(id: number): Promise<IDoctor | null> {
    throw new Error('Method not implemented.');
  }
  async getAll(): Promise<IDoctorResponse[] | null> {
    try {
      const url = endpoint.getORcreateDoctor;
      const response = await GET(url);
      if (response.status == HttpStatusCodes.NOT_FOUND) {
        routerInstance.push('/:catchAll');
      }
      const data = (await response.parsedBody) as Array<IDoctorResponse>;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  create(entity: IDoctor): Promise<IDoctor | null> {
    throw new Error('Method not implemented.');
  }
  update(entity: Partial<IDoctor>): Promise<IDoctor | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  findByParameters(parameters: object): Promise<IDoctor[]> {
    throw new Error('Method not implemented.');
  }
}
