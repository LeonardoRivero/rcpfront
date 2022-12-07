import { IPatientStatus, IReasonConsult } from 'src/models/IConsults';
import {
  IGender,
  IIDType,
  IPatientRequest,
  IPatientResponse,
} from 'src/models/IPatients';
import { EndPoints, Messages } from 'src/scripts/Constants';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { GET, POST, PUT, handleResponse } from 'src/scripts/Request';
import { IRepository } from './Interface';
const endpoint = EndPoints.getInstance();
const messages = Messages.getInstance();

type IPatient = IPatientRequest | IPatientResponse | null;
export class PatientRepository implements IRepository<IPatient> {
  getById(id: number): Promise<IPatientResponse | null> {
    throw new Error('Method not implemented.');
  }

  getAll(): Promise<IPatientResponse[] | null> {
    throw new Error('Method not implemented.');
  }

  async create(entity: IPatientRequest): Promise<IPatientResponse | null> {
    const url = endpoint.getORcreatePatient;
    try {
      const response = await POST(url, entity);
      if (!response.ok) return null;
      handleResponse(response);
      const data = (await response.parsedBody) as IPatientResponse;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  async update(
    entity: Partial<IPatientRequest>
  ): Promise<IPatientResponse | null> {
    if (entity.id == null) {
      return null;
    }
    try {
      const url = endpoint.updatePatient(entity.id);
      const response = await PUT(url, entity);
      if (!response.ok) return null;
      handleResponse(response, messages.updateSuccesfully);
      const data = (await response.parsedBody) as IPatientResponse;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name}:${error}`);
    }
  }

  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async findByParameters(parameters: object): Promise<IPatientResponse | null> {
    const urlBase = endpoint.getORcreatePatient;
    const url = endpoint.urlQueryParameter(urlBase, parameters);
    const response = await GET(url);
    if (response.status == HttpStatusCodes.NO_CONTENT) {
      return null;
    }
    const data = (await response.parsedBody) as IPatientResponse;
    return data;
  }
}

export class IDTypesRepository implements IRepository<IIDType> {
  getById(id: number): Promise<IIDType | null> {
    throw new Error('Method not implemented.');
  }
  async getAll(): Promise<IIDType[] | null> {
    const url = endpoint.getAllIDType;
    try {
      const response = await GET(url);
      if (!response.ok || response.status == HttpStatusCodes.BAD_REQUEST)
        return null;
      const data = (await response.parsedBody) as Array<IIDType>;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  create(entity: IIDType): Promise<IIDType | null> {
    throw new Error('Method not implemented.');
  }
  update(entity: Partial<IIDType>): Promise<IIDType | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  findByParameters(parameters: object): Promise<IIDType[]> {
    throw new Error('Method not implemented.');
  }
}

export class GenderRepository implements IRepository<IGender> {
  getById(id: number): Promise<IGender | null> {
    throw new Error('Method not implemented.');
  }
  async getAll(): Promise<IGender[] | null> {
    const url = endpoint.getAllGender;
    try {
      const response = await GET(url);
      if (!response.ok || response.status == HttpStatusCodes.BAD_REQUEST)
        return null;
      const data = (await response.parsedBody) as Array<IGender>;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  create(entity: IGender): Promise<IGender | null> {
    throw new Error('Method not implemented.');
  }
  update(entity: Partial<IGender>): Promise<IGender | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  findByParameters(parameters: object): Promise<IGender[]> {
    throw new Error('Method not implemented.');
  }
}

export class PatientStatusRepository implements IRepository<IPatientStatus> {
  getById(id: number): Promise<IPatientStatus | null> {
    throw new Error('Method not implemented.');
  }
  async getAll(): Promise<IPatientStatus[] | null> {
    const url = endpoint.getORcreatePatientStatus;
    try {
      const response = await GET(url);
      if (!response.ok || response.status == HttpStatusCodes.BAD_REQUEST)
        return null;
      const data = (await response.parsedBody) as Array<IPatientStatus>;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  create(entity: IPatientStatus): Promise<IPatientStatus | null> {
    throw new Error('Method not implemented.');
  }
  update(entity: Partial<IPatientStatus>): Promise<IPatientStatus | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  findByParameters(parameters: object): Promise<IPatientStatus[]> {
    throw new Error('Method not implemented.');
  }
}

export class ReasonConsultRepository implements IRepository<IReasonConsult> {
  getById(id: number): Promise<IReasonConsult | null> {
    throw new Error('Method not implemented.');
  }
  async getAll(): Promise<IReasonConsult[] | null> {
    const url = endpoint.getORcreateReasonConsult;
    try {
      const response = await GET(url);
      if (!response.ok || response.status == HttpStatusCodes.BAD_REQUEST)
        return null;
      const data = (await response.parsedBody) as Array<IReasonConsult>;
      return data;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
  create(entity: IReasonConsult): Promise<IReasonConsult | null> {
    throw new Error('Method not implemented.');
  }
  update(entity: Partial<IReasonConsult>): Promise<IReasonConsult | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  findByParameters(parameters: object): Promise<IReasonConsult[]> {
    throw new Error('Method not implemented.');
  }
}
