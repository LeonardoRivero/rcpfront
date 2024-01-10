import {
  IColumnsDataTable,
  IPaginationDataTable,
  ITableOptions,
  SelectionRow,
  TableSelect,
  TableType,
} from 'src/Domine/ICommons';
import { Builder } from 'src/Domine/IPatterns';
import { reactive } from 'vue';

export class BuilderTables extends Builder {
  public table: ITableOptions;

  public constructor() {
    super();
    this.table = {
      virtualScroll: false,
      title: '',
      columns: [] as Array<IColumnsDataTable>,
      rows: [] as Array<unknown>,
      enableSearch: false,
      enableSelect: false,
      selectionRow: 'none',
      select: new TableSelect(),
      textCite: '',
      observer: null,
      showButtonActions: false,
      tableType: TableType.simple,
      rowKey: '',
    };
  }
  public setData(column: any[], data: any, title: string): void {
    this.table.columns = column;
    this.table.rows = data;
    this.table.title = title;
  }

  public hasSelect(optionsSelect?: TableSelect) {
    if (optionsSelect == undefined) {
      throw Error('OptionsSelect is undefined');
    }

    this.table.enableSelect = true;
    this.table.select = optionsSelect;
  }

  public getResult(): ITableOptions {
    return this.table;
  }
}

export class BuilderTablesWithFetchToServer extends Builder {
  public table: ITableOptions;

  public constructor(pagination: IPaginationDataTable) {
    super();
    this.table = reactive({
      virtualScroll: false,
      title: '',
      columns: [] as Array<IColumnsDataTable>,
      rows: [] as Array<unknown>,
      enableSearch: false,
      enableSelect: false,
      selectionRow: 'none',
      select: new TableSelect(),
      textCite: '',
      observer: null,
      showButtonActions: false,
      tableType: TableType.fetchServer,
      rowKey: '',
      pagination: pagination,
    });
  }

  public setData(columns: any[], rows: any[], title: string | undefined): void {
    this.table.columns = columns;
    this.table.rows = rows;
    this.table.title = title == undefined ? '' : title;
  }

  public getResult(): ITableOptions {
    return this.table;
  }

  public enableSearch(enable: boolean) {
    this.table.enableSearch = enable;
  }
}
