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
                  v-if="userCanEdit"
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
                    v-model="currentPhysicalExamParameter.speciality"
                    :options="allSpecialities"
                    option-label="description"
                    map-options
                    emit-value
                    :option-value="(item) => (item === null ? null : item.id)"
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
import { defineComponent, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import DataTable from 'src/Infraestructure/components/commons/DataTable.vue';
import { IconSVG } from 'src/Application/Utilities/Constants';
import { useStorePhysicalExamParameter } from 'src/Infraestructure/Mediators/SettingsPage/PhysicalExamStore';
import { PhysicalExamParameterAdapter } from 'src/Adapters/PhysicalExamAdapter';
import { IPhysicalExam } from 'src/Domine/ModelsDB';
import { DataTableAdapter } from 'src/Adapters/DataTableAdapter';
import { useStoreDataTable } from 'src/Infraestructure/Mediators/Common/DatatableStore';
import 'src/css/app.sass';
import { SettingsMediator } from 'src/Infraestructure/Mediators';

export default defineComponent({
  name: 'PhysicalExamForm',
  components: {
    DataTable,
  },
  setup() {
    const mediator = SettingsMediator.getInstance();
    const iconSVG = IconSVG.getInstance();
    const {
      // physicalExamParameter,
      form,
      icon,
      speciality,
      specialityTable,
      allPhysicalMedicalParameter,
      currentPhysicalExamParameter,
      status,
      allSpecialities,
      // confirmChanges,
      // specialityChanged,
      // specialityTableChanged,
      // add,
      disable,
      rows,
      columnsr,
      titleTable,
      selected,
      userCanEdit,
      // rowClicked,
    } = storeToRefs(useStorePhysicalExamParameter());

    const storeDataTable = useStoreDataTable();
    const { tableOptions } = storeToRefs(storeDataTable);
    // const repository = PhysicalExamParameterRepository.getInstance();
    const adapter = PhysicalExamParameterAdapter.getInstance(
      useStorePhysicalExamParameter()
    );
    // const serviceSpeciality = specialityService.getInstance();
    // const queryParameters = { speciality: 1 };
    const dataTableAdapter = DataTableAdapter.getInstance(storeDataTable);

    onMounted(async () => {
      allSpecialities.value = await mediator.getAllSpecialities();
      icon.value = iconSVG.outpatient;
      // // const response = await repository.findByParameters(queryParameters);
      // // const columnsPrueba = [
      // //   {
      // //     name: 'id',
      // //     required: true,
      // //     align: 'center',
      // //     label: 'Id',
      // //     field: 'id',
      // //     sortable: true,
      // //   },
      // //   {
      // //     name: 'description',
      // //     required: true,
      // //     align: 'center',
      // //     label: 'Descripcion Parametro',
      // //     field: 'description',
      // //     sortable: true,
      // //   },
      // // ] as Array<IColumnsDataTable>;
      const builder = dataTableAdapter.getBuilder();
      builder.setData(columnsr.value, rows.value, titleTable.value);
      builder.hasSearchField(true);
      builder.setSelectionRow('single');
      tableOptions.value = builder.getResult();
      dataTableAdapter.attach(adapter);
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
      userCanEdit,
      // async clearSpeciality() {
      //   await adapter.clearSpeciality();
      //   await adapter.clear();
      // },
      async confirmChanges() {
        const isValid = await form.value?.validate();
        if (isValid == false) return;
        const response = await adapter.saveOrUpdate(
          currentPhysicalExamParameter.value
        );
        if (response != null) {
          currentPhysicalExamParameter.value = {
            active: true,
          } as IPhysicalExam;
          form.value?.reset();
        }
      },

      async specialityChanged(id: number) {
        const response = await adapter.specialityChanged(id);
        const [columns, dataRows] = adapter.getColumnsAndRows(response);
        dataTableAdapter.updateData(columns, dataRows);
      },

      // specialityTableChanged(val: unknown) {
      //   console.log(val);
      // },
      add() {
        adapter.add();
      },

      edit() {
        adapter.edit();
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
