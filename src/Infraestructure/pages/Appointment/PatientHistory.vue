<template>
  <q-stepper
    v-model="step"
    ref="stepper"
    color="primary"
    animated
    :bordered="false"
  >
    <q-step :name="1" title="Antecedentes" :done="step > 1">
      <q-form ref="formStep1">
        <!-- <div class="text-h6 text-grey">
          Social
          <q-separator inset />
        </div>
        <div class="row">
          <q-toggle
            v-model="state.alcohol"
            checked-icon="check"
            color="red"
            label="Alcohol"
            unchecked-icon="clear"
            left-label
            class="col-shrink"
            style="overflow: auto; width: 18dvh"
          />

          <q-input
            dense
            v-model="state.alcoholObservations"
            autogrow
            class="col-grow"
            style="overflow: auto"
          />
        </div>
        <div class="row">
          <q-toggle
            v-model="state.smoke"
            checked-icon="check"
            color="red"
            label="Cigarrillo"
            unchecked-icon="clear"
            left-label
            class="col-shrink"
            style="overflow: auto; width: 18dvh"
          />
          <q-input
            dense
            v-model="state.smokeObservations"
            autogrow
            class="col-grow"
            style="overflow: auto"
          />
        </div>
        <div class="row">
          <q-toggle
            v-model="state.drugs"
            checked-icon="check"
            color="red"
            label="Drogas"
            unchecked-icon="clear"
            left-label
            class="col-shrink"
            style="overflow: auto; width: 18dvh"
          />
          <q-input
            dense
            v-model="state.drugsObservations"
            autogrow
            class="col-grow"
            style="overflow: auto"
          />
        </div>
        <br /> -->
        <div class="text-h6 text-grey">
          Alergias
          <q-separator inset />
        </div>
        <div class="row">
          <q-select
            option-value="id"
            option-label="description"
            map-options
            dense
            v-model="state.allergie"
            :options="state.allAllergies"
            label=" Tipo Alergia *"
            class="col-shrink"
            style="width: 35dvh"
            @update:model-value="(val) => allergieChanged(val)"
            :rules="[isNotNull]"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input
            dense
            v-model="state.allergen"
            class="col-grow"
            style="margin-left: 15px"
            placeholder="Alergeno"
            :disable="!state.patientHasAllergie"
          />
        </div>
        <br /><br />
        <div class="text-h6 text-grey">
          Tratamiento/Medicamentos
          <q-separator inset />
        </div>
        <div class="row">
          <q-checkbox
            v-model="state.patientHasTreatment"
            class="col-shrink"
            style="overflow: auto; width: 18dvh"
          />
          <q-input
            dense
            v-model="state.treatmentMedical"
            class="col-grow"
            style="overflow: auto"
            placeholder="Nombre Medicamento o descripcion tratamiento"
            :disable="!state.patientHasTreatment"
          />
        </div>
        <br /><br />
        <div class="text-h6 text-grey">
          Familiares
          <q-separator inset />
        </div>
        <div class="row">
          <q-checkbox
            v-model="state.patientWithFamilyHistory"
            class="col-shrink"
            style="overflow: auto; width: 18dvh"
            @update:model-value="handleCheckboxFamilyHistory"
          />
          <q-select
            option-value="id"
            option-label="description"
            map-options
            dense
            v-model="state.kinship"
            :options="state.allKinship"
            label="Parentesco *"
            class="col-shrink"
            style="width: 35dvh"
            @update:model-value="(val) => allergieChanged(val)"
            :disable="!state.patientWithFamilyHistory"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input
            dense
            v-model="state.allergen"
            class="col-grow"
            style="margin-left: 15px"
            placeholder="Alergeno"
            :disable="!state.patientWithFamilyHistory"
          />
        </div>
      </q-form>
    </q-step>
    <q-step :name="2" title="Diagnostico" :done="step > 2" icon="assignment">
      <DiagnosticAppointment />
    </q-step>
    <template v-slot:navigation>
      <q-stepper-navigation>
        <q-btn
          :disable="disableContinue"
          @click="onContinueStep()"
          color="primary"
          :label="step === 3 ? 'Guardar' : 'Continuar'"
        />
        <q-btn
          v-if="step > 1"
          flat
          color="primary"
          @click="previous()"
          label="Regresar"
          class="q-ml-sm"
        />
      </q-stepper-navigation>
    </template>
  </q-stepper>
</template>

<script setup lang="ts">
  import { inject, onMounted, ref } from 'vue';
  import { QForm, QStepper } from 'quasar';
  import 'src/css/app.sass';
  import { AppointmentBloc } from 'src/Adapters';
  import { isNotNull } from 'src/Application/Utilities/Helpers';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import { IHandleGlobalState } from 'src/Domine/IPatterns';
  import { AllergieResponse } from 'src/Domine/Responses';
  import DiagnosticAppointment from './DiagnosticAppointment.vue';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <AppointmentBloc>(
    dependenciesLocator.provideAppointmentBloc()
  );
  const handleGlobalState = <IHandleGlobalState>(
    dependenciesLocator.provideHandleGlobalState()
  );

  onMounted(async () => {
    console.log('mounted Patients');
    await controller.loadInitialData(handleGlobalState);
  });

  const state = usePlocState(controller);

  function allergieChanged(val: AllergieResponse) {
    controller.allergieChanged(val);
  }

  const formStep1 = ref<QForm>();
  const stepper = ref<QStepper>();
  const step = ref<number>(1);

  // const disableContinue = store.currentSchedule == null ? false : false;
  const disableContinue = false;
  async function onContinueStep() {
    const step1 = await formStep1.value?.validate();
    if (step1 === true && step.value == 1) {
      stepper.value?.next();
    }
    // else if (formIsValid === true && step.value == 2) {
    //   stepper.value?.next();
    // }
  }
  function previous() {
    stepper.value?.previous();
  }

  function handleCheckboxFamilyHistory(value: boolean) {
    if (!value) {
      state.value.kinship = null;
    }
  }
</script>
