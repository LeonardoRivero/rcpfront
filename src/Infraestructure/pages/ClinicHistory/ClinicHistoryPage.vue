<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
        <InfoPatientPanel />
        <br />
        <q-stepper
          v-model="step"
          ref="stepper"
          alternative-labels
          color="primary"
          animated
          keep-alive
        >
          <q-step
            :name="1"
            title="Datos Preliminares"
            prefix="1"
            :done="step > 1"
          >
            <q-form ref="formStep1">
              <PreliminaryData />
            </q-form>
          </q-step>

          <q-step :name="2" title="Procedimientos" prefix="2" :done="step > 2">
            <MedicalProcedure />
          </q-step>

          <q-step :name="3" title="Plan" prefix="3"> Plan </q-step>

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
                @click="$refs.stepper.previous()"
                label="Regresar"
                class="q-ml-sm"
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <ClinicHistoryResume />
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { QForm, QStepper } from 'quasar';
import InfoPatientPanel from './InfoPatientPanel.vue';
import PreliminaryData from './PreliminaryData.vue';
import MedicalProcedure from './MedicalProcedure.vue';
import ClinicHistoryResume from './ClinicHistoryResume.vue';
import { ClinicHistoryMediator } from 'src/Infraestructure/Mediators';
import 'src/css/app.sass';
export default defineComponent({
  components: {
    InfoPatientPanel,
    PreliminaryData,
    MedicalProcedure,
    ClinicHistoryResume,
  },
  setup() {
    const formStep1 = ref<QForm>();
    const stepper = ref<QStepper>();
    const step = ref<number>(2);

    const clinicHistoryMediator = ClinicHistoryMediator.getInstance();
    const store = clinicHistoryMediator.getStore();
    return {
      formStep1,
      stepper,
      step,
      disableContinue: store.currentSchedule == null ? false : false,
      async onContinueStep() {
        const step1 = await formStep1.value?.validate();
        if (step1 === true && step.value == 1) {
          stepper.value?.next();
        }
        // else if (formIsValid === true && step.value == 2) {
        //   stepper.value?.next();
        // }
      },
    };
  },
});
</script>
