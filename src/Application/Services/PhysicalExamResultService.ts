import { IExam } from 'src/Domine/ModelsDB';
import { GenericService } from '../Repositories/Interface';
import { PhysicalExamResultResponse } from 'src/Domine/Responses';

export class PhysicalExamResultService extends GenericService<
  IExam,
  PhysicalExamResultResponse
> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;

  public constructor() {
    super();
    const urlAPI = process.env.EXAM_RESULT ? process.env.EXAM_RESULT : '';
    this.urlBase = `${process.env.RCP}${urlAPI}all/`;
    this.urlCreate = `${process.env.RCP}${urlAPI}all/`;
    this.urlList = `${process.env.RCP}${this.urlBase}all/`;
    this.urlUpdate = `${process.env.RCP}${this.urlBase}`;
  }

  public override getById(id: number): Promise<PhysicalExamResultResponse> {
    throw new Error('Method not implemented.' + { id });
  }

  public override update(): Promise<PhysicalExamResultResponse> {
    throw new Error('Method not implemented.');
  }
}
