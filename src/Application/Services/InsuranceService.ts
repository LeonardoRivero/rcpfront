import { IHealthInsurance } from 'src/Domine/ModelsDB';
import { Repository } from '../Repositories/Interface';
import { InsuranceRepository } from '../Repositories/SettingsRepository';
import { HealthInsuranceResponse } from 'src/Domine/Responses';

export class InsuranceService {
  private repository: Repository<IHealthInsurance>;
  public constructor() {
    this.repository = InsuranceRepository.getInstance();
    return;
  }

  public async create(
    payload: IHealthInsurance
  ): Promise<HealthInsuranceResponse | null> {
    const response = await this.repository.create(payload);
    if (!response.ok) return null;
    return await response.json();
  }

  public async update(
    payload: IHealthInsurance
  ): Promise<HealthInsuranceResponse | null> {
    if (payload.id == null) {
      throw EvalError('id is null');
    }
    const response = await this.repository.update(payload, payload.id);
    if (!response.ok) return null;
    return await response.json();
  }

  public async getAll(): Promise<Array<HealthInsuranceResponse>> {
    const response = await this.repository.getAll();
    if (!response.ok) return [];
    return await response.json();
  }
}
