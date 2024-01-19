import { ListAppointmentByPaginationUseCase } from 'src/Application/Services';
import {
  IColumnsDataTable,
  IPaginationDataTable,
  ITableOptions,
} from 'src/Domine/ICommons';
import {
  Bloc,
  IControllersMediator,
  Subject,
  UseCase,
} from 'src/Domine/IPatterns';
import { AppointmentListState } from 'src/Domine/IStates';
import { PaginationAppointmentResponse } from 'src/Domine/Responses';
import { DataTableController } from './DataTableController';
import { BuilderTablesWithFetchToServer } from 'src/Infraestructure/Utilities/BuildersTables';

export class AppointmentListBloc extends Bloc<AppointmentListState> {
  private columns: Array<IColumnsDataTable>;
  private listAppointmentUseCase: UseCase<void, PaginationAppointmentResponse>;
  public pagination: IPaginationDataTable;
  public constructor() {
    const state: AppointmentListState = {
      pagination: {
        sortBy: 'date',
        descending: false,
        page: 1,
        rowsPerPage: 3,
        rowsNumber: 0,
      },
      loading: false,
      filter: '',
      tableOptions: {} as ITableOptions,
    };

    super(state);
    this.pagination = state.pagination;
    this.columns = this.buildObjectColumns();
    this.listAppointmentUseCase = new ListAppointmentByPaginationUseCase(
      state.pagination
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
    this.pagination.rowsNumber = response.count;
    const rows = response.results.map((row) => ({
      patientName: `${row.patient.name} ${row.patient.lastName}`,
      identification: row.patient.identification,
      phoneNumber: row.patient.phoneNumber,
      authorizationNumber: row.authorizationNumber,
      reasonConsult: row.reasonConsult.abbreviation,
      date: new Date(row.date).toLocaleString('es-CO'),
    }));
    this.changeState({ ...this.state, pagination: this.pagination });

    const builder = new BuilderTablesWithFetchToServer(this.state.pagination);
    builder.setData(this.columns, rows, 'Resumen Citas');
    builder.hasSearchField();
    builder.showButtonActions();
    this.state.tableOptions = builder.getResult();
    this.changeState({ ...this.state, tableOptions: this.state.tableOptions });
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

  async requestServer(pagination: IPaginationDataTable): Promise<void> {
    this.changeState({ ...this.state, loading: true });
    const usecase = new ListAppointmentByPaginationUseCase(pagination);
    const response = await usecase.execute();
    this.state.tableOptions.rows = response.results.map((row) => ({
      patientName: `${row.patient.name} ${row.patient.lastName}`,
      identification: row.patient.identification,
      phoneNumber: row.patient.phoneNumber,
      authorizationNumber: row.authorizationNumber,
      reasonConsult: row.reasonConsult.abbreviation,
      date: new Date(row.date).toLocaleString('es-CO'),
    }));

    this.changeState({
      ...this.state,
      tableOptions: this.state.tableOptions,
      loading: false,
      pagination: {
        descending: pagination.descending,
        page: pagination.page,
        rowsNumber: response.count,
        rowsPerPage: pagination.rowsPerPage,
        sortBy: pagination.sortBy,
      },
    });
  }
}
