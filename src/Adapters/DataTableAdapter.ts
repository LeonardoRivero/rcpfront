import {
  IColumnsDataTable,
  ITableOptions,
  SelectionRow,
  TableSelect,
} from 'src/Domine/ICommons';
import { Builder } from 'src/Domine/IPatterns';
import { DataTableState } from 'src/Domine/IStates';
import { Observer, Subject } from 'src/patterns/Observer/Observer';
import { reactive } from 'vue';

export class DataTableController implements Subject {
  public state: DataTableState;
  private observers: Observer[] = [];
  private static instance: DataTableController;

  private constructor(state: DataTableState) {
    this.state = state;
    return;
  }

  public static getInstance(state: DataTableState): DataTableController {
    if (!DataTableController.instance) {
      DataTableController.instance = new DataTableController(state);
    }
    DataTableController;
    return DataTableController.instance;
  }

  public attach(observer: Observer | null): void {
    console.log('attach');
    if (observer == null) {
      return;
    }
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Subject: Observer has been attached already.');
    }
    console.log('Subject: Attached an observer.');
    this.observers.push(observer);
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
    console.log('Subject: Detached an observer.');
  }

  public notify(data: object): void {
    for (const observer of this.observers) {
      console.log(observer);
      observer.handleNotification(this, data);
    }
  }
}

export class BuilderTables {
  private table: ITableOptions;

  public constructor() {
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
    };
    return;
  }
  public setData(
    column: Array<IColumnsDataTable>,
    data: any,
    title: string
  ): void {
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

  public setSelectionRow(selection: SelectionRow) {
    this.table.selectionRow = selection;
  }

  public hasSearchField(arg: boolean) {
    this.table.enableSearch = arg;
  }

  public getResult(): ITableOptions {
    return this.table;
  }
}

export class BuilderTablesWithFetchToServer extends Builder {
  public table: ITableOptions;

  public constructor() {
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
  public showButtonActions() {
    this.table.showButtonActions = true;
  }
}
