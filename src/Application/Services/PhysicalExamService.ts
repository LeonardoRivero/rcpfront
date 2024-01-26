import { IPhysicalExam } from 'src/Domine/ModelsDB';
import { GenericService } from '../Repositories/Interface';
import { PhysicalExamResponse } from 'src/Domine/Responses';
import { IToCreate, IToRead, IToUpdate, UseCase } from 'src/Domine/IPatterns';

export class PhysicalExamService extends GenericService<
  IPhysicalExam,
  PhysicalExamResponse
> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;
  private allPaymentOptions: Array<PhysicalExamResponse>;
  private static instance: PhysicalExamService;

  private constructor() {
    super();
    this.allPaymentOptions = [];
    const urlAPI = process.env.PHYSICAL_EXAM_PARAMETER
      ? process.env.PHYSICAL_EXAM_PARAMETER
      : '';
    this.urlBase = `${process.env.RCP}${urlAPI}filter/`;
    this.urlCreate = `${process.env.RCP}${urlAPI}create/`;
    this.urlList = `${process.env.RCP}${urlAPI}`;
    this.urlUpdate = `${process.env.RCP}${this.urlBase}`;
  }

  public static getInstance(): PhysicalExamService {
    if (!PhysicalExamService.instance) {
      PhysicalExamService.instance = new PhysicalExamService();
    }
    return PhysicalExamService.instance;
  }

  public override async getAll(): Promise<Array<PhysicalExamResponse>> {
    if (this.allPaymentOptions.length !== 0) {
      return this.allPaymentOptions;
    }
    this.allPaymentOptions = await this.getAll();
    return this.allPaymentOptions;
  }

  public override getById(id: number): Promise<PhysicalExamResponse> {
    throw new Error('Method not implemented.' + { id });
  }
}

export class GetPhysicalExamBySpecialityUseCase
  implements UseCase<number, Array<PhysicalExamResponse>>
{
  GenericService: GenericService<IPhysicalExam, PhysicalExamResponse>;
  public constructor() {
    this.GenericService = PhysicalExamService.getInstance();
  }
  async execute(idSpeciality: number): Promise<Array<PhysicalExamResponse>> {
    const response = await this.GenericService.findByParameters({
      speciality: idSpeciality,
    });
    return response;
  }
}
