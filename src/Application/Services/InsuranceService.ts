import { IHealthInsurance } from 'src/Domine/ModelsDB';
import { IRepository } from '../Repositories/Interface';
import { InsuranceRepository } from '../Repositories/SettingsRepository';
import { HealthInsuranceResponse } from 'src/Domine/Responses';

export class InsuranceService {
  private repository: IRepository<IHealthInsurance, HealthInsuranceResponse>;
  public constructor() {
    this.repository = InsuranceRepository.getInstance();
    return;
  }

  public async create(
    payload: IHealthInsurance
  ): Promise<HealthInsuranceResponse | null> {
    const response = await this.repository.create(payload);
    return response;
  }

  public async update(
    payload: IHealthInsurance
  ): Promise<HealthInsuranceResponse | null> {
    const response = await this.repository.update(payload);
    return response;
  }

  public async getAll(): Promise<Array<HealthInsuranceResponse>> {
    const response = await this.repository.getAll();
    if (response == null) return [];
    return response;
  }
}
