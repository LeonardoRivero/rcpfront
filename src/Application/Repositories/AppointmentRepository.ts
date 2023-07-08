import { IAppointment, IPaymentOptions } from 'src/Domine/ModelsDB';
import { EndPoints } from 'src/Application/Utilities';
import { Repository } from './Interface';
const endpoint = EndPoints.getInstance();
// type IAppointment = IAppointmentRequest | IAppointmentResponse | null;
export class AppointmentRepository extends Repository<IAppointment> {
  url: string;
  urlWithParameters: string;
  public constructor() {
    super();
    this.url = process.env.CONSULT ? process.env.CONSULT : '';
    this.urlWithParameters = '';
  }
  // async getById(id: number): Promise<AppointmentResponse | null> {
  //   const url = endpoint.updateOrGetAppointmentByScheduleId(id);
  //   try {
  //     const response = await GET(url);
  //     if (!response.ok) return null;
  //     if (response.status == HttpStatusCodes.NOT_FOUND) return null;
  //     if (response.status == HttpStatusCodes.BAD_REQUEST) return null;

  //     const data: AppointmentResponse = await response.json();
  //     return data;
  //   } catch (error) {
  //     throw Error(`Error in ${Object.name} : ${error}`);
  //   }
  // }

  public override async getAll(): Promise<Response> {
    throw new Error('Method not implemented.');
  }

  // public async create(
  //   entity: IAppointment
  // ): Promise<AppointmentResponse | null> {
  //   const url = EndPoints.buildFullUrl(process.env.CONSULT);
  //   try {
  //     const response = await POST(url, entity);
  //     if (!response.ok) return null;
  //     handleResponse(response);
  //     const data: AppointmentResponse = await response.json();
  //     return data;
  //   } catch (error) {
  //     throw Error(`Error in ${Object.name} : ${error}`);
  //   }
  // }

  public override async update(
    entity: Partial<IAppointment>
  ): Promise<Response> {
    throw new Error('Method not implemented.');
  }

  public override async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  // async findByParameters(parameters: object): Promise<AppointmentResponse[]> {
  //   const urlBase = EndPoints.buildFullUrl(process.env.CONSULT);
  //   const url = endpoint.urlQueryParameter(urlBase, parameters);
  //   const response = await GET(url);
  //   if (response.status == HttpStatusCodes.NO_CONTENT) {
  //     return [];
  //   }
  //   const data: AppointmentResponse[] = await response.json();
  //   return data;
  // }
}

export class PaymentOptionsRepository extends Repository<IPaymentOptions> {
  url: string;
  urlWithParameters: string;
  public constructor() {
    super();
    this.url = process.env.PAYMENT_OPTIONS ? process.env.PAYMENT_OPTIONS : '';
    this.urlWithParameters = '';
  }
  public override async getById(id: number): Promise<Response> {
    throw new Error('Method not implemented.');
  }
  // async getAll(): Promise<PaymentOptionsResponse[] | null> {
  //   const url = EndPoints.buildFullUrl(process.env.PAYMENT_OPTIONS);
  //   try {
  //     const response = await GET(url);
  //     if (!response.ok || response.status == HttpStatusCodes.BAD_REQUEST)
  //       return null;
  //     const data: PaymentOptionsResponse[] = await response.json();
  //     return data;
  //   } catch (error) {
  //     throw Error(`Error in ${Object.name} : ${error}`);
  //   }
  // }
  public override async create(entity: IPaymentOptions): Promise<Response> {
    throw new Error('Method not implemented.');
  }
  public override async update(
    entity: Partial<IPaymentOptions>
  ): Promise<Response> {
    throw new Error('Method not implemented.');
  }
  public override async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  public override async findByParameters(
    parameters: object
  ): Promise<Response> {
    throw new Error('Method not implemented.');
  }
}
