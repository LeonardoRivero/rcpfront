<template>
  <q-card class="my-card" bordered>
    <q-card-section>
      <div class="text-h5 q-mt-sm q-mb-xs">
        <q-icon :name="icons.medicalHospital" size="48px" /> Entidades
      </div>
      <div class="text-caption text-grey">
        <q-checkbox
          v-if="state.insurance != null"
          v-model="state.insurance.takeCopayment"
          checked-icon="task_alt"
          unchecked-icon="highlight_off"
          :disable="true"
          label="Cita incluye copago:"
          left-label
        >
        </q-checkbox>
      </div>
      <q-select
        dense
        clearable
        outlined
        v-model="state.insurance"
        :options="state.allInsurance"
        option-value="id"
        option-label="nameInsurance"
        map-options
        label="Descripcion"
        @update:model-value="(val) => insuranceChanged(val)"
        @clear="(val) => clearInsurance(val)"
        :hint="`Codigo Entidad: ${
          state.currentInsurance.entityCode == undefined
            ? ''
            : state.currentInsurance.entityCode
        }`"
      >
      </q-select>
    </q-card-section>
    <q-card-actions>
      <q-btn flat round color="primary" icon="mdi-plus" @click="add">
        <q-tooltip transition-show="scale" transition-hide="scale">
          Agregar
        </q-tooltip>
      </q-btn>
      <q-btn
        v-if="state.insurance != null"
        flat
        round
        color="green"
        icon="mdi-pencil"
        @click="edit"
      >
        <q-tooltip transition-show="scale" transition-hide="scale">
          Editar
        </q-tooltip>
      </q-btn>
      <q-space />
      <q-btn
        color="grey"
        round
        flat
        dense
        :icon="state.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="state.expanded = !state.expanded"
      />
    </q-card-actions>
    <q-slide-transition>
      <div v-show="state.expanded">
        <q-separator />
        <q-card-section class="text-subitle2">
          <q-form @submit="confirmChanges" ref="form">
            <div class="row q-col-gutter-x-md">
              <div class="col-12 col-md-6">
                <q-input
                  dense
                  outlined
                  v-model="state.currentInsurance.entityCode"
                  label="Codigo Entidad"
                  maxlength="10"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Codigo es requerido',
                  ]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  dense
                  outlined
                  v-model="state.currentInsurance.nameInsurance"
                  label="Descripcion Entidad"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || 'Descripcion es requerida',
                  ]"
                />
              </div>
            </div>
            <q-checkbox
              v-model="state.currentInsurance.takeCopayment"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
              label=" Valor de cita incluye Copago "
              :rules="[(val:any) => (val && val == undefined) || 'Campo requerido']"
            >
              <small>
                <cite title="Ayuda">(Segun acuerdo previo con entidad)</cite>
              </small>
            </q-checkbox>
            <div>
              <q-btn label="Guardar" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { QForm } from 'quasar';
import { IHealthInsurance } from 'src/Domine/ModelsDB';
import { InsuranceAdapter } from 'src/Adapters/InsuranceAdapter';
import { IconSVG } from 'src/Application/Utilities';
import { HealthInsuranceResponse } from 'src/Domine/Responses';
import { InsuranceState } from 'src/Domine/IStates';
import 'src/css/app.sass';

export default defineComponent({
  name: 'InsuranceForm',

  setup() {
    const state: InsuranceState = reactive({
      allInsurance: [] as Array<HealthInsuranceResponse>,
      currentInsurance: {} as IHealthInsurance,
      expanded: false,
      error: false,
      insurance: null,
    });
    const controller = InsuranceAdapter.getInstance(state);
    const form = ref<QForm>();

    onMounted(async () => {
      state.allInsurance = await controller.getAll();
    });

    return {
      state,
      icons: IconSVG,
      form,
      clearInsurance(val: any) {
        controller.clear();
        form.value?.reset();
      },
      insuranceChanged(val: HealthInsuranceResponse) {
        state.currentInsurance = val;
      },
      edit() {
        if (state.expanded === false) {
          state.expanded = !state.expanded;
        }
        state.currentInsurance = state.insurance as HealthInsuranceResponse;
      },
      add() {
        controller.add();
      },
      async confirmChanges() {
        const isValid = await form.value?.validate();
        if (isValid == false) {
          return;
        }
        await controller.saveOrUpdate(state.currentInsurance);
      },
    };
  },
});
</script>
