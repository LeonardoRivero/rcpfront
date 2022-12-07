import { QForm } from 'quasar';
import { defineStore } from 'pinia';
// import { useStoreSettings } from 'src/stores/storeSettings';
import {
  IPhysicalExamRequest,
  IPhysicalExamResponse,
  ISpeciality,
} from 'src/models/IConsults';
// import { HttpResponse } from 'src/scripts/Request';
// import modalService from './ModalService';
// import { Messages } from 'src/scripts/Constants';
import { IColumnsDataTable } from 'src/models/ICommons';
// import HttpStatusCode from 'src/scripts/HttpStatusCodes';
import { PhysicalExamParameterRepository } from 'src/patterns/Repository/SettingsRepository';
import modalService from './ModalService';
import { Messages } from 'src/scripts/Constants';

// const store = useStoreSettings();
// const serviceModal = modalService();
// const messages = Messages.getInstance();

interface IStorePhysicalExamParameter {
  currentPhysicalExamParameter: IPhysicalExamRequest;
  allPhysicalMedicalParameter: Array<IPhysicalExamResponse>;
  speciality: ISpeciality | null;
  form: QForm | null;
  disable: boolean;
  icon: string;
  columnsr: Array<IColumnsDataTable>;
  rows: Array<unknown>;
  specialityTable: ISpeciality | null;
  selected: Array<unknown>;
  status: boolean;
}
export const useStorePhysicalExamParameter = defineStore(
  'storePhysicalExamParameter',
  {
    state: () =>
      ({
        currentPhysicalExamParameter: {} as IPhysicalExamRequest,
        allPhysicalMedicalParameter: [] as Array<IPhysicalExamResponse>,
        speciality: null,
        form: null,
        disable: false,
        icon: '',
        columnsr: [] as Array<IColumnsDataTable>,
        rows: [] as Array<unknown>,
        specialityTable: null,
        selected: [] as Array<unknown>,
        status: false,
      } as IStorePhysicalExamParameter),
  }
);
export class PhysicalExamParameterService {
  private store = useStorePhysicalExamParameter();
  private repository = PhysicalExamParameterRepository.getInstance();
  private serviceModal = modalService();
  private messages = Messages.getInstance();

  public async clearSpeciality(): Promise<void> {
    this.store.speciality = {} as ISpeciality;
  }

  public add(): void {
    this.store.disable = false;
    this.store.speciality = null;
    this.store.currentPhysicalExamParameter = {
      active: true,
    } as IPhysicalExamRequest;
    this.store.form?.reset();
  }

  public edit(): void {
    this.store.disable = !this.store.disable;
  }

  public async rowClicked(val: Array<IPhysicalExamRequest>) {
    const id = val[0].id;
    const item = this.store.allPhysicalMedicalParameter.find((obj) => {
      return obj.id === id;
    });

    if (item === undefined || item.speciality.id === undefined) {
      return;
    }

    const payload = {
      id: item.id,
      active: item.active,
      description: item.description,
      speciality: item.speciality.id,
    } as IPhysicalExamRequest;
    this.store.currentPhysicalExamParameter = payload;
    this.store.disable = true;
    this.store.speciality = this.store.specialityTable;
  }

  public async specialityChanged(val: ISpeciality | null): Promise<void> {
    this.store.speciality = val;
    if (val === null || val.id === undefined) return;

    const queryParameters = { speciality: val.id };
    this.store.currentPhysicalExamParameter.speciality = val.id;
    const response = await this.repository.findByParameters(queryParameters);
    this.store.allPhysicalMedicalParameter = response;
  }

  public async processRequest(): Promise<void> {
    const isValid = await this.store.form?.validate();
    if (isValid == false) return;
    if (
      this.store.currentPhysicalExamParameter === null ||
      !this.store.speciality ||
      this.store.speciality.id == undefined
    )
      return;

    let payload = {} as IPhysicalExamRequest;
    let response = null;

    if (this.store.currentPhysicalExamParameter.id == null) {
      payload = {
        description: this.store.currentPhysicalExamParameter.description,
        speciality: this.store.speciality.id,
        active: this.store.currentPhysicalExamParameter.active,
      };
      response = await this.create(payload);
    }

    if (this.store.currentPhysicalExamParameter.id != undefined) {
      payload = {
        id: this.store.currentPhysicalExamParameter.id,
        description: this.store.currentPhysicalExamParameter.description,
        active: this.store.currentPhysicalExamParameter.active,
        speciality: this.store.currentPhysicalExamParameter.speciality,
      };
      response = await this.update(payload);
    }

    if (response == null) return;

    if (this.store.currentPhysicalExamParameter.speciality == undefined) return;
    const queryParameters = {
      speciality: this.store.currentPhysicalExamParameter.speciality,
    };

    this.store.allPhysicalMedicalParameter =
      await this.repository.findByParameters(queryParameters);
    // const data = response.parsedBody as Array<IPhysicalExamResponse>;
    // columnsr.value = [
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
    // const r = data.map((row) => ({
    //   id: row.id,
    //   description: row.description,
    //   active: row.active == true ? 'Activo' : 'Inactivo',
    // }));
    // rows.value = r;
  }

  public async create(
    payload: IPhysicalExamRequest
  ): Promise<IPhysicalExamRequest | null> {
    const confirm = await this.serviceModal.showModal(
      'Atención',
      this.messages.newRegister
    );
    if (confirm === false) {
      return null;
    }

    const response = await this.repository.create(payload);
    return response;
  }

  public async update(
    payload: IPhysicalExamRequest
  ): Promise<IPhysicalExamResponse | null> {
    const confirm = await this.serviceModal.showModal(
      'Atención',
      this.messages.updateRegister
    );
    if (confirm == false) {
      return null;
    }

    const response = await this.repository.update(payload);
    return response;
  }
}

// export function physicalExamServices() {
//   const {
//     speciality,
//     allPhysicalMedicalParameter,
//     currentPhysicalMedicalParameter,
//   } = storeToRefs(store);
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
//     await store.retrieveAllPhysicalMedicalParameterBySpecialityId(specialityId);
//   }
//   async function specialityTableChanged(val: ISpeciality): Promise<void> {
//     speciality.value = null;
//     selected.value = [];
//     if (val.id === undefined) {
//       return;
//     }
//     const specialityId = val.id;
//     const response =
//       await store.retrieveAllPhysicalMedicalParameterBySpecialityId(
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
//       const responseCreate = await store.createPhysicalExam(payload);
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
//       const responseUpdate = await store.updatePhysicalMedicalParameter(
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
//     response = await store.retrieveAllPhysicalMedicalParameterBySpecialityId(
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
