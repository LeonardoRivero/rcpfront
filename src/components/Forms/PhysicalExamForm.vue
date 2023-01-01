<template>
  <div class="col-6 col-md-6 col-sm-12 col-xs-12">
    <div class="my-card">
      <q-form @submit="confirmChanges" ref="form">
        <q-list>
          <q-item>
            <div class="fit row justify-end">
              <div style="overflow: auto">
                <q-btn
                  color="blue"
                  size="12px"
                  flat
                  dense
                  round
                  icon="mdi-plus"
                  align="right"
                  @click="add"
                >
                  <q-tooltip transition-show="scale" transition-hide="scale">
                    Agregar
                  </q-tooltip>
                </q-btn>
                <q-btn
                  color="green"
                  size="12px"
                  flat
                  dense
                  round
                  icon="mdi-pencil"
                  align="right"
                  v-if="currentPhysicalExamParameter.description != ''"
                  @click="edit()"
                >
                  <q-tooltip transition-show="scale" transition-hide="scale">
                    Editar
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-item>
          <q-item>
            <q-item-section top>
              <div class="row q-col-gutter-x-md">
                <div class="col-md-12 col-sm-12 col-xs-12">
                  <q-select
                    :disable="disable"
                    dense
                    outlined
                    v-model="speciality"
                    :options="allSpecialities"
                    option-value="id"
                    option-label="description"
                    map-options
                    label="Especialidad"
                    :rules="[(val) => val || 'Especialidad es requerida']"
                    @update:model-value="(val) => specialityChanged(val)"
                  >
                  </q-select>
                </div>
              </div>
              <div class="row q-col-gutter-x-md">
                <div class="col-9 col-md-9 col-sm-12 col-xs-12">
                  <q-input
                    :disable="disable"
                    v-model="currentPhysicalExamParameter.description"
                    label="Parametro Examen Fisico"
                    dense
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Descripcion es requerida',
                    ]"
                  />
                </div>
                <div class="col-3 col-md-3 col-sm-12 col-xs-12">
                  <q-checkbox
                    :disable="disable"
                    v-model="currentPhysicalExamParameter.active"
                    label="Estado"
                    :rules="[
                      (val) =>
                        (val && val == undefined) || 'Estado es requerido',
                    ]"
                  >
                    <q-tooltip transition-show="scale" transition-hide="scale">
                      Activo/Inactivo
                    </q-tooltip>
                  </q-checkbox>
                </div>
              </div>
            </q-item-section>
          </q-item>
          <q-item>
            <div class="fit row justify-end">
              <div style="overflow: auto">
                <q-btn label="Guardar" type="submit" color="primary">
                  <q-tooltip transition-show="scale" transition-hide="scale">
                    Confirmar
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-item>
        </q-list>
      </q-form>
    </div>
  </div>
  <div class="col-6 col-md-6 col-sm-12 col-xs-12">
    <DataTable :tableOptions="tableOptions" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import 'src/css/app.sass';
import {
  specialityService,
  useStoreSpeciality,
} from 'src/services/SpecialityService';
import {
  PhysicalExamParameterService,
  useStorePhysicalExamParameter,
} from 'src/services/PhysicalExamService';
import * as Constants from 'src/scripts/Constants';
import { IPhysicalExamRequest } from 'src/models/IConsults';
import DataTable from 'src/components/commons/DataTable.vue';
import { TableObserver } from 'src/patterns/Observer/Observer';
import {
  DataTableService,
  useStoreDataTable,
} from 'src/services/DataTableService';

export default defineComponent({
  name: 'PhysicalExamForm',
  components: {
    DataTable,
  },
  setup() {
    const { allSpecialities } = storeToRefs(useStoreSpeciality());
    const iconSVG = Constants.IconSVG.getInstance();
    const {
      // physicalExamParameter,
      form,
      icon,
      speciality,
      specialityTable,
      allPhysicalMedicalParameter,
      currentPhysicalExamParameter,
      status,
      // confirmChanges,
      // specialityChanged,
      // specialityTableChanged,
      // add,
      disable,
      rows,
      columnsr,
      titleTable,
      selected,
      // rowClicked,
    } = storeToRefs(useStorePhysicalExamParameter());

    const { tableOptions } = storeToRefs(useStoreDataTable());
    // const repository = PhysicalExamParameterRepository.getInstance();
    const service = new PhysicalExamParameterService();
    const serviceSpeciality = specialityService.getInstance();
    // const queryParameters = { speciality: 1 };

    onMounted(async () => {
      await serviceSpeciality.getAll();
      icon.value = iconSVG.outpatient;
      const dataTableService = DataTableService.getInstance();
      // const response = await repository.findByParameters(queryParameters);
      // const columnsPrueba = [
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
      // ] as Array<IColumnsDataTable>;
      const builder = dataTableService.getBuilder();
      builder.setData(columnsr.value, rows.value, titleTable.value);
      builder.hasSearchField(true);
      builder.setSelectionRow('single');
      tableOptions.value = builder.getResult();
      dataTableService.attach(service);
    });
    return {
      icon,
      tableOptions,
      // physicalExamParameter,
      allPhysicalMedicalParameter,
      allSpecialities,
      speciality,
      specialityTable,
      form,
      disable,
      async clearSpeciality() {
        await service.clearSpeciality();
        await service.clear();
      },
      confirmChanges() {
        service.processRequest();
      },
      specialityChanged() {
        service.specialityChanged(speciality.value);
      },
      // specialityTableChanged(val: unknown) {
      //   console.log(val);
      // },
      add() {
        service.add();
      },
      edit() {
        service.edit();
      },
      currentPhysicalExamParameter,
      status,
      rows,
      columnsr,
      selected,
      // rowClicked(val: Array<IPhysicalExamRequest>) {
      //   console.log(val);
      // },
    };
  },
});
</script>
