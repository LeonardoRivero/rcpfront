import { ref } from 'vue';
import { QForm } from 'quasar';
import { storeToRefs } from 'pinia';
import { useStoreSettings } from 'src/stores/storeSettings';
import {
  IPhysicalExamRequest,
  IPhysicalExamResponse,
  ISpeciality,
} from 'src/interfaces/IConsults';
import { HttpResponse } from 'src/scripts/Request';
import modalService from './ModalService';
import { Messages } from 'src/scripts/Constants';
import { IColumnsDataTable } from 'src/interfaces/ICommons';
import HttpStatusCode from 'src/scripts/HttpStatusCodes';

const store = useStoreSettings();
const serviceModal = modalService();
const messages = new Messages();

export function physicalExamService() {
  const {
    speciality,
    allPhysicalMedicalParameter,
    currentPhysicalMedicalParameter,
  } = storeToRefs(store);
  // const test = ref<IPhysicalExamResponse | null>(null);
  const icon = ref('');
  const physicalExamParameter = ref<IPhysicalExamResponse | null>(null);
  const formPhysicalExam = ref<QForm | null>(null);
  const disable = ref<boolean>(true);
  const columnsr = ref<Array<IColumnsDataTable>>(
    [] as Array<IColumnsDataTable>
  );
  const rows = ref<any>([]);
  const specialityTable = ref<ISpeciality | null>(null);
  const selected = ref([]);

  async function clearSpeciality(val: ISpeciality): Promise<void> {
    speciality.value = val;
    if (val.id === undefined) {
      return;
    }
  }
  function add(): void {
    disable.value = !disable.value;
    formPhysicalExam.value?.reset();
    speciality.value = null;
    currentPhysicalMedicalParameter.value = {} as IPhysicalExamRequest;
  }
  // function edit(): void {
  //   if (expanded.value === false) {
  //     expanded.value = !expanded.value;
  //   }
  //   currentSpeciality.value = speciality.value as ISpeciality;
  // }
  async function toUpkir(val: Array<IPhysicalExamRequest>) {
    currentPhysicalMedicalParameter.value.description = val[0].description;
    currentPhysicalMedicalParameter.value.active = val[0].active;
    speciality.value = specialityTable.value;
  }
  async function specialityChanged(val: ISpeciality): Promise<void> {
    speciality.value = val;
    if (val.id === undefined) {
      return;
    }
    const specialityId = val.id;
    await store.retrieveAllPhysicalMedicalParameterBySpecialityId(specialityId);
  }
  async function specialityTableChanged(val: ISpeciality): Promise<void> {
    // speciality.value = val;
    selected.value = [];
    if (val.id === undefined) {
      return;
    }
    const specialityId = val.id;
    const response =
      await store.retrieveAllPhysicalMedicalParameterBySpecialityId(
        specialityId
      );
    if (response.status != HttpStatusCode.NO_CONTENT) {
      const data = response.parsedBody as Array<IPhysicalExamResponse>;
      columnsr.value = [
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
          label: 'Estado',
          field: 'active',
          sortable: true,
        },
      ] as Array<IColumnsDataTable>;
      const r = data.map((row) => ({
        description: row.description,
        active: row.active == true ? 'Activo' : 'Inactivo',
      }));
      rows.value = r;
      return;
    }
    columnsr.value = [] as Array<IColumnsDataTable>;
    rows.value = {};

    // currentPhysicalMedicalParameter.value = {} as IPhysicalExamRequest;
    // test.value = null;
  }

  async function confirmChanges(): Promise<void> {
    const isValid = await formPhysicalExam.value?.validate();
    if (isValid == false) return;
    if (
      currentPhysicalMedicalParameter.value === null ||
      !speciality.value ||
      speciality.value.id == undefined
    )
      return;

    let payload = {} as IPhysicalExamRequest;
    let response = {} as HttpResponse<unknown>;
    let confirmCreate = false;

    if (currentPhysicalMedicalParameter.value.id == null) {
      confirmCreate = await serviceModal.showModal(
        'Atención',
        messages.newRegister
      );
      if (confirmCreate === false) {
        return;
      }
    }
    if (confirmCreate == true) {
      payload = {
        description: currentPhysicalMedicalParameter.value.description,
        speciality: speciality.value.id,
        active: true,
      };
      const responseCreate = await store.createPhysicalExam(payload);
      if (responseCreate == null) {
        return;
      }
      response = responseCreate;
    }
    currentPhysicalMedicalParameter.value =
      response.parsedBody as IPhysicalExamRequest;
    if (currentPhysicalMedicalParameter.value.speciality == undefined) return;
    response = await store.retrieveAllPhysicalMedicalParameterBySpecialityId(
      currentPhysicalMedicalParameter.value.speciality
    );
    const data = response.parsedBody as Array<IPhysicalExamResponse>;
    columnsr.value = [
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
        label: 'Estado',
        field: 'active',
        sortable: true,
      },
    ] as Array<IColumnsDataTable>;
    const r = data.map((row) => ({
      description: row.description,
      active: row.active == true ? 'Activo' : 'Inactivo',
    }));
    rows.value = r;
  }

  return {
    //! Properties
    icon,
    physicalExamParameter,
    allPhysicalMedicalParameter,
    currentPhysicalMedicalParameter,
    formPhysicalExam,
    speciality,
    specialityTable,
    disable,
    add,
    columnsr,
    rows,
    selected,
    //! Metodos
    confirmChanges,
    specialityTableChanged,
    specialityChanged,
    clearSpeciality,
    toUpkir,
  };
}
