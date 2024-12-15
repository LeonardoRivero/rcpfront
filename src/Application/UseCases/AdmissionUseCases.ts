import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { AddAdmissionRequest, CheckAdmissionPatientRequest } from 'src/Domine/Request';
import { ResponseData } from 'src/Domine/Responses';
import { ENDPOINTS } from '../Utilities/EndPoints';
// import { HealthInsuranceResponse } from 'src/Domine/Responses';

export class CalculateAmountPaidAppointmentUseCase
  implements IUseCase<AddAdmissionRequest, number> {
  // public insurance: HealthInsuranceResponse | undefined;
  // constructor(insurance: HealthInsuranceResponse) {
  //   this.insurance = insurance
  // }

  execute(admission: AddAdmissionRequest): number {
    // if (this.insurance == undefined) {
    //   throw new EvalError('Insurance is undefined');
    // }

    if (admission.isParticular) {
      return admission.appointmentPrice
    }
    return +admission.appointmentPrice + +admission.copayment
    // if (this.insurance.takeCopayment == true) {
    //   return +appointment.price - +appointment.copayment;
    // }
    // return appointment.price;

  }
}

export class CreateAdmissionUseCase implements IUseCase<AddAdmissionRequest, [string, boolean]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.ADMISSION}`;
    this.url = ENDPOINTS.ADMISSION
  }

  async execute(payload: AddAdmissionRequest): Promise<[string, boolean]> {
    const response = await this.httpClient.POST(this.url, payload)
    const admission: ResponseData<number> = await response.json();
    return [admission.description, response.ok];
  }
}

export class CheckAdmissionForPatientUseCase implements IUseCase<CheckAdmissionPatientRequest, [string, boolean]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    // this.url = `${process.env.RCP}${process.env.ADMISSION}`;
    this.url = ENDPOINTS.ADMISSION
  }

  async execute(payload: CheckAdmissionPatientRequest): Promise<[string, boolean]> {
    const response = await this.httpClient.GET(this.url, { ...payload })
    const admission: ResponseData<boolean> = await response.json();
    return [admission.description, response.ok];
  }
}
