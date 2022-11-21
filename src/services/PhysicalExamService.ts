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
  const disable = ref<boolean>(false);
  const columnsr = ref<Array<IColumnsDataTable>>(
    [] as Array<IColumnsDataTable>
  );
  const rows = ref<any>([]);

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
  async function specialityChanged(val: ISpeciality): Promise<void> {
    speciality.value = val;
    if (val.id === undefined) {
      return;
    }
    const specialityId = val.id;
    const response =
      await store.retrieveAllPhysicalMedicalParameterBySpecialityId(
        specialityId
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
        style: 'display:grid',
      },
      {
        name: 'active',
        required: true,
        align: 'center',
        label: 'Estado',
        field: 'active',
        sortable: true,
        style: 'max-width: 70px',
      },
    ] as Array<IColumnsDataTable>;
    const r = data.map((row) => ({
      description: row.description,
      active: row.active == true ? 'Activo' : 'Inactivo',
    }));
    rows.value = r;
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
    await store.retrieveAllPhysicalMedicalParameterBySpecialityId(
      currentPhysicalMedicalParameter.value.speciality
    );
  }

  return {
    //! Properties
    icon,
    physicalExamParameter,
    allPhysicalMedicalParameter,
    currentPhysicalMedicalParameter,
    formPhysicalExam,
    speciality,
    disable,
    add,
    columnsr,
    rows,
    //! Metodos

    confirmChanges,
    specialityChanged,
    clearSpeciality,
  };
}
