import { IColumnsDataTable } from 'src/Domine/ICommons';
import { FactoryNotifactors } from '../Infraestructure/Utilities/Factories';
import { PhysicalExamResponse } from 'src/Domine/Responses';
import { IPhysicalExam } from 'src/Domine/ModelsDB';
import { DataTableController } from './DataTableController';
import { Messages } from 'src/Application/Utilities';
import { PhysicalExamService } from 'src/Application/Services/PhysicalExamService';
import { PhysicalExamParameterState } from 'src/Domine/IStates';
import {
  Controller,
  IControllersMediator,
  IFactoryMethodNotifications,
  Notificator,
  Observer,
  Subject,
} from 'src/Domine/IPatterns';
import { ModalType } from 'src/Domine/Types';
import { EditCommand, InsertCommand } from 'src/Application/Commands';

export class PhysicalExamParameterController
  extends Controller
  implements Observer {
  public state: PhysicalExamParameterState;
  private service = PhysicalExamService.getInstance();
  private notifySweetAlert: Notificator;
  // private static instance: PhysicalExamParameterController;

  public constructor(
    state: PhysicalExamParameterState,
    factoryNotificator: IFactoryMethodNotifications
  ) {
    super();
    this.state = state;
    this.notifySweetAlert = factoryNotificator.createNotificator(
      ModalType.SweetAlert
    );
  }

  // public static getInstance(
  //   state: PhysicalExamParameterState
  // ): PhysicalExamParameterController {
  //   if (!PhysicalExamParameterController.instance) {
  //     PhysicalExamParameterController.instance =
  //       new PhysicalExamParameterController(state);
  //   }
  //   return PhysicalExamParameterController.instance;
  // }

  public receiveData(data: IControllersMediator): void {
    throw new Error('Method not implemented.');
  }
  public clear(): void {
    throw new Error('Method not implemented.');
  }
  public handleNotification(subject: Subject, data: Array<object>): void {
    const isInstance = subject instanceof DataTableController;
    if (isInstance == false) {
      throw Error('Instancia no admitida');
    }
    if (data.length === 0) {
      this.state.disable = false;
      return;
    }
    const payload = data[0] as IPhysicalExam;
    this.state.currentPhysicalExamParameter = payload;
    this.state.disable = true;
    this.state.userCanEdit = true;
  }

  public add(): void {
    this.state.disable = false;

    this.state.currentPhysicalExamParameter = {
      active: true,
    } as IPhysicalExam;
    this.state.userCanEdit = false;
  }

  public edit(): void {
    this.state.disable = !this.state.disable;
  }

  // public async rowClicked(val: Array<IPhysicalExamRequest>) {
  //   const id = val[0].id;
  //   const item = this.state.allPhysicalMedicalParameter.find((obj) => {
  //     return obj.id === id;
  //   });

  //   if (item === undefined || item.speciality.id === undefined) {
  //     return;
  //   }

  //   const payload = {
  //     id: item.id,
  //     active: item.active,
  //     description: item.description,
  //     speciality: item.speciality.id,
  //   } as IPhysicalExamRequest;
  //   this.state.currentPhysicalExamParameter = payload;
  //   this.state.disable = true;
  //   this.state.speciality = this.state.specialityTable;
  // }

  public async specialityChanged(
    idSpeciality: number
  ): Promise<PhysicalExamResponse[]> {
    // this.state.speciality = val;
    // if (val === null || val.id === undefined) return;

    const queryParameters = { speciality: idSpeciality };
    // this.state.currentPhysicalExamParameter.speciality = idSpeciality;
    const response = await this.service.findByParameters(queryParameters);
    this.state.allPhysicalMedicalParameter = response;
    return response;
    // this.serviceDataTable.updateData(columns, rows);
    // this.state.currentPhysicalExamParameter.description = '';
  }

  public getColumnsAndRows(
    response: PhysicalExamResponse[]
  ): [Array<IColumnsDataTable>, Array<object>] {
    const columns: Array<IColumnsDataTable> = [
      {
        name: 'description',
        required: true,
        align: 'center',
        label: 'Descripcion Parametro',
        field: 'description',
        sortable: true,
      },
      {
        name: 'active',
        required: true,
        align: 'center',
        label: 'Activo',
        field: 'active',
        sortable: true,
      },
    ];
    const rows = response.map((row) => ({
      description: row.description,
      active: row.active,
      id: row.id,
      speciality: row.speciality.id,
    }));
    return [columns, rows];
  }

  public async saveOrUpdate(): Promise<PhysicalExamResponse | null> {
    let response: PhysicalExamResponse | null = null;
    let payload: IPhysicalExam;
    if (this.state.currentPhysicalExamParameter.id == undefined) {
      delete this.state.currentPhysicalExamParameter['id'];
      const insertCommand = new InsertCommand(
        this.state.currentPhysicalExamParameter,
        this.service
      );
      response = <PhysicalExamResponse | null>await insertCommand.execute();
      insertCommand.showNotification(response);
    }

    if (this.state.currentPhysicalExamParameter.id != undefined) {
      payload = this.state.currentPhysicalExamParameter;
      const editCommand = new EditCommand(
        payload,
        this.state.currentPhysicalExamParameter.id,
        this.service
      );
      response = <PhysicalExamResponse | null>await editCommand.execute();
      editCommand.showNotification(response);
    }

    if (response != null) {
      this.state.currentPhysicalExamParameter = {
        active: true,
      } as IPhysicalExam;
    }
    return response;

    // if (this.state.currentPhysicalExamParameter.speciality == undefined) return;
    // const queryParameters = {
    //   speciality: this.state.currentPhysicalExamParameter.speciality,
    // };

    // this.state.allPhysicalMedicalParameter =

    // const data = response.parsedBody as Array<IPhysicalExamResponse>;
    // this.state.columnsr = [
    //   {
    //     name: 'id',
    //     required: true,
    //     align: 'center',
    //     label: 'Id',
    //     field: 'id',
    //     sortable: true,
    //   },
    //   {
    //     name: 'description',
    //     required: true,
    //     align: 'center',
    //     label: 'Descripcion Parametro',
    //     field: 'description',
    //     sortable: true,
    //   },
    //   {
    //     name: 'active',
    //     required: true,
    //     align: 'center',
    //     label: 'Estado',
    //     field: 'active',
    //     sortable: true,
    //   },
    // ] as Array<IColumnsDataTable>;
    // const r =  this.state.allPhysicalMedicalParameter.map((row) => ({
    //   id: row.id,
    //   description: row.description,
    //   active: row.active == true ? 'Activo' : 'Inactivo',
    // }));
    // this.state.rows = r;
  }

  // public async create(
  //   payload: IPhysicalExam
  // ): Promise<PhysicalExamResponse | null> {
  //   const confirm = await this.notifySweetAlert.show(
  //     'Atención',
  //     Messages.newRegister
  //   );
  //   if (confirm === false) {
  //     return null;
  //   }

  //   const response = await this.service.create(payload);
  //   return response;
  // }

  // public async update(
  //   payload: IPhysicalExam
  // ): Promise<PhysicalExamResponse | null> {
  //   const confirm = await this.notifySweetAlert.show(
  //     'Atención',
  //     Messages.updateRegister
  //   );
  //   if (confirm == false) {
  //     return null;
  //   }
  //   if (payload.id == null) return null;
  //   const response = await this.service.update(payload, payload.id);
  //   return response;
  // }
}

// export function physicalExamServices() {
//   const {
//     speciality,
//     allPhysicalMedicalParameter,
//     currentPhysicalMedicalParameter,
//   } = stateToRefs(state);
//   // const test = ref<IPhysicalExamResponse | null>(null);
//   const icon = ref('');
//   const physicalExamParameter = ref<IPhysicalExamResponse | null>(null);
//   const formPhysicalExam = ref<QForm | null>(null);
//   const disable = ref<boolean>(true);
//   const columnsr = ref<Array<IColumnsDataTable>>(
//     [] as Array<IColumnsDataTable>
//   );
//   const rows = ref<any>([]);
//   const specialityTable = ref<ISpeciality | null>(null);
//   const selected = ref([]);
//   const statusPhysicalMedicalParameter = ref(false);

//   async function clearSpeciality(val: ISpeciality): Promise<void> {
//     speciality.value = val;
//     if (val.id === undefined) {
//       return;
//     }
//   }
//   function add(): void {
//     disable.value = !disable.value;
//     formPhysicalExam.value?.reset();
//     speciality.value = null;
//     currentPhysicalMedicalParameter.value = {
//       active: true,
//     } as IPhysicalExamRequest;
//   }
//   function edit(): void {
//     disable.value = !disable.value;
//   }
//   async function rowClicked(val: Array<IPhysicalExamRequest>) {
//     const id = val[0].id;
//     const item = allPhysicalMedicalParameter.value.find((obj) => {
//       return obj.id === id;
//     });
//     if (item === undefined || item.speciality.id === undefined) {
//       return;
//     }
//     currentPhysicalMedicalParameter.value.description = item.description;
//     currentPhysicalMedicalParameter.value.active = item.active;
//     currentPhysicalMedicalParameter.value.id = item.id;
//     currentPhysicalMedicalParameter.value.speciality = item.speciality.id;

//     speciality.value = specialityTable.value;
//     disable.value = true;
//   }
//   async function specialityChanged(val: ISpeciality): Promise<void> {
//     speciality.value = val;
//     if (val.id === undefined) {
//       return;
//     }
//     const specialityId = val.id;
//     currentPhysicalMedicalParameter.value.speciality = val.id;
//     await state.retrieveAllPhysicalMedicalParameterBySpecialityId(specialityId);
//   }
//   async function specialityTableChanged(val: ISpeciality): Promise<void> {
//     speciality.value = null;
//     selected.value = [];
//     if (val.id === undefined) {
//       return;
//     }
//     const specialityId = val.id;
//     const response =
//       await state.retrieveAllPhysicalMedicalParameterBySpecialityId(
//         specialityId
//       );
//     if (response.status != HttpStatusCode.NO_CONTENT) {
//       const data = response.parsedBody as Array<IPhysicalExamResponse>;
//       columnsr.value = [
//         {
//           name: 'description',
//           required: true,
//           align: 'center',
//           label: 'Descripcion Parametro',
//           field: 'description',
//           sortable: true,
//         },
//         {
//           name: 'active',
//           required: true,
//           align: 'center',
//           label: 'Estado',
//           field: 'active',
//           sortable: true,
//         },
//       ] as Array<IColumnsDataTable>;
//       const r = data.map((row) => ({
//         id: row.id,
//         description: row.description,
//         active: row.active == true ? 'Activo' : 'Inactivo',
//       }));
//       rows.value = r;
//       return;
//     }
//     columnsr.value = [] as Array<IColumnsDataTable>;
//     rows.value = [];

//     // currentPhysicalMedicalParameter.value = {} as IPhysicalExamRequest;
//     // test.value = null;
//   }

//   async function confirmChanges(): Promise<void> {
//     const isValid = await formPhysicalExam.value?.validate();
//     if (isValid == false) return;
//     if (
//       currentPhysicalMedicalParameter.value === null ||
//       !speciality.value ||
//       speciality.value.id == undefined
//     )
//       return;

//     let payload = {} as IPhysicalExamRequest;
//     let response = {} as HttpResponse<unknown>;
//     let confirmCreate = false;

//     if (currentPhysicalMedicalParameter.value.id == null) {
//       confirmCreate = await serviceModal.showModal(
//         'Atención',
//         messages.newRegister
//       );
//       if (confirmCreate === false) {
//         return;
//       }
//     }
//     if (confirmCreate == true) {
//       payload = {
//         description: currentPhysicalMedicalParameter.value.description,
//         speciality: speciality.value.id,
//         active: currentPhysicalMedicalParameter.value.active,
//       };
//       const responseCreate = await state.createPhysicalExam(payload);
//       if (responseCreate == null) {
//         return;
//       }
//       response = responseCreate;
//     }
//     let confirmUpdate = false;
//     if (currentPhysicalMedicalParameter.value.id != undefined) {
//       confirmUpdate = await serviceModal.showModal(
//         'Atención',
//         messages.updateRegister
//       );
//       if (confirmUpdate == false) {
//         return;
//       }
//     }
//     if (confirmUpdate == true) {
//       payload = {
//         id: currentPhysicalMedicalParameter.value.id,
//         description: currentPhysicalMedicalParameter.value.description,
//         active: currentPhysicalMedicalParameter.value.active,
//         speciality: currentPhysicalMedicalParameter.value.speciality,
//       };
//       const responseUpdate = await state.updatePhysicalMedicalParameter(
//         payload
//       );
//       if (responseUpdate == null) {
//         return;
//       }
//       response = responseUpdate;
//     }
//     currentPhysicalMedicalParameter.value =
//       response.parsedBody as IPhysicalExamRequest;
//     if (currentPhysicalMedicalParameter.value.speciality == undefined) return;
//     response = await state.retrieveAllPhysicalMedicalParameterBySpecialityId(
//       currentPhysicalMedicalParameter.value.speciality
//     );
//     const data = response.parsedBody as Array<IPhysicalExamResponse>;
//     columnsr.value = [
//       {
//         name: 'id',
//         required: true,
//         align: 'center',
//         label: 'Id',
//         field: 'id',
//         sortable: true,
//       },
//       {
//         name: 'description',
//         required: true,
//         align: 'center',
//         label: 'Descripcion Parametro',
//         field: 'description',
//         sortable: true,
//       },
//       {
//         name: 'active',
//         required: true,
//         align: 'center',
//         label: 'Estado',
//         field: 'active',
//         sortable: true,
//       },
//     ] as Array<IColumnsDataTable>;
//     const r = data.map((row) => ({
//       id: row.id,
//       description: row.description,
//       active: row.active == true ? 'Activo' : 'Inactivo',
//     }));
//     rows.value = r;
//   }

//   return {
//     //! Properties
//     icon,
//     physicalExamParameter,
//     allPhysicalMedicalParameter,
//     currentPhysicalMedicalParameter,
//     statusPhysicalMedicalParameter,
//     formPhysicalExam,
//     speciality,
//     specialityTable,
//     disable,
//     add,
//     edit,
//     columnsr,
//     rows,
//     selected,
//     //! Metodos
//     confirmChanges,
//     specialityTableChanged,
//     specialityChanged,
//     clearSpeciality,
//     rowClicked,
//   };
// }
