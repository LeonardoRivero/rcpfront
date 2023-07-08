import { IPatientStatus, IReasonConsult } from 'src/Domine/ModelsDB';
import { IIDType, IPatient } from 'src/Domine/ModelsDB';
import { Repository } from './Interface';

export class PatientRepository extends Repository<IPatient> {
  url: string;
  urlWithParameters: string;
  public constructor() {
    super();
    this.url = process.env.PATIENT ? process.env.PATIENT : '';
    this.urlWithParameters = '';
  }

  public override async getById(id: number): Promise<Response> {
    throw new Error('Method not implemented.' + { id });
  }

  public override async getAll(): Promise<Response> {
    throw new Error('Method not implemented.');
  }

  public override async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.' + { id });
  }
}

export class IDTypesRepository extends Repository<IIDType> {
  url: string;
  urlWithParameters: string;
  private constructor() {
    super();
    this.url = process.env.ID_TYPE ? process.env.ID_TYPE : '';
    this.urlWithParameters = '';
  }
  public override async getById(id: number): Promise<Response> {
    throw new Error('Method not implemented.' + { id });
  }
  public override async create(entity: IIDType): Promise<Response> {
    throw new Error('Method not implemented.' + { entity });
  }
  public override async update(entity: Partial<IIDType>): Promise<Response> {
    throw new Error('Method not implemented.' + { entity });
  }
  public override async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.' + { id });
  }
  public override async findByParameters(
    parameters: object
  ): Promise<Response> {
    throw new Error('Method not implemented.' + { parameters });
  }
}

export class PatientStatusRepository extends Repository<IPatientStatus> {
  url: string;
  urlWithParameters: string;
  public constructor() {
    super();
    this.url = process.env.PATIENT_STATUS ? process.env.PATIENT_STATUS : '';
    this.urlWithParameters = '';
  }
  public override async getById(id: number): Promise<Response> {
    throw new Error('Method not implemented.' + { id });
  }

  public override async create(entity: IPatientStatus): Promise<Response> {
    throw new Error('Method not implemented.' + { entity });
  }

  public override async update(
    entity: Partial<IPatientStatus>
  ): Promise<Response> {
    throw new Error('Method not implemented.' + { entity });
  }
  public override async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.' + { id });
  }
  public override async findByParameters(
    parameters: object
  ): Promise<Response> {
    throw new Error('Method not implemented.' + { parameters });
  }
}

export class ReasonConsultRepository extends Repository<IReasonConsult> {
  url: string;
  urlWithParameters: string;

  public constructor() {
    super();
    this.url = process.env.REASON_CONSULT ? process.env.REASON_CONSULT : '';
    this.urlWithParameters = '';
  }
  public override async getById(id: number): Promise<Response> {
    throw new Error('Method not implemented.' + { id });
  }

  public override async create(entity: IReasonConsult): Promise<Response> {
    throw new Error('Method not implemented.' + { entity });
  }

  public override async update(
    entity: Partial<IReasonConsult>
  ): Promise<Response> {
    throw new Error('Method not implemented.' + { entity });
  }
  public override async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.' + { id });
  }
  public override async findByParameters(
    parameters: object
  ): Promise<Response> {
    throw new Error('Method not implemented.' + { parameters });
  }
}
