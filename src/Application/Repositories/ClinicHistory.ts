import { IExam } from 'src/Domine/ModelsDB';
import { Repository } from './Interface';
import { GET } from 'src/Infraestructure/Utilities/Request';

export class PhysicalExamResultRepository extends Repository<IExam> {
  url: string;
  urlWithParameters: string;
  public constructor() {
    super();
    const urlAPI = process.env.EXAM_RESULT ? process.env.EXAM_RESULT : '';
    this.url = `${process.env.REPORTS}${urlAPI}`;
    this.urlWithParameters = '';
  }

  public override getById(id: number): Promise<Response> {
    throw new Error('Method not implemented.' + { id });
  }

  public override update(): Promise<Response> {
    throw new Error('Method not implemented.');
  }

  public override delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.' + { id });
  }

  // public async getAll(): Promise<Response> {
  //   try {
  //     const urlBase = `${process.env.REPORTS}${this.url}`;
  //     // 'http://localhost:8001/api/physicalexamresult/all/'
  //     return await GET(this.url);
  //   } catch (error) {
  //     throw Error(`Error in ${Object.name} : ${error}`);
  //   }
  // }
}
