import {
  IDoctor,
  IDXMainCode,
  IPhysicalExam,
  IRelationCode,
  ISpeciality,
  IHealthInsurance,
  IPathologycalHistory,
} from 'src/Domine/ModelsDB';
import { Repository } from './Interface';
import 'reflect-metadata';
import { injectable, inject } from 'inversify';

@injectable()
export class PhysicalExamParameterRepository extends Repository<IPhysicalExam> {
  url: string;
  urlWithParameters: string;
  private static instance: PhysicalExamParameterRepository;
  public constructor() {
    super();
    const urlAPI = process.env.PHYSICAL_EXAM_PARAMETER
      ? process.env.PHYSICAL_EXAM_PARAMETER
      : '';
    this.url = `${process.env.RCP}${urlAPI}`;
    this.urlWithParameters = '';
  }
  public static getInstance(): PhysicalExamParameterRepository {
    if (!PhysicalExamParameterRepository.instance) {
      PhysicalExamParameterRepository.instance =
        new PhysicalExamParameterRepository();
    }
    return PhysicalExamParameterRepository.instance;
  }
  public override getById(id: number): Promise<Response> {
    throw new Error('Method not implemented.' + { id });
  }
  public override getAll(): Promise<Response> {
    throw new Error('Method not implemented.');
  }
  public override delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.' + { id });
  }
}

@injectable()
export class SpecialityRepository extends Repository<ISpeciality> {
  url: string;
  urlWithParameters: string;
  private static instance: SpecialityRepository;
  public constructor() {
    super();
    const urlAPI = process.env.SPECIALITY ? process.env.SPECIALITY : '';
    this.url = `${process.env.RCP}${urlAPI}`;
    this.urlWithParameters = '';
  }
  public override async findByParameters(
    parameters: object
  ): Promise<Response> {
    throw new Error('Method not implemented.' + { parameters });
  }

  public static getInstance(): SpecialityRepository {
    if (!SpecialityRepository.instance) {
      SpecialityRepository.instance = new SpecialityRepository();
    }
    return SpecialityRepository.instance;
  }

  public override async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.' + { id });
  }
}

@injectable()
export class InsuranceRepository extends Repository<IHealthInsurance> {
  url: string;
  urlWithParameters: string;
  private static instance: InsuranceRepository;
  public constructor() {
    super();
    const urlAPI = process.env.INSURANCE ? process.env.INSURANCE : '';
    this.url = `${process.env.RCP}${urlAPI}`;
    this.urlWithParameters = '';
  }
  public override async findByParameters(
    parameters: object
  ): Promise<Response> {
    throw new Error('Method not implemented.' + { parameters });
  }
  public static getInstance(): InsuranceRepository {
    if (!InsuranceRepository.instance) {
      InsuranceRepository.instance = new InsuranceRepository();
    }
    return InsuranceRepository.instance;
  }
  public override async getById(id: number): Promise<Response> {
    throw new Error('Method not implemented.' + { id });
  }
}

@injectable()
export class DxMainCodeRepository extends Repository<IDXMainCode> {
  url: string;
  urlWithParameters: string;
  private static instance: DxMainCodeRepository;
  public constructor() {
    super();
    const urlAPI = process.env.DX_MAIN_CODE ? process.env.DX_MAIN_CODE : '';
    this.url = `${process.env.RCP}${urlAPI}`;
    this.urlWithParameters = '';
    return;
  }
  public static getInstance(): DxMainCodeRepository {
    if (!DxMainCodeRepository.instance) {
      DxMainCodeRepository.instance = new DxMainCodeRepository();
    }
    return DxMainCodeRepository.instance;
  }

  public override async getById(id: number): Promise<Response> {
    throw new Error('Method not implemented.' + { id });
  }

  public override async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.' + { id });
  }
}

@injectable()
export class RelationCodeRepository extends Repository<IRelationCode> {
  url: string;
  urlWithParameters: string;
  private static instance: RelationCodeRepository;
  public constructor() {
    super();
    const urlAPI = process.env.RELATION_CODE ? process.env.RELATION_CODE : '';
    this.url = `${process.env.RCP}${urlAPI}`;
    this.urlWithParameters = '';
  }
  public static getInstance(): RelationCodeRepository {
    if (!RelationCodeRepository.instance) {
      RelationCodeRepository.instance = new RelationCodeRepository();
    }
    return RelationCodeRepository.instance;
  }
  public override async getById(id: number): Promise<Response> {
    throw new Error('Method not implemented.' + { id });
  }
  public override async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.' + { id });
  }
}

@injectable()
export class DoctorRepository extends Repository<IDoctor> {
  url: string;
  urlWithParameters: string;
  private static instance: DoctorRepository;
  public constructor() {
    super();
    const urlAPI = process.env.DOCTOR ? process.env.DOCTOR : '';
    this.url = `${process.env.RCP}${urlAPI}`;
    this.urlWithParameters = '';
  }
  public static getInstance(): DoctorRepository {
    if (!DoctorRepository.instance) {
      DoctorRepository.instance = new DoctorRepository();
    }
    return DoctorRepository.instance;
  }

  public override async create(entity: IDoctor): Promise<Response> {
    throw new Error('Method not implemented.' + { entity });
  }

  public override async update(entity: Partial<IDoctor>): Promise<Response> {
    throw new Error('Method not implemented.' + { entity });
  }

  public override async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.' + { id });
  }
}

@injectable()
export class PathologicalHistoryRepository extends Repository<IPathologycalHistory> {
  url: string;
  urlWithParameters: string;
  public constructor() {
    super();

    const urlAPI = process.env.PATHOLOGY_HISTORY
      ? process.env.PATHOLOGY_HISTORY
      : '';
    this.url = `${process.env.RCP}${urlAPI}`;
    this.urlWithParameters = '';
  }

  public override async getById(id: number): Promise<Response> {
    throw new Error('Method not implemented.' + { id });
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
