<template>
  <q-card class="rounded-borders">
    <q-toolbar class="rounded-borders">
      <h5 class="text-h5 q-ma-md">
        Datos Paciente:
        <q-avatar :icon="state.iconAvatar" color="white" size="4rem"></q-avatar>
      </h5>
      <q-space />
      <q-input
        dense
        outlined
        input-class="text-right"
        class="q-ml-md"
        v-model="state.identificationPatient"
        @keydown.enter.prevent="searchPatient()"
        label="N° Identificacion"
        type="number"
      >
        <template v-slot:append>
          <q-btn
            flat
            round
            dense
            icon="search"
            class="q-mr-xs"
            @click="searchPatient()"
          />
          <q-tooltip transition-show="scale" transition-hide="scale">
            Verificar Paciente
          </q-tooltip>
        </template>
      </q-input>
    </q-toolbar>
    <q-separator inset></q-separator>
    <q-card-section>
      <div class="row">
        <q-card-section class="col-12 col-sm-6 col-xs-12">
          <b>Nombre Completo:</b>
          <div class="text-h6 q-mb-xs">
            {{ state.currentPatient.name }}
            {{ state.currentPatient.lastName }}
          </div>
          <q-separator />
          <b>Telefono/Celular:</b>
          <div>
            {{ state.currentPatient.phoneNumber }}
          </div>
          <q-separator />
          <b>Correo Electronico:</b>
          <div>
            {{ state.currentPatient.email }}
          </div>
        </q-card-section>
        <q-card-section class="col-12 col-sm-6 col-xs-12">
          <b>Fecha Nacimiento:</b>
          <div v-if="state.age != 0">
            {{ state.currentPatient.dateBirth }}
            <cite>({{ state.age }} años)</cite>
          </div>
          <q-separator />
          <b>Entidad :</b>
          <div v-if="state.currentPatient.insurance != null">
            {{ state.currentPatient.insurance.nameInsurance }}
          </div>
          <q-separator />
          <b>Fecha Primera Consulta:</b>
        </q-card-section>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ClinicHistoryAdapter, PatientAdapter } from 'src/Adapters';
import { useStorePatient } from '../../stores/PatientsPage/PatientStore';
import { Validators } from 'src/Application/Utilities';

export default defineComponent({
  name: 'InfoPatientPanel',
  setup() {
    const patientAdapter = PatientAdapter.getInstance(useStorePatient());
    const controller = new ClinicHistoryAdapter();
    const validator = Validators.getInstance();
    const state = controller.getState();

    return {
      async searchPatient() {
        const patient = await patientAdapter.searchByIdentificacion(
          state.identificationPatient
        );
        state.currentPatient = patient;
        if (state.currentPatient == undefined || patient == null) return;
        state.age = validator.calculateAge(
          state.currentPatient.dateBirth.toString()
        );
        controller.getGender(patient);
      },
      state,
    };
  },
});
</script>
