import { HTTPClient, IUseCase } from 'src/Domine/IPatterns';
import { AddAdmissionRequest } from 'src/Domine/Request';
import { ResponseData } from 'src/Domine/Responses';
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

export class CreateAdmissionUseCase
  implements IUseCase<AddAdmissionRequest, [string, boolean]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.ADMISSION}`;
  }

  async execute(payload: AddAdmissionRequest): Promise<[string, boolean]> {
    const response = await this.httpClient.POST(this.url, payload)
    const admission: ResponseData<number> = await response.json();
    return [admission.description, response.ok];
  }
}
// calle 40A 26-06 Nuevo Sotomayor
// Jueves 5 Dic 8 Am
