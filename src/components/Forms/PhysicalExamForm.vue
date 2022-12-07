<template>
  <div class="row">
    <div class="col-6 col-md-6 col-sm-12 col-xs-12">
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
                  v-if="selected.length != 0"
                  @click="edit"
                >
                  <q-tooltip transition-show="scale" transition-hide="scale">
                    Confirmar
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-item>
          <!-- <q-item>
            <q-item-section top>
              <small>
                <cite title="Ayuda"
                  >(Seleccione una especialidad a asociar con tu parametro del
                  examen fisico)</cite
                >
              </small>
              <q-select
                dense
                clearable
                outlined
                v-model="speciality"
                :options="allSpecialities"
                option-value="id"
                option-label="description"
                map-options
                label="Especialidad"
                :rules="[(val) => val || 'Especialidad es requerida']"
                @update:model-value="(val) => specialityChanged(val)"
                @clear="(val) => clearSpeciality(val)"
              >
              </q-select>
            </q-item-section>
          </q-item> -->
          <q-item>
            <q-item-section top>
              <div class="row q-col-gutter-x-md">
                <div class="col-5 col-md-5 col-sm-12 col-xs-12">
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
                <div class="col-5 col-md-5 col-sm-12 col-xs-12">
                  <q-select
                    :disable="disable"
                    dense
                    clearable
                    outlined
                    v-model="speciality"
                    :options="allSpecialities"
                    option-value="id"
                    option-label="description"
                    map-options
                    label="Especialidad"
                    :rules="[(val) => val || 'Especialidad es requerida']"
                    @update:model-value="(val) => specialityChanged(val)"
                    @clear="(val) => clearSpeciality(val)"
                  >
                  </q-select>
                </div>
                <div class="col-2 col-md-2 col-sm-12 col-xs-12">
                  <q-checkbox
                    :disable="disable"
                    v-model="currentPhysicalExamParameter.active"
                    label="Estado"
                  />
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
    <div class="col-6 col-md-6 col-sm-12 col-xs-12">
      <!-- <q-list style="max-width: 800px">
        <q-item> -->
      <div class="q-pa-md">
        <q-table
          title="Parametros Examen Fisico"
          :hide-bottom="true"
          :rows="rows"
          :columns="columnsr"
          row-key="id"
          virtual-scroll
          :rows-per-page-options="[0]"
          selection="single"
          :dense="$q.screen.lt.xs"
          v-model:selected="selected"
          class="table-responsive link-cursor"
          style="height: 300px"
          @update:selected="(val) => rowClicked(val)"
        >
          <template v-slot:top>
            <small>
              <cite title="Ayuda"
                >(Seleccione una especialidad para detalles de los parametros
                fisicos)</cite
              >
            </small>
            Parametros Disponibles
            <q-space />
            <q-select
              v-model="specialityTable"
              outlined
              dense
              options-dense
              map-options
              :options="allSpecialities"
              option-value="id"
              option-label="description"
              style="min-width: 50%"
              label="Seleccione"
              @update:model-value="(val) => specialityTableChanged(val)"
              @clear="(val) => clearSpeciality(val)"
            />
          </template>
        </q-table>
      </div>
      <!-- <q-item-section top>
            <small>
              <cite title="Ayuda"
                >Despliegue la lista para consultar los parametros disponibles
                en su examen fisico</cite
              >
            </small>
            {{ physicalMedicalParameter }}
            <q-select
              dense
              clearable
              outlined
              fill-input
              v-model="physicalExamParameter"
              :options="allPhysicalMedicalParameter"
              option-value="id"
              option-label="description"
              map-options
              label="Parametros Disponibles"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section> -->
      <!-- </q-item>
      </q-list> -->
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import {
  specialityService,
  useStoreSpeciality,
} from 'src/services/SpecialityService';
import {
  PhysicalExamParameterService,
  useStorePhysicalExamParameter,
} from 'src/services/PhysicalExamService';
import * as Constants from 'src/scripts/Constants';
import 'src/css/app.sass';
import { storeToRefs } from 'pinia';
import { IPhysicalExamRequest } from 'src/models/IConsults';

export default defineComponent({
  name: 'PhysicalExamForm',
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
      // edit,
      disable,
      rows,
      columnsr,
      selected,
      // rowClicked,
    } = storeToRefs(useStorePhysicalExamParameter());

    const service = new PhysicalExamParameterService();
    const serviceSpeciality = specialityService.getInstance();

    onMounted(async () => {
      await serviceSpeciality.getAll();
      icon.value = iconSVG.outpatient;
    });
    return {
      icon,
      // physicalExamParameter,
      allPhysicalMedicalParameter,
      allSpecialities,
      speciality,
      specialityTable,
      form,
      disable,
      //clearSpeciality,
      confirmChanges() {
        service.processRequest();
      },
      specialityChanged() {
        service.specialityChanged(speciality.value);
      },
      specialityTableChanged(val: any) {
        console.log(val);
      },
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
      rowClicked(val: Array<IPhysicalExamRequest>) {
        console.log(val);
      },
    };
  },
});
</script>
