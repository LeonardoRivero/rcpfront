<template>
  <q-page class="q-pa-sm">
    <div class="text-h6 text-grey">
      Cita Médica
      <q-separator inset />
    </div>
    <br />
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-9">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-8">
            <InfoPatientPanel />
          </div>
          <div class="col-12 col-sm-4">
            <q-card flat bordered>LastMeditions</q-card>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-3">
        <q-card flat bordered>Last Appointments</q-card>
      </div>
    </div>
    <br />
    <div class="row q-col-gutter-sm">
      <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
        <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          animated
          :bordered="false"
          lazy
        >
          <q-step :name="1" title="Antecedentes" :done="step > 1">
            <q-form ref="formStep1">
              <PatientHistory />
            </q-form>
          </q-step>
          <q-step
            :name="2"
            title="Diagnostico"
            :done="step > 2"
            icon="assignment"
          >
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
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { QForm, QStepper } from 'quasar';
  import InfoPatientPanel from './InfoPatientPanel.vue';
  import PatientHistory from './PatientHistory.vue';
  import DiagnosticAppointment from './DiagnosticAppointment.vue';
  import 'src/css/app.sass';

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
</script>
