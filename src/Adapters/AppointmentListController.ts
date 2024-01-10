import { ListAppointmentByPaginationUseCase } from 'src/Application/Services';
import { IColumnsDataTable, IPaginationDataTable } from 'src/Domine/ICommons';
import {
  Controller,
  IControllersMediator,
  Observer,
  Subject,
  UseCase,
} from 'src/Domine/IPatterns';
import { AppointmentListState } from 'src/Domine/IStates';
import {
  AppointmentResponse,
  PaginationAppointmentResponse,
} from 'src/Domine/Responses';
import { DataTableController } from './DataTableController';

export class AppointmentListController extends Controller implements Observer {
  public state: object;
  private columns: Array<IColumnsDataTable>;
  private listAppointmentUseCase: UseCase<void, PaginationAppointmentResponse>;
  public pagination: IPaginationDataTable;
  public constructor() {
    super();
    this.state = {};
    this.pagination = {
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 3,
      rowsNumber: 8,
    };

    this.columns = this.buildObjectColumns();
    this.listAppointmentUseCase = new ListAppointmentByPaginationUseCase(
      this.pagination
    );
  }
  handleNotification(subject: Subject, data: object): void {
    console.log('entro cuando hay algo en datatabel');
    const isInstance = subject instanceof DataTableController;
    if (isInstance == false) {
      throw Error('Instancia no admitida');
    }
    console.log('entro cuando hay algo en datatabel');
    // if (data.length === 0) {
    //   this.state.disable = false;
    //   return;
    // }
    // const payload = data[0] as IPhysicalExam;
    // this.state.currentPhysicalExamParameter = payload;
    // this.state.disable = true;
    // this.state.userCanEdit = true;
  }

  receiveData(data: IControllersMediator): void {
    throw new Error('Method not implemented.');
  }
  clear(): void {
    throw new Error('Method not implemented.');
  }
  async getRowsData(): Promise<any> {
    const response = await this.listAppointmentUseCase.execute();
    console.log(response);
    this.pagination.rowsNumber = response.total;
    const rows = response.results.map((row) => ({
      patientName: `${row.patient.name} ${row.patient.lastName}`,
      identification: row.patient.identification,
      phoneNumber: row.patient.phoneNumber,
      authorizationNumber: row.authorizationNumber,
      reasonConsult: row.reasonConsult.abbreviation,
      date: new Date(row.date).toLocaleString('es-CO'),
    }));
    return rows;
  }
  get columnsData() {
    return this.columns;
  }

  private buildObjectColumns(): Array<IColumnsDataTable> {
    return [
      {
        name: 'date',
        label: 'Fecha',
        field: 'date',
        required: true,
        sortable: false,
        align: 'center',
      },
      {
        name: 'patientName',
        label: 'Nombre Paciente',
        field: 'patientName',
        required: true,
        sortable: true,
      },
      {
        name: 'identification',
        label: 'Identificacion',
        field: 'identification',
        required: true,
        sortable: false,
      },
      {
        name: 'phoneNumber',
        label: 'Numero Telefono',
        field: 'phoneNumber',
        required: true,
        sortable: false,
      },
      {
        name: 'authorizationNumber',
        label: 'N° Autorizacion',
        field: 'authorizationNumber',
        required: true,
        sortable: false,
      },
      {
        name: 'reasonConsult',
        label: 'Razon Consulta',
        field: 'reasonConsult',
        required: true,
        sortable: false,
      },
    ];
  }
}
