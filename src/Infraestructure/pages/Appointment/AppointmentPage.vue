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
        <PatientHistory />
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
  import InfoPatientPanel from './InfoPatientPanel.vue';
  import PatientHistory from './PatientHistory.vue';

  import 'src/css/app.sass';
</script>
