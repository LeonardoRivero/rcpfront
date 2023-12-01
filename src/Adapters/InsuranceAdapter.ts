import { InsuranceService } from 'src/Application/Services/InsuranceService';
import { IHealthInsurance } from 'src/Domine/ModelsDB';
import { HealthInsuranceResponse } from 'src/Domine/Responses';
import { InsuranceState } from 'src/Domine/IStates';
import { EditCommand, InsertCommand } from 'src/Application/Commands';

export class InsuranceController {
  private state: InsuranceState;
  private service = new InsuranceService();
  private static instance: InsuranceController;

  private constructor(state: InsuranceState) {
    this.state = state;
    return;
  }

  public static getInstance(state: InsuranceState): InsuranceController {
    if (!InsuranceController.instance) {
      InsuranceController.instance = new InsuranceController(state);
    }
    return InsuranceController.instance;
  }

  public clear() {
    this.state.insurance = null;
    this.state.currentInsurance = {} as IHealthInsurance;
  }

  public add(): void {
    this.state.expanded = true;
    this.state.currentInsurance = { takeCopayment: false } as IHealthInsurance;
  }

  public edit(): void {
    if (this.state.expanded === false) {
      this.state.expanded = !this.state.expanded;
    }
    this.state.currentInsurance = this.state
      .insurance as HealthInsuranceResponse;
  }

  public insuranceSelectChanged(val: HealthInsuranceResponse) {
    this.state.currentInsurance = val;
  }
  public async saveOrUpdate(): Promise<void> {
    if (!this.state.currentInsurance) return;

    let response: IHealthInsurance | null = null;
    if (this.state.currentInsurance.id == undefined) {
      delete this.state.currentInsurance['id'];
      const insertCommand = new InsertCommand(
        this.state.currentInsurance,
        this.service
      );
      response = <IHealthInsurance | null>await insertCommand.execute();
      insertCommand.showNotification(response);
    }

    if (this.state.currentInsurance.id != undefined) {
      const editCommand = new EditCommand(
        this.state.currentInsurance,
        this.state.currentInsurance.id,
        this.service
      );
      response = <IHealthInsurance | null>await editCommand.execute();
      editCommand.showNotification(response);
    }

    if (response == null) {
      return;
    }
    this.state.currentInsurance = response;
    this.state.allInsurance = await this.service.getAll();
    this.state.expanded = false;
  }

  public async getAll(): Promise<Array<HealthInsuranceResponse>> {
    if (this.state.allInsurance.length !== 0) {
      return this.state.allInsurance;
    }
    const response = await this.service.getAll();
    this.state.allInsurance = response;

    return response;
  }

  public responseToEntity(
    payload: HealthInsuranceResponse | null
  ): IHealthInsurance {
    if (payload === null) {
      return {} as IHealthInsurance;
    }
    const entity: HealthInsuranceResponse = {
      nameInsurance: payload.nameInsurance,
      id: payload.id,
      entityCode: payload.entityCode,
      takeCopayment: payload.takeCopayment,
    };
    return entity;
  }
}
