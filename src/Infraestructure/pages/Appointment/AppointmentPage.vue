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
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-stepper
              v-model="step"
              ref="stepper"
              color="primary"
              animated
              :bordered="false"
              flat
            >
              <q-step :name="1" title="Diagnostico" :done="step > 1">
                <q-form ref="formStep1">
                  <DiagnosticPatient :bloc="controller" />
                </q-form>
              </q-step>
              <q-step
                :name="2"
                title="Antecedentes"
                :done="step > 2"
                icon="assignment"
              >
                <q-form ref="formStep2">
                  <MedicalHistoryPatient :bloc="controller" />
                </q-form>
              </q-step>
              <q-step
                :name="3"
                title="Procedimientos"
                :done="step > 3"
                icon="mdi-clipboard-pulse"
              >
                <q-form ref="formStep3">
                  <MedicalProcedure :bloc="controller" />
                </q-form>
              </q-step>
              <q-step
                :name="4"
                title="Posologia"
                :done="step > 4"
                icon="mdi-pill"
              >
                <q-form>
                  <AppointmentPosology :bloc="controller" />
                </q-form>
              </q-step>
              <template v-slot:navigation>
                <q-stepper-navigation>
                  <br />
                  <q-btn
                    :disable="disableContinue"
                    @click="onContinueStep()"
                    color="primary"
                    :label="step === 4 ? 'Guardar' : 'Continuar'"
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
      </div>
      <div class="col-12 col-sm-3">
        <q-card flat bordered> <LastAppointmentsPanel /> </q-card>
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
  import MedicalProcedure from './MedicalProcedure.vue';
  import { IconSVG } from 'src/Application/Utilities';
  import AppointmentPosology from './AppointmentPosology.vue';

  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <AppointmentBloc>(
    dependenciesLocator.provideAppointmentBloc()
  );
  const disableContinue = false;
  const stepper = ref<QStepper>();
  const step = ref<number>(1);
  const formStep1 = ref<QForm>();
  const formStep2 = ref<QForm>();
  const formStep3 = ref<QForm>();

  async function onContinueStep() {
    const step1 = await formStep1.value?.validate();
    if (step1 === true && step.value == 1) {
      stepper.value?.next();
    }
    const step2 = await formStep2.value?.validate();
    if (step2 === true && step.value == 2) {
      stepper.value?.next();
    }
    const step3 = await formStep3.value?.validate();
    if (step3 === true && step.value == 3) {
      stepper.value?.next();
    }
  }
  function previous() {
    stepper.value?.previous();
  }
</script>
