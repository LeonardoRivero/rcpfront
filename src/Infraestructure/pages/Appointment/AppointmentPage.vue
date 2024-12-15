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
        <q-card flat bordered> <LastAppointmentsPanel /> </q-card>
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
          flat
        >
          <q-step :name="1" title="Antecedentes" :done="step > 1">
            <q-form ref="formStep1">
              <DiagnosticPatient :bloc="controller" />
            </q-form>
          </q-step>
          <q-step
            :name="2"
            title="Diagnostico"
            :done="step > 2"
            icon="assignment"
          >
            <MedicalHistoryPatient :bloc="controller" />
          </q-step>
          <template v-slot:navigation>
            <q-stepper-navigation>
              <br />
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
  import { inject, ref } from 'vue';
  import InfoPatientPanel from './InfoPatientPanel.vue';
  import LastAppointmentsPanel from './LastAppointmentsPanel.vue';
  import MedicalHistoryPatient from './MedicalHistoryPatient.vue';
  import DiagnosticPatient from './DiagnosticPatient.vue';
  import 'src/css/app.sass';
  import { AppointmentBloc } from 'src/Adapters';
  import { QForm, QStepper } from 'quasar';

  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <AppointmentBloc>(
    dependenciesLocator.provideAppointmentBloc()
  );
  const disableContinue = false;
  const stepper = ref<QStepper>();
  const step = ref<number>(1);
  const formStep1 = ref<QForm>();

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
