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
                  v-if="state.userCanEdit"
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
                    :disable="state.disable"
                    dense
                    outlined
                    v-model="state.currentPhysicalExamParameter.speciality"
                    :options="state.allSpecialities"
                    option-label="description"
                    map-options
                    emit-value
                    :option-value="(item) => (item === null ? null : item.id)"
                    label="Especialidad"
                    :rules="[isNotNull]"
                    @update:model-value="(val) => specialityChanged(val)"
                  >
                  </q-select>
                </div>
              </div>
              <div class="row q-col-gutter-x-md">
                <div class="col-9 col-md-9 col-sm-12 col-xs-12">
                  <q-input
                    :disable="state.disable"
                    v-model="state.currentPhysicalExamParameter.description"
                    label="Parametro Examen Fisico"
                    dense
                    lazy-rules
                    :rules="[required]"
                  />
                </div>
                <div class="col-3 col-md-3 col-sm-12 col-xs-12">
                  <q-checkbox
                    :disable="state.disable"
                    v-model="state.currentPhysicalExamParameter.active"
                    label="Estado"
                    :rules="[required]"
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
    <DataTable :tableOptions="tableOptions" :controller="controller" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import DataTable from 'src/Infraestructure/components/commons/DataTable.vue';
import { useStorePhysicalExamParameter } from 'src/Infraestructure/Mediators/SettingsPage/PhysicalExamStore';
import { PhysicalExamParameterController } from 'src/Adapters/PhysicalExamAdapter';
import { IPhysicalExam } from 'src/Domine/ModelsDB';
import { BuilderTables } from 'src/Adapters/DataTableAdapter';
import { useStoreDataTable } from '../../Mediators/Common/DatatableStore';
import { SettingsMediator } from '../../Mediators';
import { PhysicalExamParameterState } from 'src/Domine/IStates';
import { PhysicalExamResponse } from 'src/Domine/Responses';
import { QForm } from 'quasar';
import { required, isNotNull } from 'src/Application/Utilities/Helpers';
import 'src/css/app.sass';

export default defineComponent({
  name: 'PhysicalExamForm',
  components: {
    DataTable,
  },
  setup() {
    const mediator = SettingsMediator.getInstance();
    const form = ref<QForm>();
    const { disable, rows, columnsr, titleTable, userCanEdit } = storeToRefs(
      useStorePhysicalExamParameter()
    );

    const state: PhysicalExamParameterState = reactive({
      currentPhysicalExamParameter: {
        active: true,
        description: '',
      } as IPhysicalExam,
      allPhysicalMedicalParameter: [] as Array<PhysicalExamResponse>,
      disable: false,
      allSpecialities: [],
      userCanEdit: false,
    });

    const storeDataTable = useStoreDataTable();
    const { tableOptions } = storeToRefs(storeDataTable);
    const controller = PhysicalExamParameterController.getInstance(state);
    // const dataTableController = DataTableController.getInstance(storeDataTable);

    onMounted(async () => {
      state.allSpecialities = await mediator.getAllSpecialities();
      const builder = new BuilderTables();
      builder.setData(columnsr.value, rows.value, titleTable.value);
      builder.hasSearchField(true);
      builder.setSelectionRow('single');
      tableOptions.value = builder.getResult();
      tableOptions.value.observer = controller;
      // dataTableController.attach(adapter);
    });

    return {
      controller,
      state,
      tableOptions,
      form,
      disable,
      userCanEdit,
      required,
      isNotNull,
      async confirmChanges() {
        const isValid = await form.value?.validate();
        if (isValid == false) return;
        const response = await controller.saveOrUpdate(
          state.currentPhysicalExamParameter
        );
        if (response != null) {
          state.currentPhysicalExamParameter = {
            active: true,
          } as IPhysicalExam;
          form.value?.reset();
        }
      },

      async specialityChanged(id: number) {
        const response = await controller.specialityChanged(id);
        const [columns, dataRows] = controller.getColumnsAndRows(response);
        tableOptions.value.columns = columns;
        tableOptions.value.data = dataRows;
        // dataTableController.updateData(columns, dataRows);
      },
      async add() {
        controller.add();
        form.value?.reset();
      },

      edit() {
        controller.edit();
      },
    };
  },
});
</script>
